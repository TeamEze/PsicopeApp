import { DataTypes} from "sequelize";
import sequelize from "../database.js";

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

await sequelize.sync();  // Crea la tabla si no existe

export default Localidad;