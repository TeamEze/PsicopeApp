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

  async getAllCentrosMedicosWithPagination(page, pageSize) { 
    /*const offset = (page - 1) * pageSize;
    return await CentroMedico.findAll({
      limit: pageSize,
      offset: offset,
      include: [
        {model: Localidad, as: 'localidad'},
        {model: Estado, as: 'estado'}
      ]
    });*/
    const offset = (page - 1) * pageSize;
    const { rows, count } = await CentroMedico.findAndCountAll({
      limit: pageSize,
      offset: offset,
      include: [
        {model: Localidad, as: 'localidad'},
        {model: Estado, as: 'estado'}
      ]
    });

    return {
      data: rows,
      totalRecords: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
    };
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