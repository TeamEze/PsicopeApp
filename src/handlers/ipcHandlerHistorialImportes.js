const { ipcMain } = require('electron');

function setupIpcHandlersHistorialImportes(mainWindow, nuevoHistorialImporteWindow, historialImportesViewModel, errorLogService) {
    // Abrir la ventana modal y limpiar el formulario
    ipcMain.on('open-NuevoHistorialImporteModal', () => {
        if (nuevoHistorialImporteWindow) {
            mainWindow.webContents.send('show-overlay');
            nuevoHistorialImporteWindow.show();
            nuevoHistorialImporteWindow.webContents.send('clear-formNuevoHistorialImporte'); // Limpiar el formulario
        }
    });
    // Ocultar la ventana modal
    ipcMain.on('hide-NuevoHistorialImporteModal', () => {
        if (nuevoHistorialImporteWindow) {
            nuevoHistorialImporteWindow.hide(); // Ocultar la ventana
            mainWindow.webContents.send('hide-overlay');
        }
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
}

module.exports = { setupIpcHandlersHistorialImportes };