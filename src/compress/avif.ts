interface AvifConfig extends CompressConfig {
  engine: "avif";
}

export async function run(
  image: WaitingImageItem,
  config: AvifConfig
): Promise<Required<ImageItem>> {
  return image as any;
}
