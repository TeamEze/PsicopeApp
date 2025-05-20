const Localidad = require('../models/localidad.model.js');

class LocalidadRepository{
    async getAllLocalidades(){
        const localidades = await Localidad.findAll({
            attributes: [
                            ['idLocalidad','id'],
                            'descripcion'
                        ],
            order: [['descripcion', 'ASC']]
        })

        return localidades.map(loc => loc.get({ plain: true }));
    }
}

module.exports = new LocalidadRepository();