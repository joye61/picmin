const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('TxxCompressApp', {
  closeApp() {
    ipcRenderer.send('quitApp');
  },
  minimizeApp() {
    ipcRenderer.send('minimizeApp');
  },
});
