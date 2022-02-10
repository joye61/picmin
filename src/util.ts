import { state } from "./state";
import fileSize from "filesize";

/**
 * 是否有文件正在处理中
 */
export function hasImageInProcessing() {
  return state.list.some((item) => item.status === 1);
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
 * 获取一个格式化之后的大小
 * @param num
 */
export function fsize(num: number, array = false): string | [number, string] {
  const result = fileSize(num, {base: 2, output: "array", standard: "jedec" });
  if (array) {
    return result;
  } else {
    return result[0] + result[1];
  }
}
