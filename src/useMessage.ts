import { ipcRenderer } from "electron";
import { useEffect } from "react";
import { IPCEvents } from "./const";
import { readImagesFromPathList } from "./image";
import { state } from "./state";

/**
 * 这个hooks用来响应主进程的信号
 */
export function useMessage() {
  useEffect(() => {
    // 获取选取结果
    ipcRenderer.on(IPCEvents.PickResult, (_, list: Array<string>) => {
      state.isReadList = true;
      // 根据列表读取图片文件
      readImagesFromPathList(list);
    });

    return () => {
      (ipcRenderer.removeAllListeners as any)();
    };
  }, []);
}
