const express = require('express');
const cors = require('cors');
const logger = require('./middlewares/logger');
const usuarioRoutes = require('./routes/usuarioRoutes');
const direccionRoutes = require('./routes/direccionRoutes');
const stockProductoRoutes = require('./routes/stockProductoRoutes');
const cuponRoutes = require('./routes/cuponRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const colorRoutes = require('./routes/colorRoutes');
const tallaRoutes = require('./routes/tallaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const ordenRoutes = require('./routes/ordenRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/direcciones', direccionRoutes);
app.use('/api/stock-productos', stockProductoRoutes);
app.use('/api/cupones', cuponRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/colores', colorRoutes);
app.use('/api/tallas', tallaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ordenes', ordenRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;