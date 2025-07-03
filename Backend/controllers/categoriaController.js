const { pg } = require('../config/db');

// Obtener todas las categorías
const getCategorias = async (req, res) => {
  try {
    const result = await pg.query('SELECT * FROM categoria');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// Obtener una categoría por ID
const getCategoriaById = async (req, res) => {
  try {
    const result = await pg.query('SELECT * FROM categoria WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
};

// Crear nueva categoría
const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const result = await pg.query(
      'INSERT INTO categoria (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

// Actualizar categoría completa (PUT)
const actualizarCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const result = await pg.query(
      'UPDATE categoria SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',
      [nombre, descripcion, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

// Modificar parcialmente (PATCH)
const modificarParcialCategoria = async (req, res) => {
  try {
    const campos = Object.keys(req.body);
    const valores = Object.values(req.body);

    if (campos.length === 0) {
      return res.status(400).json({ error: 'No se enviaron campos a modificar' });
    }

    const setClause = campos.map((campo, i) => `${campo} = $${i + 1}`).join(', ');
    const result = await pg.query(
      `UPDATE categoria SET ${setClause} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al modificar categoría' });
  }
};

// Eliminar categoría
const eliminarCategoria = async (req, res) => {
  try {
    const result = await pg.query('DELETE FROM categoria WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};

module.exports = {
  getCategorias,
  getCategoriaById,
  crearCategoria,
  actualizarCategoria,
  modificarParcialCategoria,
  eliminarCategoria
};