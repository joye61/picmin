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
  status: 0 | 1;
  path: string;
  name?: string;
  oldSize?: number;
  oldWidth?: number;
  oldHeight?: number;
  newSize?: number;
  newWidth?: number;
  newHeight?: number;
  extension?: string;
}
