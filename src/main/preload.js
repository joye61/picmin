const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("TxxCompressApp", {
  // 关闭app
  closeApp() {
    ipcRenderer.send("quitApp");
  },
  // 最小化app
  minimizeApp() {
    ipcRenderer.send("minimizeApp");
  },
  // 向图片列表中添加图片
  addImageList(imageList) {
    ipcRenderer.send("addImageList", imageList);
  },
  // 清空图片列表
  clearImageList(){
    ipcRenderer.send("clearImageList")
  }
});

// npx @squoosh/cli --oxipng '{"level":2,"interlace":false}'
