import { state, __g } from "./state";
import fileSize from "filesize";
import { ipcRenderer } from "electron";
import { IPCEvents, TempDir } from "../utils/const";
import { isWin } from "../utils/is";
import path from "path";

/**
 * 是否有文件正在处理中
 */
export function hasImageInProcessing() {
  return state.list.some((item) => item.status !== 0);
}

/**
 * 清除按钮是否禁用
 */
export function isClearDisabled() {
  if (state.list.length === 0 || state.isReadList || hasImageInProcessing()) {
    return true;
  }
  return false;
}

/**
 * 保存按钮是否禁用
 */
export function isSaveDisabled() {
  if (state.list.length === 0 || state.isReadList || hasImageInProcessing()) {
    return true;
  }
  return false;
}
/**
 * 添加按钮是否禁用
 */
export function isAddDisabled() {
  if (state.isReadList || hasImageInProcessing()) {
    return true;
  }
  return false;
}

/**
 * 配置项是否禁用
 * @returns
 */
export function isConfigDisabled() {
  if (state.isReadList || hasImageInProcessing()) {
    return true;
  }
  return false;
}

/**
 * 重新压缩按钮是否禁用
 */
export function isRedoDisabled() {
  if (state.list.length === 0 || state.isReadList || hasImageInProcessing()) {
    return true;
  }
  return false;
}

/**
 * 获取一个格式化之后的大小
 * @param num
 */
export function fsize(num: number, array = false): string | [number, string] {
  const result = fileSize(num, { base: 2, output: "array", standard: "jedec" });
  if (array) {
    return result;
  } else {
    return result[0] + result[1];
  }
}

/**
 * 获取系统路径
 * @param pathname
 * @returns
 */
export async function getSysPath(pathname = "temp") {
  ipcRenderer.send(IPCEvents.GetSysPath, pathname);
  return new Promise<string>((resolve) => {
    ipcRenderer.once(IPCEvents.GetSysPathResult, (_, result: string) => {
      resolve(result);
    });
  });
}

/**
 * 获取二进制文件的路径
 * @param binName
 */
export function getBinPath(binName: string) {
  let name = binName;
  if (isWin()) {
    name += ".exe";
  }
  let binPart = `./bin/${process.platform}/${name}`;
  if (process.env.NODE_ENV === "production") {
    return path.resolve(process.resourcesPath, binPart);
  }
  return path.resolve(__g.appPath, `./assets/`, binPart);
}

/**
 * 获取一个node_modules模块的具体路径
 * @param moduleName
 */
export function getNodeModulesPath(moduleName?: string) {
  let nodeModulesPath: string = path.resolve(__g.appPath, "./node_modules/");
  return moduleName ? path.join(nodeModulesPath, moduleName) : nodeModulesPath;
}

/**
 * 获取临时目录
 */
export function getTempDir() {
  return path.join(__g.tempPath, TempDir);
}

/**
 * 将已展示的图片路径返回
 * @returns 
 */
export function getExistsSets() {
  const esets = new Set<string>();
  state.list.forEach((item) => {
    esets.add(item.path);
  });
  return esets;
}
