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

  return { width, height };
}
