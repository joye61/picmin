import { ipcMain, app, BrowserWindow, IpcMainEvent } from 'electron';
import { IPCChannel } from './const';

export type IPCEventHandler = (event: IpcMainEvent, ...args: any[]) => void;

export class IPC {
  private _quitApp: IPCEventHandler;
  private _minimize: IPCEventHandler;
  private quitApp() {
    app.quit();
  }
  private minimize() {
    this.win.minimize();
  }

  constructor(public win: BrowserWindow) {
    this._quitApp = this.quitApp.bind(this);
    this._minimize = this.minimize.bind(this);
  }

  public bind() {
    ipcMain.on(IPCChannel.QuitApp, this._quitApp);
    ipcMain.on(IPCChannel.minimizeApp, this._minimize);
  }
  public unbind() {
    ipcMain.off(IPCChannel.QuitApp, this._quitApp);
    ipcMain.off(IPCChannel.minimizeApp, this._minimize);
  }
}
