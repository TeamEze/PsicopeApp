const DataTypes = require('sequelize');
const Localidad = require('./localidad.model.js');
const Estado = require('./estado.model.js');
const sequelize = require('../databaseConnection.js');

const CentroMedico = sequelize.define('CentroMedico', {
    idCentroMedico: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    personaContacto: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    duracionSesion: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, 
  {
    modelName: 'CentroMedico',
    tableName: 'CentroMedico',
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaModificacion',
    sequelize
  });

  CentroMedico.belongsTo(Localidad, { foreignKey: 'idLocalidad', as: 'localidad'});
  CentroMedico.belongsTo(Estado, {foreignKey: 'idEstado', as: 'estado'});

  module.exports = CentroMedico;