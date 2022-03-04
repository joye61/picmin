import { notification, Typography } from "antd";
import { ipcRenderer } from "electron";
import { useEffect } from "react";
import { IPCEvents } from "../utils/const";
import { gworker } from "./g";
import { invokeCompress } from "./image";
import { state } from "./state";
import { type RespMsg } from "./worker";
import { CloseIcon } from "@/components/CloseIcon";

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
    // 监听worker的通信
    const workerListen = (event: MessageEvent<RespMsg>) => {
      const result = event.data;
      if (result.ok === true) {
        const cacheName = "ok-tip";
        const cache = window.sessionStorage.getItem(cacheName);
        if (!cache) {
          notification.success({
            duration: 3,
            message: <Typography.Text type="success">压缩完成</Typography.Text>,
            closeIcon: <CloseIcon />,
            description: (
              <Typography.Text>
                压缩结果不会自动保存，请选择一种保存方式主动保存。
                <Typography.Text type="secondary">
                  （该提示只会在启动后的首次压缩时显示）
                </Typography.Text>
              </Typography.Text>
            ),
          });
          window.sessionStorage.setItem(cacheName, "ok");
        }
      } else {
        const item = event.data.item;
        const index = event.data.index;
        state.list[index] = { key: item.path, ...item, status: 0 };
      }
    };
    gworker.addEventListener("message", workerListen);

    // 开始读取
    ipcRenderer.on(IPCEvents.StartRead, () => {
      state.isReadList = true;
    });

    // 监听主进程的通信
    ipcRenderer.on(
      IPCEvents.ReadImageItem,
      async (_, result: ReceiveImageItemResult) => {
        state.readTotal = result.total;
        state.readCurrent = result.current;

        // 读取结束，调用压缩
        if (result.readOver) {
          state.isReadList = false;
          state.readTotal = 0;
          state.readCurrent = 0;
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
      gworker.removeEventListener("message", workerListen);
      (ipcRenderer.removeAllListeners as any)();
    };
  }, []);
}
