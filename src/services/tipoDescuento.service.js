class TipoDescuentoService{
    constructor(tipoDescuentoRepository) {
        this.tipoDescuentoRepository = tipoDescuentoRepository;
    }

    async getAllTiposDescuento(){
        const tiposDescuento = await this.tipoDescuentoRepository.getAllTiposDescuento();
        return tiposDescuento;
    }
}

module.exports = TipoDescuentoService;