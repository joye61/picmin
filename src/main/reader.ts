import { AllowTypes, IPCEvents, TempDirName } from "@/utils/const";
import fs from "fs-extra";
import path from "path";
import readdirp from "readdirp";
import sizeOf from "probe-image-size";
import { UID } from "./uid";
import { IpcMainEvent } from "electron";
import { getTempDir } from "./resolve";

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
  let item: ImageItem = {
    // 新添加的图片默认都是等待压缩中
    status: 1,
    // 文件路径
    path: filePath,
    extension,
    upperExtension,
    cantCompress: false,
  };

  // 获取文件的名字
  item.nameWithoutExt = path.basename(filePath, "." + extension);
  item.name = item.nameWithoutExt + "." + extension;
  const stat = fs.lstatSync(item.path);
  item.oldSize = stat.size;

  // 读取图片文件的尺寸信息
  const { width, height } = await sizeOf(fs.createReadStream(item.path));
  item.oldWidth = width;
  item.oldHeight = height;

  // 获取目标将要生成的临时文件路径
  const outputDir = path.join(getTempDir(), TempDirName);

  // 临时文件名字：名字.id.后缀
  const tempId = UID.temp;
  item.tempId = tempId;
  if (["JPG", "JPEG"].includes(upperExtension)) {
    // squoosh生成的临时文件后缀都是jpg
    item.tempPath = path.join(
      outputDir,
      `${item.nameWithoutExt}.${tempId}.jpg`
    );
  } else {
    item.tempPath = path.join(
      outputDir,
      `${item.nameWithoutExt}.${tempId}.${extension.toLowerCase()}`
    );
  }

  return item;
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
  const list: WaitingImageItem[] = [];

  const fileList: string[] = [];

  // 通过文件图片添加图片对象，如果图片不合法，则不会添加
  const addItemByPath = async (imagePath: string, current: number) => {
    const imageItem = await createWaitingImageItem(imagePath, existList);
    event.reply(IPCEvents.ReadImageItem, {
      readOver: false,
      imageItem,
      total: fileList.length,
      current,
    });
  };

  // 遍历文件夹
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
  for (let i = 0; i < fileList.length; i++) {
    await addItemByPath(fileList[i], i + 1);
  }

  // 读取文件列表结束
  event.reply(IPCEvents.ReadImageItem, {
    readOver: true,
    imageItem: null,
    total: fileList.length,
    current: fileList.length,
  });

  return list;
}
