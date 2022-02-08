/// <reference types="vite/client" />
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

interface ImageItem {
  // 0：完成压缩，1：正在压缩
  status: 0 | 1;
  path: string;
  name?: string;
  oldSize?: number;
  newSize?: number;
}
