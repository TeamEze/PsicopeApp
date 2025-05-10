const fs = require('fs');
const path = require('path')
const { ipcMain } = require('electron');

function setupIpcHandlers(mainWindow, nuevoCentroMedicoWindow, centroMedicoViewModel, errorLogService) {
  // Abrir la ventana modal y limpiar el formulario
  ipcMain.on('open-newCentroMedicoModal', () => {
    if (nuevoCentroMedicoWindow) {
      nuevoCentroMedicoWindow.webContents.send('clear-form'); // Limpiar el formulario
      nuevoCentroMedicoWindow.show(); // Mostrar la ventana si ya está creada
    }
  });

  // Recibir datos para editar un centro médico
  ipcMain.on('open-editCentroMedicoModal', (event, centroMedico) => {
    if (nuevoCentroMedicoWindow) {
      nuevoCentroMedicoWindow.webContents.send('editar-centro-medico', centroMedico); // Enviar los datos a la ventana modal
      nuevoCentroMedicoWindow.show(); // Mostrar la ventana modal
    }
  });

  // Ocultar la ventana modal
  ipcMain.on('hide-newCentroMedicoModal', () => {
    if (nuevoCentroMedicoWindow) {
      nuevoCentroMedicoWindow.hide(); // Ocultar la ventana
    }
  });

  // Recibir datos del nuevo centro médico desde la ventana modal
  ipcMain.on('nuevo-centro-medico', (event, nuevoCentroMedico) => {
    // Enviar los datos a la ventana principal
    mainWindow.webContents.send('nuevo-centro-medico-added', nuevoCentroMedico);
  });

  ipcMain.on('centro-medico-edited', (event, centroMedicoEdited) => {
    // Enviar los datos a la ventana principal
    mainWindow.webContents.send('centro-medico-edited', centroMedicoEdited);
  });

  ipcMain.on('mostrar-error-generico', (event, centroMedicoEdited) => {
    // Enviar los datos a la ventana principal
    mainWindow.webContents.send('mostrar-error-generico', centroMedicoEdited);
  });

   // Interceptar el cierre con la X
   nuevoCentroMedicoWindow.on('close', (e) => {
    e.preventDefault(); // evitamos que se cierre sin más
    nuevoCentroMedicoWindow.webContents.send('solicitar-cancelar'); // pedimos al renderer que ejecute cancelar
  });

  // Otros manejadores IPC (por ejemplo, para obtener datos)
  ipcMain.handle('getCentroMedicoById', async (event, idCentroMedico) => {
    return await centroMedicoViewModel.getCentroMedicoById(idCentroMedico);
  });

  ipcMain.handle('getPaginatedActiveCentrosMedicos', async (event, paginationData) => {
    return await centroMedicoViewModel.getPaginatedActiveCentrosMedicos(paginationData.page, paginationData.pageSize);
  });

  ipcMain.handle('createCentroMedico', async (event, centroMedico) => {
    return await centroMedicoViewModel.createCentroMedico(centroMedico);
  });

  ipcMain.handle('updateCentroMedico', async (event, centroMedico) => {
    return await centroMedicoViewModel.updateCentroMedico(centroMedico);
  });

  ipcMain.handle('getPaginatedFilteredCentrosMedicos', async (event, filters, paginationData) => {
    return await centroMedicoViewModel.getPaginatedFilteredCentrosMedicos(filters, paginationData.page, paginationData.pageSize);
  });

  ipcMain.handle('updateEstadoCentroMedico', async (event, idCentroMedico, nuevoEstado) => {
    return await centroMedicoViewModel.updateEstadoCentroMedico(idCentroMedico, nuevoEstado);
  });

  ipcMain.handle('getAllLocalidades', async () => {
    return await centroMedicoViewModel.getAllLocalidades();
  });

  ipcMain.handle('logError', async (event, errorData) => {
    const { message, parameters, stack, source } = errorData;
    await errorLogService.handleError(message, parameters, stack, source);
  });
  ipcMain.handle('read-file', (event, filePath) => {
    const fullPath = path.resolve(__dirname, '../renderer/views', filePath); // ajusta si tu renderer está en otra carpeta
    return fs.readFileSync(fullPath, 'utf-8');
  });
   ipcMain.handle('getActiveCentroMedico', async() => {
    return await centroMedicoViewModel.getActiveCentroMedico();
   });
}

module.exports = { setupIpcHandlers };