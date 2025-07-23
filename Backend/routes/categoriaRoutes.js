const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Aplica el middleware a todas las rutas del router
router.use(authMiddleware);

router.get('/', categoriaController.getCategorias);
router.get('/:id', categoriaController.getCategoriaById);
router.post('/', categoriaController.crearCategoria);
router.put('/:id', categoriaController.actualizarCategoria);
router.patch('/:id', categoriaController.modificarParcialCategoria);
router.delete('/:id', categoriaController.eliminarCategoria);

module.exports = router;