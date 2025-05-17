const HistorialImporte = require('../models/historialImporte.model.js');
const CentroMedico = require('./centroMedico.model.js');
const TipoDescuento = require('./tipoDescuento.model.js');
const Estado = require('./estado.model.js');

class HistorialImporteRepository {
    //Creo que necesitamos un indice sobre VigenciaDesde
    async getPaginatedHistorialImporteIds(offset, pageSize){    
        const idResult = await HistorialImporte.findAll({
            attributes: ['idHistorialImporte'],
            order: [['vigenciaDesde', 'DESC']],
            limit: pageSize,
            offset: offset,
            raw: true
        });
    
        const ids = idResult.map(row => row.idHistorialImporte);
        return ids;    
    }

    async getHistorialImporteByIds(idList) {
        const historialImportes = await HistorialImporte.findAll({
            where: {
                idHistorialImporte: idList
            },
            include: [
                { model: CentroMedico, as: 'centroMedico', required: true },
                { model: TipoDescuento, as: 'tipoDescuento', required: true },
                { model: Estado, as: 'estado', required: true }
            ],
            order: [['vigenciaDesde', 'ASC']]
        });
        return historialImportes;
    }

    async getTotalHistorialImporte(){
        return await HistorialImporte.count();
    }
}

module.exports = new HistorialImporteRepository();