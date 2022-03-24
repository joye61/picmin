import fileSize from "filesize";
import { existSets } from "./state";

const { ipcRenderer } = require("electron");
const fs = require("fs-extra");

/**
 * 获取一个格式化之后的大小
 * @param num
 */
export function fsize(num: number, array = false): string | [number, string] {
  const result = fileSize(num, { base: 2, output: "array", standard: "jedec" });
  if (array) {
    return result;
  } else {
    return result[0] + result[1];
  }
}

/**
 * 处理文件拖拽进入事件
 * @param event
 */
export async function handleFilesDrop(event: React.DragEvent<HTMLDivElement>) {
  let files: string[] = [];
  // Electron环境可以确保dataTransform存在
  for (let i = 0; i < event.dataTransfer!.items.length; i++) {
    if (event.dataTransfer!.items[i].kind === "file") {
      const file = event.dataTransfer!.items[i].getAsFile()!;
      files.push(file.path);
    }
  }
  // 读取图片
  ipcRenderer.send("ReadImages", files, existSets);
}