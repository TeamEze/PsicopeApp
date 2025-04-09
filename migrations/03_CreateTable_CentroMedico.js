module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('CentroMedico', {
            idCentroMedico: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nombre: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            direccion: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            idLocalidad: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Localidad',  
                    key: 'idLocalidad',      
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            telefono: {
                type: Sequelize.STRING(10),
                allowNull: false
            },
            personaContacto: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            duracionSesion: {
                type: Sequelize.INTEGER,
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
            fechaCreacion: {
                type: Sequelize.DATE,
                allowNull: false
            },
            fechaModificacion: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        // Índice 1: idEstado + nombre
        await queryInterface.addIndex('CentroMedico', ['idEstado', 'nombre'], {
            name: 'idx_estado_nombre'
        });

        await queryInterface.addIndex('CentroMedico', ['idLocalidad', 'idEstado', 'nombre'], {
            name: 'idx_localidad_estado_nombre'
          });
    },
  
    down: async (queryInterface) => {
        await queryInterface.removeIndex('CentroMedico', 'idx_localidad_estado_nombre');
        await queryInterface.removeIndex('CentroMedico', 'idx_estado_nombre');
        await queryInterface.dropTable('CentroMedico');
    }
  };