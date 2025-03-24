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
    return await CentroMedico.findByPk(id);
  }

  /*static async createCentroMedico() {
    return CentroMedico.create({ name, email });
  }*/
}

module.exports = new CentroMedicoRepository();