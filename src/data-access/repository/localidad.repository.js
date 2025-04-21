const Localidad = require('../models/localidad.model.js');

class LocalidadRepository{
    async getAllLocalidades(){
        const localidades = await Localidad.findAll({
            order: [['descripcion', 'ASC']]
        })

        return localidades;
    }
}

module.exports = new LocalidadRepository();