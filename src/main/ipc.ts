import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  OpenDialogSyncOptions,
  shell,
} from "electron";
import { AllowTypes, IPCEvents } from "../utils/const";
import { readImageListFromFiles } from "./reader";
import { isMac } from "@/utils/is";
import { resetTemp } from "./util";

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

  // 临时目录重置
  ipcMain.on(IPCEvents.TempReset, (event) => {
    resetTemp();
    event.reply(IPCEvents.TempResetOver);
  });

  // 读取图片列表，拖拽上传的
  ipcMain.on(
    IPCEvents.ReadImages,
    (event, replyList: string[], existList: Set<string>) => {
      readImageListFromFiles(event, replyList, existList);
    }
  );

  // 选取图片
  ipcMain.on(IPCEvents.PickImages, (event, existList: Set<string>) => {
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
    readImageListFromFiles(event, replyList, existList);
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
