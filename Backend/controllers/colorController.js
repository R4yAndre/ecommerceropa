const { pg } = require('../config/db');

// Obtener todos los colores
const getColores = async (req, res) => {
  try {
    const result = await pg.query('SELECT * FROM color');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener colores' });
  }
};

// Obtener un color por ID
const getColorById = async (req, res) => {
  try {
    const result = await pg.query('SELECT * FROM color WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Color no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener color' });
  }
};

// Crear nuevo color
const crearColor = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const result = await pg.query(
      'INSERT INTO color (nombre) VALUES ($1) RETURNING *',
      [nombre.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear color' });
  }
};

// Actualizar color completo (PUT)
const actualizarColor = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const result = await pg.query(
      'UPDATE color SET nombre = $1 WHERE id = $2 RETURNING *',
      [nombre.trim(), req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Color no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar color' });
  }
};

// Modificar parcialmente (PATCH)
const modificarParcialColor = async (req, res) => {
  try {
    const campos = Object.keys(req.body);
    const valores = Object.values(req.body);

    if (campos.length === 0) {
      return res.status(400).json({ error: 'No se enviaron campos a modificar' });
    }

    const setClause = campos.map((campo, i) => `${campo} = $${i + 1}`).join(', ');
    const result = await pg.query(
      `UPDATE color SET ${setClause} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Color no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al modificar color' });
  }
};

// Eliminar color
const eliminarColor = async (req, res) => {
  try {
    const result = await pg.query('DELETE FROM color WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Color no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar color' });
  }
};

module.exports = {
  getColores,
  getColorById,
  crearColor,
  actualizarColor,
  modificarParcialColor,
  eliminarColor
};