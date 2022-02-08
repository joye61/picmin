import { contextBridge, ipcRenderer } from "electron";
import {type ImageItem, IPCEvents} from "../../common/const"

contextBridge.exposeInMainWorld("PicMin", {
  // 关闭app
  closeApp() {
    ipcRenderer.send(IPCEvents.QuitApp);
  },
  // 最小化app
  miniApp() {
    ipcRenderer.send(IPCEvents.MiniApp);
  },
  // 向图片列表中添加图片
  addImages(imageList: Array<ImageItem>) {
    ipcRenderer.send(IPCEvents.AddImages, imageList);
  },
  // 清空图片列表
  emptyImages() {
    ipcRenderer.send(IPCEvents.EmptyImages);
  },
});
