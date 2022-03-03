import { __g } from "@/renderer/g";
import { spawn } from "child_process";
import {
  assignNewWithOld,
  ensureOutputImageExits,
  getNewDimensionByScale,
} from "./function";
import path from "path";

export async function compressByGifsicle(
  item: WaitingImageItem,
  option: CompressConfig,
  g: typeof __g
) {
  try {
    const binPath = path.join(g.binPath, "gifsicle");
    const { width, height } = getNewDimensionByScale(item, option.scale);

    // 执行gif压缩
    await new Promise<void>((resolve, reject) => {
      const quality = Math.ceil((3 * option.quality) / 100);
      const gifsicle = spawn(binPath, [
        `-O${quality}`,
        "--resize",
        `${width}x${height}`,
        item.path,
        "-o",
        item.tempPath,
      ]);
      gifsicle.on("exit", (event) => {
        console.log("Gifsicle cli exited:", event);
        resolve();
      });
      gifsicle.on("error", (event) => {
        console.log("Spawn gifsicle cli failed:", event);
        reject();
      });
    });

    await ensureOutputImageExits(item);
  } catch (error) {
    console.log("Exceptions occur when compressing GIF file: ", error);
    // 压缩失败，使用旧的文件值直接替换，防止报错
    assignNewWithOld(item);
  }
}
