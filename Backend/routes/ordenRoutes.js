const express = require('express');
const router = express.Router();
const {
  getOrdenes,
  getOrdenById,
  crearOrden,
  modificarOrden,
  eliminarOrden,
  patchOrden
} = require('../controllers/ordenController');

router.get('/', getOrdenes);
router.get('/:id', getOrdenById);
router.post('/', crearOrden);
router.patch('/:id', patchOrden);
router.delete('/:id', eliminarOrden);

module.exports = router;