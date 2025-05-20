const TipoDescuento = require('../models/tipoDescuento.model.js');

class TipoDescuentoRepository{
    async getAllTiposDescuento(){
        const tiposDescuento = await TipoDescuento.findAll({
            attributes: [
                            ['idTipoDescuento','id'],
                            'descripcion'
                        ],
            order: [['descripcion', 'ASC']]
        })

        return tiposDescuento.map(td => td.get({ plain: true }));
    }
}

module.exports = new TipoDescuentoRepository();