const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario'); // Modelo Sequelize

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener usuario por ID
const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Crear usuario (aprovechando hooks en modelo si existen)
const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, contraseña, fecha_creacion } = req.body;
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      contraseña,
      fecha_creacion: fecha_creacion || new Date()
    });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Reemplazar completamente un usuario (PUT)
const actualizarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { nombre, email, contraseña, fecha_creacion } = req.body;

    // Validación: todos los campos deben estar presentes
    if (!nombre || !email || !contraseña || !fecha_creacion) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios: nombre, email, contraseña, fecha_creacion'
      });
    }

    await usuario.update({ nombre, email, contraseña, fecha_creacion });
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Modificar parcialmente un usuario (PATCH)
const modificarParcialUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const datosActualizados = { ...req.body };

    if (datosActualizados.contraseña) {
      const salt = await bcrypt.genSalt(10);
      datosActualizados.contraseña = await bcrypt.hash(datosActualizados.contraseña, salt);
    }

    await usuario.update(datosActualizados);
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al modificar usuario' });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    await usuario.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  crearUsuario,
  actualizarUsuario,
  modificarParcialUsuario,
  eliminarUsuario
};