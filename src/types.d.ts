/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PUBLIC_URL: string;
  }
}

declare module "*.avif" {
  const src: string;
  export default src;
}

declare module "*.bmp" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "@squoosh/lib";

interface File {
  path: string;
}

type IPCEventHandler = (event: IpcMainEvent, ...args: any[]) => void;

interface ImageItem {
  // 0：完成压缩，1：正在等待压缩，2：正在压缩中
  status: 0 | 1 | 2;
  // 图片文件的完整路径
  path: string;
  // 生成的临时文件路径
  tempPath?: string;
  // 生成的临时文件对应的id
  tempId?: number;
  // 有扩展名的名字
  name?: string;
  // 没有扩展名的名字
  nameWithoutExt?: string;
  oldSize?: number;
  oldWidth?: number;
  oldHeight?: number;
  newSize?: number;
  newWidth?: number;
  newHeight?: number;
  // 图片文件的扩展名，原始扩展
  extension?: string;
  // 大写扩展名
  upperExtension?: string;
}

// 等待状态的图片
interface WaitingImageItem {
  status: 0 | 1 | 2;
  path: string;
  tempPath: string;
  tempId: number;
  name: string;
  nameWithoutExt: string;
  extension: string;
  upperExtension: string;
  oldSize: number;
  oldWidth: number;
  oldHeight: number;
  // 等待状态就最后三个状态不确定
  newSize?: number;
  newWidth?: number;
  newHeight?: number;
}

// 缩放选项
interface ScaleOption {
  mode: "percent" | "width" | "height";
  percent: number;
  width?: number;
  height?: number;
}

// 压缩选项
interface CompressConfig {
  scale: ScaleOption;
  quality: number;
}
