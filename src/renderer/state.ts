import { observable } from "mobx";
import { Key } from "react";
import { EngineMap } from "../compress/define";

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
  showSetEngin: boolean;

  // 批量压缩配置选项
  scaleMode: "percent" | "width" | "height";
  scalePercent: number;
  scaleWidth?: number;
  scaleHeight?: number;
  qualityPercent: number;

  // 压缩引擎配置
  jpegEngine: EngineMap["jpeg"];
  pngEngine: EngineMap["png"];
  webpEngine: EngineMap["webp"];
  svgEngine: EngineMap["svg"];
  apngEngine: EngineMap["apng"];
  avifEngine: EngineMap["avif"];
  gifEngine: EngineMap["gif"];

  dragActive: boolean;
  
  // 是否正在读取列表，用来显示loading状态
  isReadList: boolean;
  readTotal: number;
  readCurrent: number;
};

export type SaveMenuItem = {
  value: SaveType;
  name: string;
};

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
  qualityPercent: 75,
  jpegEngine: "canvas",
  pngEngine: "upng",
  webpEngine: "canvas",
  svgEngine: "svgo",
  gifEngine: "gifsicle",
  apngEngine: "upng",
  avifEngine: "avif",
  dragActive: false,
  isReadList: false,
  readTotal: 0,
  readCurrent: 0,
  showSetEngin: false,
  list: [],
});

export interface __GVars {
  // app目录
  appPath: string;
  // 系统临时目录
  tempPath: string;
}

/**
 * 全局变量存储
 */
export const __g = {
  appPath: "",
  tempPath: "",
};
