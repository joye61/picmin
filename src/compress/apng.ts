interface ApngConfig extends CompressConfig {
  engine: "upng";
}

export async function run(
  image: WaitingImageItem,
  config: ApngConfig
): Promise<Required<ImageItem>> {
  return image as any;
}
