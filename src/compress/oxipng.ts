import { __g } from "@/renderer/g";
import { spawn } from "child_process";
import {
  assignNewWithOld,
  createBlob,
  ensureOutputImageExits,
  getNewDimensionByScale,
  writeToTemp,
} from "./function";
import path from "path";
import { compressViaExec } from "./spawn";

export async function compressByOxipng(
  item: WaitingImageItem,
  option: CompressConfig,
  g: typeof __g
) {
  try {
    const binPath = path.join(g.binPath, "oxipng");
    const { width } = getNewDimensionByScale(item, option.scale);

    // 如果启用了缩放逻辑，先生成缩放图
    let needResize = false;
    if (item.oldWidth !== width) {
      const blob = await createBlob(item, option);
      await writeToTemp(item, blob);
      needResize = true;
    }

    let quality: number | string = Math.ceil((option.quality * 7) / 100);
    if (quality === 7) {
      quality = "max";
    }
    const args = [
      "-o",
      `${quality}`,
      "--out",
      item.tempPath,
      "--strip",
      "all",
      needResize ? item.tempPath : item.path,
    ];
    await compressViaExec({ execPath: binPath, args });
    await ensureOutputImageExits(item);
  } catch (error) {
    console.error(error);
    // 压缩失败，使用旧的文件值直接替换，防止报错
    assignNewWithOld(item);
  }
}
