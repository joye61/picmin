/// <reference path="../types.d.ts" />

import { AllowTypes, CacheDirName } from "./const";
import fs from "fs-extra";
import path from "path";
import readdirp from "readdirp";
import sizeOf from "probe-image-size";
import { UID } from "./utils";
import { IpcMainEvent } from "electron";
import { getCachePath } from "./temp";

/**
 * 根据路径等待中创建图片对象
 * @param filePath
 * @returns
 */
export async function createWaitingImageItem(
  filePath: string,
  existList: Set<string>
): Promise<ImageItem | null> {
  // 如果文件后缀不在许可列表中，直接返回
  if (existList.has(filePath)) return null;

  // 检查是否支持，出于性能考虑，直接检查扩展名，不检查实际mime类型
  const extension = path.extname(filePath).replace(/^\./, "");
  const upperExtension = extension.toUpperCase();

  // 获取所有的文件类型
  const types = Object.keys(AllowTypes);
  // 如果文件后缀不在许可列表中，直接返回
  if (!types.includes(upperExtension)) return null;

  // 创建图片对象
  let item: Partial<ImageItem> = {
    // 新添加的图片默认都是等待压缩中
    status: 0,
    // 文件路径
    path: filePath,
    // 文件类型
    type: AllowTypes[upperExtension as keyof typeof AllowTypes],
    // 文件后缀
    extension,
    // 文件后缀大写
    upperExtension,
    // 默认压缩成功
    fail: false
  };

  // 获取文件的名字
  item.nameWithoutExt = path.basename(filePath, "." + extension);
  item.name = item.nameWithoutExt + "." + extension;
  const stat = fs.lstatSync(item.path!);
  item.oldSize = stat.size;

  // 读取图片文件的尺寸信息
  const { width, height } = await sizeOf(fs.createReadStream(item.path!));
  item.oldWidth = width;
  item.oldHeight = height;

  // 获取目标将要生成的临时文件路径
  const outputDir = getCachePath();

  // 临时文件名字：名字.id.后缀
  const tempId = UID.value;
  item.tempId = tempId;
  item.tempPath = path.join(
    outputDir,
    `${item.nameWithoutExt}.${tempId}.${extension.toLowerCase()}`
  );
  return item as ImageItem;
}

/**
 * 从文件列表中创建图片列表
 * @param pathList
 */
export async function readImageListFromFiles(
  event: IpcMainEvent,
  pathList: string[],
  existList: Set<string>
) {
  // 遍历文件夹
  const fileList: string[] = [];
  for (let item of pathList) {
    const stat = fs.lstatSync(item);
    const isDir = stat.isDirectory();
    // 如果是目录，则遍历读取目录的所有图片
    if (isDir) {
      for await (const entry of readdirp(item, { depth: Infinity })) {
        fileList.push(entry.fullPath);
      }
      continue;
    }
    // 如果是文件，直接生成图片对象
    fileList.push(item);
  }

  // 添加图片列表
  const list: ImageItem[] = [];
  for (let file of fileList) {
    const imageItem = await createWaitingImageItem(file, existList);
    if (imageItem) {
      list.push(imageItem);
    }
  }

  // 收到图片列表
  event.reply("ReceiveImages", list);
  event.reply("EndRead");
}
