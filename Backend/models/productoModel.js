const mongoose = require('mongoose');

const varianteSchema = new mongoose.Schema({
  talla: String,
  color: String,
  stock: Number
}, { _id: false });

const productoSchema = new mongoose.Schema({
  nombre: String,
  categoria: String,
  descripcion: String,
  imagenes: [String],
  variantes: [varianteSchema]
});

module.exports = mongoose.model('Producto', productoSchema);