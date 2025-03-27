const centroMedicoService = require('../services/centroMedico.service');
class CentroMedicoViewModel {

  static async getCentrosMedicos() {
    try {
        const listaCentrosMedicos = await centroMedicoService.getAllCentrosMedicos();
        return listaCentrosMedicos;
    } catch (error) {
        console.error('Error al obtener los centros médicos:', error);
        throw error;
    }
  }

  static async getCentrosMedicosByFilters(filters) {
    try {
        const listaCentrosMedicos = await centroMedicoService.getCentrosMedicosByFilters(filters);
        return listaCentrosMedicos;
    } catch (error) {
        console.error('Error al obtener los centros médicos:', error);
        throw error;
    }
  }

  static async createCentroMedico(centroMedico) {
    try {
        const newCentroMedico = await centroMedicoService.createCentroMedico(centroMedico);
        return newCentroMedico;
    } catch (error) {
        console.error('Error al crear el centro médico:', error);
        throw error;
    }
  }
}

module.exports = CentroMedicoViewModel;