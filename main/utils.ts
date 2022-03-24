/**
 * 用来标识图片的临时唯一值
 */
 export const UID = {
  _tempIndex: 0,
  get value(): number {
    if(this._tempIndex > 1e10) {
      this._tempIndex = 0;
    }
    this._tempIndex++;
    return this._tempIndex;
  },
  reset() {
    this._tempIndex = 0;
  },
};

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