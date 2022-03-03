import { AllowTypes, IPCEvents } from "../utils/const";
import { state } from "./state";
import { type EngineMap } from "../compress/define";
import { ipcRenderer } from "electron";
import { toJS } from "mobx";
import { gworker, __g } from "./g";

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
  ipcRenderer.send(IPCEvents.TempReset);
  await new Promise<void>((resolve) => {
    ipcRenderer.once(IPCEvents.TempResetOver, () => resolve());
  });
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

  for (let index = 0; index < state.list.length; index++) {
    const item = state.list[index];
    // 只有等待压缩的选项才执行压缩
    if (item.status !== 1) continue;
    gworker.postMessage({ index, item: toJS(item), config, enginMap, g: __g });
  }
}

/**
 * 立即重新执行压缩
 */
export async function reCompress() {
  await emptyImageList();
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
