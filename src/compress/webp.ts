interface WebpConfig extends CompressConfig {
  engine: "canvas" | "webp";
}

export async function run(
  image: WaitingImageItem,
  config: WebpConfig
): Promise<Required<ImageItem>> {
  return image as any;
}
