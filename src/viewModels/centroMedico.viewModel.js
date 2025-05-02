const { json } = require("sequelize");

class CentroMedicoViewModel {

  constructor(centroMedicoService, localidadService, errorLogService) {
    this.centroMedicoService = centroMedicoService;
    this.localidadService = localidadService;
    this.errorLogService = errorLogService;
  }

  async getCentroMedicoById(idCentroMedico) { 
    try {
      const centroMedico = await this.centroMedicoService.getCentroMedicoById(idCentroMedico);
      return {ok: true, data: centroMedico.toJSON()};
    }
    catch (error) { 
      await this.errorLogService.handleError(
        error.message,
        json.stringify({idCentroMedico}),
        error.stack,
        'CentroMedicoViewModel.getCentroMedicoById'
      );
      return {ok: false};
    }
  }

  async getPaginatedActiveCentrosMedicos(page, pageSize) {
    try {
      const listaCentrosMedicos = await this.centroMedicoService.getPaginatedActiveCentrosMedicos(page, pageSize);
      return {ok: true, data: listaCentrosMedicos};
    } 
    catch (error) {
      await this.errorLogService.handleError(
        error.message,
        json.stringify({page, pageSize}),
        error.stack,
        'CentroMedicoViewModel.getPaginatedActiveCentrosMedicos'
      );
      return {ok: false};
    }
  }

  async getPaginatedFilteredCentrosMedicos(filters, page, pageSize) {
    try {
      const listaCentrosMedicos = await this.centroMedicoService.getPaginatedFilteredCentrosMedicos(filters, page, pageSize);
      return {ok: true, data: listaCentrosMedicos};
    } 
    catch (error) {
      await this.errorLogService.handleError(
        error.message,
        json.stringify({filters, page, pageSize}),
        error.stack,
        'CentroMedicoViewModel.getPaginatedFilteredCentrosMedicos'
      );
      return {ok: false};
    }
  }

  async createCentroMedico(centroMedico) {
    try {
      const newCentroMedico = await this.centroMedicoService.createCentroMedico(centroMedico);
      return {ok: true, data: newCentroMedico};
    } 
    catch (error) {
      await this.errorLogService.handleError(
        error.message,
        JSON.stringify(centroMedico),
        error.stack,
        'CentroMedicoViewModel.createCentroMedico'
      );
      return {ok: false};
    }
  }

  async updateCentroMedico(centroMedico) {
        
    try {
      const updatedCentroMedico = await this.centroMedicoService.updateCentroMedico(centroMedico);
      return {ok: true, data: updatedCentroMedico};
    } 
    catch (error) {
      await this.errorLogService.handleError(
        error.message,
        JSON.stringify(centroMedico),
        error.stack,
        'CentroMedicoViewModel.updateCentroMedico'
      );
      return {ok: false};
    }
  }

  async updateEstadoCentroMedico(idCentroMedico, nuevoEstado) {
    try {
      await this.centroMedicoService.updateEstadoCentroMedico(idCentroMedico, nuevoEstado);
      return {ok: true};
    } 
    catch (error) {
      await this.errorLogService.handleError(
        error.message,
        JSON.stringify({idCentroMedico, nuevoEstado}),
        error.stack,
        'CentroMedicoViewModel.updateEstadoCentroMedico'
      );
      return {ok: false};
    }
  }

  async getAllLocalidades(){
    try {
      const localidades = await this.localidadService.getAllLocalidades();
      return {ok: true, data: localidades};
    } 
    catch (error) {
      await this.errorLogService.handleError(
        error.message,
        null,
        error.stack,
        'CentroMedicoViewModel.getAllLocalidades'
      );
      return {ok: false};
    }
  }
}

module.exports = CentroMedicoViewModel;