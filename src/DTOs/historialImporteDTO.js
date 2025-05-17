// filepath: src/dtos/centroMedico.dto.js

class HistorialImporteDTO {
    constructor() {
        this.idHistorialImporte = null;
        this.centroMedico = null;
        this.tipoDescuento = null;
        this.valor = null;
        this.importeSesionEvaluacion = null;
        this.importeSesionTratamiento = null;
        this.vigenciaDesde = null;
        this.vigenciaHasta = null;
        this.estado = null
    }
}
module.exports = HistorialImporteDTO;