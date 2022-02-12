// Warning: 当前文件只能被主进程调用

import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  OpenDialogSyncOptions,
  shell,
} from "electron";
import { AllowTypes, IPCEvents } from "./const";
import { isMac } from "./resolve";

/**
 * 进程间通信绑定逻辑
 * @param mainWindow
 */
export function bindIPC(mainWindow: BrowserWindow) {
  // 退出APP
  ipcMain.on(IPCEvents.QuitApp, () => {
    app.quit();
  });

  // 最小化APP
  ipcMain.on(IPCEvents.MiniApp, () => {
    mainWindow.minimize();
  });

  // 定位图片
  ipcMain.on(IPCEvents.LocateImage, (_, imagePath) => {
    shell.showItemInFolder(imagePath);
  });

  // 选取图片
  ipcMain.on(IPCEvents.PickImages, (event) => {
    const extensions = Object.keys(AllowTypes).map((ext) => ext.toLowerCase());
    // windows和linux下不支持同时选择文件和文件夹
    const openProps: OpenDialogSyncOptions["properties"] = ["openFile"];
    if (isMac()) {
      openProps.push("openDirectory");
    }
    const result = dialog.showOpenDialogSync({
      title: "请选择待压缩的图片",
      filters: [{ name: "支持类型", extensions }],
      properties: [
        ...openProps,
        "multiSelections",
        "showHiddenFiles",
        "promptToCreate",
      ],
    });

    // 将读取的图片列表返回给渲染进程
    const replyList: Array<string> = Array.isArray(result) ? result : [];
    event.reply(IPCEvents.PickResult, replyList);
  });

  // 获取系统相关的路径
  ipcMain.on(
    IPCEvents.GetSysPath,
    (event, pathname: "app" | Parameters<typeof app.getPath>[any]) => {
      let result: string;
      if (pathname === "app") {
        result = app.getAppPath();
      } else {
        result = app.getPath(pathname);
      }
      event.reply(IPCEvents.GetSysPathResult, result);
    }
  );
}

export function unbindIPC() {
  ipcMain.removeAllListeners();
}
