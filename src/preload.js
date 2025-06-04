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
  openNuevoHistorialImporteModal: (descuentoDefault) => ipcRenderer.send('open-NuevoHistorialImporteModal', descuentoDefault),
  hideNuevoHistorialImporteModal: () => ipcRenderer.send('hide-NuevoHistorialImporteModal'),
  editNuevoHistorialImporteModal: (idHistorialImporte) => ipcRenderer.send('edit-NuevoHistorialImporteModal', idHistorialImporte), // Enviar datos para editar un historial de importe
  clearForm: (callback) => ipcRenderer.on('clear-formNuevoHistorialImporte', callback),
  loadDefaultTipoDescuento: (callback) => ipcRenderer.on('load-defaultTipoDescuento', callback), // Enviar el tipo de descuento por defecto al modal
  onEditarHistorialImporte: (callback) => ipcRenderer.on('edit-HistorialImporte', callback), // Escuchar evento para editar un centro médico
  getHistorialImporteById: (idHistorialImporte) => ipcRenderer.invoke('getHistorialImporteById', idHistorialImporte), // Obtener historial de importe por ID
  //Métodos para manejar creación de Historial de Importes
  sendCreatedHistorialImporteToMain: (createdHistorialImporte) => ipcRenderer.send('createdHistorialImporte', createdHistorialImporte), // Enviar datos del nuevo historial importe
  onNewAddedHistorialImporte: (callback) => ipcRenderer.on('new-AddedHistorialImporte', callback), // Escuchar evento para actualizar la grilla
  sendEditedHistorialImporteToMain: (editedHistorialImporte) => ipcRenderer.send('editedHistorialImporte', editedHistorialImporte), // Enviar datos del historial importe editado
  onEditedHistorialImporte: (callback) => ipcRenderer.on('edited-HistorialImporte', callback), // Escuchar evento para actualizar la grilla con el historial importe editado
  //Métodos para el manejo de la grilla de Historial de Importes (API Backend)
  getAllTiposDescuento: () => ipcRenderer.invoke('getAllTiposDescuento'),
  getAllEstados: () => ipcRenderer.invoke('getAllEstados'),
  getPaginatedHistorialImportes: (paginationData, filters) => ipcRenderer.invoke('getPaginatedHistorialImportes', paginationData.page, paginationData.pageSize, filters),
  getTotalActiveHistorialImporteByCentroMedicoId: (idCentroMedico) => ipcRenderer.invoke('getTotalActiveHistorialImporteByCentroMedicoId', idCentroMedico),
  createHistorialImporte: (nuevoHistorialImporte) => ipcRenderer.invoke('createHistorialImporte', nuevoHistorialImporte),
  updateHistorialImporte: (historialImporte) => ipcRenderer.invoke('updateHistorialImporte', historialImporte),
  getDefaultTipoDescuentoNewHistorialImporte: (idCentroMedico) => ipcRenderer.invoke('getDefaultTipoDescuentoNewHistorialImporte', idCentroMedico)
});
