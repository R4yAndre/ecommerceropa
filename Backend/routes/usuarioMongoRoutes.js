const express = require('express');
const router = express.Router();
const usuarioMongoController = require('../controllers/usuarioMongoController');

// Ruta para obtener usuarios desde MongoDB
router.get('/', usuarioMongoController.getUsuariosMongo);

module.exports = router;