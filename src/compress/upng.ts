import {
  assignNewWithOld,
  createImage,
  drawImageToCanvas,
  ensureOutputImageExits,
  getNewDimensionByScale,
  readImageFileToBuffer,
  writeToTemp,
} from "./function";
import { UPNG } from "./upng.lib";

export async function compressByUpng(
  item: WaitingImageItem,
  option: CompressConfig
) {
  try {
    if (!["PNG", "APNG"].includes(item.upperExtension)) {
      throw new Error("Unsupported [A]PNG image formats");
    }

    const { width, height } = getNewDimensionByScale(item, option.scale);

    // 读取图片数据到buffer中
    const buf = await readImageFileToBuffer(item.path);
    // 解码数据
    const decodeRes: any = UPNG.decode(buf);
    // 编码质量
    const quality = (option.quality * 256) / 100;

    let cbuf: ArrayBuffer;
    // 单帧PNG文件
    if (decodeRes.frames.length === 0) {
      try {
        // 如果编码过程中报错，尝试用canvas绘制
        cbuf = UPNG.encode([decodeRes.data.buffer], width, height, quality);
      } catch (error) {
        const image = await createImage(item);
        const { context } = drawImageToCanvas(image, width, height);
        const imageData = context.getImageData(0, 0, width, height);
        cbuf = UPNG.encode([imageData.data.buffer], width, height, quality);
      }
    }
    // APNG文件
    else {
      let bufs: Array<ArrayBuffer> = [decodeRes.data.buffer];
      let delays: number[] = [];
      decodeRes.frames.forEach((item: any, index: number) => {
        if (index !== 0) {
          bufs.push(item.data.buffer);
        }
        delays.push(item.dealy);
      });
      cbuf = UPNG.encode(bufs, width, height, quality, delays);
    }

    // 输出写入临时目录
    await writeToTemp(item, cbuf);
    // 更新数据
    await ensureOutputImageExits(item);
  } catch (error) {
    console.log(`Exceptions occur when compressing [A]PNG file: `, error);
    assignNewWithOld(item);
  }
}
