const HistorialImporteService = require('../../src/services/historialImporte.service.js');
const historialImporteRepository = require('../../src/data-access/repository/historialImporte.repository.js');
const historialImporteMapper = require('../../src/mappers/historialImporteMapper.js');

describe('HistorialImporteService', () => {
    let historialImporteService;
    
    beforeEach(() => {
        // Crear mocks para las dependencias
        historialImporteRepository.getTotalActiveHistorialImporteByCentroMedicoId = jest.fn();
        historialImporteMapper.mapHistorialImporteToDTO = jest.fn();
    
        // Crear una instancia del servicio con las dependencias mockeadas
        historialImporteService = new HistorialImporteService(historialImporteRepository, historialImporteMapper);
    });

    it('Retorna un único historial de importes activo dado un centro médico', async () => {
        // Datos simulados devueltos por el repositorio
        const mockData = [
            {
                total: 1
            },            
        ];

        // Configurar el mock del repositorio
        historialImporteRepository.getTotalActiveHistorialImporteByCentroMedicoId.mockResolvedValue(mockData);
    
        // Llamar al servicio
        const result = await historialImporteService.getTotalActiveHistorialImporteByCentroMedicoId(1);
    
        // Verificar que el resultado coincide con los datos esperados
        expect(result).toEqual(mockData);
    
    });
});
