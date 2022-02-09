import { contextBridge, ipcRenderer } from "electron";
import { IPCEvents } from "@c/const";
// import { IPC } from "./IPC";

export type Callback = (...data: any[]) => void;

/**
 * 处理渲染进程发送给主进程的消息
 */
contextBridge.exposeInMainWorld("PicMin", {
  // 关闭app
  closeApp() {
    ipcRenderer.send(IPCEvents.QuitApp);
  },
  // 最小化app
  miniApp() {
    ipcRenderer.send(IPCEvents.MiniApp);
  },
  // 选取图片
  pickImages() {
    ipcRenderer.send(IPCEvents.PickImages);
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


/**
 * 处理渲主进程发送给渲染进程的消息
 */
contextBridge.exposeInMainWorld("PicMinMessage", {
  // 文件选择结束时触发
  onPickOver(callback: Callback) {
    ipcRenderer.on(IPCEvents.PickOver, () => callback());
  },
  // 清空完成触发
  onEmptyOver(callback: Callback) {
    ipcRenderer.on(IPCEvents.EmptyOver, callback);
  },
  // 状态更新触发
  onStatusUpdate(callback: Callback) {
    ipcRenderer.on(IPCEvents.StatusUpdate, (_, ...data: any[]) =>
      callback(...data)
    );
  },
  // 取消监听所有
  unListenAll() {
    ipcRenderer.removeAllListeners(IPCEvents.EmptyOver);
    ipcRenderer.removeAllListeners(IPCEvents.StatusUpdate);
  },
});
