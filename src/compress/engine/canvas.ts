import { AllowTypes } from "@/const";
import {
  assignNewWithOld,
  createImageBySrc,
  getNewDimensionByScale,
  removeOldTemp,
  writeToTemp,
} from "./function";

/**
 * 利用浏览器canvas进行图片压缩，目前支持JPEG/JPG/WEBP
 * @param item
 * @param option
 * @param type
 * @returns
 */
export async function compressByCanvas(
  item: WaitingImageItem,
  option: CompressConfig,
  type: "JPEG" | "WEBP"
) {
  // 删除旧临时文件
  removeOldTemp(item);

  // 计算新的高度和宽度
  const { width: newWidth, height: newHeight } = getNewDimensionByScale(
    item,
    option.scale
  );

  // 通过canvas写新图片
  const canvas = document.createElement("canvas");
  canvas.width = newWidth;
  canvas.height = newHeight;
  const context = canvas.getContext("2d");

  if (context instanceof CanvasRenderingContext2D) {
    const image = await createImageBySrc(item.path);
    context.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      newWidth,
      newHeight
    );

    // 生成Blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (res) => resolve(res),
        AllowTypes[type],
        option.quality / 100
      );
    });

    if (blob instanceof Blob) {
      const wres = await writeToTemp(item, blob);
      if (wres) {
        item.newWidth = newWidth;
        item.newHeight = newHeight;
        item.newSize = blob.size;
        return item;
      }
    }
  }
  // 走到这里代表失败，用原值替换
  assignNewWithOld(item);

  return item;
}
