const DataTypes = require('sequelize');
const sequelize = require('../databaseConnection.js');

// Definición del modelo "Estado"
const Estado = sequelize.define('Estado', {
    idEstado: {
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
    modelName: 'Estado',
    tableName: 'Estado',
    timestamps: false,
    sequelize
  });

  module.exports = Estado;