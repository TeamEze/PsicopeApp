import { DataTypes, Model } from "sequelize";
import sequelize from "../database.js";

// Definición del modelo "Usuario"
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
      allowNull: false,
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
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fechaModificacion: {
        type: DataTypes.DATE,
        allowNull: false
    }
  }, 
  {
    modelName: 'CentroMedico',
    tableName: 'CentroMedico',
    sequelize,
  });

await sequelize.sync();  // Crea la tabla si no existe

export default CentroMedico;
