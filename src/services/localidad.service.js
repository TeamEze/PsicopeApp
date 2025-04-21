class LocalidadService{
    constructor(localidadRepository) {
        this.localidadRepository = localidadRepository;
    }

    async getAllLocalidades(){
        const localidades = await this.localidadRepository.getAllLocalidades();
        return localidades.map(localidad => localidad.get({ plain: true })); // <- importante
    }
}

module.exports = LocalidadService;