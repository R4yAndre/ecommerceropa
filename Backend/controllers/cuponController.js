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

// Obtener cupón por ID
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

// Crear nuevo cupón
const crearCupon = async (req, res) => {
  try {
    const { codigo, descuento, fecha_expiracion, uso_maximo } = req.body;
    const result = await pg.query(
      'INSERT INTO cupon (codigo, descuento, fecha_expiracion, uso_maximo) VALUES ($1, $2, $3, $4) RETURNING *',
      [codigo, descuento, fecha_expiracion, uso_maximo]
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
    const { codigo, descuento, fecha_expiracion, uso_maximo } = req.body;

    // Validar que todos los campos estén presentes
    if (
      codigo === undefined ||
      descuento === undefined ||
      fecha_expiracion === undefined ||
      uso_maximo === undefined
    ) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios: codigo, descuento, fecha_expiracion, uso_maximo'
      });
    }

    const result = await pg.query(
      'UPDATE cupon SET codigo = $1, descuento = $2, fecha_expiracion = $3, uso_maximo = $4 WHERE id = $5 RETURNING *',
      [codigo, descuento, fecha_expiracion, uso_maximo, req.params.id]
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

// Modificar parcialmente cupón
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

// Eliminar cupón
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