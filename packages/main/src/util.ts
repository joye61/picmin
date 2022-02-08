import { URL } from "url";
import path from "path";
import { app } from "electron";


/**
 * 获取入口文件的URL路径
 * @returns
 */
export function getEntryUrl(): string {
  const devServerUrl: string | undefined = import.meta.env
    .VITE_DEV_SERVER_URL as string;

  // 开发环境返回http地址的url
  if (import.meta.env.DEV && devServerUrl !== undefined) {
    return devServerUrl;
  } 

  // 正式环境返回文件路径
  const url =  new URL('../renderer/dist/index.html', 'file://' + __dirname);
  return url.toString();
}

/**
 * 获取资源路径
 * @param paths
 * @returns
 */
export function getAssetPath(...paths: string[]) {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, "resources")
    : path.join(__dirname, "../../resources");

  return path.join(RESOURCES_PATH, ...paths);
}

