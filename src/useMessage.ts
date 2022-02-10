import { ipcRenderer } from "electron";
import { useEffect } from "react";
import { IPCEvents } from "./const";
import { readImagesFromPathList } from "./image";
import { type RowType, state } from "./state";

type DataType = {
  // 主进程返回的图片列表
  list: ImageItem[];
  // 是否读取列表结束
  readListOver?: true;
  // 更新类型：add添加，update更新
  type: "add" | "update";
  // 用于索引
  keyMap?: Map<string, number>;
};

let keyMap: null | Map<string, number> = null;

/**
 * 根据ImageItem创建列表的行数据
 * @param item
 * @returns
 */
function createRowByImageItem(item: ImageItem): RowType {
  return {
    key: item.path,
    ...item,
  };
}

/**
 * 这个hooks用来响应主进程的信号
 */
export function useMessage() {
  useEffect(() => {
    // 获取选取结果
    ipcRenderer.on(IPCEvents.PickResult, (_, list: Array<string>) => {
      state.isReadList = true;
      // 根据列表读取图片文件
      readImagesFromPathList(list);
    });

    // // 清空完成事件
    // window.PicMinMessage.onEmptyOver(() => {
    //   state.list = [];
    // });

    // // 列表状态更新事件
    // window.PicMinMessage.onStatusUpdate((data: DataType) => {
    //   // 初始化读取列表完成
    //   if (data.readListOver === true) {
    //     state.isReadList = false;
    //   }

    //   // 全量更新，替换整个列表
    //   if (data.type === "add") {
    //     keyMap = data.keyMap!;
    //     data.list.forEach((item) => {
    //       state.list.push(createRowByImageItem(item));
    //     });
    //   }

    //   // 增量更新，只更新对应的行
    //   else if (data.type === "update") {
    //     data.list.forEach((item) => {
    //       const index = keyMap!.get(item.path)!;
    //       state.list[index] = createRowByImageItem(item);
    //     });
    //   }
    // });
    // return window.PicMinMessage.unListenAll;

    return () => {
      (ipcRenderer.removeAllListeners as any)();
    };
  }, []);
}
