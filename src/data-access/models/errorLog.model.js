const { DataTypes } = require('sequelize');
const sequelize = require('../databaseConnection.js');

const ErrorLog = sequelize.define('ErrorLog', {
  idError: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  message: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  parameters:{
    type: DataTypes.STRING(1024),
    allowNull: true,
  },
  stack: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  source: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
},
{
  timestamps: true,            
  updatedAt: false, 
  tableName: 'ErrorLog',
});

module.exports = ErrorLog;