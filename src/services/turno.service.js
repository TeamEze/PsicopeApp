class TurnoService{
    constructor(turnoRepository) {
        this.turnoRepository = turnoRepository;
    }

    async getAllTurnos(){
        const turnos = await this.turnoRepository.getAllTurnos();
        return turnos.map(turno => turno.get({ plain: true })); // <- importante
    }
}

module.exports = TurnoService;