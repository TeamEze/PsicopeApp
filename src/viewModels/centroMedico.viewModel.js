class CentroMedicoViewModel {

  constructor(centroMedicoService) {
    this.centroMedicoService = centroMedicoService;
  }

  async getCentrosMedicos() {
    try {
        const listaCentrosMedicos = await this.centroMedicoService.getAllCentrosMedicos();
        return listaCentrosMedicos;
    } catch (error) {
        console.error('Error al obtener los centros médicos:', error);
        throw error;
    }
  }

  async getCentrosMedicosByFilters(filters) {
    try {
        const listaCentrosMedicos = await this.centroMedicoService.getCentrosMedicosByFilters(filters);
        return listaCentrosMedicos;
    } catch (error) {
        console.error('Error al obtener los centros médicos:', error);
        throw error;
    }
  }

  async createCentroMedico(centroMedico) {
    try {
        const newCentroMedico = await this.centroMedicoService.createCentroMedico(centroMedico);
        return newCentroMedico;
    } catch (error) {
        console.error('Error al crear el centro médico:', error);
        throw error;
    }
  }
}

module.exports = CentroMedicoViewModel;