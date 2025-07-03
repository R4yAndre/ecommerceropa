const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.get('/', categoriaController.getCategorias);
router.get('/:id', categoriaController.getCategoriaById);
router.post('/', categoriaController.crearCategoria);
router.put('/:id', categoriaController.actualizarCategoria);
router.patch('/:id', categoriaController.modificarParcialCategoria);
router.delete('/:id', categoriaController.eliminarCategoria);

module.exports = router;