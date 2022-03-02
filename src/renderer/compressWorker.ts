import { type EngineMap } from "@/compress/define";
import { compressImage } from "@/compress/function";

declare const self: any;

interface ReqMsg {
  item: WaitingImageItem;
  config: CompressConfig;
  enginMap: EngineMap;
}

/**
 * 压缩一批图片，逐张压缩
 * @param list
 */
export async function compress(
  item: WaitingImageItem,
  config: CompressConfig,
  enginMap: EngineMap
) {
  await compressImage(item, config, enginMap);
}

self.onmessage = async function (event: any) {
  const data = event.data as ReqMsg;
  const item: WaitingImageItem = { ...data.item };
  await compressImage(item, data.config, data.enginMap);
  self.postMessage(item);
};
