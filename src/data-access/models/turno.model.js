const DataTypes = require('sequelize');
const sequelize = require('../databaseConnection.js');

// Definición del modelo "Turno"
const Turno = sequelize.define('Turno', {
    idTurno: {
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
    modelName: 'Turno',
    tableName: 'Turno',
    timestamps: false,
    sequelize
  });

  module.exports = Turno;