//const mapper = require('../../config/automapper.js');
const { createMap, forMember, mapFrom } = require('@automapper/core');
const mapper = require('../../config/automapper.js');
const HistorialImporte = require('../data-access/models/historialImporte.model.js');
const HistorialImporteDTO = require('../DTOs/historialImporteDTO.js');


// Crear el mapeo de HistorialImporte a HistorialImporteDTO
createMap(mapper, HistorialImporte, HistorialImporteDTO,
  forMember((dest) => dest.idHistorialImporte, mapFrom((src) => src.idHistorialImporte)),
  forMember((dest) => dest.centroMedico, mapFrom((src) => src.centroMedico.nombre)),
  forMember((dest) => dest.tipoDescuento, mapFrom((src) => src.tipoDescuento.descripcion)),
  forMember((dest) => dest.valor, mapFrom((src) => src.valor)),
  forMember((dest) => dest.importeSesionEvaluacion, mapFrom((src) => src.importeSesionEvaluacion)),
  forMember((dest) => dest.importeSesionTratamiento, mapFrom((src) => src.importeSesionTratamiento)),
  forMember((dest) => dest.vigenciaDesde, mapFrom((src) => src.vigenciaDesde)),
  forMember((dest) => dest.vigenciaHasta, mapFrom((src) => src.vigenciaHasta)),
  forMember((dest) => dest.estado, mapFrom((src) => src.estado.descripcion))
);

class HistorialImporteMapper {
    static mapHistorialImporteToDTO(historialImporte) {
      return mapper.map(historialImporte, HistorialImporte, HistorialImporteDTO);
    }
  }
  
module.exports = HistorialImporteMapper;