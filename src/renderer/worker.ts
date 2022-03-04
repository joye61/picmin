import { type EngineMap } from "@/compress/define";
import { compressImage } from "@/compress/function";
import { __g } from "./g";

declare const self: any;

export interface ReqMsg {
  list: WaitingImageItem[];
  config: CompressConfig;
  enginMap: EngineMap;
  g: typeof __g;
}

export interface RespMsg {
  index: number;
  item: ImageItem;
  ok?: boolean;
}

self.onmessage = async function (event: any) {
  const data = event.data as ReqMsg;

  const all: Promise<void>[] = [];

  for (let i = 0; i < data.list.length; i++) {
    const item = data.list[i];
    const task = async () => {
      await compressImage(item, data.config, data.enginMap, data.g);
      self.postMessage({ item, index: i });
    };
    all.push(task());
  }

  await Promise.all(all);
  // 通知主线程完成
  self.postMessage({ ok: true });
};
