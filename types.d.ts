/// <reference types="vite/client" />
/// <reference types="electron" />

declare module "svgo";

interface ImageItem {
  // 0：压缩中，1：压缩完成
  status: 0 | 1;
  // 图片文件的完整路径
  path: string;
  // 文件类型
  type: string;
  // 生成的临时文件路径
  tempPath: string;
  // 生成的临时文件对应的id
  tempId: number;
  // 有扩展名的名字
  name: string;
  // 没有扩展名的名字
  nameWithoutExt: string;
  // 图片文件的扩展名，原始扩展
  extension: string;
  // 大写扩展名
  upperExtension: string;
  // 原始尺寸
  oldSize: number;
  // 原始宽度
  oldWidth: number;
  // 原始高度
  oldHeight: number;
  // 压缩后尺寸
  newSize?: number;
  // 压缩后宽度
  newWidth?: number;
  // 压缩后高度
  newHeight?: number;
  // 预览二进制
  preview?: Blob;
}

// 压缩选项
interface CompressOption {
  mode: "percent" | "width" | "height";
  percent: number;
  width?: number;
  height?: number;
  quality: number;
}