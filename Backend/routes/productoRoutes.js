const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const verificarToken = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', productoController.getProductos);
router.get('/:id', productoController.getProductoById);

// Rutas protegidas
router.post('/', verificarToken, productoController.crearProducto);
router.put('/:id', verificarToken, productoController.actualizarProducto);
router.patch('/:id', verificarToken, productoController.modificarParcialProducto);
router.delete('/:id', verificarToken, productoController.eliminarProducto);

module.exports = router;