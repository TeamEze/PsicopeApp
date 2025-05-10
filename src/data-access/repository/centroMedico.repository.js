const CentroMedico = require('../models/centroMedico.model.js');
const Estado = require('../models/estado.model.js');
const Localidad = require('../models/localidad.model.js');

class CentroMedicoRepository {

  async getCentroMedicoById(id) {
    return await CentroMedico.findByPk(id);
  }

  /**
   * Obtiene el número total de registros de centros médicos que cumplen con los filtros especificados.
   *
   * @async
   * @function getTotalFilteredCentrosMedicos
   * @param {Object} filters - Un objeto que contiene los filtros a aplicar en la consulta.
   * @returns {Promise<number>} El número total de centros médicos que coinciden con los filtros.
   */
  async getTotalFilteredCentrosMedicos(filters) {
    const whereClause = {
      ...filters
    };
    const totalCount = await CentroMedico.count({
      where: whereClause
    });
    return totalCount;
  }       

  /**
   * Obtiene el número total de registros en la tabla de centros médicos.
   * 
   * @async
   * @function
   * @returns {Promise<number>} El número total de centros médicos.
   */
  async getTotalCentrosMedicos(){
    return await CentroMedico.count();
  }

  /**
   * Retrieves a list of medical centers (centros médicos) by their IDs.
   * @param {Array<number>} idList - An array of IDs representing the medical centers to retrieve.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of medical center objects,
   * including their associated localidad and estado, ordered by their name in ascending order.
   */
  async getCentrosMedicosByIds(idList) {
    const centros = await CentroMedico.findAll({
      where: {
        idCentroMedico: idList
      },
      include: [
        { model: Localidad, as: 'localidad', required: true },
        { model: Estado, as: 'estado', required: true }
      ],
      order: [['nombre', 'ASC']]
    });
    return centros;
  }

  /**
   * Retrieves a paginated list of Centro Medico IDs from the database.
   *
   * @async
   * @function getPaginatedCentroMedicoIds
   * @param {number} offset - The starting index for the pagination.
   * @param {number} pageSize - The number of records to retrieve per page.
   * @returns {Promise<number[]>} A promise that resolves to an array of Centro Medico IDs.
   */
  async getPaginatedCentroMedicoIds(offset, pageSize) {
    const idResult = await CentroMedico.findAll({
      attributes: ['idCentroMedico'],
      order: [['nombre', 'ASC']],
      limit: pageSize,
      offset: offset,
      raw: true
    });

    const ids = idResult.map(row => row.idCentroMedico);
    return ids;
  }

  async getActiveCentroMedico(){
    const centrosMedicos = await CentroMedico.findAll({
      attributes: [
                    ['idCentroMedico','id'],
                    ['nombre', 'descripcion']
                  ] ,
      order: [['nombre', 'ASC']],
      where: {
        idEstado: 1
      }
    });
    return centrosMedicos;
  }
  /**
   * Retrieves a paginated list of CentroMedico IDs based on the provided filters.
   *
   * @param {number} offset - The starting index for pagination.
   * @param {number} pageSize - The number of records to retrieve per page.
   * @param {Object} filters - An object containing the filtering criteria.
   * @returns {Promise<number[]>} A promise that resolves to an array of CentroMedico IDs.
   */
  async getPaginatedFilteredCentroMedicoIds(offset, pageSize, filters) {
    const whereClause = {
      ...filters
    };
    const idResult = await CentroMedico.findAll({
      attributes: ['idCentroMedico'],
      where: whereClause,
      order: [['nombre', 'ASC']],
      limit: pageSize,
      offset: offset,
      raw: true
    });
    const ids = idResult.map(row => row.idCentroMedico);
    return ids;
  }

  async getCentroMedicoByIdWithIncludes(id) {
    return await CentroMedico.findByPk(id, {
      include: [
        {model: Localidad, as: 'localidad', required: true},
        {model: Estado, as: 'estado', required: true}
      ]
    });
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