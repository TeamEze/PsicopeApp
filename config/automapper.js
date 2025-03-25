const { createMapper } = require('@automapper/core');
const { classes } = require('@automapper/classes');

// Crear una instancia global del mapper
const mapper = createMapper({
  strategyInitializer: classes()
});

module.exports = mapper; 
