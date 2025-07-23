const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const SECRET_KEY = '07aa163743a9681c02eeeca106e2ebb1abe556e11ab2046c2662c8f6326f63bf';

const login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET_KEY, {
      expiresIn: '2h'
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = { login };