const centroMedicoService = require('../../src/services/centroMedico.service.js');
const centroMedicoRepository = require('../../src/data-access/repository/centroMedico.repository.js');
jest.mock('../../src/data-access/repository/centroMedico.repository.js');

describe('CentroMedicoService', () => {
  it('should return a list of CentroMedicoDTOs', async () => {
    // Mock data
    const mockData = [
      {
        idCentroMedico: 1,
        nombre: 'Centro 1',
        direccion: 'Calle 123',
        localidad: { descripcion: 'Localidad 1' },
        telefono: '123456789',
        personaContacto: 'Persona 1',
        email: 'email@centro1.com',
        duracionSesion: 60,
        estado: { descripcion: 'Activo' }
      }
    ];
    centroMedicoRepository.getAllCentrosMedicos.mockResolvedValue(mockData);

    // Call the service
    const result = await centroMedicoService.getAllCentrosMedicos();

    // Assertions
    expect(result).toHaveLength(1);
    expect(result[0].nombre).toBe('Centro 1');
    expect(result[0].localidad).toBe('Localidad 1');
    expect(result[0].estado).toBe('Activo');
  });

  it('should create a CentroMedico and return the DTO', async () => {
    // Mock input data
    const inputData = {
      nombre: 'Centro 2',
      direccion: 'Calle 456',
      idLocalidad: 2,
      telefono: '987654321',
      personaContacto: 'Persona 2',
      email: 'email@centro2.com',
      duracionSesion: 45,
      idEstado: 1
    };

    // Mock output data from the repository
    const mockCreatedData = {
      idCentroMedico: 2,
      ...inputData,
      //localidad: { descripcion: 'Localidad 2' },
      //estado: { descripcion: 'Activo' }
    };

    const mockGetDataById = {
        idCentroMedico: 2,
        ...inputData,
        localidad: { descripcion: 'Localidad 2' },
        estado: { descripcion: 'Activo' }
      };
    centroMedicoRepository.createCentroMedico.mockResolvedValue(mockCreatedData);
    centroMedicoRepository.getCentroMedicoById.mockResolvedValue(mockGetDataById);
    // Call the service
    const result = await centroMedicoService.createCentroMedico(inputData);

    // Assertions
    expect(centroMedicoRepository.createCentroMedico).toHaveBeenCalledWith(inputData);
    expect(result.idCentroMedico).toBe(2);
    expect(result.nombre).toBe('Centro 2');
    //expect(result.localidad).toBe('Localidad 2');
    //expect(result.estado).toBe('Activo');
  });
});