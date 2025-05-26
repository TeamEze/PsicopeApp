const Turno = require('../models/turno.model.js');


class TurnoRepository{
    async getAllTurnos(){
        const turnos = await Turno.findAll({
            attributes: [
                            ['idTurno','id'],
                            'descripcion'
                        ],
            order: [['descripcion', 'ASC']]
        })

        return turnos;
    }
}

module.exports = new TurnoRepository();