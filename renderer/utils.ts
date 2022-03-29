import fileSize from "filesize";
import { toJS } from "mobx";
import { showAlert } from "./components/Alert";
import { workers } from "./ipc";
import { existSets, getCompressOption, state, __g } from "./state";

const { ipcRenderer } = require("electron");
const fs = require("fs-extra");

/**
 * 获取一个格式化之后的大小
 * @param num
 */
export function fsize(num: number, array = false): string | [number, string] {
  const result = fileSize(num, { base: 2, output: "array", standard: "jedec" });
  if (array) {
    return result;
  } else {
    return result[0] + result[1];
  }
}

/**
 * 处理文件拖拽进入事件
 * @param event
 */
export async function handleFilesDrop(event: React.DragEvent<HTMLDivElement>) {
  let files: string[] = [];
  // Electron环境可以确保dataTransform存在
  for (let i = 0; i < event.dataTransfer!.items.length; i++) {
    if (event.dataTransfer!.items[i].kind === "file") {
      const file = event.dataTransfer!.items[i].getAsFile()!;
      files.push(file.path);
    }
  }
  // 读取图片
  ipcRenderer.send("ReadImages", files, existSets);
}

/**
 * 重新压缩所有图片
 */
export async function reCompress() {
  const sendList: Omit<ImageItem, "preview">[] = [];
  state.list.forEach((item) => {
    item.status = 0;
    item.fail = false;
    item.newSize = undefined;
    item.newWidth = undefined;
    item.newSize = undefined;

    const tempItem = toJS(item);
    // 防止preview在worker间传递
    delete tempItem.preview;
    sendList.push(tempItem);
  });

  // 重新压缩之前首先要重置缓存目录
  resetCache();

  // 发送给压缩worker处理
  workers.wc?.postMessage({
    list: sendList,
    option: getCompressOption(),
    g: __g,
  });
}

// 确保系统路径获取只在初始化的时候执行一次
export async function getSysPath(name = "app") {
  ipcRenderer.send("GetSysPath", name);
  return await new Promise<string>((resolve) => {
    ipcRenderer.once("GetSysPathResult", (_, result) => {
      resolve(result);
    });
  });
}

/**
 * 获取app是否已打包
 * @returns
 */
export async function getAppIsPacked() {
  ipcRenderer.send("IsPacked");
  return await new Promise<boolean>((resolve) => {
    ipcRenderer.once("IsPackedResult", (_, result) => {
      resolve(result);
    });
  });
}

/**
 * 获取缓存路径
 * @returns
 */
export async function getCachePath() {
  return getSysPath("txxcache");
}

/**
 * 1、清空缓存目录
 * 2、确保缓存目录存在
 */
export function resetCache() {
  if (__g.cachePath) {
    fs.emptyDirSync(__g.cachePath);
  }
}

/**
 * 保存压缩结果
 */
export async function saveResult() {
  state.isSaving = true;
  if (state.saveType === "cover") {
    await new Promise<void>((resolve) => {
      showAlert("覆盖保存会丢失原始文件，是否确认操作？", () => {
        for (let item of state.list) {
          if (!item.fail) {
            try {
              fs.copySync(item.tempPath, item.path);
            } catch (error) {}
            resolve();
          }
        }
      });
    });
  } else if (state.saveType === "alias") {
  } else if (state.saveType === "bundle") {
  }

  state.isSaving = false;
}
