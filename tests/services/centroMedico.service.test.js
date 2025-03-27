const CentroMedicoService = require('../../src/services/centroMedico.service.js');
const centroMedicoRepository = require('../../src/data-access/repository/centroMedico.repository.js');
const CentroMedicoMapper = require('../../src/mappers/centroMedicoMapper.js');
jest.mock('../../src/data-access/repository/centroMedico.repository.js');
jest.mock('../../src/mappers/centroMedicoMapper.js');

describe('CentroMedicoService', () => {
  
  let centroMedicoService;
  
  beforeEach(() => {
    
    /// Crear mocks para las dependencias
    centroMedicoRepository.getAllCentrosMedicos = jest.fn();
    centroMedicoRepository.getCentrosMedicosByFilters = jest.fn();
    centroMedicoRepository.createCentroMedico = jest.fn();
    centroMedicoRepository.getCentroMedicoById = jest.fn();
    CentroMedicoMapper.mapCentroMedicoToDTO = jest.fn();

    // Crear una instancia del servicio con las dependencias mockeadas
    centroMedicoService = new CentroMedicoService(centroMedicoRepository, CentroMedicoMapper);

  });

  it('should return a list of CentroMedicoDTOs', async () => {
    // Datos simulados devueltos por el repositorio
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

    // Datos esperados después del mapeo
    const mockDTO = [
      {
        idCentroMedico: 1,
        nombre: 'Centro 1',
        localidad: 'Localidad 1',
        estado: 'Activo'
      }
    ];

    // Configurar el mock del repositorio
    centroMedicoRepository.getAllCentrosMedicos.mockResolvedValue(mockData);

    // Configurar el mock del mapper
    CentroMedicoMapper.mapCentroMedicoToDTO.mockImplementation(centroMedico => ({
      idCentroMedico: centroMedico.idCentroMedico,
      nombre: centroMedico.nombre,
      localidad: centroMedico.localidad.descripcion,
      estado: centroMedico.estado.descripcion
    }));

    // Llamar al servicio
    const result = await centroMedicoService.getAllCentrosMedicos();

    // Verificar que el resultado coincide con los datos esperados
    expect(result).toEqual(mockDTO);

    // Verificar que el mapper fue llamado una vez por cada elemento en los datos simulados
    expect(CentroMedicoMapper.mapCentroMedicoToDTO).toHaveBeenCalledTimes(mockData.length);
  });

  it('should return filtered CentroMedicoDTOs', async () => {
    // Filtros de búsqueda
    const filters = { idLocalidad: 1, nombre: 'Centro 1' };

    // Datos simulados devueltos por el repositorio
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

    // Datos esperados después del mapeo
    const mockDTO = [
      {
        idCentroMedico: 1,
        nombre: 'Centro 1',
        localidad: 'Localidad 1',
        estado: 'Activo'
      }
    ];

    // Configurar el mock del repositorio
    centroMedicoRepository.getCentrosMedicosByFilters.mockResolvedValue(mockData);

    // Configurar el mock del mapper
    CentroMedicoMapper.mapCentroMedicoToDTO.mockImplementation(centroMedico => ({
      idCentroMedico: centroMedico.idCentroMedico,
      nombre: centroMedico.nombre,
      localidad: centroMedico.localidad.descripcion,
      estado: centroMedico.estado.descripcion
    }));

    // Llamar al servicio con los filtros
    const result = await centroMedicoService.getCentrosMedicosByFilters(filters);

    // Verificar que el resultado coincide con los datos esperados
    expect(result).toEqual(mockDTO);
    // Verificar que el mapper fue llamado una vez por cada elemento en los datos simulados
    expect(CentroMedicoMapper.mapCentroMedicoToDTO).toHaveBeenCalledTimes(mockData.length);
  });

  it('should return filtered CentroMedicoDTOs only by IdLocalidad', async () => {
    // Filtros de búsqueda
    const filters = { idLocalidad: 1, nombre: '' };

    // Datos simulados devueltos por el repositorio
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

    // Datos esperados después del mapeo
    const mockDTO = [
      {
        idCentroMedico: 1,
        nombre: 'Centro 1',
        localidad: 'Localidad 1',
        estado: 'Activo'
      }
    ];

    // Configurar el mock del repositorio
    centroMedicoRepository.getCentrosMedicosByFilters.mockResolvedValue(mockData);

    // Configurar el mock del mapper
    CentroMedicoMapper.mapCentroMedicoToDTO.mockImplementation(centroMedico => ({
      idCentroMedico: centroMedico.idCentroMedico,
      nombre: centroMedico.nombre,
      localidad: centroMedico.localidad.descripcion,
      estado: centroMedico.estado.descripcion
    }));

    // Llamar al servicio con los filtros
    const result = await centroMedicoService.getCentrosMedicosByFilters(filters);

    // Verificar que el resultado coincide con los datos esperados
    expect(result).toEqual(mockDTO);

    // Verificar que el mapper fue llamado una vez por cada elemento en los datos simulados
    expect(CentroMedicoMapper.mapCentroMedicoToDTO).toHaveBeenCalledTimes(mockData.length);
  });

  it('should return list of CentroMedicoDTOs without filters', async () => {
    // Filtros de búsqueda
    const filters = {idLocalidad: null, nombre: ''};

    // Datos simulados devueltos por el repositorio
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
      },
      {
        idCentroMedico: 2,
        nombre: 'Centro 2',
        direccion: 'Calle 123',
        localidad: { descripcion: 'Localidad 2' },
        telefono: '123456789',
        personaContacto: 'Persona 2',
        email: 'email@centro2.com',
        duracionSesion: 60,
        estado: { descripcion: 'Activo' }
      }
    ];

    // Datos esperados después del mapeo
    const mockDTO = [
      {
        idCentroMedico: 1,
        nombre: 'Centro 1',
        localidad: 'Localidad 1',
        estado: 'Activo'
      },
      {
        idCentroMedico: 2,
        nombre: 'Centro 2',
        localidad: 'Localidad 2',
        estado: 'Activo'
      }
    ];

    // Configurar el mock del repositorio
    centroMedicoRepository.getAllCentrosMedicos.mockResolvedValue(mockData);

    // Configurar el mock del mapper
    CentroMedicoMapper.mapCentroMedicoToDTO.mockImplementation(centroMedico => ({
      idCentroMedico: centroMedico.idCentroMedico,
      nombre: centroMedico.nombre,
      localidad: centroMedico.localidad.descripcion,
      estado: centroMedico.estado.descripcion
    }));

    // Llamar al servicio con los filtros
    const result = await centroMedicoService.getCentrosMedicosByFilters(filters);

    // Verificar que el resultado coincide con los datos esperados
    expect(result).toEqual(mockDTO);

    // Verificar que el mapper fue llamado una vez por cada elemento en los datos simulados
    expect(CentroMedicoMapper.mapCentroMedicoToDTO).toHaveBeenCalledTimes(mockData.length);
  });

  it('should create a CentroMedico and return the DTO', async () => {
    // Datos de entrada para crear un centro médico
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

    // Datos simulados devueltos por el repositorio al crear el centro médico
    const mockCreatedData = {
      idCentroMedico: 2,
      ...inputData
    };

    // Datos simulados devueltos por el repositorio al obtener el centro médico por ID
    const mockGetDataById = {
      idCentroMedico: 2,
      ...inputData,
      localidad: { descripcion: 'Localidad 2' },
      estado: { descripcion: 'Activo' }
    };

    // Datos esperados después del mapeo
    const mockDTO = {
      idCentroMedico: 2,
      nombre: 'Centro 2',
      localidad: 'Localidad 2',
      estado: 'Activo'
    };

    // Configurar el mock del repositorio para crear el centro médico
    centroMedicoRepository.createCentroMedico.mockResolvedValue(mockCreatedData);

    // Configurar el mock del repositorio para obtener el centro médico por ID
    centroMedicoRepository.getCentroMedicoById.mockResolvedValue(mockGetDataById);

    // Configurar el mock del mapper
    CentroMedicoMapper.mapCentroMedicoToDTO.mockImplementation(centroMedico => ({
      idCentroMedico: centroMedico.idCentroMedico,
      nombre: centroMedico.nombre,
      localidad: centroMedico.localidad.descripcion,
      estado: centroMedico.estado.descripcion
    }));

    // Llamar al servicio para crear el centro médico
    const result = await centroMedicoService.createCentroMedico(inputData);

    // Verificar que el repositorio fue llamado con los datos de entrada correctos
    expect(centroMedicoRepository.createCentroMedico).toHaveBeenCalledWith(inputData);

    // Verificar que el repositorio fue llamado para obtener el centro médico por ID
    expect(centroMedicoRepository.getCentroMedicoById).toHaveBeenCalledWith(mockCreatedData.idCentroMedico);

    // Verificar que el resultado coincide con los datos esperados
    expect(result).toEqual(mockDTO);
  });
});