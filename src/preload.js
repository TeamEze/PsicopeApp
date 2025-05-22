/* const fs = require('fs');
const path = require('path'); */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  showOverlay: (callback) => ipcRenderer.on('show-overlay', callback),
  hideOverlay: (callback) => ipcRenderer.on('hide-overlay', callback)
});

// Exponer métodos seguros a la UI
contextBridge.exposeInMainWorld('viewModelAPI', {
  getCentroMedicoById: (idCentroMedico) => ipcRenderer.invoke('getCentroMedicoById', idCentroMedico),
  getPaginatedActiveCentrosMedicos: (paginationData) => ipcRenderer.invoke('getPaginatedActiveCentrosMedicos', paginationData),
  createCentroMedico: (centroMedico) => ipcRenderer.invoke('createCentroMedico', centroMedico),
  updateCentroMedico: (centroMedico) => ipcRenderer.invoke('updateCentroMedico', centroMedico),
  getPaginatedFilteredCentrosMedicos: (filters, paginationData) => ipcRenderer.invoke('getPaginatedFilteredCentrosMedicos', filters, paginationData),
  openNuevoCentroMedicoModal: () => ipcRenderer.send('open-newCentroMedicoModal'),
  openEditCentroMedicoModal: (centroMedico) => ipcRenderer.send('open-editCentroMedicoModal', centroMedico), // Enviar datos para editar
  hideNuevoCentroMedicoModal: () => ipcRenderer.send('hide-newCentroMedicoModal'),
  clearForm: (callback) => ipcRenderer.on('clear-form', callback), // Escuchar el evento 'clear-form'
  sendNuevoCentroMedico: (centroMedico) => ipcRenderer.send('nuevo-centro-medico', centroMedico), // Enviar datos del nuevo centro médico
  sendCentroMedicoEdited: (centroMedico) => ipcRenderer.send('centro-medico-edited', centroMedico), // Enviar datos del nuevo centro médico
  onNuevoCentroMedico: (callback) => ipcRenderer.on('nuevo-centro-medico-added', callback), // Escuchar evento para actualizar la grilla
  onEditarCentroMedico: (callback) => ipcRenderer.on('editar-centro-medico', callback), // Escuchar evento para editar un centro médico
  onCentroMedicoEdited: (callback) => ipcRenderer.on('centro-medico-edited', callback), // Escuchar evento para actualizar la grilla con el centro médico editado
  updateEstadoCentroMedico: (idCentroMedico, nuevoEstado) => ipcRenderer.invoke('updateEstadoCentroMedico', idCentroMedico, nuevoEstado),
  getAllLocalidades: () => ipcRenderer.invoke('getAllLocalidades'),
  reportError: (errorData) => ipcRenderer.invoke('logError', errorData),
  onSolicitarCancelar: (callback) => ipcRenderer.on('solicitar-cancelar', callback),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  getActiveCentroMedico: () => ipcRenderer.invoke('getActiveCentroMedico'),
  mostrarErrorGenerico: (mensaje) => ipcRenderer.send('mostrar-error-generico', mensaje),
  onMostrarErrorGenerico: (callback) => ipcRenderer.on('mostrar-error-generico', callback), // Escuchar evento para mostrar error genérico
});

contextBridge.exposeInMainWorld('historialImportesAPI', {
  //Métodos para el manejo de ventan modal Nuevo Historial de Importes
  openNuevoHistorialImporteModal: () => ipcRenderer.send('open-NuevoHistorialImporteModal'),
  hideNuevoHistorialImporteModal: () => ipcRenderer.send('hide-NuevoHistorialImporteModal'),
  clearForm: (callback) => ipcRenderer.on('clear-formNuevoHistorialImporte', callback),
  //Métodos para el manejo de la grilla de Historial de Importes (API Backend)
  getAllTiposDescuento: () => ipcRenderer.invoke('getAllTiposDescuento'),
  getAllEstados: () => ipcRenderer.invoke('getAllEstados'),
  getPaginatedHistorialImportes: (paginationData, filters) => ipcRenderer.invoke('getPaginatedHistorialImportes', paginationData.page, paginationData.pageSize, filters),
});
