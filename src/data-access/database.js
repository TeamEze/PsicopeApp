import { Sequelize } from 'sequelize';

// Conexión a MySQL con Sequelize
const sequelize = new Sequelize('psicopebd', 'egomez', 'pass2025', {
    host: 'localhost',
    dialect: 'mysql'
  });

export default sequelize;
