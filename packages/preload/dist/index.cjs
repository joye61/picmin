"use strict";
var electron = require("electron");
electron.contextBridge.exposeInMainWorld("TxxCompressApp", {
  closeApp() {
    electron.ipcRenderer.send("quitApp");
  },
  minimizeApp() {
    electron.ipcRenderer.send("minimizeApp");
  },
  addImageList(imageList) {
    electron.ipcRenderer.send("addImageList", imageList);
  },
  clearImageList() {
    electron.ipcRenderer.send("clearImageList");
  }
});
//# sourceMappingURL=index.cjs.map
