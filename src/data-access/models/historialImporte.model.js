const CentroMedico = require('./centroMedico.model.js');
const TipoDescuento = require('./tipoDescuento.model.js');
const Estado = require('./estado.model.js');
const DataTypes = require('sequelize');
const sequelize = require('../databaseConnection.js');


const HistorialImporte = sequelize.define('HistorialImporte', {
    idHistorialImporte: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    sesionTratamiento: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    sesionEvaluacion: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    vigenciaDesde: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    vigenciaHasta: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, 
{
    modelName: 'HistorialImporte',
    tableName: 'HistorialImporte',
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaModificacion',
    sequelize
});

HistorialImporte.belongsTo(CentroMedico, {foreignKey: 'idCentroMedico', as: 'centroMedico'});
HistorialImporte.belongsTo(TipoDescuento, {foreignKey: 'idTipoDescuento', as: 'tipoDescuento'});
HistorialImporte.belongsTo(Estado, {foreignKey: 'idEstado', as: 'estado'});

