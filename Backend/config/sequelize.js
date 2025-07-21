const { Sequelize } = require('sequelize');

// Conexión manual (modifica según tus datos)
const sequelize = new Sequelize(
  'ecommerce_ropa', // Nombre de la base de datos
  'postgres',          // Usuario de PostgreSQL
  'samurai202',       // Contraseña del usuario
  {
    host: 'localhost', // o IP del servidor
    port: 5432,        // Puerto por defecto de PostgreSQL
    dialect: 'postgres',
    logging: false,    // Cambiar a true para ver logs SQL
  }
);

module.exports = sequelize;