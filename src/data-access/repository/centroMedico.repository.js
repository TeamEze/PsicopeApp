const CentroMedico = require('../models/centroMedico.model.js');
const Estado = require('../models/estado.model.js');
const Localidad = require('../models/localidad.model.js');

class CentroMedicoRepository {
  async getAllCentrosMedicos() {
    return await CentroMedico.findAll({
      include: [
        {model: Localidad, as: 'localidad'},
        {model: Estado, as: 'estado'}
      ]
    });
  }

  async getCentroMedicoById(id) {
    return await CentroMedico.findByPk(id, {
      include: [
        {model: Localidad, as: 'localidad'},
        {model: Estado, as: 'estado'}
      ]
    });
  }

  async getCentrosMedicosByFilters(filters) {
    return await CentroMedico.findAll({
      where: filters,
      include: [
        {model: Localidad, as: 'localidad'},
        {model: Estado, as: 'estado'}
      ]
    });
  } 

  async createCentroMedico(centroMedico) {
    return await CentroMedico.create(centroMedico);
  }
}

module.exports = new CentroMedicoRepository();