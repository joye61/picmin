import { useEffect } from "react";
import { state } from "./state";

type DataType = {
  list: ImageItem[];
  // 是否读取列表结束
  readListOver?: true;
  keyMap?: Map<string, number>;
};

export function useMessage() {
  useEffect(() => {
    // 选取结束事件
    window.PicMinMessage.onPickOver(() => {
      state.isReadList = true;
    });
    // 清空完成事件
    window.PicMinMessage.onEmptyOver(() => {
      state.list = [];
    });
    // 列表状态更新事件
    window.PicMinMessage.onStatusUpdate((data: DataType) => {
      // 初始化读取列表完成
      if (data.readListOver === true) {
        state.isReadList = false;
      }
      state.list = data.list.map((item) => {
        return {
          key: item.path,
          ...item
        };
      });
    });
    return window.PicMinMessage.unListenAll;
  }, []);
}
