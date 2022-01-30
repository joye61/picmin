const { contextBridge, ipcRenderer } = require('electron');
const { path } = require('path');
const constPath = path.resolve('./const');
const { IPCChannel, ExposeName } = require(constPath);

contextBridge.exposeInMainWorld('TxxCompressApp', {
  closeApp() {
    ipcRenderer.send(IPCChannel.QuitApp);
  },
  minimize() {
    ipcRenderer.send(IPCChannel.minimizeApp);
  },
});
