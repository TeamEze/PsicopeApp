const { ipcMain } = require('electron');

function setupIpcHandlersHistorialImportes(nuevoHistorialImporteWindow, historialImportesViewModel, errorLogService) {
    // Abrir la ventana modal y limpiar el formulario
    ipcMain.on('open-newHistorialImporteModal', () => {
        if (nuevoHistorialImporteWindow) {
            //nuevoHistorialImporteWindow.webContents.send('clear-form'); // Limpiar el formulario
            nuevoHistorialImporteWindow.show(); // Mostrar la ventana si ya está creada
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