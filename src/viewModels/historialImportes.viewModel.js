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
}

module.exports = HistorialImportesViewModel;
