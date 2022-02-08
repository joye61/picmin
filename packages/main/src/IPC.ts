import { ipcMain, app, BrowserWindow, IpcMainEvent } from "electron";
import { ImageList } from "./image";
import { getAllImagesFromPathList } from "./util";
import {type ImageItem, IPCEvents} from "../../common/const"

export type IPCEventHandler = (event: IpcMainEvent, ...args: any[]) => void;

export class IPC {
  private _quitApp: IPCEventHandler;
  private _minimize: IPCEventHandler;
  private _addImageList: IPCEventHandler;
  private _clearImageList: IPCEventHandler;

  private quitApp() {
    app.quit();
  }
  private minimize() {
    this.win.minimize();
  }

  /**
   * 向图片列表中添加图片
   * @param list
   */
  private addImageList(event: IpcMainEvent, list: ImageItem[]) {
    getAllImagesFromPathList(list);
  }
  
  /**
   * 清空图片列表
   */
  private clearImageList() {
    ImageList.splice(0);
  }

  constructor(public win: BrowserWindow) {
    this._quitApp = this.quitApp.bind(this);
    this._minimize = this.minimize.bind(this);
    this._addImageList = this.addImageList.bind(this);
    this._clearImageList = this.clearImageList.bind(this);
  }

  public bind() {
    ipcMain.on(IPCEvents.QuitApp, this._quitApp);
    ipcMain.on(IPCEvents.MiniApp, this._minimize);
    ipcMain.on(IPCEvents.AddImages, this._addImageList);
    ipcMain.on(IPCEvents.EmptyImages, this._clearImageList);
  }
  public unbind() {
    ipcMain.off(IPCEvents.QuitApp, this._quitApp);
    ipcMain.off(IPCEvents.MiniApp, this._minimize);
    ipcMain.off(IPCEvents.AddImages, this._addImageList);
    ipcMain.off(IPCEvents.EmptyImages, this._clearImageList);
  }
}
