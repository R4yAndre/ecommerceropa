const Producto = require('../models/productoModel');

// Obtener todos los productos desde MongoDB
exports.getProductosMongo = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos de MongoDB' });
  }
};