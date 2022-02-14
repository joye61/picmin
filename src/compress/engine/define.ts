export interface EngineMap {
  apng: "upng";
  avif: "avif";
  gif: "gifsicle";
  jpeg: "canvas" | "mozjpeg" | "jpegxl";
  png: "pngquant" | "oxipng" | "upng";
  svg: "svgo";
  webp: "canvas" | "webp";
}

export const engineList = {
  apng: [{ name: "UPNG", value: "upng" }],
  avif: [{ name: "AVIF", value: "avif" }],
  gif: [{ name: "Gifsicle", value: "Gifsicle" }],
  jpeg: [
    { name: "Browser Canvas", value: "canvas" },
    {
      name: "MozJPEG",
      value: "mozjpeg",
    },
    { name: "JPEG-XL", value: "jpegxl" },
  ],
  png: [
    { name: "PNGQuant", value: "pngquant" },
    { name: "OxiPNG", value: "oxipng" },
    { name: "UPNG", value: "upng" },
  ],
  svg: [{ name: "SVGO", value: "svgo" }],
  webp: [
    { name: "Browser Canvas", value: "canvas" },
    { name: "WebP", value: "webp" },
  ],
};
