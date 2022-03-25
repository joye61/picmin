import WorkerP from "./workerp?worker";
import WorkerC from "./workerc?worker";
import { getCompressOption, state } from "./state";
import { useEffect } from "react";

const { ipcRenderer } = require("electron");

// 存储全局的workers
export const workers: Record<string, Worker | null> = {
  wp: null,
  wc: null,
};

/**
 * 处理和主进程的通信逻辑
 */
export function useIpc() {
  useEffect(() => {
    ipcRenderer.on("ReceiveImages", (_, list: ImageItem[]) => {
      state.list.push(...list);
      state.isReadList = false;
      // 生成缩略图
      workers.wp?.postMessage(list);
      // 压缩图片
      workers.wc?.postMessage({
        list,
        option: getCompressOption(),
      });
    });
    ipcRenderer.on("StartRead", () => {
      state.isReadList = true;
    });

    return () => {
      (ipcRenderer.removeAllListeners as any)();
    };
  }, []);
}

/**
 * 处理Worker相关逻辑
 * @returns
 */
export function useWorker() {
  useEffect(() => {
    workers.wp = new WorkerP();
    workers.wc = new WorkerC();

    workers.wp.onmessage = (event) => {
      const data: { path: string; preview: Blob } = event.data;
      const item = state.list.find((row) => row.path === data.path);
      if (item) {
        item.preview = data.preview;
      }
    };

    workers.wc.onmessage = (event) => {
      console.log(event.data);
    };

    return () => {
      if (workers.wp instanceof WorkerP) {
        workers.wp.terminate();
      }
      if (workers.wc instanceof WorkerC) {
        workers.wc.terminate();
      }
    };
  }, []);
}
