const Vinculo = require('../models/vinculo.model.js');

class VinculoRepository{
    async getAllVinculos(){
        const vinculos = await Vinculo.findAll({
            attributes: [
                            ['idVinculo','id'],
                            'descripcion'
                        ],
            order: [['descripcion', 'ASC']]
        })

        return vinculos;
    }
}

module.exports = new VinculoRepository();