const { contextBridge, ipcRenderer } = require('electron');

// Exponer métodos seguros a la UI
contextBridge.exposeInMainWorld('viewModelAPI', {
  getCentrosMedicos: () => ipcRenderer.invoke('getCentrosMedicos'),
  getCentrosMedicosWithPagination: (paginationData) => ipcRenderer.invoke('getCentrosMedicosWithPagination', paginationData),
  createCentroMedico: (centroMedico) => ipcRenderer.invoke('createCentroMedico', centroMedico),
  getCentrosMedicosByFilters: (filters) => ipcRenderer.invoke('getCentrosMedicosByFilters', filters)
});
