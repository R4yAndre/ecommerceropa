const { pg } = require('../config/db');

// Obtener todos los cupones
const getCupones = async (req, res) => {
  try {
    const result = await pg.query('SELECT * FROM cupon');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener cupones' });
  }
};

// Obtener un cupón por ID
const getCuponById = async (req, res) => {
  try {
    const result = await pg.query('SELECT * FROM cupon WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cupón no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener cupón' });
  }
};

// Crear un nuevo cupón
const crearCupon = async (req, res) => {
  try {
    const { codigo, descripcion, porcentaje_descuento, fecha_inicio, fecha_fin } = req.body;
    const result = await pg.query(
      'INSERT INTO cupon (codigo, descripcion, porcentaje_descuento, fecha_inicio, fecha_fin) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [codigo, descripcion, porcentaje_descuento, fecha_inicio, fecha_fin]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear cupón' });
  }
};

// Actualizar cupón completo
const actualizarCupon = async (req, res) => {
  try {
    const { codigo, descripcion, porcentaje_descuento, fecha_inicio, fecha_fin } = req.body;
    const result = await pg.query(
      'UPDATE cupon SET codigo = $1, descripcion = $2, porcentaje_descuento = $3, fecha_inicio = $4, fecha_fin = $5 WHERE id = $6 RETURNING *',
      [codigo, descripcion, porcentaje_descuento, fecha_inicio, fecha_fin, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cupón no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar cupón' });
  }
};

// Modificar parcialmente un cupón
const modificarParcialCupon = async (req, res) => {
  try {
    const campos = Object.keys(req.body);
    const valores = Object.values(req.body);

    if (campos.length === 0) {
      return res.status(400).json({ error: 'No se enviaron campos a modificar' });
    }

    const setClause = campos.map((campo, i) => `${campo} = $${i + 1}`).join(', ');
    const result = await pg.query(
      `UPDATE cupon SET ${setClause} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cupón no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al modificar cupón' });
  }
};

// Eliminar un cupón
const eliminarCupon = async (req, res) => {
  try {
    const result = await pg.query('DELETE FROM cupon WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cupón no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar cupón' });
  }
};

module.exports = {
  getCupones,
  getCuponById,
  crearCupon,
  actualizarCupon,
  modificarParcialCupon,
  eliminarCupon
};