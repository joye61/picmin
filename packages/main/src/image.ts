import { IpcMainEvent } from "electron";
import fs from "fs";
import path from "path";
import readdirp from "readdirp";
import { AllowTypes, IPCEvents } from "@c/const";
import { ImagePool } from "@squoosh/lib";
import { cpus } from "os";
import sizeOf from "image-size";
// import fs from 'fs/promises';

// 创建处理池子
// const imagePool = new ImagePool(cpus().length);

// 用来临时缓存所有的图片列表
const imageList: Array<ImageItem> = [];
// 用来缓存图片的索引，键是路径，值是imageList索引
const imageKeyMap: Map<string, number> = new Map();

/**
 * 清空图片列表
 * @param event
 */
export async function emptyImageList() {
  imageList.splice(0);
  imageKeyMap.clear();
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
  const list: ImageItem[] = [];
  // 如果不是目录，则判断是否是合法的图片文件
  const types = Object.keys(AllowTypes);

  /**
   * 验证图片合法性，合法条件
   * 1、必须为列表中不存在的图片
   * 2、必须为支持的图片类型
   * @param image
   */
  const ensureImageLegal = (image: ImageItem): void => {
    // 图片已存在，直接退出
    if (imageKeyMap.has(image.path)) return;
    // 检查是否支持，出于性能考虑，直接检查扩展名，不检查实际mime类型
    const extension = path.extname(image.path).replace(/^\./, "");
    if (types.includes(extension.toUpperCase())) {
      let item: ImageItem = {
        status: 1,
        path: image.path,
        name: image.name,
        extension,
      };
      // 获取文件的名字
      item.nameWithoutExt = path.basename(image.path, "." + extension);
      item.name = item.nameWithoutExt + "." + extension;
      const stat = fs.lstatSync(item.path);
      item.oldSize = stat.size;
      // 读取图片文件的尺寸信息
      // 由于image-size不支持avif格式，avif尺寸在解码的时候读取
      if (extension !== "AVIF") {
        const { width, height } = sizeOf(item.path);
        item.oldWidth = width;
        item.oldHeight = height;
      }
      list.push(item);

      // 这里同时将数据添加到imageList中并更新imageKeyMap
      imageList.push(item);
      imageKeyMap.set(item.path, imageList.length);
    }
  };

  // 遍历文件夹
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

  // 到这里位置，响应客户端第一个状态
  // 读取图片列表完成，且获取了图片的初始宽高，尺寸等信息
  // 添加的初始化过程执行的是一次全量更新
  event.reply(IPCEvents.StatusUpdate, {
    list: imageList,
    readListOver: true,
    type: "add",
    keyMap: imageKeyMap,
  });

  return list;
}

// 缩放选项
export interface ScaleOption {
  mode: "percent" | "width" | "height";
  percent?: number;
  width?: number;
  height?: number;
}

// 压缩选项
export interface CompressConfig {
  scale?: ScaleOption;
  quality?: number;
}

/**
 * 压缩单张图片
 * @param image 图片
 * @param option 压缩选项
 */
export async function compressImage(image: ImageItem, option?: CompressConfig) {
  // 选项默认值
  let config: Required<CompressConfig> = {
    scale: {
      mode: "percent",
      percent: 100,
    },
    quality: 75,
  };
  if (typeof option === "object") {
    config = { ...config, ...option };
  }


}
