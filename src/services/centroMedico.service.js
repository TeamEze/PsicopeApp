const { Op } = require('sequelize');
class CentroMedicoService {
  /*async addCentroMedico(name) {
    // 1. Validación de negocio
    const validation = User.validate({ name });
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // 2. Verificar duplicados
    const existingUser = await userRepository.getUserByName(name);
    if (existingUser) {
      return { success: false, error: "El usuario ya existe." };
    }

    // 3. Guardar en la BD
    await userRepository.addUser(name);
    return { success: true };
  }*/
    constructor(centroMedicoRepository, centroMedicoMapper) {
      this.centroMedicoRepository = centroMedicoRepository;
      this.centroMedicoMapper = centroMedicoMapper;
    }

  async getCentroMedicoById(idCentroMedico) {
    const centroMedico = await this.centroMedicoRepository.getCentroMedicoById(idCentroMedico);
    if (!centroMedico) {
      return null;
    }
    return centroMedico;
  }

  /**
   * Retrieves a paginated list of active medical centers (centros médicos).
   *
   * @async
   * @function
   * @param {number} page - The current page number (1-based index).
   * @param {number} pageSize - The number of records per page.
   * @returns {Promise<Object>} An object containing the paginated data:
   * - `data` {Array<Object>} - The list of active medical centers in DTO format.
   * - `totalRecords` {number} - The total number of active medical centers.
   * - `totalPages` {number} - The total number of pages.
   * - `currentPage` {number} - The current page number.
   * 
   * @description
   * This function fetches a paginated list of active medical centers from the repository.
   * It calculates the offset based on the page and pageSize, retrieves the corresponding
   * IDs, and fetches the medical center details. It also calculates the total number of
   * active medical centers and maps the data to DTO format before returning the result.
   */
  async getPaginatedActiveCentrosMedicos(page, pageSize) {
    const dataToFilter = {
      idEstado: 1 // Activos
    };
    const offset = (page - 1) * pageSize;
    const ids = await this.centroMedicoRepository.getPaginatedFilteredCentroMedicoIds(offset, pageSize, dataToFilter);
    if (ids.length === 0) {
      return {
        data: [],
        totalRecords: 0,
        totalPages: 0,
        currentPage: page
      };
    }
    const centrosMedicos = await this.centroMedicoRepository.getCentrosMedicosByIds(ids);
    const totalCount = await this.centroMedicoRepository.getTotalFilteredCentrosMedicos(dataToFilter);
    const centrosMedicosDTO = centrosMedicos.map(centroMedico =>
      this.centroMedicoMapper.mapCentroMedicoToDTO(centroMedico)); 
    return {
      data: centrosMedicosDTO,
      totalRecords: totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page
    };
  }

  async getPaginatedCentrosMedicos(page, pageSize) {
    const offset = (page - 1) * pageSize;
    const ids = await this.centroMedicoRepository.getPaginatedCentroMedicoIds(offset, pageSize);
    if (ids.length === 0) {
      return {
        data: [],
        totalRecords: 0,
        totalPages: 0,
        currentPage: page
      };
    }
    const centrosMedicos = await this.centroMedicoRepository.getCentrosMedicosByIds(ids);
    const totalCount = await this.centroMedicoRepository.getTotalCentrosMedicos();
    const centrosMedicosDTO = centrosMedicos.map(centroMedico =>
      this.centroMedicoMapper.mapCentroMedicoToDTO(centroMedico)); 
    return {
      data: centrosMedicosDTO,
      totalRecords: totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page
    };
  }

  async getPaginatedFilteredCentrosMedicos(filters, page, pageSize) {
    
    let dataToFilter = {
      ...(filters.idLocalidad && { idLocalidad: filters.idLocalidad }),
      ...(filters.nombre && { nombre: {[Op.like]: filters.nombre +'%'} }),
      ...(filters.incluirInactivos === false && { idEstado: 1 })
    };

    if(Object.keys(dataToFilter).length === 0) {
      // Fetch all paginated medical centers without filters
      return await this.getPaginatedCentrosMedicos(page, pageSize);
    } 

    const offset = (page - 1) * pageSize;
    const ids = await this.centroMedicoRepository.getPaginatedFilteredCentroMedicoIds(offset, pageSize, dataToFilter);
    if (ids.length === 0) {
      return {
        data: [],
        totalRecords: 0,
        totalPages: 0,
        currentPage: page
      };
    }
    const centrosMedicos = await this.centroMedicoRepository.getCentrosMedicosByIds(ids);
    const totalCount = await this.centroMedicoRepository.getTotalFilteredCentrosMedicos(dataToFilter);
    const centrosMedicosDTO = centrosMedicos.map(centroMedico =>
      this.centroMedicoMapper.mapCentroMedicoToDTO(centroMedico)); 
    return {
      data: centrosMedicosDTO,
      totalRecords: totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page
    };
  } 

  async createCentroMedico(centroMedico) {
    const nuevoCentroMedico = await this.centroMedicoRepository.createCentroMedico(centroMedico);
    const centroMedicoConIncludes = await this.centroMedicoRepository.getCentroMedicoByIdWithIncludes(nuevoCentroMedico.idCentroMedico);
    return this.centroMedicoMapper.mapCentroMedicoToDTO(centroMedicoConIncludes);
  } 

  async updateCentroMedico(centroMedico) {
    const updatedCentroMedico = await this.centroMedicoRepository.updateCentroMedico(centroMedico);
    const centroMedicoConIncludes = await this.centroMedicoRepository.getCentroMedicoByIdWithIncludes(updatedCentroMedico.idCentroMedico);
    return this.centroMedicoMapper.mapCentroMedicoToDTO(centroMedicoConIncludes);
  }

  async updateEstadoCentroMedico(idCentroMedico, nuevoEstado) {
    await this.centroMedicoRepository.updateEstadoCentroMedico(idCentroMedico, nuevoEstado);
  }
async getActiveCentroMedico(){
    const centrosMedicos = await this.centroMedicoRepository.getActiveCentroMedico();
    return centrosMedicos.map(centroMedico => centroMedico.get({ plain: true })); 
  }
}

module.exports = CentroMedicoService;
