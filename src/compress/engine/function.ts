import fs from "fs-extra";

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
  item.tempPath = item.path;
}

/**
 * 通过图片地址创建图片
 * @param src
 * @returns
 */
export async function createImageBySrc(
  src: string | Blob
): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    if (src instanceof Blob) {
      img.src = URL.createObjectURL(src);
    } else {
      img.src = src;
    }
    img.onload = () => resolve(img);
  });
}

/**
 * 删除旧的生成文件
 * @param item
 */
export function removeOldTemp(item: WaitingImageItem) {
  fs.rmSync(item.tempPath, { force: true });
}

/**
 * 将数据写入临时文件
 * @param item
 * @param data
 */
export async function writeToTemp(item: WaitingImageItem, data: Blob) {
  const buf = await data.arrayBuffer();
  fs.outputFileSync(item.tempPath, new Uint8Array(buf));
  return fs.existsSync(item.tempPath);
}
