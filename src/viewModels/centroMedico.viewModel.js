class CentroMedicoViewModel {

  constructor(centroMedicoService, localidadService) {
    this.centroMedicoService = centroMedicoService;
    this.localidadService = localidadService;
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

  async getPaginatedActiveCentrosMedicos(page, pageSize) {
    try {
        const listaCentrosMedicos = await this.centroMedicoService.getPaginatedActiveCentrosMedicos(page, pageSize);
        return listaCentrosMedicos;
    } catch (error) {
        console.error('Error al obtener los centros médicos:', error);
        throw error;
    }
  }

  async getPaginatedFilteredCentrosMedicos(filters, page, pageSize) {
    try {
        const listaCentrosMedicos = await this.centroMedicoService.getPaginatedFilteredCentrosMedicos(filters, page, pageSize);
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

  async updateEstadoCentroMedico(idCentroMedico, nuevoEstado) {
    try {
        await this.centroMedicoService.updateEstadoCentroMedico(idCentroMedico, nuevoEstado);
    } catch (error) {
        console.error('Error al actualizar el estado del centro médico:', error);
        throw error;
    }
  }

  async getAllLocalidades(){
    try {
      return await this.localidadService.getAllLocalidades();
    } 
    catch (error) {
      console.error('Error al obtener las localidades', error);
      throw error;
    }
  }
}

module.exports = CentroMedicoViewModel;