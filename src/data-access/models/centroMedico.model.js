import { DataTypes, Model } from "sequelize";
import Localidad from "./localidad.model.js"  // Importa el modelo padre
import Estado from "./estado.model.js"
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
      allowNull: false
    },
    idLocalidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Localidad, // Nombre de la tabla (o el modelo si se asocia después)
        key: 'idLocalidad'
      }
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
    idEstado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Estado, // Nombre de la tabla (o el modelo si se asocia después)
        key: 'idEstado'
      }
    }
  }, 
  {
    modelName: 'CentroMedico',
    tableName: 'CentroMedico',
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaModificacion',
    sequelize
  });

await sequelize.sync();  // Crea la tabla si no existe

export default CentroMedico;
