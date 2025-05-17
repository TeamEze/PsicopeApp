const { json } = require("sequelize");

class HistorialImportesViewModel {
  constructor(tipoDescuentoService, errorLogService) {
    //this.historialImportesService = historialImportesService;
    this.tipoDescuentoService = tipoDescuentoService;
    this.errorLogService = errorLogService;
  }

    async getAllTiposDescuento() {
        try {
            const tiposDescuento = await this.tipoDescuentoService.getAllTiposDescuento();
            return {ok: true, data: tiposDescuento};
        } 
        catch (error) {
            await this.errorLogService.handleError(
                error.message,
                json.stringify({}),
                error.stack,
                'HistorialImportesViewModel.getAllTiposDescuento'
            );
            return {ok: false};
        }
    }

    async getPaginatedHistorialImportes(page, pageSize) {
        try {
            const historialImportes = await this.historialImportesService.getPaginatedHistorialImportes(page, pageSize);
            return {ok: true, data: historialImportes};
        } 
        catch (error) {
            await this.errorLogService.handleError(
                error.message,
                json.stringify({page, pageSize}),
                error.stack,
                'HistorialImportesViewModel.getPaginatedHistorialImportes'
            );
            return {ok: false};
        }
    }
}

module.exports = HistorialImportesViewModel;
