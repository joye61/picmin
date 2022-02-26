import { AllowTypes, TempDir } from "./const";
import fs from "fs";
import path from "path";
import readdirp from "readdirp";
import sizeOf from "probe-image-size";
import { indexes, state, __g } from "./state";
import { spawn } from "child_process";
import { getNodeModulesPath, getTempDir } from "./util";

/**
 * 获取应用程序支持的所有后缀
 * @returns
 */
export function getSupportExtensionsAsString() {
  return Object.keys(AllowTypes).join("/");
}

/**
 * 清空图片列表
 * @param event
 */
export async function emptyImageList() {
  state.list = [];
  indexes.clear();
  // 同时清理临时文件夹
  fs.rmSync(getTempDir(), {
    force: true,
    recursive: true,
  });
  // 恢复tid计数器到0
  __g.tid = 0;
}

/**
 * 根据提供的路径列表返回所有的图片文件
 * @param event
 * @param pathList
 * @returns
 */
export async function readImagesFromPathList(pathList: string[]) {
  const list: ImageItem[] = [];
  // 如果不是目录，则判断是否是合法的图片文件
  const types = Object.keys(AllowTypes);

  /**
   * 验证图片合法性，合法条件
   * 1、必须为列表中不存在的图片
   * 2、必须为支持的图片类型
   * @param image
   */
  const ensureImageLegal = async (imagePath: string): Promise<void> => {
    // 图片已存在，直接退出
    if (indexes.has(imagePath)) return;
    // 检查是否支持，出于性能考虑，直接检查扩展名，不检查实际mime类型
    const extension = path.extname(imagePath).replace(/^\./, "");
    const upperExtension = extension.toUpperCase();
    if (types.includes(upperExtension)) {
      let item: ImageItem = {
        // 新添加的图片默认都是等待压缩中
        status: 1,
        path: imagePath,
        extension,
        upperExtension
      };
      // 获取文件的名字
      item.nameWithoutExt = path.basename(imagePath, "." + extension);
      item.name = item.nameWithoutExt + "." + extension;
      const stat = fs.lstatSync(item.path);
      item.oldSize = stat.size;
      // 读取图片文件的尺寸信息
      const { width, height } = await sizeOf(fs.createReadStream(item.path));
      item.oldWidth = width;
      item.oldHeight = height;

      // 获取目标将要生成的临时文件路径
      const outputDir = path.join(__g.tempPath, TempDir);
      const tempId = __g.tid++;
      item.tempId = tempId;
      if (["JPG", "JPEG"].includes(upperExtension)) {
        item.tempPath = path.join(
          outputDir,
          `${item.nameWithoutExt}.${item.tempId}.jpg`
        );
      } else {
        item.tempPath = path.join(
          outputDir,
          `${item.nameWithoutExt}.${extension.toLowerCase()}`
        );
      }

      list.push(item);

      // 这里同时将数据添加到imageList中并更新imageKeyMap
      state.list.push({ key: item.path, ...item });
      indexes.set(item.path, state.list.length);
    }
  };

  // 遍历文件夹
  for (let item of pathList) {
    // const imagePath = item.path;
    const stat = fs.lstatSync(item);
    const isDir = stat.isDirectory();
    // 如果是目录，则遍历读取目录的所有文件信息
    if (isDir) {
      for await (const entry of readdirp(item, { depth: Infinity })) {
        await ensureImageLegal(entry.fullPath);
      }
      continue;
    }
    // 如果是文件，直接验证文件
    await ensureImageLegal(item);
  }

  // 更新状态，图片列表读取完成
  state.isReadList = false;

  // 开始压缩图片
}
