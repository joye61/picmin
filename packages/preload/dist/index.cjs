"use strict";
var electron = require("electron");
var AllowTypes;
(function(AllowTypes2) {
  AllowTypes2["JPG"] = "image/jpeg";
  AllowTypes2["JPEG"] = "image/jpeg";
  AllowTypes2["PNG"] = "image/png";
  AllowTypes2["APNG"] = "image/apng";
  AllowTypes2["WEBP"] = "image/webp";
  AllowTypes2["GIF"] = "image/gif";
  AllowTypes2["AVIF"] = "image/avif";
  AllowTypes2["SVG"] = "image/svg+xml";
})(AllowTypes || (AllowTypes = {}));
var IPCEvents;
(function(IPCEvents2) {
  IPCEvents2["QuitApp"] = "QuitApp";
  IPCEvents2["MiniApp"] = "MiniApp";
  IPCEvents2["AddImages"] = "AddImages";
  IPCEvents2["EmptyImages"] = "EmptyImages";
})(IPCEvents || (IPCEvents = {}));
electron.contextBridge.exposeInMainWorld("PicMin", {
  closeApp() {
    electron.ipcRenderer.send(IPCEvents.QuitApp);
  },
  miniApp() {
    electron.ipcRenderer.send(IPCEvents.MiniApp);
  },
  addImages(imageList) {
    electron.ipcRenderer.send(IPCEvents.AddImages, imageList);
  },
  emptyImages() {
    electron.ipcRenderer.send(IPCEvents.EmptyImages);
  }
});
//# sourceMappingURL=index.cjs.map
