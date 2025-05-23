class HistorialImportesViewModel {
  constructor(historialImporteService, tipoDescuentoService, estadoService, errorLogService) {
    this.historialImporteService = historialImporteService;
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

    async getPaginatedHistorialImportes(page, pageSize, filters) {
        try {
            const historialImportes = await this.historialImporteService.getPaginatedHistorialImportes(page, pageSize, filters);
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

    async getTotalActiveHistorialImporteByCentroMedicoId(idCentroMedico) {
        try {
            const totalCount = await this.historialImporteService.getTotalActiveHistorialImporteByCentroMedicoId(idCentroMedico);
            return {ok: true, data: totalCount};
        } 
        catch (error) {
            await this.errorLogService.handleError(
                error.message,
                JSON.stringify({idCentroMedico}),
                error.stack,
                'HistorialImportesViewModel.getTotalActiveHistorialImporteByCentroMedicoId'
            );
            return {ok: false};
        }
    }

    async createHistorialImporte(historialImporte) {
        try {
            const nuevoHistorialImporte = await this.historialImporteService.createHistorialImporte(historialImporte);
            return {ok: true, data: nuevoHistorialImporte};
        } 
        catch (error) {
            await this.errorLogService.handleError(
                error.message,
                JSON.stringify(historialImporte),
                error.stack,
                'HistorialImportesViewModel.createHistorialImporte'
            );
            return {ok: false};
        }
    }
}

module.exports = HistorialImportesViewModel;
