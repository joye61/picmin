import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  OpenDialogSyncOptions,
  shell,
} from "electron";
import { AllowTypes } from "./const";
import { readImageListFromFiles } from "./reader";
import { getCachePath } from "./temp";
import { isMac } from "./utils";

/**
 * 进程间通信绑定逻辑
 * @param mainWindow
 */
export function bindIPC(mainWindow: BrowserWindow) {
  // 退出APP
  ipcMain.on("QuitApp", () => {
    app.quit();
  });

  // 最小化APP
  ipcMain.on("MiniApp", () => {
    mainWindow.minimize();
  });

  // 定位图片
  ipcMain.on("LocateImage", (_, imagePath) => {
    shell.showItemInFolder(imagePath);
  });

  // 读取图片列表，拖拽上传的
  ipcMain.on(
    "ReadImages",
    (event, replyList: string[], existList: Set<string>) => {
      // 响应渲染层读取开始
      event.reply("StartRead");
      readImageListFromFiles(event, replyList, existList);
    }
  );

  // 选取图片
  ipcMain.on("PickImages", (event, existList: Set<string>) => {
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
    // 响应渲染层读取开始
    event.reply("StartRead");
    readImageListFromFiles(event, replyList, existList);
  });

  // 打包保存
  ipcMain.on(
    "SaveBundle",
    (event, list: ImageItem[], bundleName: string) => {
      // TODO
      const savePath = dialog.showSaveDialogSync(mainWindow, {
        defaultPath: bundleName,
        title: "打包另存",
      });
      if (!savePath) {
        event.reply("SaveBundleOver", { ok: false });
        return;
      }
    }
  );

  // 获取系统相关的路径
  ipcMain.on("GetSysPath", (event, pathname: string) => {
    let result: string;
    if (pathname === "txxcache") {
      result = getCachePath();
    } else if (pathname === "app") {
      result = app.getAppPath();
    } else {
      result = app.getPath(pathname as any);
    }
    event.reply("GetSysPathResult", result);
  });

  // 获取app是否已经打包
  ipcMain.on("IsPacked", (event) => {
    event.reply("IsPackedResult", app.isPackaged);
  });
}

export function unbindIPC() {
  ipcMain.removeAllListeners();
}
