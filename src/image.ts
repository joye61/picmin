import { AllowTypes, TempDir } from "./const";
import fs from "fs";
import path from "path";
import readdirp from "readdirp";
import sizeOf from "probe-image-size";
import { indexes, state, __g } from "./state";
import { spawn } from "child_process";
import { getNodeModulesPath, getTempDir } from "./util";

/**
 * 获取应用程序支持的所有后缀
 * @returns
 */
export function getSupportExtensionsAsString() {
  return Object.keys(AllowTypes).join("/");
}

/**
 * 清空图片列表
 * @param event
 */
export async function emptyImageList() {
  state.list = [];
  indexes.clear();
}

/**
 * 根据提供的路径列表返回所有的图片文件
 * @param event
 * @param pathList
 * @returns
 */
export async function readImagesFromPathList(pathList: string[]) {
  const list: ImageItem[] = [];
  // 如果不是目录，则判断是否是合法的图片文件
  const types = Object.keys(AllowTypes);

  /**
   * 验证图片合法性，合法条件
   * 1、必须为列表中不存在的图片
   * 2、必须为支持的图片类型
   * @param image
   */
  const ensureImageLegal = async (imagePath: string): Promise<void> => {
    // 图片已存在，直接退出
    if (indexes.has(imagePath)) return;
    // 检查是否支持，出于性能考虑，直接检查扩展名，不检查实际mime类型
    const extension = path.extname(imagePath).replace(/^\./, "");
    const upperExtension = extension.toUpperCase();
    if (types.includes(upperExtension)) {
      let item: ImageItem = {
        // 新添加的图片默认都是等待压缩中
        status: 1,
        path: imagePath,
        extension,
      };
      // 获取文件的名字
      item.nameWithoutExt = path.basename(imagePath, "." + extension);
      item.name = item.nameWithoutExt + "." + extension;
      const stat = fs.lstatSync(item.path);
      item.oldSize = stat.size;
      // 读取图片文件的尺寸信息
      const { width, height } = await sizeOf(fs.createReadStream(item.path));
      item.oldWidth = width;
      item.oldHeight = height;

      // 获取目标将要生成的临时文件路径
      const outputDir = path.join(__g.tempPath, TempDir);
      const tempId = __g.tid++;
      item.tempId = tempId;
      if (["JPG", "JPEG"].includes(upperExtension)) {
        item.tempPath = path.join(
          outputDir,
          `${item.nameWithoutExt}.${item.tempId}.jpg`
        );
      } else {
        item.tempPath = path.join(
          outputDir,
          `${item.nameWithoutExt}.${extension.toLowerCase()}`
        );
      }

      list.push(item);

      // 这里同时将数据添加到imageList中并更新imageKeyMap
      state.list.push({ key: item.path, ...item });
      indexes.set(item.path, state.list.length);
    }
  };

  // 遍历文件夹
  for (let item of pathList) {
    // const imagePath = item.path;
    const stat = fs.lstatSync(item);
    const isDir = stat.isDirectory();
    // 如果是目录，则遍历读取目录的所有文件信息
    if (isDir) {
      for await (const entry of readdirp(item, { depth: Infinity })) {
        await ensureImageLegal(entry.fullPath);
      }
      continue;
    }
    // 如果是文件，直接验证文件
    await ensureImageLegal(item);
  }

  // 更新状态，图片列表读取完成
  state.isReadList = false;

  // 开始压缩图片
  await compress();
}

// 缩放选项
export interface ScaleOption {
  mode: "percent" | "width" | "height";
  percent: number;
  width?: number;
  height?: number;
}

// 压缩选项
export interface CompressConfig {
  scale: ScaleOption;
  quality: number;
}

/**
 * 获取最终的压缩选项
 * @param option
 */
export function ensureConfig() {
  // 选项默认值
  let config: CompressConfig = {
    scale: {
      mode: state.scaleMode,
      percent: state.scalePercent,
      width: state.scaleWidth,
      height: state.scaleHeight,
    },
    quality: state.qualityPercent,
  };
  const scale = config.scale;
  if (scale.mode !== "percent") {
    scale.percent = 100;
  }
  // 如果是缩放到宽度或者高度，但是值不存在，则认为不调整
  if (
    (scale.mode === "width" && typeof scale.width !== "number") ||
    (scale.mode === "height" && typeof scale.height !== "number")
  ) {
    scale.mode = "percent";
    scale.percent = 100;
  }
  return config;
}

/**
 * 立即压缩整个列表，只压缩正在等待中的图片
 * 0、压缩完成的图片
 * 1、等待压缩的图片
 * 2、压缩中的图片
 */
export async function compress() {
  const option = ensureConfig();
  for (let item of state.list) {
    if (item.status === 1) {
      // 标记正在压缩状态
      item.status = 2;
      await compressImage(item as WaitingImageItem, option);
      // 标记压缩完成
      item.status = 0;
    }
  }
}

/**
 * 压缩单张图片
 * @param image 图片
 * @param option 压缩选项
 */
export async function compressImage(
  image: WaitingImageItem,
  option: CompressConfig
) {
  const ext = image.extension.toUpperCase();
  if (["JPG", "JPEG", "WEBP", "AVIF"].includes(ext)) {
    await compressWithSquoosh(image, option);
  } else if (ext === "PNG") {
    await compressWithPngquant(image, option);
  } else if (ext === "SVG") {
    await compressWithSvgo(image, option);
  } else if (ext === "GIF") {
    await compressWithGifsicle(image, option);
  }
}

/**
 * 用Svgo压缩，压缩svg文件
 * @param item
 * @param option
 */
export async function compressWithSvgo(
  item: WaitingImageItem,
  option: CompressConfig
) {
  // TODO
}

/**
 * 用PngQuant压缩，压缩png文件
 * @param item
 * @param option
 */
export async function compressWithPngquant(
  item: WaitingImageItem,
  option: CompressConfig
) {
  // TODO
}

/**
 * 用Gifsicle压缩，压缩GIF文件
 * @param item
 * @param option
 */
export async function compressWithGifsicle(
  item: WaitingImageItem,
  option: CompressConfig
) {
  // TODO
}

/**
 * 用squoosh压缩，压缩JPEG/JPG/WEBP/AVIF文件
 * @param item
 * @param option
 */
export async function compressWithSquoosh(
  item: WaitingImageItem & ImageItem,
  option: CompressConfig
) {
  const entry = await getNodeModulesPath("@squoosh");
  const script = path.resolve(entry, "./cli/src/index.js");
  const options = getSquooshCliArguments(item, option);

  // 压缩前先确保删除旧的临时文件
  fs.rmSync(item.tempPath, { force: true });

  // 调用 Squoosh CLI 执行压缩
  try {
    await new Promise<void>((resolve, reject) => {
      const squoosh = spawn(process.execPath, [script, ...options], {
        env: {
          ...process.env,
          ELECTRON_RUN_AS_NODE: "1",
        },
      });
      // 如果启动进程报错，则任务失败
      squoosh.on("error", (event) => {
        console.log("Spawn squoosh cli failed:", event);
        reject();
        squoosh.kill();
      });
      // Squoosh CLI的输出在标准错误通道
      squoosh.stderr.on("data", (data: Buffer) => {
        console.log(`Squoosh output:`, data.toString("utf8"));
        resolve();
        squoosh.kill();
      });
      // 有正常输出的情况下，还要检查输出目录是否有文件生成，如果没有，则任务失败
      squoosh.stdout.on("data", (data: Buffer) => {
        console.log(`Squoosh output:`, data.toString("utf8"));
        resolve();
        squoosh.kill();
      });
    });

    // 检查目录中是否有输出文件
    if (fs.existsSync(item.tempPath)) {
      const stat = fs.lstatSync(item.tempPath);
      item.newSize = stat.size;
      // 读取图片文件的尺寸信息
      const { width, height } = await sizeOf(
        fs.createReadStream(item.tempPath)
      );
      item.newWidth = width;
      item.newHeight = height;
    } else {
      throw new Error("The compressed file does not exist");
    }
  } catch (error) {
    console.log("Unknown exception:", error);
    // 压缩失败，使用旧的文件值直接替换，防止报错
    item.newSize = item.oldSize;
    item.newWidth = item.oldWidth;
    item.newHeight = item.oldHeight;
    item.tempPath = item.path;
  }
}

/**
 * 获取squoosh的调用参数
 * @param item
 * @param option
 */
export function getSquooshCliArguments(
  item: WaitingImageItem,
  option: CompressConfig
) {
  // 最终的输出选项数组
  const options: string[] = [];

  // 拼接尺寸相关参数
  const { width, height } = getNewDimensionByScale(item, option.scale);
  if (width !== item.oldWidth) {
    options.push(
      "--resize",
      JSON.stringify({
        enabled: true,
        width,
        height,
        method: "lanczos3",
        fitMethod: "stretch",
        premultiply: true,
        linearRGB: true,
      })
    );
  }

  // 拼接质量参数
  const quality = option.quality;
  const ext = item.extension!.toUpperCase();
  if (ext === "JPG" || ext === "JPEG") {
    // 对于jpeg格式，quality取值0-100，值越小压缩率越高
    options.push(
      "--mozjpeg",
      JSON.stringify({
        quality,
        baseline: false,
        arithmetic: false,
        progressive: true,
        optimize_coding: true,
        smoothing: 0,
        color_space: 3,
        quant_table: 3,
        trellis_multipass: false,
        trellis_opt_zero: false,
        trellis_opt_table: false,
        trellis_loops: 1,
        auto_subsample: true,
        chroma_subsample: 2,
        separate_chroma_quality: false,
        chroma_quality: 75,
      })
    );
  } else if (ext === "WEBP") {
    // 对于webp格式，quality取值0-100，值越小压缩率越高
    options.push(
      "--webp",
      JSON.stringify({
        quality,
        target_size: 0,
        target_PSNR: 0,
        method: 4,
        sns_strength: 50,
        filter_strength: 60,
        filter_sharpness: 0,
        filter_type: 1,
        partitions: 0,
        segments: 4,
        pass: 1,
        show_compressed: 0,
        preprocessing: 0,
        autofilter: 0,
        partition_limit: 0,
        alpha_compression: 1,
        alpha_filtering: 1,
        alpha_quality: 100,
        lossless: 0,
        exact: 0,
        image_hint: 0,
        emulate_jpeg_size: 0,
        thread_level: 0,
        low_memory: 0,
        near_lossless: 100,
        use_delta_palette: 0,
        use_sharp_yuv: 0,
      })
    );
  } else if (ext === "avif") {
    // 对于avif格式，cqLevel取值0-63，值越大压缩率越高
    let fQuality = ((100 - quality) * 63) / 100;
    options.push(
      "--avif",
      JSON.stringify({
        cqLevel: fQuality,
        cqAlphaLevel: -1,
        subsample: 1,
        tileColsLog2: 0,
        tileRowsLog2: 0,
        speed: 6,
        chromaDeltaQ: false,
        sharpness: 0,
        denoiseLevel: 0,
        tune: 0,
      })
    );
  }

  // 设置文件后缀

  options.push("--suffix", "." + item.tempId);

  // 设置输出目录
  options.push("--output-dir", getTempDir());

  // 设置待压缩的文件
  options.push(item.path);

  return options;
}

/**
 * 这个函数建立在已经读取oldWidth和oldHeight的前提下
 * @param item
 * @param scale
 * @returns 返回计算出的新的宽度和高度
 */
export function getNewDimensionByScale(
  item: WaitingImageItem,
  scale: ScaleOption
) {
  let width = item.oldWidth!;
  let height = item.oldHeight!;
  /**
   * 如果百分比有变化
   */
  if (scale.mode === "percent" && scale.percent !== 100) {
    width = (width * scale.percent) / 100;
    height = (height * scale.percent) / 100;
  }
  if (scale.mode === "width" && scale.width !== width) {
    const ratio = scale.width! / width;
    width = scale.width!;
    height = height! * ratio;
  }
  if (scale.mode === "height" && scale.height !== height) {
    const ratio = scale.height! / height;
    height = scale.height!;
    width = width! * ratio;
  }

  return { width, height };
}
