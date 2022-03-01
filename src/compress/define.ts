export interface EngineMap {
  apng: "upng";
  avif: "avif";
  gif: "gifsicle";
  jpeg: "canvas" | "mozjpeg";
  png: "upng" | "pngquant" | "oxipng";
  svg: "svgo";
  webp: "canvas" | "webp";
}

export type EngineItem = {
  name: string;
  value: string;
  info?: string;
};

export type EngineList = Record<string, Array<EngineItem>>;

export const engineList: EngineList = {
  gif: [{ name: "Gifsicle", value: "gifsicle" }],
  jpeg: [
    { name: "Browser Canvas", value: "canvas", info: "速度极快，体积较小" },
    {
      name: "Squoosh MozJPEG",
      value: "mozjpeg",
      info: "速度较慢，体积较小",
    },
  ],
  webp: [
    { name: "Browser Canvas", value: "canvas", info: "速度极快，体积较小" },
    { name: "Squoosh WebP", value: "webp", info: "速度较慢，体积较小" },
  ],
  png: [
    { name: "UPNG", value: "upng", info: "速度极快，体积较小" },
    { name: "PNGQuant", value: "pngquant", info: "速度较快，体积一般" },
    { name: "OxiPNG", value: "oxipng", info: "速度一般，体积一般" },
  ],
  svg: [{ name: "SVGO", value: "svgo" }],
  apng: [{ name: "UPNG", value: "upng" }],
  avif: [{ name: "Squoosh AVIF", value: "avif" }],
};
