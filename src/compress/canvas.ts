import {
  assignNewWithOld,
  createBlob,
  ensureOutputImageExits,
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
) {
  try {
    const blob = await createBlob(item, option);
    await writeToTemp(item, blob);
    await ensureOutputImageExits(item);
  } catch (error) {
    console.log(error);
    assignNewWithOld(item);
  }
}
