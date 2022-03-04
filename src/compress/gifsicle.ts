import { __g } from "@/renderer/g";
import {
  assignNewWithOld,
  ensureOutputImageExits,
  getNewDimensionByScale,
} from "./function";
import path from "path";
import { compressViaExec } from "./spawn";

export async function compressByGifsicle(
  item: WaitingImageItem,
  option: CompressConfig,
  g: typeof __g
) {
  try {
    const binPath = path.join(g.binPath, "gifsicle");
    const { width, height } = getNewDimensionByScale(item, option.scale);
    const quality = Math.ceil((3 * option.quality) / 100);
    const args = [
      `-O${quality}`,
      "--resize",
      `${width}x${height}`,
      item.path,
      "-o",
      item.tempPath,
    ];

    // 执行GIF压缩
    await compressViaExec({ execPath: binPath, args });
    // 确保输出文件存在
    await ensureOutputImageExits(item);
  } catch (error) {
    console.error(error);
    // 压缩失败，使用旧的文件值直接替换，防止报错
    assignNewWithOld(item);
  }
}
