const { Pool } = require('pg');
const mongoose = require('mongoose');

// PostgreSQL config
const pg = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ecommerce_ropa',
    password: 'samurai202',
    port: 5432,
  });
  
  // MongoDB config
  const connectMongo = async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/ecommerce_ropa');
      console.log('MongoDB conectado');
    } catch (error) {
      console.error('Error en conexión MongoDB:', error);
    }
  };
  
  module.exports = { pg, connectMongo };