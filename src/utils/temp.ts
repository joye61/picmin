import os from "os";
import path from "path";
import { TempDirName } from "./const";
import fs from "fs-extra";
import { UID } from "./uid";

/**
 * 获取临时路径
 * @returns
 */
export function getTempPath() {
  return path.resolve(os.tmpdir(), TempDirName);
}

/**
 * 重置临时路径和文件
 */
export function resetTemp() {
  const tempPath = getTempPath();
  fs.rmSync(tempPath, {
    force: true,
    recursive: true,
  });
  fs.ensureDirSync(tempPath);
  UID.reset();
}
