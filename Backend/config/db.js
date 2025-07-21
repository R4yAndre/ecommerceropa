const { Pool } = require('pg');

// PostgreSQL config
const pg = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ecommerce_ropa',
    password: 'samurai202',
    port: 5432,
  });
  
  module.exports = { pg };