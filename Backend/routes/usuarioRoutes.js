const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');

// Aplica el middleware a todas las rutas del router
router.use(authMiddleware);

router.get('/', usuarioController.getUsuarios);
router.get('/:id', usuarioController.getUsuarioById);
router.post('/', usuarioController.crearUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
router.patch('/:id', usuarioController.modificarParcialUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;