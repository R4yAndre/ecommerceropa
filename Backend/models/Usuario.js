const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/sequelize'); // Importar la instancia centralizada

const Usuario = sequelize.define('Usuario', {
  nombre: DataTypes.STRING,
  email: DataTypes.STRING,
  contraseña: DataTypes.STRING,
  fecha_creacion: DataTypes.DATE
}, {
  tableName: 'usuario',
  timestamps: false
});

// Hook para hashear contraseña antes de crear
Usuario.beforeCreate(async (usuario) => {
  const salt = await bcrypt.genSalt(10);
  usuario.contraseña = await bcrypt.hash(usuario.contraseña, salt);
});

module.exports = Usuario;