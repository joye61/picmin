export const AllowTypes = {
  JPG: "image/jpeg",
  JPEG: "image/jpeg",
  PNG: "image/png",
  WEBP: "image/webp",
  GIF: "image/gif",
  AVIF: "image/avif",
  SVG: "image/svg+xml",
}

// 假设主进程A，渲染进程B
export enum IPCEvents {
  // 退出应用程序 B->A
  QuitApp = "QuitApp",
  // 最小化应用程序 B->A
  MiniApp = "MiniApp",
  // 读取图片列表
  ReadImages = "ReadImages",
  // 选取图片 B->A
  PickImages = "PickImages",
  // 开始读取
  StartRead = "StartRead",
  // 收到一张图片对象
  ReadImageItem = "ReceiveImageItem",
  // 定位图片，打开图片所在文件夹 B->A
  LocateImage = "LocateImage",
  // 获取系统文件夹路径 B->A
  GetSysPath = "GetSysPath",
  // 获取系统文件夹路径结果 A->B
  GetSysPathResult = "GetSysPathResult",
  // 临时目录重置
  TempReset = "TempReset",
  // 临时目录重置完成
  TempResetOver = "TempResetOver",
  // 保存压缩包
  SaveBundle = "SaveBundle",
  // 保存压缩包结束
  SaveBundleOver = "SaveBundleOver",
}

// 临时的生成文件夹名字，放在临时目录下
export const TempDirName = "com.tuxiaoxiao.picmin";