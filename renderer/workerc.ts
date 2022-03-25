import type { Sharp, SharpOptions } from "sharp";
import type {
  SpawnOptionsWithoutStdio,
  ChildProcessWithoutNullStreams,
} from "child_process";
import { type GData } from "./state";

// nodejs模块需要用require来加载
const sharp = require("sharp");
const fs = require("fs-extra");
const svgo = require("svgo");
const sizeOf = require("probe-image-size");
const { spawn } = require("child_process");
const process = require("process");
const path = require("path");

interface CompressData {
  list: ImageItem[];
  option: CompressOption;
  g: GData;
}

// 用于压缩的worker
self.addEventListener("message", (event) => {
  const { list, option, g } = event.data as CompressData;
  compressList(list, option, g);
});

export type OldDimension = {
  oldWidth: number;
  oldHeight: number;
};

/**
 * 根据旧尺寸转换为新尺寸
 * @param dim
 * @param option
 * @returns
 */
export function getNewDimension(
  dim: OldDimension,
  option: Omit<CompressOption, "quality">
) {
  let width = dim.oldWidth;
  let height = dim.oldHeight;

  if (option.mode === "percent" && option.percent !== 100) {
    width = (width * option.percent) / 100;
    height = (height * option.percent) / 100;
  }
  if (option.mode === "width" && option.width && option.width !== width) {
    const ratio = option.width! / width;
    width = option.width;
    height = height * ratio;
  }
  if (option.mode === "height" && option.height && option.height !== height) {
    const ratio = option.height! / height;
    height = option.height;
    width = width * ratio;
  }

  // 确保小边的宽度大于等于1像素
  if (width >= height && height < 1) {
    const ratio = 1 / height;
    height = 1;
    width = ratio * width;
  }
  if (height > width && width < 1) {
    const ratio = 1 / width;
    width = 1;
    height = ratio * height;
  }

  width = Math.ceil(width);
  height = Math.ceil(height);

  return { width, height };
}

/**
 * 获取二进制文件路径
 * @param binName
 * @param g
 */
export function getBinPath(binName: string, g: GData) {
  const isMac = process.platform === "darwin";
  const isWin = process.platform === "win32";
  const isPacked = g.isPacked!;
  let basePath: string;
  if (isPacked) {
    basePath = process.resourcesPath;
  } else {
    basePath = path.join(g.appPath!, "resources");
  }

  if (isMac) {
    return path.join(basePath, `${binName}-mac`);
  } else if (isWin) {
    return path.join(basePath, `${binName}-win.exe`);
  } else {
    return "";
  }
}

/**
 * 读取图片的信息
 * @param filePath
 */
async function getImageInfo(filePath: string) {
  const stat = fs.lstatSync(filePath);
  const size = stat.size;

  // 读取图片文件的尺寸信息
  const { width, height } = await sizeOf(fs.createReadStream(filePath));
  return { size, width, height };
}

export interface SpawnMsg {
  execPath: string;
  args: string[];
  option?: SpawnOptionsWithoutStdio;
}

/**
 * 通过外部可执行文件进行压缩
 * @param msg
 * @returns
 */
export async function spawnNewProcess(msg: SpawnMsg) {
  // 调用可执行文件
  return new Promise<void>((resolve, reject) => {
    const exec: ChildProcessWithoutNullStreams = spawn(
      msg.execPath,
      msg.args,
      msg.option
    );
    exec.on("exit", (event) => {
      console.log(`${msg.execPath} exited: `, event);
      resolve();
    });
    exec.on("error", (event) => {
      console.error(`${msg.execPath} error: `, event);
      reject();
    });
  });
}

/**
 * 压缩完毕后最后执行一次检查，并发送结果
 * @param item
 */
async function recheckOutput(item: ImageItem) {
  // 如果没有找到生成文件，则用旧值赋给新值
  if (!fs.existsSync(item.tempPath)) {
    item.newSize = item.oldSize;
    item.newWidth = item.oldWidth;
    item.newHeight = item.oldHeight;
    item.fail = true;
  } else {
    const info = await getImageInfo(item.tempPath);
    item.newSize = info.size;
    item.newWidth = info.width;
    item.newHeight = info.height;
  }
  delete item.preview;
  self.postMessage(item);
}

/**
 * 压缩gif文件
 * @param item
 * @param option
 * @param g
 */
async function compressGif(item: ImageItem, option: CompressOption, g: GData) {
  try {
    const execPath = getBinPath("gifsicle", g);
    const { width, height } = getNewDimension(item, option);
    const quality = Math.ceil((3 * option.quality) / 100);
    const args = [
      `-O${quality}`,
      "--resize",
      `${width}x${height}`,
      "--lossy",
      item.path,
      "-o",
      item.tempPath,
    ];
    // 执行GIF压缩
    await spawnNewProcess({ execPath, args });
  } catch (error) {
    console.log(error);
  }

  // 验证输出
  await recheckOutput(item);
}

/**
 * 压缩SVG文件
 * @param item
 */
async function compressSVG(item: ImageItem) {
  try {
    // 写入新文件前先删除旧临时文件
    fs.rmSync(item.tempPath, { force: true });
    const content = fs.readFileSync(item.path, { encoding: "utf-8" });
    const result = svgo.optimize(content);
    fs.outputFileSync(item.tempPath, result.data);
  } catch (error) {
    console.log(error);
  }

  // 验证输出
  await recheckOutput(item);
}

/**
 * 用sharp来压缩JPEG/PNG/WEBP/GIF/AVIF
 * @param item
 * @param option
 */
async function compressWithSharp(item: ImageItem, option: CompressOption) {
  // 压缩前先将上次的临时文件删除
  fs.rmSync(item.tempPath, { force: true });

  // 执行压缩
  try {
    const { width, height } = getNewDimension(item, option);
    const needResize = width !== item.oldWidth;
    // 其他图片类型通过sharp来压缩
    const options: SharpOptions = {};
    if (["GIF", "WebP", "AVIF"].includes(item.upperExtension)) {
      options.animated = true;
    }
    let pdata: Sharp = sharp(item.path, options);

    // 如果需要缩放，执行缩放
    if (needResize) {
      pdata = pdata.resize({
        width,
        height,
        fit: "fill",
      });
    }

    let hasCompress = true;
    switch (item.upperExtension) {
      case "JPG":
        pdata = pdata.jpeg({ quality: option.quality });
        break;
      case "JPEG":
        pdata = pdata.jpeg({ quality: option.quality });
        break;
      case "WEBP": {
        const meta = await pdata.metadata();
        pdata = pdata.webp({
          loop: meta.loop,
          delay: meta.delay,
          quality: option.quality,
        });
        break;
      }
      case "PNG":
        pdata = pdata.png({ palette: true, quality: option.quality });
        break;
      case "GIF": {
        const meta = await pdata.metadata();
        pdata = pdata.gif({
          loop: meta.loop,
          delay: meta.delay,
          colours: Math.floor(2 + ((256 - 2) * option.quality) / 100),
        });
        break;
      }
      case "AVIF":
        pdata = pdata.avif({ quality: option.quality });
        break;
      default:
        hasCompress = false;
        break;
    }

    // 将结果写入文件
    if (hasCompress) {
      const { size, width, height } = await pdata.toFile(item.tempPath);
      item.newSize = size;
      item.newWidth = width;
      item.newHeight = height;
    }
  } catch (error) {
    console.log(error);
  }

  // 检测是否有输出，如果没有，则认为失败，用旧值赋予新值
  if (!fs.existsSync(item.tempPath)) {
    item.newSize = item.oldSize;
    item.newWidth = item.oldWidth;
    item.newHeight = item.oldHeight;
    item.fail = true;
  }

  // 响应给主线程
  delete item.preview;
  self.postMessage(item);
}

/**
 * 压缩输入的列表
 * @param list
 */
async function compressList(
  list: ImageItem[],
  option: CompressOption,
  g: GData
) {
  const all: Array<Promise<void> | void> = [];

  for (let item of list) {
    // SVG文件通过svgo来压缩
    if (item.upperExtension === "SVG") {
      all.push(compressSVG(item));
      continue;
    }

    // GIF文件通过gifsicle压缩
    if (item.upperExtension === "GIF") {
      all.push(compressGif(item, option, g));
      continue;
    }

    // 其余类型通过sharp压缩
    all.push(compressWithSharp(item, option));
  }

  await Promise.all(all);
}
