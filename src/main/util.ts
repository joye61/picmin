/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';
import { app } from 'electron';

/**
 * 判断是否是开发环境
 * @returns
 */
export function isDev(): boolean {
  return (
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
  );
}

/**
 * 获取入口文件的URL路径
 * @returns
 */
export function getEntryUrl(): string {
  const entryFileName = 'index.html';
  if (isDev()) {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = entryFileName;
    return url.href;
  }
  return `file://` + path.resolve(__dirname, '../renderer/', entryFileName);
}

/**
 * 获取资源路径
 * @param paths 
 * @returns 
 */
export function getAssetPath(...paths: string[]) {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  return path.join(RESOURCES_PATH, ...paths);
}
