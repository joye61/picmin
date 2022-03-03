/**
 * 全局变量存储
 */
export const __g = {
  appPath: "",
  tempPath: "",
  nodeModulesPath: "",
  binPath: "",
};

// 全局worker对象
export const gworker = new Worker(new URL("./worker.ts", import.meta.url));
