const Sequelize = require('sequelize');
require('dotenv').config();

//Conexión principal a la BD de la aplication
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
});

// Crear la BD si no existe
/*async function createDatabaseIfNotExists() {
  const tempSequelize = new Sequelize('', config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
  });

  try {
    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
    console.log(`Base de datos '${config.database}' creada/verificada.`);
  } finally {
    await tempSequelize.close();
  }
}*/


module.exports = sequelize;
