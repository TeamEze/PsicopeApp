const DataTypes = require('sequelize');
const sequelize = require('../databaseConnection.js');

// Definición del modelo "Vinculo"
const Vinculo = sequelize.define('Vinculo', {
    idVinculo: {
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
    modelName: 'Vinculo',
    tableName: 'Vinculo',
    timestamps: false,
    sequelize
  });

  module.exports = Vinculo;