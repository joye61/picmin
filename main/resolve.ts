import { app } from "electron";
import path from "path";

/**
 * 获取资源路径
 * @param paths
 * @returns
 */
export function getAssetsPath(...paths: string[]) {
  const assetsPath = app.isPackaged
    ? path.join(process.resourcesPath, "./assets")
    : path.join(__dirname, "../public");

  return path.join(assetsPath, ...paths);
}

/**
 * 获取入口地址
 * @returns
 */
export function getEntryUrl() {
  if (app.isPackaged) {
    return "file://" + path.resolve(process.resourcesPath, "./app/dist/renderer/index.html");
  }
  return "http://127.0.0.1:4000";
}