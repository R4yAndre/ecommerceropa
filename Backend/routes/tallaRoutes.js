const express = require('express');
const router = express.Router();
const tallaController = require('../controllers/tallaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Aplica el middleware a todas las rutas del router
router.use(authMiddleware);

router.get('/', tallaController.getTallas);
router.get('/:id', tallaController.getTallaById);
router.post('/', tallaController.crearTalla);
router.put('/:id', tallaController.actualizarTalla);
router.patch('/:id', tallaController.modificarParcialTalla);
router.delete('/:id', tallaController.eliminarTalla);

module.exports = router;