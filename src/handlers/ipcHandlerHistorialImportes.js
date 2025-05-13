const { ipcMain } = require('electron');

function setupIpcHandlersHistorialImportes(historialImportesViewModel, errorLogService) {
    ipcMain.handle('getAllTiposDescuento', async () => {
        return await historialImportesViewModel.getAllTiposDescuento();
    });
}

module.exports = { setupIpcHandlersHistorialImportes };