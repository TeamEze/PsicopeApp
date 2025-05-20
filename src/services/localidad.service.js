class LocalidadService{
    constructor(localidadRepository) {
        this.localidadRepository = localidadRepository;
    }

    async getAllLocalidades(){
        const localidades = await this.localidadRepository.getAllLocalidades();
        return localidades; // <- importante
    }
}

module.exports = LocalidadService;