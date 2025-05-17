class HistorialImporteService {
  constructor(historialImporteRepository, historialImporteMapper) {
    this.historialImporteRepository = historialImporteRepository;
    this.historialImporteMapper = historialImporteMapper;
  }

  async getPaginatedHistorialImportes(page, pageSize) {
    const offset = (page - 1) * pageSize;
    const ids = await this.historialImporteRepository.getPaginatedHistorialImporteIds(offset, pageSize);
    if (ids.length === 0) {
      return {
        data: [],
        totalRecords: 0,
        totalPages: 0,
        currentPage: page
      };
    }
    const historialImportes = await this.historialImporteRepository.getHistorialImporteByIds(ids);
    const totalCount = await this.historialImporteRepository.getTotalHistorialImporte();
    const historialImportesDTO = historialImportes.map(historialImporte =>
      this.historialImporteMapper.mapHistorialImporteToDTO(historialImporte)); 
    return {
      data: historialImportesDTO,
      totalRecords: totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page
    };
  }
}

module.exports = HistorialImporteService;