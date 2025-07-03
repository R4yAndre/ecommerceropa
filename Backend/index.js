const app = require('./app');
const { pg } = require('./config/db');

const PORT = 3000;

// Verifica conexión PostgreSQL
pg.connect()
  .then(() => console.log('PostgreSQL conectado'))
  .catch(err => console.error('Error en PostgreSQL:', err));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});