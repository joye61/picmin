interface PngConfig extends CompressConfig {
  engine: "pngquant" | "oxipng" | "upng";
}

export async function run(
  image: WaitingImageItem,
  config: PngConfig
): Promise<Required<ImageItem>> {
  return image as any;
}
