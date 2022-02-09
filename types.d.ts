/// <reference types="vite/client" />
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module "@squoosh/lib";
interface File {
  path: string;
}

type IPCEventHandler = (event: IpcMainEvent, ...args: any[]) => void;

interface ImageItem {
  // 0：完成压缩，1：正在压缩
  status?: 0 | 1;
  // 图片文件的完整路径
  path: string;
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
}
