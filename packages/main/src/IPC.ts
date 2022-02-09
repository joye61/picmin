import {
  ipcMain,
  app,
  BrowserWindow,
  IpcMainEvent,
  dialog,
  OpenDialogSyncOptions,
} from "electron";
import { addImagesFromList, emptyImageList } from "./image";
import { AllowTypes, IPCEvents } from "@c/const";
import { isMac } from "@c/functions";

export class IPC {
  private _quitApp: IPCEventHandler;
  private _miniApp: IPCEventHandler;
  private _addImages: IPCEventHandler;
  private _emptyImages: IPCEventHandler;
  private _pickImages: IPCEventHandler;

  /**
   * 关闭App
   */
  private quitApp() {
    app.quit();
  }

  /**
   * 最小化App
   */
  private miniApp() {
    this.win.minimize();
  }

  /**
   * 选择图片，会弹出系统原生文件选择对话框
   * @param event
   */
  private pickImages(event: IpcMainEvent) {
    const extensions = Object.keys(AllowTypes).map((ext) => ext.toLowerCase());
    // windows和linux下不支持同时选择文件和文件夹
    const openProps: OpenDialogSyncOptions["properties"] = ["openFile"];
    if (isMac()) {
      openProps.push("openDirectory");
    }
    const result = dialog.showOpenDialogSync({
      title: "请选择待压缩的图片",
      filters: [{ name: "图片类型", extensions }],
      properties: [
        ...openProps,
        "multiSelections",
        "showHiddenFiles",
        "promptToCreate",
      ],
    });

    if (Array.isArray(result) && result.length > 0) {
      // 回复渲染进程选取完成
      event.reply(IPCEvents.PickOver);
      const list: ImageItem[] = result.map((item) => {
        return {
          status: 1,
          path: item,
        };
      });
      addImagesFromList(event, list);
    }
  }

  /**
   * 向图片列表中添加图片
   * @param list
   */
  private addImages(event: IpcMainEvent, list: ImageItem[]) {
    addImagesFromList(event, list);
  }

  /**
   * 清空图片列表
   */
  private emptyImages(event: IpcMainEvent) {
    emptyImageList();
    event.reply(IPCEvents.EmptyOver);
  }

  constructor(public win: BrowserWindow) {
    this._quitApp = this.quitApp.bind(this);
    this._miniApp = this.miniApp.bind(this);
    this._addImages = this.addImages.bind(this);
    this._emptyImages = this.emptyImages.bind(this);
    this._pickImages = this.pickImages.bind(this);
  }

  public bind() {
    ipcMain.on(IPCEvents.QuitApp, this._quitApp);
    ipcMain.on(IPCEvents.MiniApp, this._miniApp);
    ipcMain.on(IPCEvents.AddImages, this._addImages);
    ipcMain.on(IPCEvents.EmptyImages, this._emptyImages);
    ipcMain.on(IPCEvents.PickImages, this._pickImages);
  }

  public unbind() {
    ipcMain.off(IPCEvents.QuitApp, this._quitApp);
    ipcMain.off(IPCEvents.MiniApp, this._miniApp);
    ipcMain.off(IPCEvents.AddImages, this._addImages);
    ipcMain.off(IPCEvents.EmptyImages, this._emptyImages);
    ipcMain.off(IPCEvents.PickImages, this._pickImages);
  }
}
