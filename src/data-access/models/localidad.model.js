const DataTypes = require('sequelize');
const sequelize = require('../databaseConnection.js');

// Definición del modelo "Usuario"
const Localidad = sequelize.define('Localidad', {
    idLocalidad: {
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
    modelName: 'Localidad',
    tableName: 'Localidad',
    timestamps: false,
    sequelize,
  });
  
  module.exports = Localidad;