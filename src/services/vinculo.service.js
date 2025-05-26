class VinculoService{
    constructor(vinculoRepository) {
        this.vinculoRepository = vinculoRepository;
    }

    async getAllVinculos(){
        const vinculos = await this.vinculoRepository.getAllVinculos();
        return vinculos.map(vinculo => vinculo.get({ plain: true })); // <- importante
    }
}

module.exports = VinculoService;