import { AllowTypes, IPCEvents } from "../utils/const";
import { state } from "./state";
import { type EngineMap } from "../compress/define";
import { ipcRenderer } from "electron";
import { toJS } from "mobx";
import { gworker, __g } from "./g";
import fs from "fs-extra";
import path from "path";

/**
 * 获取应用程序支持的所有后缀
 * @returns
 */
export function getSupportExtensionsAsString() {
  return Object.keys(AllowTypes).join("/");
}

/**
 * 清空图片列表
 * @param event
 */
export async function emptyImageList() {
  state.list = [];
  await clearTempDir();
}

/**
 * 清空临时目录
 */
export async function clearTempDir() {
  ipcRenderer.send(IPCEvents.TempReset);
  await new Promise<void>((resolve) => {
    ipcRenderer.once(IPCEvents.TempResetOver, () => resolve());
  });
}

/**
 * 删除列表中的某一项
 * @param item
 * @param index
 * @param removeSource
 */
export async function removeImageItem(
  item: WaitingImageItem,
  index: number,
  removeSource: boolean = false
) {
  // 删除压缩文件
  fs.removeSync(item.tempPath);
  // 如果允许，则删除源文件
  if (removeSource) {
    fs.removeSync(item.path);
  }
  // 删除列表中的项
  state.list.splice(index, 1);
}

/**
 * 图片保存逻辑
 */
export async function saveImageList() {
  // 标记正在保存中
  state.isSaving = true;
  // 展示保存状态至少一秒钟
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 800);
  });

  if (state.saveType === "cover" || state.saveType === "alias") {
    for (let item of state.list) {
      if (!item.tempPath || !fs.pathExistsSync(item.tempPath)) {
        continue;
      }
      // 覆盖原始文件
      if (state.saveType === "cover") {
        try {
          fs.copyFileSync(item.tempPath, item.path);
        } catch (error) {}
      }
      // 别名保存逻辑
      if (state.saveType === "alias") {
        const dirname = path.dirname(item.path);
        const filename =
          item.nameWithoutExt + `.${state.alias}.` + item.extension;
        const dest = path.join(dirname, filename);
        try {
          fs.copyFileSync(item.tempPath, dest);
        } catch (error) {}
      }
    }
  }

  // 打包保存，打包保存通过主进程来执行
  if (state.saveType === "bundle") {
    await new Promise<void>((resolve) => {
      ipcRenderer.send(
        IPCEvents.SaveBundle,
        toJS(state.list),
        state.bundleName
      );
      ipcRenderer.once(IPCEvents.SaveBundleOver, () => {
        resolve();
      });
    });
  }

  state.isSaving = false;
}

/**
 * 唤起压缩
 */
export async function invokeCompress() {
  const enginMap: EngineMap = {
    apng: state.apngEngine,
    avif: state.avifEngine,
    gif: state.gifEngine,
    jpeg: state.jpegEngine,
    png: state.pngEngine,
    svg: state.svgEngine,
    webp: state.webpEngine,
  };

  const scale: ScaleOption = {
    mode: state.scaleMode,
    percent: state.scalePercent && Number(state.scalePercent),
    width: state.scaleWidth && Number(state.scaleWidth),
    height: state.scaleHeight && Number(state.scaleHeight),
  };
  const config: CompressConfig = {
    quality: state.qualityPercent,
    scale,
  };
  gworker.postMessage({ list: toJS(state.list), config, enginMap, g: __g });
}

/**
 * 立即重新执行压缩
 */
export async function reCompress() {
  await clearTempDir();
  const list = toJS(state.list);
  list.forEach((item) => {
    item.newSize = undefined;
    item.newWidth = undefined;
    item.newHeight = undefined;
    item.cantCompress = false;
    item.status = 1;
  });
  state.list = list;
  // 列表状态更新后，停止一秒钟
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 1000);
  });
  await invokeCompress();
}
