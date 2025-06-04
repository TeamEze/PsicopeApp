module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('HistorialImporte', {
            idHistorialImporte: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            idCentroMedico: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'CentroMedico',  
                    key: 'idCentroMedico',      
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            idTipoDescuento: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'TipoDescuento',  
                    key: 'idTipoDescuento',
                },
                onUpdate: 'CASCADE',    
                onDelete: 'CASCADE',
            },
            valor: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            importeSesionEvaluacion: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            importeSesionTratamiento: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            vigenciaDesde: {
                type: Sequelize.DATE,   
                allowNull: false
            },
            vigenciaHasta: {
                type: Sequelize.DATE,
                allowNull: true
            },
            fechaCreacion: {
                type: Sequelize.DATE,
                allowNull: false
            },
            fechaModificacion: {
                type: Sequelize.DATE,
                allowNull: false
            },
            idEstado: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Estado',  
                    key: 'idEstado',
                },  
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
        });
    },
  
    down: async (queryInterface) => {
        await queryInterface.dropTable('HistorialImporte');
    }
  };