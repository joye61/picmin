interface SvgConfig extends CompressConfig {
  engine: "svgo";
}

export async function run(
  image: WaitingImageItem,
  config: SvgConfig
): Promise<Required<ImageItem>> {
  return image as any;
}
