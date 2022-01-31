import { observable } from 'mobx';

export type SaveType = 'cover' | 'alias' | 'bundle';

export type State = {
  saveType: SaveType;
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
});
