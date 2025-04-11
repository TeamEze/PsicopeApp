const { contextBridge, ipcRenderer } = require('electron');

// Exponer métodos seguros a la UI
contextBridge.exposeInMainWorld('viewModelAPI', {
  getCentrosMedicos: () => ipcRenderer.invoke('getCentrosMedicos'),
  getCentroMedicoById: (idCentroMedico) => ipcRenderer.invoke('getCentroMedicoById', idCentroMedico),
  getCentrosMedicosWithPagination: (paginationData) => ipcRenderer.invoke('getCentrosMedicosWithPagination', paginationData),
  createCentroMedico: (centroMedico) => ipcRenderer.invoke('createCentroMedico', centroMedico),
  updateCentroMedico: (centroMedico) => ipcRenderer.invoke('updateCentroMedico', centroMedico),
  getCentrosMedicosByFilters: (filters, paginationData) => ipcRenderer.invoke('getCentrosMedicosByFilters', filters, paginationData),
  openNuevoCentroMedicoModal: () => ipcRenderer.send('open-newCentroMedicoModal'),
  openEditCentroMedicoModal: (centroMedico) => ipcRenderer.send('open-editCentroMedicoModal', centroMedico), // Enviar datos para editar
  hideNuevoCentroMedicoModal: () => ipcRenderer.send('hide-newCentroMedicoModal'),
  clearForm: (callback) => ipcRenderer.on('clear-form', callback), // Escuchar el evento 'clear-form'
  sendNuevoCentroMedico: (centroMedico) => ipcRenderer.send('nuevo-centro-medico', centroMedico), // Enviar datos del nuevo centro médico
  sendCentroMedicoEdited: (centroMedico) => ipcRenderer.send('centro-medico-edited', centroMedico), // Enviar datos del nuevo centro médico
  onNuevoCentroMedico: (callback) => ipcRenderer.on('nuevo-centro-medico-added', callback), // Escuchar evento para actualizar la grilla
  onEditarCentroMedico: (callback) => ipcRenderer.on('editar-centro-medico', callback), // Escuchar evento para editar un centro médico
  onCentroMedicoEdited: (callback) => ipcRenderer.on('centro-medico-edited', callback), // Escuchar evento para actualizar la grilla con el centro médico editado
  updateEstadoCentroMedico: (idCentroMedico, nuevoEstado) => ipcRenderer.invoke('updateEstadoCentroMedico', idCentroMedico, nuevoEstado)
});
