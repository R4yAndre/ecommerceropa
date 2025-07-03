const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockProductoController');

router.get('/', stockController.getStockProductos);
router.get('/:id', stockController.getStockProductoById);
router.post('/', stockController.crearStockProducto);
router.put('/:id', stockController.actualizarStockProducto);
router.patch('/:id', stockController.modificarParcialStockProducto);
router.delete('/:id', stockController.eliminarStockProducto);

module.exports = router;