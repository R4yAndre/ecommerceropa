const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockProductoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', stockController.getStockProductos);
router.get('/:id', stockController.getStockProductoById);

// Rutas protegidas
router.post('/', authMiddleware, stockController.crearStockProducto);
router.put('/:id', authMiddleware, stockController.actualizarStockProducto);
router.patch('/:id', authMiddleware, stockController.modificarParcialStockProducto);
router.delete('/:id', authMiddleware, stockController.eliminarStockProducto);

module.exports = router;