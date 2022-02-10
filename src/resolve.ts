import { app } from "electron";
import path from "path";

/**
 * 获取资源路径
 * @param paths
 * @returns
 */
export function getAssetsPath(...paths: string[]) {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, "./assets")
    : path.join(__dirname, "../assets");

  return path.join(RESOURCES_PATH, ...paths);
}

/**
 * 获取入口地址
 * @returns
 */
export function getEntryUrl() {
  if (process.env.NODE_ENV === "development") {
    return "http://127.0.0.1:4000";
  }
  return "file://" + path.resolve(__dirname, "../renderer/index.html");
}

/**
 * 判断是否是mac平台
 * @returns
 */
export function isMac() {
  return process.platform === "darwin";
}

/**
 * 判断是否是windows平台
 * @returns
 */
export function isWin() {
  return process.platform === "win32";
}

/**
 * 判断是否是linux平台
 * @returns
 */
export function isLinux() {
  return process.platform === "linux";
}
