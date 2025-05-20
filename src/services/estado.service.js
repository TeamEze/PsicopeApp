class EstadoService{
    constructor(estadoRepository) {
        this.estadoRepository = estadoRepository;
    }

    async getAllEstados(){
        const estados = await this.estadoRepository.getAllEstados();
        return estados;
    }
}

module.exports = EstadoService;