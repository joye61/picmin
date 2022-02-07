import { URL } from "url";
import path from "path";
import { app } from "electron";
import fs from "fs";
import readdirp from "readdirp";
import { AllowTypes } from "../functions";

/**
 * 判断是否是开发环境
 * @returns
 */
export function isDev(): boolean {
  return (
    process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true"
  );
}

/**
 * 获取入口文件的URL路径
 * @returns
 */
export function getEntryUrl(): string {
  const entryFileName = "index.html";
  if (isDev()) {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = entryFileName;
    return url.href;
  }
  return `file://` + path.resolve(__dirname, "../renderer/", entryFileName);
}

/**
 * 获取资源路径
 * @param paths
 * @returns
 */
export function getAssetPath(...paths: string[]) {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, "assets")
    : path.join(__dirname, "../../assets");

  return path.join(RESOURCES_PATH, ...paths);
}

/**
 * 根据提供的路径列表返回所有的图片文件
 * @param pathList
 */
export async function getAllImagesFromPathList(pathList: ImageItem[]) {
  const output: ImageItem[] = [];
  // 如果不是目录，则判断是否是合法的图片文件
  const types = Object.keys(AllowTypes);

  // 验证文件的合法性，如果是图片，添加到输出中
  const ensureImageLegal = (image: ImageItem): void => {
    const extension = path.extname(image.path).toUpperCase().replace(/^\./, "");
    if (types.includes(extension)) {
      let item: ImageItem = {
        status: image.status,
        path: image.path,
        name: image.name,
      };
      if (!item.name) {
        item.name = path.basename(image.path);
      }
      const stat = fs.lstatSync(item.path);
      item.oldSize = stat.size;
      output.push(item);
    }
  };

  for (let item of pathList) {
    const imagePath = item.path;
    const isDir = fs.lstatSync(imagePath).isDirectory();
    // 如果是目录，则遍历读取目录的所有文件信息
    if (isDir) {
      for await (const entry of readdirp(imagePath, { depth: Infinity })) {
        ensureImageLegal({
          status: item.status,
          name: entry.basename,
          path: entry.fullPath,
        });
      }
      continue;
    }
    // 如果是文件，直接验证文件
    ensureImageLegal(item);
  }

  console.log(output);

  return output;
}
