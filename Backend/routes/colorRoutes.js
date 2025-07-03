const express = require('express');
const router = express.Router();
const colorController = require('../controllers/colorController');

router.get('/', colorController.getColores);
router.get('/:id', colorController.getColorById);
router.post('/', colorController.crearColor);
router.put('/:id', colorController.actualizarColor);
router.patch('/:id', colorController.modificarParcialColor);
router.delete('/:id', colorController.eliminarColor);

module.exports = router;