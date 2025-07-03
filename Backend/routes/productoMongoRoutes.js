const express = require('express');
const router = express.Router();
const productoMongoController = require('../controllers/productoMongoController');

// Ruta GET para obtener todos los productos
router.get('/', productoMongoController.getProductosMongo);

module.exports = router;