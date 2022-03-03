import { type EngineMap } from "@/compress/define";
import { compressImage } from "@/compress/function";
import { __g } from "./g";

declare const self: any;

export interface ReqMsg {
  index: number;
  item: WaitingImageItem;
  config: CompressConfig;
  enginMap: EngineMap;
  g: typeof __g;
}

export interface RespMsg {
  index: number;
  item: ImageItem;
}

self.onmessage = async function (event: any) {
  const data = event.data as ReqMsg;
  const item: WaitingImageItem = { ...data.item };
  await compressImage(item, data.config, data.enginMap, data.g);
  self.postMessage({ item, index: data.index });
};
