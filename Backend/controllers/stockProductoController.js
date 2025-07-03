const { pg } = require('../config/db');

// Obtener todos los registros de stock_producto
const getStockProductos = async (req, res) => {
  try {
    const result = await pg.query('SELECT * FROM stock_producto');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener stock de productos' });
  }
};

// Obtener un registro de stock por ID
const getStockProductoById = async (req, res) => {
  try {
    const result = await pg.query('SELECT * FROM stock_producto WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener stock' });
  }
};

// Crear nuevo registro de stock
const crearStockProducto = async (req, res) => {
  try {
    const { id_producto, talla, color, cantidad } = req.body;
    const result = await pg.query(
      'INSERT INTO stock_producto (id_producto, talla, color, cantidad) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_producto, talla, color, cantidad]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear stock' });
  }
};

// Actualizar registro de stock (PUT)
const actualizarStockProducto = async (req, res) => {
  try {
    const { id_producto, talla, color, cantidad } = req.body;
    const result = await pg.query(
      'UPDATE stock_producto SET id_producto = $1, talla = $2, color = $3, cantidad = $4 WHERE id = $5 RETURNING *',
      [id_producto, talla, color, cantidad, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar stock' });
  }
};

// Modificar parcialmente (PATCH)
const modificarParcialStockProducto = async (req, res) => {
  try {
    const campos = Object.keys(req.body);
    const valores = Object.values(req.body);

    if (campos.length === 0) {
      return res.status(400).json({ error: 'No se enviaron campos a modificar' });
    }

    const setClause = campos.map((campo, i) => `${campo} = $${i + 1}`).join(', ');
    const result = await pg.query(
      `UPDATE stock_producto SET ${setClause} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al modificar stock' });
  }
};

// Eliminar registro de stock
const eliminarStockProducto = async (req, res) => {
  try {
    const result = await pg.query('DELETE FROM stock_producto WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar stock' });
  }
};

module.exports = {
  getStockProductos,
  getStockProductoById,
  crearStockProducto,
  actualizarStockProducto,
  modificarParcialStockProducto,
  eliminarStockProducto
};