console.log("[Preload.js] loaded");
const { contextBridge, ipcRenderer } = require('electron');
const iconv = require('iconv-lite');

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: ipcRenderer.send.bind(ipcRenderer),
        on: ipcRenderer.on.bind(ipcRenderer),
        removeListener: ipcRenderer.removeListener.bind(ipcRenderer)
    },
    iconv: iconv
});