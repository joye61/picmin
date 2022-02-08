import { IpcMainEvent } from "electron";
import fs from "fs";
import path from "path";
import readdirp from "readdirp";
import { AllowTypes, type ImageItem } from "@common/const";

/**
 * 用来临时缓存所有的图片列表
 */
export const ImageList: Array<ImageItem> = [];

/**
 * 清空图片列表
 * @param event 
 */
export async function emptyImageList(event: IpcMainEvent){
  ImageList.splice(0);
  // 发送成功通知 TODO
}

/**
 * 根据提供的路径列表返回所有的图片文件
 * @param event 
 * @param pathList 
 * @returns 
 */
export async function addImagesFromList(
  event: IpcMainEvent,
  pathList: ImageItem[]
) {
  const output: ImageItem[] = [];
  // 如果不是目录，则判断是否是合法的图片文件
  const types = Object.keys(AllowTypes);

  // 验证文件的合法性，如果是图片，添加到输出中
  const ensureImageLegal = (image: ImageItem): void => {
    const extension = path.extname(image.path).toUpperCase().replace(/^\./, "");
    if (types.includes(extension)) {
      let item: ImageItem = {
        status: image.status,
        path: image.path,
        name: image.name,
      };
      if (!item.name) {
        item.name = path.basename(image.path);
      }
      const stat = fs.lstatSync(item.path);
      item.oldSize = stat.size;
      output.push(item);
    }
  };

  for (let item of pathList) {
    const imagePath = item.path;
    const isDir = fs.lstatSync(imagePath).isDirectory();
    // 如果是目录，则遍历读取目录的所有文件信息
    if (isDir) {
      for await (const entry of readdirp(imagePath, { depth: Infinity })) {
        ensureImageLegal({
          status: item.status,
          name: entry.basename,
          path: entry.fullPath,
        });
      }
      continue;
    }
    // 如果是文件，直接验证文件
    ensureImageLegal(item);
  }

  return output;
}
