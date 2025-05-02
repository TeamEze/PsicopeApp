/* const LocalidadService = require('../../src/services/localidad.service.js');
const localidadRepository = require('../../src/data-access/repository/localidad.repository.js');

jest.mock('../../src/data-access/repository/localidad.repository.js');

describe('CentroMedicoService', () => {
    let localidadService;
    beforeEach(() => {
    
        /// Crear mocks para las dependencias
        localidadRepository.getAllLocalidades = jest.fn();
    
        // Crear una instancia del servicio con las dependencias mockeadas
        localidadService = new LocalidadService(localidadRepository);
    
    });

    it('Retorna una lista de todas las localidades', async () => {
        // Datos simulados devueltos por el repositorio
        const mockData = [
          {
            idLocalidad: 1,
            descripcion: 'Castelar'
          },
          {
            idLocalidad: 2,
            descripcion: 'Morón'
          }
        ];

        // Configurar el mock del repositorio
        localidadRepository.getAllLocalidades.mockResolvedValue(mockData);
    
        // Llamar al servicio
        const result = await localidadService.getAllLocalidades();
    
        // Verificar que el resultado coincide con los datos esperados
        expect(result).toEqual(mockData);
    
      });
}); */