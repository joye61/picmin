import { observable, autorun } from "mobx";

export type SaveType = "cover" | "alias" | "bundle";
export type ModeType = "percent" | "width" | "height";

export type State = {
  saveType: SaveType;
  list: ImageItem[];
  showSetting: boolean;
  showSetEngin: boolean;

  // 批量压缩配置选项
  mode: ModeType;
  percent: number;
  width?: number;
  height?: number;
  quality: number;

  dragActive: boolean;

  // 是否正在读取列表，用来显示loading状态
  isReadList: boolean;
  readTotal: number;
  readCurrent: number;

  // 统计用的临时值
  sum: SumType;

  // 保存时的别名
  alias: string;
  // 正在保存中
  isSaving: boolean;
  // 打包存储的文件名
  bundleName: string;
};

export type SumType = {
  // 已完成压缩的数量
  cnum: number;
  // 压缩前总体积
  oldTotalSize: number;
  // 压缩后总体积
  newTotalSize: number;
};

// 保存选项
export type SaveMenuItem = {
  value: string;
  key: SaveType;
};
export const saveMenus: SaveMenuItem[] = [
  { value: "覆盖保存", key: "cover" },
  { value: "别名保存", key: "alias" },
  { value: "打包另存", key: "bundle" },
];

// 缩放选项
export type ScaleMenuItem = {
  value: string;
  key: ModeType;
};
export const scaleMenus: ScaleMenuItem[] = [
  { value: "缩放到比例", key: "percent" },
  { value: "缩放到宽度", key: "width" },
  { value: "缩放到高度", key: "height" },
];

export const state = observable<State>({
  saveType: "alias",
  showSetting: false,
  mode: "percent",
  percent: 100,
  width: undefined,
  height: undefined,
  quality: 70,
  dragActive: false,
  isReadList: false,
  readTotal: 0,
  readCurrent: 0,
  showSetEngin: false,
  list: [],
  sum: {
    cnum: 0,
    oldTotalSize: 0,
    newTotalSize: 0,
  },
  alias: "bak",
  isSaving: false,
  bundleName: "bundle",
});

// 已经存在的图片路径映射
export const existSets: Set<string> = new Set();

autorun(() => {
  const sum: SumType = {
    cnum: 0,
    oldTotalSize: 0,
    newTotalSize: 0,
  };

  existSets.clear();

  state.list.forEach((item) => {
    sum.oldTotalSize += item.oldSize;
    if (item.status === 1) {
      sum.cnum += 1;
      sum.newTotalSize == item.newSize;
    } else {
      sum.newTotalSize += item.oldSize;
    }

    existSets.add(item.path);
  });

  state.sum = state.list.reduce((prev: typeof sum, item) => {
    let cnum = prev.cnum;
    let oldTotalSize = prev.oldTotalSize;
    let newTotalSize = prev.newTotalSize;
    const itemSize = item.oldSize!;
    oldTotalSize += itemSize;
    if (item.status === 1) {
      cnum += 1;
      newTotalSize += item.newSize!;
    } else {
      newTotalSize += itemSize;
    }
    return {
      cnum,
      oldTotalSize,
      newTotalSize,
    };
  }, sum);
});

/**
 * 获取当前的压缩选项
 * @returns 
 */
export function getCompressOption(): CompressOption {
  return {
    mode: state.mode,
    percent: state.percent,
    width: state.width,
    height: state.height,
    quality: state.quality,
  };
}
