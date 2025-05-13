const DataTypes = require('sequelize');
const sequelize = require('../databaseConnection.js');

// Definición del modelo "Usuario"
const TipoDescuento = sequelize.define('TipoDescuento', {
    idTipoDescuento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, 
  {
    modelName: 'TipoDescuento',
    tableName: 'TipoDescuento',
    timestamps: false,
    sequelize,
  });
  
  module.exports = TipoDescuento;