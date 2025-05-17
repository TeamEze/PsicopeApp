class HistorialImportesViewModel {
  constructor(tipoDescuentoService, estadoService, errorLogService) {
    //this.historialImportesService = historialImportesService;
    this.tipoDescuentoService = tipoDescuentoService;
    this.estadoService = estadoService;
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
                JSON.stringify({}),
                error.stack,
                'HistorialImportesViewModel.getAllTiposDescuento'
            );
            return {ok: false};
        }
    }

    async getAllEstados (){
        try {
            const estados = await this.estadoService.getAllEstados();
            return {ok: true, data: estados};
        } 
        catch (error) {
            await this.errorLogService.handleError(
                error.message,
                JSON.stringify({}),
                error.stack,
                'HistorialImportesViewModel.getAllEstados'
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
                JSON.stringify({page, pageSize}),
                error.stack,
                'HistorialImportesViewModel.getPaginatedHistorialImportes'
            );
            return {ok: false};
        }
    }
}

module.exports = HistorialImportesViewModel;
