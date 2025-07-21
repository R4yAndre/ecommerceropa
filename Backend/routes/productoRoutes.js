const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

router.get('/', productoController.getProductos);
router.get('/:id', productoController.getProductoById);
router.post('/', productoController.crearProducto);
router.put('/:id', productoController.actualizarProducto);
router.patch(':id', productoController.modificarParcialProducto);
router.delete(':id', productoController.eliminarProducto);

module.exports = router;