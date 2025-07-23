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

const authMiddleware = require('../middlewares/authMiddleware');

// Aplica el middleware a todas las rutas del router
router.use(authMiddleware);

router.get('/', getOrdenes);
router.get('/:id', getOrdenById);
router.post('/', crearOrden);
router.patch('/:id', patchOrden);
router.delete('/:id', eliminarOrden);

module.exports = router;