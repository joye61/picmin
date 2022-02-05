import { observable } from 'mobx';
import { Key } from 'react';

export interface RowType {
  key: Key;
  status: 0 | 1; // 0,正在压缩，1压缩完成
  name: React.ReactNode;
  oldSize: React.ReactNode;
  newSize: React.ReactNode;
  rate: React.ReactNode;
  action?: React.ReactNode;
}

export type SaveType = 'cover' | 'alias' | 'bundle';

export type State = {
  saveType: SaveType;
  list: RowType[];
  showSetting: boolean;
  scaleMode: 'percent' | 'width' | 'height';
  scalePercent?: number;
  scaleWidth?: number;
  scaleHeight?: number;
  qualityPercent: number;
  dragActive: boolean;
};

export type SaveMenuItem = {
  value: SaveType;
  name: string;
};

export const saveMenus: SaveMenuItem[] = [
  { name: '覆盖保存', value: 'cover' },
  { name: '别名保存', value: 'alias' },
  { name: '打包另存', value: 'bundle' },
];

export const state = observable.object<State>({
  saveType: 'cover',
  showSetting: false,
  scaleMode: 'percent',
  scalePercent: 100,
  scaleWidth: undefined,
  scaleHeight: undefined,
  qualityPercent: 70,
  dragActive: false,
  list: [
    {
      key: 1,
      status: 1,
      name: 'a.png',
      oldSize: 1234,
      newSize: 234,
      rate: '75%',
    },
    {
      key: 2,
      status: 1,
      name: 'a.png',
      oldSize: 1234,
      newSize: 234,
      rate: '75%',
    },
    {
      key: 3,
      status: 0,
      name: 'a.png',
      oldSize: 1234,
      newSize: 234,
      rate: '75%',
    },
    {
      key: 4,
      status: 0,
      name: 'a.png',
      oldSize: 1234,
      newSize: 234,
      rate: '75%',
    },
  ],
});
