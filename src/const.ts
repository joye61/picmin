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

// 假设主进程A，渲染进程B
export enum IPCEvents {
  // 退出应用程序 B->A
  QuitApp = "QuitApp",
  // 最小化应用程序 B->A
  MiniApp = "MiniApp",
  // // 添加图片列表 B->A
  // AddImages = "AddImages",
  // // 清空图片列表 B->A
  // EmptyImages = "EmptyImages",
  // // 清空完成 A->B
  // EmptyOver = "EmptyOver",
  // // 选取图片 B->A
  PickImages = "PickImages",
  // 选取图片完成，但是还没有开始处理
  PickResult = "PickResult",
  // // 状态更新 A->B
  // StatusUpdate = "StatusUpdate",
  // 定位图片，打开图片所在文件夹 B->A
  LocateImage = "LocateImage",
}
