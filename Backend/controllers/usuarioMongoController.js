const Usuario = require('../models/usuarioModel');

// Obtener todos los usuarios de MongoDB
exports.getUsuariosMongo = async (req, res) => {
    try {
      const usuarios = await Usuario.find();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios de MongoDB' });
    }
  };