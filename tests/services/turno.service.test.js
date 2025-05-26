const TurnoService = require('../../src/services/turno.service.js');
const turnoRepository = require('../../src/data-access/repository/turno.repository.js');

jest.mock('../../src/data-access/repository/turno.repository.js');

describe('TurnoService', () => {
  let turnoService;

  beforeEach(() => {
    // Crear mock de la función del repositorio
    turnoRepository.getAllTurnos = jest.fn();

    // Crear instancia del servicio con el repositorio simulado
    turnoService = new TurnoService(turnoRepository);
  });

  it('debe retornar una lista de turnos como objetos planos', async () => {
    // Simulamos que el repositorio devuelve objetos Sequelize con get()
    const mockTurnos = [
      { get: () => ({ id: 1, descripcion: 'mañana' }) },
      { get: () => ({ id: 2, descripcion: 'tarde' }) }
    ];

    turnoRepository.getAllTurnos.mockResolvedValue(mockTurnos);

    const result = await turnoService.getAllTurnos();

    expect(result).toEqual([
      { id: 1, descripcion: 'mañana' },
      { id: 2, descripcion: 'tarde' }
    ]);

    expect(turnoRepository.getAllTurnos).toHaveBeenCalled();
  });
});

