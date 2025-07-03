const { pg } = require('../config/db');

// Obtener todas las tallas
const getTallas = async (req, res) => {
  try {
    const result = await pg.query('SELECT * FROM talla');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener tallas' });
  }
};

// Obtener una talla por ID
const getTallaById = async (req, res) => {
  try {
    const result = await pg.query('SELECT * FROM talla WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Talla no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener talla' });
  }
};

// Crear nueva talla
const crearTalla = async (req, res) => {
  try {
    const { nombre } = req.body;
    const result = await pg.query(
      'INSERT INTO talla (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear talla' });
  }
};

// Actualizar talla completa (PUT)
const actualizarTalla = async (req, res) => {
  try {
    const { nombre } = req.body;
    const result = await pg.query(
      'UPDATE talla SET nombre = $1 WHERE id = $2 RETURNING *',
      [nombre, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Talla no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar talla' });
  }
};

// Modificar parcialmente (PATCH)
const modificarParcialTalla = async (req, res) => {
  try {
    const campos = Object.keys(req.body);
    const valores = Object.values(req.body);

    if (campos.length === 0) {
      return res.status(400).json({ error: 'No se enviaron campos a modificar' });
    }

    const setClause = campos.map((campo, i) => `${campo} = $${i + 1}`).join(', ');
    const result = await pg.query(
      `UPDATE talla SET ${setClause} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Talla no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al modificar talla' });
  }
};

// Eliminar talla
const eliminarTalla = async (req, res) => {
  try {
    const result = await pg.query('DELETE FROM talla WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Talla no encontrada' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar talla' });
  }
};

module.exports = {
  getTallas,
  getTallaById,
  crearTalla,
  actualizarTalla,
  modificarParcialTalla,
  eliminarTalla
};