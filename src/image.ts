import { AllowTypes } from "./const";
import fs from "fs/promises";
import path from "path";
import readdirp from "readdirp";
import sizeOf from "image-size";
import { indexes, state } from "./state";
import { spawn } from "child_process";
import { getNodeModulesPath, getSysPath } from "./util";
// import { getNodeModulesPath } from "./resolve";

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
    if (types.includes(extension.toUpperCase())) {
      let item: ImageItem = {
        // 初始化状态只能为正在处理中
        status: 1,
        path: imagePath,
        extension,
      };
      // 获取文件的名字
      item.nameWithoutExt = path.basename(imagePath, "." + extension);
      item.name = item.nameWithoutExt + "." + extension;
      const stat = await fs.lstat(item.path);
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
      state.list.push({ key: item.path, ...item });
      indexes.set(item.path, state.list.length);
    }
  };

  // 遍历文件夹
  for (let item of pathList) {
    // const imagePath = item.path;
    const stat = await fs.lstat(item);
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

  await callSquoosh();
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

export async function callSquoosh() {
  const entry = await getNodeModulesPath("@squoosh");
  const script = path.resolve(entry, "./cli/src/index.js");
  const squoosh = spawn(process.execPath, [script, "--help"], {
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
    },
  });
  squoosh.on("error", (event) => {
    console.log(event, "error");
  });
  squoosh.stderr.on("data", (data: Buffer) => {
    console.log("squoosh err:", data.toString("utf8"));
  });
  squoosh.stdout.on("data", (data: Buffer) => {
    console.log(`squoosh out:`, data.toString("utf8"));
  });
}
