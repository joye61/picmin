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
