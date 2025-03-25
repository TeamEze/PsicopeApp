const CentroMedicoMapper = require('../../src/mappers/centroMedicoMapper.js');

describe('CentroMedicoMapper', () => {
  it('should map CentroMedico to CentroMedicoDTO', () => {
    // Mock data
    const mockCentroMedico = {
      idCentroMedico: 1,
      nombre: 'Centro 1',
      direccion: 'Calle 123',
      localidad: { descripcion: 'Localidad 1' },
      telefono: '123456789',
      personaContacto: 'Persona 1',
      email: 'email@centro1.com',
      duracionSesion: 60,
      estado: { descripcion: 'Activo' }
    };

    // Call the mapper
    const result = CentroMedicoMapper.mapCentroMedicoToDTO(mockCentroMedico);

    // Assertions
    expect(result.idCentroMedico).toBe(1);
    expect(result.nombre).toBe('Centro 1');
    expect(result.localidad).toBe('Localidad 1');
    expect(result.estado).toBe('Activo');
  });
});