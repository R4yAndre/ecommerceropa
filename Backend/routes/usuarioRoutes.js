const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', usuarioController.getUsuarios);
router.get('/:id', usuarioController.getUsuarioById);
router.post('/', usuarioController.crearUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
router.patch('/:id', usuarioController.modificarParcialUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;