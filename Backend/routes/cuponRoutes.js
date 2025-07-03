const express = require('express');
const router = express.Router();
const cuponController = require('../controllers/cuponController');

router.get('/', cuponController.getCupones);
router.get('/:id', cuponController.getCuponById);
router.post('/', cuponController.crearCupon);
router.put('/:id', cuponController.actualizarCupon);
router.patch('/:id', cuponController.modificarParcialCupon);
router.delete('/:id', cuponController.eliminarCupon);

module.exports = router;