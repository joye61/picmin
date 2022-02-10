import { observable } from "mobx";
import { Key } from "react";

export interface RowType extends ImageItem {
  key: Key;
  rate?: React.ReactNode;
  action?: React.ReactNode;
}

export type SaveType = "cover" | "alias" | "bundle";

export type State = {
  saveType: SaveType;
  list: RowType[];
  showSetting: boolean;
  scaleMode: "percent" | "width" | "height";
  scalePercent?: number;
  scaleWidth?: number;
  scaleHeight?: number;
  qualityPercent: number;
  dragActive: boolean;
  // 是否正在读取列表，用来显示loading状态
  isReadList: boolean;
};

export type SaveMenuItem = {
  value: SaveType;
  name: string;
};

// 用来缓存图片的索引，键是路径，值是imageList索引
export const indexes: Map<string, number> = new Map();

export const saveMenus: SaveMenuItem[] = [
  { name: "覆盖保存", value: "cover" },
  { name: "别名保存", value: "alias" },
  { name: "打包另存", value: "bundle" },
];

export const state = observable.object<State>({
  saveType: "cover",
  showSetting: false,
  scaleMode: "percent",
  scalePercent: 100,
  scaleWidth: undefined,
  scaleHeight: undefined,
  qualityPercent: 70,
  dragActive: false,
  isReadList: false,
  list: [],
});
