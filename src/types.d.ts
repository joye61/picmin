interface Window {
  TxxCompressApp: {
    closeApp(): void;
    minimizeApp(): void;
    addImageList(imageList: ImageItem[]): void;
  };
}

interface ImageItem {
  // 0：完成压缩，1：正在压缩
  status: 0 | 1;
  path: string;
  name?: string;
  oldSize?: number;
  newSize?: number;
}
