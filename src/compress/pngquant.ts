import { getBinPath, getTempDir } from "@/util";
import { spawn } from "child_process";
import {
  assignNewWithOld,
  createBlob,
  ensureOutputImageExits,
  getNewDimensionByScale,
  writeToTemp,
} from "./function";
import fs from "fs-extra";

export async function compressByPngQuant(
  item: WaitingImageItem,
  option: CompressConfig
) {
  try {
    const binPath = getBinPath("pngquant");
    const { width } = getNewDimensionByScale(item, option.scale);

    // 如果启用了缩放逻辑，先生成缩放图
    let needResize = false;
    if (item.oldWidth !== width) {
      const blob = await createBlob(item, option);
      await writeToTemp(item, blob);
      needResize = true;
    }

    // 要确保临时目录存在，否则pngquant无法生成文件
    fs.ensureDirSync(getTempDir(), {
      mode: 0o744,
    });

    // 执行gif压缩
    await new Promise<void>((resolve, reject) => {
      const pngquant = spawn(binPath, [
        "--force",
        "--output",
        item.tempPath,
        "--quality",
        `${option.quality}`,
        "--strip",
        needResize ? item.tempPath : item.path,
      ]);
      pngquant.on("exit", (event) => {
        console.log("Pngquant cli exited:", event);
        resolve();
      });
      pngquant.on("error", (event) => {
        console.log("Spawn pngquant cli failed:", event);
        reject();
      });
    });

    await ensureOutputImageExits(item);
  } catch (error) {
    console.log("Exceptions occur when compressing png file: ", error);
    // 压缩失败，使用旧的文件值直接替换，防止报错
    assignNewWithOld(item);
  }
}
