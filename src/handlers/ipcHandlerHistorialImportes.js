const { ipcMain } = require('electron');

function setupIpcHandlersHistorialImportes(historialImportesViewModel, errorLogService) {
    ipcMain.handle('getAllTiposDescuento', async () => {
        return await historialImportesViewModel.getAllTiposDescuento();
    });
    ipcMain.handle ('getAllEstados',async () => {
        return await historialImportesViewModel.getAllEstados();
    });
    ipcMain.handle('getPaginatedHistorialImportes', async (event, page, pageSize) => {
        return await historialImportesViewModel.getPaginatedHistorialImportes(page, pageSize);
    });
}

module.exports = { setupIpcHandlersHistorialImportes };