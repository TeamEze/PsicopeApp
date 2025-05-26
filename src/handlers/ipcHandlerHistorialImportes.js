const { ipcMain } = require('electron');

function setupIpcHandlersHistorialImportes(mainWindow, nuevoHistorialImporteWindow, historialImportesViewModel, errorLogService) {
    // Abrir la ventana modal y limpiar el formulario
    ipcMain.on('open-NuevoHistorialImporteModal', (event, descuentoDefault) => {
        if (nuevoHistorialImporteWindow) {
            mainWindow.webContents.send('show-overlay');
            nuevoHistorialImporteWindow.show();
            nuevoHistorialImporteWindow.webContents.send('clear-formNuevoHistorialImporte'); // Limpiar el formulario
            nuevoHistorialImporteWindow.webContents.send('load-defaultTipoDescuento', descuentoDefault); 
        }
    });
    // Ocultar la ventana modal
    ipcMain.on('hide-NuevoHistorialImporteModal', () => {
        if (nuevoHistorialImporteWindow) {
            nuevoHistorialImporteWindow.hide(); // Ocultar la ventana
            mainWindow.webContents.send('hide-overlay');
        }
    });
    // Recibir datos del nuevo historial de importe desde la ventana modal
    ipcMain.on('createdHistorialImporte', (event, createdHistorialImporte) => {
        // Enviar los datos a la ventana principal
        mainWindow.webContents.send('new-AddedHistorialImporte', createdHistorialImporte);
    });
    ipcMain.handle('getAllTiposDescuento', async () => {
        return await historialImportesViewModel.getAllTiposDescuento();
    });
    ipcMain.handle ('getAllEstados',async () => {
        return await historialImportesViewModel.getAllEstados();
    });
    ipcMain.handle('getPaginatedHistorialImportes', async (event, page, pageSize, filters) => {
        return await historialImportesViewModel.getPaginatedHistorialImportes(page, pageSize, filters);
    });
    ipcMain.handle('getTotalActiveHistorialImporteByCentroMedicoId', async (event, idCentroMedico) => {
        return await historialImportesViewModel.getTotalActiveHistorialImporteByCentroMedicoId(idCentroMedico);
    });
    ipcMain.handle('createHistorialImporte', async (event, nuevoHistorialImporte) => {
        return await historialImportesViewModel.createHistorialImporte(nuevoHistorialImporte);
    });
    ipcMain.handle('getDefaultTipoDescuentoNewHistorialImporte', async (event, idCentroMedico) => {
        return await historialImportesViewModel.getDefaultTipoDescuentoNewHistorialImporte(idCentroMedico);
    });
}

module.exports = { setupIpcHandlersHistorialImportes };