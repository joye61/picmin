import {
  assignNewWithOld,
  ensureOutputImageExits,
  writeToTemp,
} from "./function";
import svgo from "svgo";
import fs from "fs";

export async function compressBySvgo(item: WaitingImageItem) {
  try {
    const content = fs.readFileSync(item.path, { encoding: "utf-8" });
    const result = svgo.optimize(content, {
      plugins: [
        {
          name: "removeViewBox",
          active: false,
        },
        {
          name: "removeDimensions",
          active: true,
        },
      ],
    });
    await writeToTemp(item, result.data);
    await ensureOutputImageExits(item);
  } catch (error) {
    console.log(`SVG:`, error);
    assignNewWithOld(item);
  }
}
