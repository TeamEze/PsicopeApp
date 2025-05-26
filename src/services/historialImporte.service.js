const { Op } = require('sequelize');
class HistorialImporteService {
  constructor(historialImporteRepository, historialImporteMapper) {
    this.historialImporteRepository = historialImporteRepository;
    this.historialImporteMapper = historialImporteMapper;
  }

  async getPaginatedHistorialImportes(page, pageSize, filters) {

    let dataToFilter = {
      ...(filters.idCentroMedico && { idCentroMedico: filters.idCentroMedico }),
      ...(filters.idEstado && { idEstado: filters.idEstado }),
      ...(filters.idTipoDescuento && { idTipoDescuento: filters.idTipoDescuento }),
      ...(filters.fechaVigenciaDesde && { vigenciaDesde: {[Op.gte]: filters.fechaVigenciaDesde} }),
      ...(filters.fechaVigenciaHasta && { vigenciaHasta: {[Op.lte]: filters.fechaVigenciaHasta} })
    };

    const offset = (page - 1) * pageSize;
    const ids = await this.historialImporteRepository.getPaginatedHistorialImporteIds(offset, pageSize, dataToFilter);
    if (ids.length === 0) {
      return {
        data: [],
        totalRecords: 0,
        totalPages: 0,
        currentPage: page
      };
    }
    const historialImportes = await this.historialImporteRepository.getHistorialImporteByIds(ids);
    const totalCount = await this.historialImporteRepository.getTotalHistorialImporte(dataToFilter);
    const historialImportesDTO = historialImportes.map(historialImporte =>
      this.historialImporteMapper.mapHistorialImporteToDTO(historialImporte)); 
    return {
      data: historialImportesDTO,
      totalRecords: totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page
    };
  }

  async getTotalActiveHistorialImporteByCentroMedicoId(idCentroMedico) {
    const totalCount = await this.historialImporteRepository.getTotalActiveHistorialImporteByCentroMedicoId(idCentroMedico);
    return totalCount;
  }


  async createHistorialImporte(historialImporte) {
    const nuevoHistorialImporte = await this.historialImporteRepository.createHistorialImporte(historialImporte);
    const historialImporteConIncludes = await this.historialImporteRepository.getHistorialImporteByIdWithIncludes(nuevoHistorialImporte.idHistorialImporte);
    return this.historialImporteMapper.mapHistorialImporteToDTO(historialImporteConIncludes);
  } 

  async getDefaultTipoDescuentoNewHistorialImporte(idCentroMedico) {
    const defaultTipoDescuento = await this.historialImporteRepository.getDefaultTipoDescuentoNewHistorialImporte(idCentroMedico);
    return defaultTipoDescuento;
  }
}

module.exports = HistorialImporteService;