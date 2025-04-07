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

  async getCentroMedicoById(idCentroMedico) { 
    try {
        const centroMedico = await this.centroMedicoService.getCentroMedicoById(idCentroMedico);
        return centroMedico.toJSON(); // Convertir a JSON si es necesario
    }
    catch (error) { 
        console.error('Error al obtener el centro médico por ID:', error);
        throw error;
    }
  }

  async getCentrosMedicoswithPagination(page, pageSize) {
    try {
        const listaCentrosMedicos = await this.centroMedicoService.getAllCentrosMedicosWithPagination(page, pageSize);
        return listaCentrosMedicos;
    } catch (error) {
        console.error('Error al obtener los centros médicos:', error);
        throw error;
    }
  }

  async getCentrosMedicosByFilters(filters, page, pageSize) {
    try {
        const listaCentrosMedicos = await this.centroMedicoService.getCentrosMedicosByFilters(filters, page, pageSize);
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

  async updateCentroMedico(centroMedico) {
    try {
        const updatedCentroMedico = await this.centroMedicoService.updateCentroMedico(centroMedico);
        return updatedCentroMedico;
    } catch (error) {
        console.error('Error al actualizar el centro médico:', error);
        throw error;
    }
  }
}

module.exports = CentroMedicoViewModel;