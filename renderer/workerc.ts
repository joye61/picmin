import type { Sharp, SharpOptions } from "sharp";

// nodejs模块需要用require来加载
const sharp = require("sharp");
const fs = require("fs");
const svgo = require("svgo");

interface CompressData {
  list: ImageItem[];
  option: CompressOption;
}

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

  return { width, height };
}

/**
 * 将数据写入临时文件
 * @param item
 * @param data
 */
export async function writeToTemp(
  filePath: string,
  data: Blob | ArrayBuffer | string
): Promise<boolean> {
  // 写入新文件前先删除旧文件
  fs.rmSync(filePath, { force: true });

  let content: Uint8Array | string = "";
  if (data instanceof ArrayBuffer) {
    content = new Uint8Array(data);
  } else if (data instanceof Blob) {
    const buf = await data.arrayBuffer();
    content = new Uint8Array(buf);
  } else if (typeof content === "string") {
    content = data;
  }

  fs.outputFileSync(filePath, content);
  return fs.existsSync(filePath);
}

/**
 * 在压缩失败的情况下，用旧值代替新值
 * @param item
 */
export function assignNewWithOld(item: ImageItem) {
  item.newSize = item.oldSize;
  item.newWidth = item.oldWidth;
  item.newHeight = item.oldHeight;
}

// 用于压缩的worker
self.addEventListener("message", (event) => {
  const { list, option } = event.data as CompressData;
  compressList(list, option);
});

/**
 * 压缩SVG文件
 * @param item
 */
async function compressSVG(item: ImageItem) {
  const content = fs.readFileSync(item.path, { encoding: "utf-8" });
  const result = svgo.optimize(content);
  const res = await writeToTemp(item.tempPath, result);
  if (!res) {
    assignNewWithOld(item);
  }
}

/**
 * 用sharp来压缩JPEG/PNG/WEBP/GIF/AVIF
 * @param item
 * @param option
 */
async function compressWithSharp(item: ImageItem, option: CompressOption) {
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
          colours: 2 + ((256 - 2) * option.quality) / 100,
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
      fs.rmSync(item.tempPath, { force: true });
      const { size, width, height } = await pdata.toFile(item.tempPath);
      item.newSize = size;
      item.newWidth = width;
      item.newHeight = height;
    }
  } catch (error) {
    // 压缩过程中的任何异常都用旧值替换新值
    assignNewWithOld(item);
  }

  // 响应给主线程
  item.preview = undefined;
  self.postMessage(item);
}

/**
 * 压缩输入的列表
 * @param list
 */
async function compressList(list: ImageItem[], option: CompressOption) {
  const all: Array<Promise<void> | void> = [];

  for (let item of list) {
    // SVG文件通过svgo来压缩
    if (item.upperExtension === "SVG") {
      all.push(compressSVG(item));
      continue;
    }

    // 其他图片类型通过sharp来压缩
    const options: SharpOptions = {};
    if (["GIF", "WebP", "AVIF"].includes(item.upperExtension)) {
      options.animated = true;
    }
    let pdata: Sharp = sharp(item.path, options);
    if (item.upperExtension === "PNG") {
      pdata = pdata.png({ palette: true, quality: 20 });
    }

    pdata.toBuffer().then((buf) => {
      console.log(buf, 2222);
    });
  }

  await Promise.all(all);
}
