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
  async getAllCentrosMedicos() {
    const centrosMedicos = await this.centroMedicoRepository.getAllCentrosMedicos();
    const centrosMedicosDTO = centrosMedicos.map(centroMedico =>
      this.centroMedicoMapper.mapCentroMedicoToDTO(centroMedico)); 

    return centrosMedicosDTO;
  }

  async getCentroMedicoById(idCentroMedico) {
    const centroMedico = await this.centroMedicoRepository.getCentroMedicoById(idCentroMedico);
    if (!centroMedico) {
      return null;
    }
    return centroMedico;
  }

  async getAllCentrosMedicosWithPagination(page, pageSize) {
    const result = await this.centroMedicoRepository.getAllCentrosMedicosWithPagination(page, pageSize);
    const centrosMedicos = result.data;
    const centrosMedicosDTO = centrosMedicos.map(centroMedico =>
      this.centroMedicoMapper.mapCentroMedicoToDTO(centroMedico)); 
    result.data = centrosMedicosDTO;
    return result;
  }

  async getAllCentrosMedicosWithPagination2(page, pageSize) {
    const result = await this.centroMedicoRepository.getAllCentrosMedicosWithPagination2(page, pageSize);
    const centrosMedicos = result.data;
    const centrosMedicosDTO = centrosMedicos.map(centroMedico =>
      this.centroMedicoMapper.mapCentroMedicoToDTO(centroMedico)); 
    result.data = centrosMedicosDTO;
    return result;
  }

  async getCentrosMedicosByFilters(filters, page, pageSize) {
    
    if(Object.keys(filters).length === 0) {
      return await this.getAllCentrosMedicosWithPagination(page, pageSize);
    }

    let dataToFilter = {
      ...(filters.idLocalidad && { idLocalidad: filters.idLocalidad }),
      ...(filters.nombre && { nombre: {[Op.like]: filters.nombre +'%'} }),
      ...(filters.incluirInactivos === false && { idEstado: 1 })
    };
    if(Object.keys(dataToFilter).length === 0) {
      return await this.getAllCentrosMedicosWithPagination2(page, pageSize);
    } 
  
    const result = await this.centroMedicoRepository.getCentrosMedicosByFilters(dataToFilter, page, pageSize);
    const centrosMedicosFiltered = result.data;
    const centrosMedicosFilteredDTO = centrosMedicosFiltered.map(centroMedico =>
        this.centroMedicoMapper.mapCentroMedicoToDTO(centroMedico)); 
    result.data = centrosMedicosFilteredDTO;
    return result;
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
}

module.exports = CentroMedicoService;
