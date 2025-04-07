const { ipcMain } = require('electron');

function setupIpcHandlers(mainWindow, nuevoCentroMedicoWindow, centroMedicoViewModel) {
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

  // Otros manejadores IPC (por ejemplo, para obtener datos)
  ipcMain.handle('getCentrosMedicos', async () => {
    return await centroMedicoViewModel.getCentrosMedicos();
  });

  ipcMain.handle('getCentroMedicoById', async (event, idCentroMedico) => {
    return await centroMedicoViewModel.getCentroMedicoById(idCentroMedico);
  });

  ipcMain.handle('getCentrosMedicosWithPagination', async (event, paginationData) => {
    return await centroMedicoViewModel.getCentrosMedicoswithPagination(paginationData.page, paginationData.pageSize);
  });

  ipcMain.handle('createCentroMedico', async (event, centroMedico) => {
    return await centroMedicoViewModel.createCentroMedico(centroMedico);
  });

  ipcMain.handle('updateCentroMedico', async (event, centroMedico) => {
    return await centroMedicoViewModel.updateCentroMedico(centroMedico);
  });

  ipcMain.handle('getCentrosMedicosByFilters', async (event, filters, paginationData) => {
    return await centroMedicoViewModel.getCentrosMedicosByFilters(filters, paginationData.page, paginationData.pageSize);
  });
}

module.exports = { setupIpcHandlers };