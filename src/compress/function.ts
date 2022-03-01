import fs from "fs-extra";
import { type EngineMap } from "./define";
import { compressByCanvas } from "./canvas";
import { compressByGifsicle } from "./gifsicle";
import { compressByOxipng } from "./oxipng";
import { compressByPngQuant } from "./pngquant";
import { compressBySquoosh } from "./squoosh";
import { compressBySvgo } from "./svgo";
import { compressByUpng } from "./upng";
import sizeOf from "probe-image-size";
import { AllowTypes } from "@/const";

/**
 * 根据传入的配置参数获取将要生成的图片的宽度和高度
 * @param item
 * @param scale
 * @returns 返回计算出的新的宽度和高度
 */
export function getNewDimensionByScale(
  item: WaitingImageItem,
  scale: ScaleOption
) {
  let width = item.oldWidth;
  let height = item.oldHeight;

  if (scale.mode === "percent" && scale.percent !== 100) {
    width = (width * scale.percent) / 100;
    height = (height * scale.percent) / 100;
  }
  if (scale.mode === "width" && scale.width && scale.width !== width) {
    const ratio = scale.width! / width;
    width = scale.width;
    height = height * ratio;
  }
  if (scale.mode === "height" && scale.height && scale.height !== height) {
    const ratio = scale.height! / height;
    height = scale.height;
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
 * 在压缩失败的情况下，用旧值代替新值
 * @param item
 */
export function assignNewWithOld(item: WaitingImageItem) {
  item.newSize = item.oldSize;
  item.newWidth = item.oldWidth;
  item.newHeight = item.oldHeight;
  item.cantCompress = true;
}

/**
 * 生成图片文件的buffer数据
 * @param src
 * @returns
 */
export async function readImageFileToBuffer(src: string) {
  const resp = await fetch(`file://` + src);
  const buf = await resp.arrayBuffer();
  return buf;
}

/**
 * 根据图片文件创建Blob
 * @param item
 * @param option
 */
export async function createBlob(
  item: WaitingImageItem,
  option: CompressConfig
) {
  // 计算新的高度和宽度
  const { width, height } = getNewDimensionByScale(item, option.scale);
  const image = await createImageBySrc(item.path);
  const { canvas } = drawImageToCanvas(image, width, height);
  // 生成Blob
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(
      (res) => resolve(res),
      (AllowTypes as any)[item.upperExtension],
      option.quality / 100
    );
  });
  if (!(blob instanceof Blob)) {
    throw new Error("Unable to read image binary information");
  }

  return blob;
}

/**
 * 通过图片地址创建图片
 * @param src
 * @returns
 */
export async function createImageBySrc(
  src: string | Blob
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    if (src instanceof Blob) {
      img.src = URL.createObjectURL(src);
    } else {
      img.src = "file://" + src;
    }
    img.onerror = (error) => {
      reject(error);
    };
    img.onload = () => {
      resolve(img);
    };
  });
}

/**
 * 绘制图片到canvas中
 * @param image
 * @param width
 * @param height
 */
export function drawImageToCanvas(
  image: HTMLImageElement,
  width: number,
  height: number
) {
  // 通过canvas写新图片
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!(context instanceof CanvasRenderingContext2D)) {
    throw new Error("Unable to get canvas drawing context");
  }

  // 将图片绘制到canvas中
  context.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    0,
    0,
    width,
    height
  );

  return { canvas, context };
}

/**
 * 将数据写入临时文件
 * @param item
 * @param data
 */
export async function writeToTemp(
  item: WaitingImageItem,
  data: Blob | ArrayBuffer | string
) {
  // 写入新文件前先删除旧文件
  fs.rmSync(item.tempPath, { force: true });

  let content: Uint8Array | string = "";
  if (data instanceof ArrayBuffer) {
    content = new Uint8Array(data);
  } else if (data instanceof Blob) {
    const buf = await data.arrayBuffer();
    content = new Uint8Array(buf);
  } else if (typeof content === "string") {
    content = data;
  }

  fs.outputFileSync(item.tempPath, content);
  const wres = fs.existsSync(item.tempPath);
  if (!wres) {
    throw new Error(
      `File cannot be written to temporary directory: ${item.path}`
    );
  }
}

/**
 * 确认输出文件存在，如果不存在，则抛出错误
 * @param item
 */
export async function ensureOutputImageExits(item: WaitingImageItem) {
  // 检查目录中是否有输出文件
  if (!fs.existsSync(item.tempPath)) {
    throw new Error("The compressed file does not exist");
  }
  const stat = fs.lstatSync(item.tempPath);
  item.newSize = stat.size;
  // 读取图片文件的尺寸信息
  const { width, height } = await sizeOf(fs.createReadStream(item.tempPath));
  item.newWidth = width;
  item.newHeight = height;
  item.cantCompress = false;
}

/**
 * 压缩图片
 * @param item
 * @param option
 * @param engin
 * @returns
 */
export async function compressImage(
  item: WaitingImageItem,
  option: CompressConfig,
  engin: Partial<EngineMap>
): Promise<Required<ImageItem>> {
  const type = item.upperExtension;
  if (type === "APNG") {
    await compressByUpng(item, option);
  } else if (type === "AVIF") {
    await compressBySquoosh(item, option);
  } else if (type === "GIF") {
    await compressByGifsicle(item, option);
  } else if (type === "JPG" || type === "JPEG") {
    if (engin.jpeg === "canvas") {
      await compressByCanvas(item, option);
    } else if (engin.jpeg === "mozjpeg") {
      await compressBySquoosh(item, option);
    } else {
      assignNewWithOld(item);
    }
  } else if (type === "PNG") {
    if (engin.png === "upng") {
      await compressByUpng(item, option);
    } else if (engin.png === "pngquant") {
      await compressByPngQuant(item, option);
    } else if (engin.png === "oxipng") {
      await compressByOxipng(item, option);
    } else {
      assignNewWithOld(item);
    }
  } else if (type === "SVG") {
    await compressBySvgo(item, option);
  } else if (type === "WEBP") {
    if (engin.webp === "canvas") {
      await compressByCanvas(item, option);
    } else if (engin.webp === "webp") {
      await compressBySquoosh(item, option);
    } else {
      assignNewWithOld(item);
    }
  } else {
    assignNewWithOld(item);
  }

  return item as Required<ImageItem>;
}
