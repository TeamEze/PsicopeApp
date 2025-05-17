class EstadoService{
    constructor(estadoRepository) {
        this.estadoRepository = estadoRepository;
    }

    async getAllEstados(){
        const estados = await this.estadoRepository.getAllEstados();
        return estados.map(estado => estado.get({ plain: true })); // <- importante
    }
}

module.exports = EstadoService;