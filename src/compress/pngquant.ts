import {
  assignNewWithOld,
  createBlob,
  ensureOutputImageExits,
  getNewDimensionByScale,
  writeToTemp,
} from "./function";
import fs from "fs-extra";
import { __g } from "@/renderer/g";
import path from "path";
import { compressViaExec } from "./spawn";

export async function compressByPngQuant(
  item: WaitingImageItem,
  option: CompressConfig,
  g: typeof __g
) {
  try {
    const binPath = path.join(g.binPath, "pngquant");
    const { width } = getNewDimensionByScale(item, option.scale);

    // 如果启用了缩放逻辑，先生成缩放图
    let needResize = false;
    if (item.oldWidth !== width) {
      const blob = await createBlob(item, option);
      await writeToTemp(item, blob);
      needResize = true;
    }

    // 要确保临时目录存在，否则pngquant无法生成文件
    fs.ensureDirSync(g.tempPath, {
      mode: 0o744,
    });

    // 执行PNG压缩
    const speed = 11 - (10 * option.quality) / 100;
    const args = [
      "--force",
      "--output",
      item.tempPath,
      "--quality",
      "0-100",
      "--speed",
      `${speed}`,
      "--strip",
      needResize ? item.tempPath : item.path,
    ];
    await compressViaExec({
      execPath: binPath,
      args,
    });
    await ensureOutputImageExits(item);
  } catch (error) {
    console.error(error);
    // 压缩失败，使用旧的文件值直接替换，防止报错
    assignNewWithOld(item);
  }
}
