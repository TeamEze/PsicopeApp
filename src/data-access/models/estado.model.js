import { DataTypes} from "sequelize";
import sequelize from "../database.js";

// Definición del modelo "Usuario"
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
    sequelize,
  });

await sequelize.sync();  // Crea la tabla si no existe

export default Estado;