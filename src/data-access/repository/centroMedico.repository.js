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

  async getAllCentrosMedicosWithPagination2(page, pageSize) { 
    
    const offset = (page - 1) * pageSize;

    // Paso 1: obtener solo los IDs paginados
    const idResult = await CentroMedico.findAll({
      attributes: ['idCentroMedico'],
      order: [['nombre', 'ASC']],
      limit: pageSize,
      offset: offset,
      raw: true
    });

    const ids = idResult.map(row => row.idCentroMedico);

    if (ids.length === 0) {
      return {
        data: [],
        totalRecords: 0,
        totalPages: 0,
        currentPage: page
      };
    }

    // Paso 2: obtener los datos completos usando los IDs
    const centros = await CentroMedico.findAll({
      where: {
        idCentroMedico: ids
      },
      include: [
        { model: Localidad, as: 'localidad', required: true },
        { model: Estado, as: 'estado', required: true }
      ],
      order: [['nombre', 'ASC']] // mantenemos el orden
    });

    // Total de registros para paginación
    const totalCount = await CentroMedico.count();

    return {
      data: centros,
      totalRecords: totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page
    };
  }   

  async getAllCentrosMedicosWithPagination(page, pageSize) { 
    
    const offset = (page - 1) * pageSize;

    // Paso 1: obtener solo los IDs paginados
    const idResult = await CentroMedico.findAll({
      attributes: ['idCentroMedico'],
      where: {
        idEstado: 1
      },
      order: [['nombre', 'ASC']],
      limit: pageSize,
      offset: offset,
      raw: true
    });

    const ids = idResult.map(row => row.idCentroMedico);

    if (ids.length === 0) {
      return {
        data: [],
        totalRecords: 0,
        totalPages: 0,
        currentPage: page
      };
    }

    // Paso 2: obtener los datos completos usando los IDs
    const centros = await CentroMedico.findAll({
      where: {
        idCentroMedico: ids
      },
      include: [
        { model: Localidad, as: 'localidad', required: true },
        { model: Estado, as: 'estado', required: true }
      ],
      order: [['nombre', 'ASC']] // mantenemos el orden
    });

    // Total de registros para paginación
    const totalCount = await CentroMedico.count({
      where: {
        idEstado: 1
      }
    });

    return {
      data: centros,
      totalRecords: totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page
    };
  }     

  async getCentroMedicoByIdWithIncludes(id) {
    return await CentroMedico.findByPk(id, {
      include: [
        {model: Localidad, as: 'localidad', required: true},
        {model: Estado, as: 'estado', required: true}
      ]
    });
  }

  async getCentrosMedicosByFilters(filters, page, pageSize) {
    const offset = (page - 1) * pageSize;

    // Armamos los filtros dinámicos
    const whereClause = {
      ...filters
    };

    // Paso 1: Traer solo los IDs paginados con filtros aplicados
    const idResult = await CentroMedico.findAll({
      attributes: ['idCentroMedico'],
      where: whereClause,
      order: [['nombre', 'ASC']],
      limit: pageSize,
      offset: offset,
      raw: true
    });

    const ids = idResult.map(row => row.idCentroMedico);

    if (ids.length === 0) {
      return {
        data: [],
        totalRecords: 0,
        totalPages: 0,
        currentPage: page
      };
    }

    // Paso 2: Obtener los datos completos con joins
    const centros = await CentroMedico.findAll({
      where: {
        idCentroMedico: ids
      },
      include: [
        { model: Localidad, as: 'localidad', required: true },
        { model: Estado, as: 'estado', required: true }
      ],
      order: [['nombre', 'ASC']] // mantener el orden para coherencia
    });

    // Total con filtros
    const totalCount = await CentroMedico.count({
      where: whereClause
    });

    return {
      data: centros,
      totalRecords: totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page
    };
  }

  async createCentroMedico(centroMedico) {
    return await CentroMedico.create(centroMedico);
  }

  async updateCentroMedico(centroMedico) {
    await CentroMedico.update(centroMedico, {
        where: { idCentroMedico: centroMedico.idCentroMedico }
    });
    return centroMedico;
  }

  async updateEstadoCentroMedico(idCentroMedico, nuevoEstado) {
    await CentroMedico.update(
        { idEstado: nuevoEstado },
        { where: { idCentroMedico: idCentroMedico } }
    );
  }
}

module.exports = new CentroMedicoRepository();