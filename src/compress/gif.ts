interface GifConfig extends CompressConfig {
  engine: "gifsicle";
}

export async function run(
  image: WaitingImageItem,
  config: GifConfig
): Promise<Required<ImageItem>> {
  return image as any;
}
