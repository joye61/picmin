import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("TxxCompressApp", {
  // 关闭app
  closeApp() {
    ipcRenderer.send("quitApp");
  },
  // 最小化app
  minimizeApp() {
    ipcRenderer.send("minimizeApp");
  },
  // 向图片列表中添加图片
  addImageList(imageList: Array<ImageItem>) {
    ipcRenderer.send("addImageList", imageList);
  },
  // 清空图片列表
  clearImageList() {
    ipcRenderer.send("clearImageList");
  },
});
