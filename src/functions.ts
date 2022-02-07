export enum AllowTypes {
  JPG = "image/jpeg",
  JPEG = "image/jpeg",
  PNG = "image/png",
  APNG = "image/apng",
  WEBP = "image/webp",
  GIF = "image/gif",
  AVIF = "image/avif",
  SVG = "image/svg+xml",
}

export interface Window {
  TxxCompressApp: {
    closeApp(): void;
    minimizeApp(): void;
  };
}