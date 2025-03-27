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

  async getCentrosMedicosByFilters(filters) {
    
    if(Object.keys(filters).length === 0) {
      //console.log('No filters');
      return await this.getAllCentrosMedicos();
    }

    let dataToFilter = {
      ...(filters.idLocalidad && { idLocalidad: filters.idLocalidad }),
      ...(filters.nombre && { nombre: {[Op.like]: '%' + filters.nombre +'%'} })
    };
    if(Object.keys(dataToFilter).length === 0) {
      return await this.getAllCentrosMedicos();
    } 
  
    const centrosMedicosFiltered = await this.centroMedicoRepository.getCentrosMedicosByFilters(dataToFilter);
    const centrosMedicosDTO = centrosMedicosFiltered.map(centroMedico =>
        this.centroMedicoMapper.mapCentroMedicoToDTO(centroMedico)); 
    return centrosMedicosDTO;
  } 

  async createCentroMedico(centroMedico) {
    const nuevoCentroMedico = await this.centroMedicoRepository.createCentroMedico(centroMedico);
    const centroMedicoConIncludes = await this.centroMedicoRepository.getCentroMedicoById(nuevoCentroMedico.idCentroMedico);
    return this.centroMedicoMapper.mapCentroMedicoToDTO(centroMedicoConIncludes);
  } 
}

module.exports = CentroMedicoService;
