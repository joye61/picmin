import { getBinPath } from "@/util";
import { spawn } from "child_process";
import {
  assignNewWithOld,
  createBlob,
  ensureOutputImageExits,
  getNewDimensionByScale,
  writeToTemp,
} from "./function";

export async function compressByOxipng(
  item: WaitingImageItem,
  option: CompressConfig
) {
  try {
    const binPath = getBinPath("oxipng");
    const { width } = getNewDimensionByScale(item, option.scale);

    // 如果启用了缩放逻辑，先生成缩放图
    let needResize = false;
    if (item.oldWidth !== width) {
      const blob = await createBlob(item, option);
      await writeToTemp(item, blob);
      needResize = true;
    }

    // 执行gif压缩
    await new Promise<void>((resolve, reject) => {
      let quality: number | string = Math.ceil((option.quality * 7) / 100);
      if (quality === 7) {
        quality = "max";
      }
      const oxipng = spawn(binPath, [
        "-o",
        `${quality}`,
        "--out",
        item.tempPath,
        "--strip",
        "all",
        needResize ? item.tempPath : item.path,
      ]);
      oxipng.on("exit", (event) => {
        console.log("Oxipng cli exited:", event);
        resolve();
      });
      oxipng.on("error", (event) => {
        console.log("Spawn oxipng cli failed:", event);
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
