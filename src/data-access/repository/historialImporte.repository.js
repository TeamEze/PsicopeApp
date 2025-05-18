const HistorialImporte = require('../models/historialImporte.model.js');
const CentroMedico = require('../models/centroMedico.model.js');
const TipoDescuento = require('../models/tipoDescuento.model.js');
const Estado = require('../models/estado.model.js');
const { where } = require('sequelize');

class HistorialImporteRepository {
    //Creo que necesitamos un indice sobre VigenciaDesde
    async getPaginatedHistorialImporteIds(offset, pageSize, filters){  
        const whereClause = {
            ...(filters || {})
          };
        
        const idResult = await HistorialImporte.findAll({
            attributes: ['idHistorialImporte'],
            where: whereClause,
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
            order: [['vigenciaDesde', 'DESC']]
        });
        return historialImportes;
    }

    async getTotalHistorialImporte(filters){
        const whereClause = {
            ...(filters || {})
        };
        const totalCount = await HistorialImporte.count({
            where: whereClause
        });
        return totalCount;
    }
}

module.exports = new HistorialImporteRepository();