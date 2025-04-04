const { contextBridge, ipcRenderer } = require('electron');

// Exponer métodos seguros a la UI
contextBridge.exposeInMainWorld('viewModelAPI', {
  getCentrosMedicos: () => ipcRenderer.invoke('getCentrosMedicos'),
  getCentrosMedicosWithPagination: (paginationData) => ipcRenderer.invoke('getCentrosMedicosWithPagination', paginationData),
  createCentroMedico: (centroMedico) => ipcRenderer.invoke('createCentroMedico', centroMedico),
  getCentrosMedicosByFilters: (filters, paginationData) => ipcRenderer.invoke('getCentrosMedicosByFilters', filters, paginationData),
  openNuevoCentroMedicoModal: () => ipcRenderer.send('open-newCentroMedicoModal'),
  hideNuevoCentroMedicoModal: () => ipcRenderer.send('hide-newCentroMedicoModal'),
  clearForm: (callback) => ipcRenderer.on('clear-form', callback), // Escuchar el evento 'clear-form'
  sendNuevoCentroMedico: (centroMedico) => ipcRenderer.send('nuevo-centro-medico', centroMedico), // Enviar datos del nuevo centro médico
  onNuevoCentroMedico: (callback) => ipcRenderer.on('nuevo-centro-medico-added', callback) // Escuchar evento para actualizar la grilla
});
