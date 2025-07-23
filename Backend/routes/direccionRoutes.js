const express = require('express');
const router = express.Router();
const direccionController = require('../controllers/direccionEnvioController');
const verificarToken = require('../middlewares/authMiddleware');

// Aplica el middleware a todas las rutas de esta sección
router.use(verificarToken);

router.get('/', direccionController.getDirecciones);
router.get('/:id', direccionController.getDireccionById);
router.post('/', direccionController.crearDireccion);
router.put('/:id', direccionController.actualizarDireccion);
router.patch('/:id', direccionController.modificarParcialDireccion);
router.delete('/:id', direccionController.eliminarDireccion);

module.exports = router;