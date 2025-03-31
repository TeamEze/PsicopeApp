//const mapper = require('../../config/automapper.js');
const { createMap, forMember, mapFrom } = require('@automapper/core');
const mapper = require('../../config/automapper.js');
const CentroMedico = require('../data-access/models/centroMedico.model.js');
const CentroMedicoDTO = require('../DTOs/centroMedicoDTO.js');


// Crear el mapeo de CentroMedico a CentroMedicoDTO
createMap(mapper, CentroMedico, CentroMedicoDTO,
  forMember((dest) => dest.idCentroMedico, mapFrom((src) => src.idCentroMedico)),
  forMember((dest) => dest.nombre, mapFrom((src) => src.nombre)),
  forMember((dest) => dest.direccion, mapFrom((src) => src.direccion)),
  forMember((dest) => dest.localidad, mapFrom((src) => src.localidad.descripcion)),
  forMember((dest) => dest.telefono, mapFrom((src) => src.telefono)),
  forMember((dest) => dest.personaContacto, mapFrom((src) => src.personaContacto)),
  forMember((dest) => dest.email, mapFrom((src) => src.email)),
  forMember((dest) => dest.duracionSesion, mapFrom((src) => src.duracionSesion)),
  forMember((dest) => dest.estado, mapFrom((src) => src.estado.descripcion))
);

class CentroMedicoMapper {
    static mapCentroMedicoToDTO(centroMedico) {
      return mapper.map(centroMedico, CentroMedico, CentroMedicoDTO);
    }
  }
  
module.exports = CentroMedicoMapper;