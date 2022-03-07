import { type EngineMap } from "./define";

export interface ImageItem {
  // 0：完成压缩，1：正在等待压缩，2：正在压缩中
  status: 0 | 1 | 2;
  // 图片文件的完整路径
  path: string;
  // 生成的临时文件路径
  tempPath: string;
  // 生成的临时文件对应的id
  tempId: number;
  // 有扩展名的名字
  name: string;
  // 没有扩展名的名字
  nameWithoutExt: string;
  // 原始尺寸
  oldSize: number;
  // 原始宽度
  oldWidth: number;
  // 原始高度
  oldHeight: number;
  // 压缩尺
  newSize: number;
  // 压缩宽度
  newWidth: number;
  // 压缩高度
  newHeight: number;
  // 图片文件的扩展名，原始扩展
  extension: string;
  // 大写扩展名
  upperExtension: string;
  // 是否无法压缩
  fail: boolean;
}

// 压缩之前的图片
export type WaitingImageItem = Omit<
  ImageItem,
  "newSize" | "newWidth" | "newHeight" | "fail"
>;

export interface CompressOption {
  quality: number;
  mode: "percent" | "width" | "height";
  percent: number;
  width?: undefined;
  height?: undefined;
}

export async function compress(
  file: string,
  option: CompressOption,
  engine: EngineMap
): Promise<ImageItem> {
  // throw new Error("test111");
  // return Promise.reject(new Error("rrr"));

  return {} as ImageItem;
}
