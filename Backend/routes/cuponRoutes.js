const express = require('express');
const router = express.Router();
const cuponController = require('../controllers/cuponController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', cuponController.getCupones);
router.get('/:id', cuponController.getCuponById);

// Rutas protegidas
router.post('/', authMiddleware, cuponController.crearCupon);
router.put('/:id', authMiddleware, cuponController.actualizarCupon);
router.patch('/:id', authMiddleware, cuponController.modificarParcialCupon);
router.delete('/:id', authMiddleware, cuponController.eliminarCupon);

module.exports = router;