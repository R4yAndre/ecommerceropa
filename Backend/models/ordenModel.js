const mongoose = require('mongoose');

const direccionEnvioSchema = new mongoose.Schema({
  direccion: String,
  ciudad: String,
  pais: String,
  codigo_postal: String
}, { _id: false });

const itemOrdenSchema = new mongoose.Schema({
  nombre_producto: String,
  talla: String,
  color: String,
  cantidad: Number,
  precio_unitario: Number
}, { _id: false });

const pagoSchema = new mongoose.Schema({
  metodo: String,
  estado: String,
  fecha: Date
}, { _id: false });

const ordenSchema = new mongoose.Schema({
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  direccion_envio: direccionEnvioSchema,
  items: [itemOrdenSchema],
  pago: pagoSchema,
  fecha_orden: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Orden', ordenSchema);