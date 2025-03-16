const { contextBridge, ipcRenderer } = require('electron');

// Exponer métodos seguros a la UI
contextBridge.exposeInMainWorld('electron', {
  getCentrosMedicos: () => ipcRenderer.invoke('getCentrosMedicos')
});
