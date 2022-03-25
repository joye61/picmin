import path from "path";
import { CacheDirName } from "./const";
import fs from "fs-extra";
import { UID } from "./utils";
import { app } from "electron";

/**
 * 获取临时路径
 * @returns
 */
export function getCachePath() {
  return path.resolve(app.getPath("temp"), CacheDirName);
}

/**
 * 重置临时路径和文件
 */
export function resetCache() {
  const tempPath = getCachePath();
  fs.emptyDirSync(tempPath);
  UID.reset();
}
