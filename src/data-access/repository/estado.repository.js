const Estado = require('../models/estado.model.js');

class EstadoRepository{
    async getAllEstados(){
        const estados = await Estado.findAll({
            attributes: [
                            ['idEstado','id'],
                            'descripcion'
                        ],
            order: [['descripcion', 'ASC']]
        })

        return estados;
    }
}

module.exports = new EstadoRepository();