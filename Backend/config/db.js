const path = require('path');
require('dotenv').config();
const { Pool } = require('pg');

const pg = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

module.exports = { pg };