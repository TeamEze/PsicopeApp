class TipoDescuentoService{
    constructor(tipoDescuentoRepository) {
        this.tipoDescuentoRepository = tipoDescuentoRepository;
    }

    async getAllTiposDescuento(){
        const tiposDescuento = await this.tipoDescuentoRepository.getAllTiposDescuento();
        return tiposDescuento.map(tipoDescuento => tipoDescuento.get({ plain: true }));
    }
}

module.exports = TipoDescuentoService;