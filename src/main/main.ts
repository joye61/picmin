import path from 'path';

import { app, BrowserWindow, shell } from 'electron';
import { getEntryUrl, isDev, getAssetPath } from './util';
import { IPC } from './ipc';
import { createMenu } from './menu';

// 当前主窗口的引用
let mainWindow: BrowserWindow | null = null;

/**
 * 创建一个应用程序窗口
 */
async function createWindow() {
  // 创建一个窗口实例
  mainWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    icon: getAssetPath('icon.png'),
    // 窗口不可缩放
    resizable: false,
    // 无边框
    frame: false,
    maximizable: false,
    roundedCorners: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      // 只有开发环境允许使用devtools
      devTools: isDev(),
      // 窗口预加载的资源文件
      preload: path.join(__dirname, './preload.js'),
    },
  });
  // 伴随着window而创建的ipc通信逻辑
  const ipc = new IPC(mainWindow);
  ipc.bind();

  // 窗口准备好了，显示窗口
  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  // 窗口被关闭，清理资源
  mainWindow.on('closed', () => {
    mainWindow = null;
    ipc.unbind();
  });

  // 加载窗口入口文件
  await mainWindow.loadURL(getEntryUrl());

  // 在本地浏览器窗口中打开链接请求
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });
}

/**
 * 启动应用程序
 */
(async () => {
  createMenu();
  // 当所有窗口都关闭时，退出app
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // 等待app就绪
  await app.whenReady();
  createWindow();

  // 应用被激活时触发
  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
})();
