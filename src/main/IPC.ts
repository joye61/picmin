import { ipcMain, app, BrowserWindow, IpcMainEvent } from 'electron';

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
    ipcMain.on('quitApp', this._quitApp);
    ipcMain.on('minimizeApp', this._minimize);
  }
  public unbind() {
    ipcMain.off('quitApp', this._quitApp);
    ipcMain.off('minimizeApp', this._minimize);
  }
}
