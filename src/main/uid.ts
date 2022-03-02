/**
 * 用来标识图片的临时唯一值
 */
export const UID = {
  _tempIndex: 0,
  get temp(): number {
    this._tempIndex++;
    return this._tempIndex;
  },
  resetTemp() {
    this._tempIndex = 0;
  },
};
