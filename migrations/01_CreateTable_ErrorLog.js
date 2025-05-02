module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('ErrorLog', {
        idError: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        message: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        parameters: {
          type: Sequelize.STRING(1024),
          allowNull: true,
        },
        stack: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        source: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      });
    },
  
    down: async (queryInterface) => {
      await queryInterface.dropTable('ErrorLog');
    },
  };