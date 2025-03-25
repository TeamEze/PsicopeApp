const centroMedicoRepository = require('../data-access/repository/centroMedico.repository.js') ;
const CentroMedicoMapper = require('../mappers/centroMedicoMapper.js');

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
  async getAllCentrosMedicos() {
    const centrosMedicos = await centroMedicoRepository.getAllCentrosMedicos();
    const centrosMedicosDTO = centrosMedicos.map(centroMedico =>
        CentroMedicoMapper.mapCentroMedicoToDTO(centroMedico)); 

    return centrosMedicosDTO;
  }

  async createCentroMedico(centroMedico) {
    const nuevoCentroMedico = await centroMedicoRepository.createCentroMedico(centroMedico);
    const centroMedicoConIncludes = await centroMedicoRepository.getCentroMedicoById(nuevoCentroMedico.idCentroMedico);
    return CentroMedicoMapper.mapCentroMedicoToDTO(centroMedicoConIncludes);
  } 
}

module.exports = new CentroMedicoService();
