import { ipcRenderer } from "electron";
import { useEffect } from "react";
import { IPCEvents } from "../utils/const";
import { invokeCompress } from "./image";
import { state } from "./state";

interface ReceiveImageItemResult {
  readOver: boolean;
  imageItem: WaitingImageItem | null;
  total: number;
  current: number;
}

/**
 * 这个hooks用来响应主进程的信号
 */
export function useMessage() {
  useEffect(() => {
    ipcRenderer.on(
      IPCEvents.ReadImageItem,
      async (_, result: ReceiveImageItemResult) => {
        state.readTotal = result.total;
        state.readCurrent = result.current;

        // 读取结束，调用压缩
        if (result.readOver) {
          state.isReadList = false;
          await invokeCompress();
          return;
        }
        if (result.imageItem) {
          const item = result.imageItem;
          state.list.push({ key: item.path, ...item });
        }
      }
    );

    return () => {
      (ipcRenderer.removeAllListeners as any)();
    };
  }, []);
}
