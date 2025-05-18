module.exports = {
  up: async (QueryInterface, Sequelize) => {
    await QueryInterface.createTable("Vinculo", {
      idVinculo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      descripcion: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    });
  },
  down: async (QueryInterface) => {
    await QueryInterface.dropTable("Vinculo");
  },
};
