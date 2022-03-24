export enum AllowTypes {
  JPG = "image/jpeg",
  JPEG = "image/jpeg",
  PNG = "image/png",
  WEBP = "image/webp",
  GIF = "image/gif",
  AVIF = "image/avif",
  SVG = "image/svg+xml",
}

/**
 * 获取应用程序支持的所有后缀
 * @returns
 */
 export function getSupportExtensionsAsString() {
  return Object.keys(AllowTypes).join("/");
}