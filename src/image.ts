import { AllowTypes, TempDir } from "./const";
import fs from "fs";
import path from "path";
import readdirp from "readdirp";
import sizeOf from "probe-image-size";
import { indexes, state, __g } from "./state";
import { getTempDir } from "./util";
import { type EngineMap } from "./compress/define";
import { compressImage } from "./compress/function";

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
  const tempDir = getTempDir();
  fs.rmSync(tempDir, {
    force: true,
    recursive: true,
  });
  // 恢复tid计数器到0
  __g.tid = 0;
}

/**
 * 根据路径等待中创建图片对象
 * @param filePath
 * @returns
 */
export async function createWaitingImageItem(
  filePath: string
): Promise<ImageItem | null> {
  // 图片已存在，直接退出
  if (indexes.has(filePath)) return null;

  // 获取所有的文件类型
  const types = Object.keys(AllowTypes);

  // 检查是否支持，出于性能考虑，直接检查扩展名，不检查实际mime类型
  const extension = path.extname(filePath).replace(/^\./, "");
  const upperExtension = extension.toUpperCase();

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
  const outputDir = path.join(__g.tempPath, TempDir);
  const tempId = __g.tid++;
  item.tempId = tempId;

  // 临时文件名字：名字.id.后缀
  if (["JPG", "JPEG"].includes(upperExtension)) {
    // squoosh生成的临时文件后缀都是jpg
    item.tempPath = path.join(
      outputDir,
      `${item.nameWithoutExt}.${item.tempId}.jpg`
    );
  } else {
    item.tempPath = path.join(
      outputDir,
      `${item.nameWithoutExt}.${item.tempId}.${extension.toLowerCase()}`
    );
  }

  return item;
}

/**
 * 根据提供的路径列表返回所有的图片文件
 * @param event
 * @param pathList
 * @returns
 */
export async function addImagesFromPathList(pathList: string[]) {
  const list: WaitingImageItem[] = [];

  // 通过文件图片添加图片对象，如果图片不合法，则不会添加
  const addItemByPath = async (imagePath: string) => {
    const imageItem = (await createWaitingImageItem(
      imagePath
    )) as WaitingImageItem;
    if (imageItem) {
      list.push(imageItem);
    }
    state.list.push({ key: imagePath, ...(<ImageItem>imageItem) });
    indexes.set(imagePath, state.list.length - 1);
  };

  // 遍历文件夹
  for (let item of pathList) {
    const stat = fs.lstatSync(item);
    const isDir = stat.isDirectory();
    // 如果是目录，则遍历读取目录的所有图片
    if (isDir) {
      for await (const entry of readdirp(item, { depth: Infinity })) {
        await addItemByPath(entry.fullPath);
      }
    }
    // 如果是文件，直接生成图片对象
    else {
      await addItemByPath(item);
    }
  }

  // 更新状态，图片列表读取完成
  state.isReadList = false;
  // 开始压缩图片
  await compressImageList(list);
}

/**
 * 压缩一批图片，逐张压缩
 * @param list
 */
export async function compressImageList(list: WaitingImageItem[]) {
  const enginMap: EngineMap = {
    apng: state.apngEngine,
    avif: state.avifEngine,
    gif: state.gifEngine,
    jpeg: state.jpegEngine,
    png: state.pngEngine,
    svg: state.svgEngine,
    webp: state.webpEngine,
  };

  const scale: ScaleOption = {
    mode: state.scaleMode,
    percent: state.scalePercent && Number(state.scalePercent),
    width: state.scaleWidth && Number(state.scaleWidth),
    height: state.scaleHeight && Number(state.scaleHeight),
  };
  const option: CompressConfig = {
    quality: state.qualityPercent,
    scale,
  };

  // 逐张压缩图片
  for (let item of list) {
    await compressImage(item, option, enginMap);
    // 压缩完成，更新UI
    const index = indexes.get(item.path);
    if (typeof index === "number") {
      state.list[index] = { key: item.path, ...item, status: 0 };
    }
  }
}
