import { AllowTypes, IPCEvents } from "../utils/const";
import { state } from "./state";
import { type EngineMap } from "../compress/define";
import { ipcRenderer } from "electron";
import { toJS } from "mobx";

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

  for (let item of state.list) {
    if (item.status !== 1) continue;
    // 压缩逻辑，放在worker中压缩
    const result: ImageItem = await new Promise<ImageItem>((resolve) => {
      const worker = new Worker(
        new URL("./compressWorker.ts", import.meta.url)
      );
      worker.postMessage({ item: toJS(item), config, enginMap });
      worker.onmessage = function (event) {
        resolve(event.data);
        worker.terminate();
      };
    });

    // 更新列表中对应的项
    const findIndex = state.list.findIndex((item) => item.path === result.path);
    if (findIndex !== -1) {
      state.list[findIndex] = { key: result.path, ...result, status: 0 };
    }
  }
}
