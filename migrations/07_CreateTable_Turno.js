module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Turno", {
      idTurno: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      descripcion: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Turno");
  },
};
