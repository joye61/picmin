interface JpegConfig extends CompressConfig {
  engine: "canvas" | "mozjpeg" | "jpegxl";
}

export async function run(
  image: WaitingImageItem,
  config: JpegConfig
): Promise<Required<ImageItem>> {
  return image as any;
}
