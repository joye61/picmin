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
