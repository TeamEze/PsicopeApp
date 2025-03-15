import CentroMedico from '../models/centroMedico.model.js';

class CentroMedicoRepository {
  async getAllCentrosMedicos() {
    return await CentroMedico.findAll();
  }

  async getCentroMedicoById(id) {
    return await CentroMedico.findByPk(id);
  }

  /*static async createCentroMedico() {
    return CentroMedico.create({ name, email });
  }*/
}

export default new CentroMedicoRepository();