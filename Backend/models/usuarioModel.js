const mongoose = require('mongoose');

const direccionSchema = new mongoose.Schema({
  direccion: String,
  ciudad: String,
  pais: String,
  codigo_postal: String
}, { _id: false });

const carritoItemSchema = new mongoose.Schema({
  nombre_producto: String,
  talla: String,
  color: String,
  cantidad: Number
}, { _id: false });

const notificacionSchema = new mongoose.Schema({
  mensaje: String,
  leido: Boolean,
  fecha: Date
}, { _id: false });

const cuponUsadoSchema = new mongoose.Schema({
  codigo: String,
  fecha_uso: Date
}, { _id: false });

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  contraseña: String,
  fecha_creacion: { type: Date, default: Date.now },
  direcciones_envio: [direccionSchema],
  carrito: {
    items: [carritoItemSchema]
  },
  notificaciones: [notificacionSchema],
  cupones_usados: [cuponUsadoSchema]
});

module.exports = mongoose.model('Usuario', usuarioSchema);
