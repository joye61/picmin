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

export enum IPCEvents {
  // 退出应用程序
  QuitApp = "QuitApp",
  // 最小化应用程序
  MiniApp = "MiniApp",
  // 添加图片列表
  AddImages = "AddImages",
  // 清空图片列表
  EmptyImages = "EmptyImages",
  // 清空完成
  EmptyOver = "EmptyOver",
  // 选取图片
  PickImages = "PickImages",
  // 选取图片完成，但是还没有开始处理
  PickOver = "PickOver",
  // 状态更新
  StatusUpdate = "StatusUpdate",
}
