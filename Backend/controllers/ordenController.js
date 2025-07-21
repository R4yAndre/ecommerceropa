const { pg } = require('../config/db');

// Obtener todas las órdenes
const getOrdenes = async (req, res) => {
  try {
    const result = await pg.query('SELECT * FROM orden');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
};

// Obtener una orden por ID
const getOrdenById = async (req, res) => {
  try {
    const ordenId = req.params.id;
    const ordenResult = await pg.query('SELECT * FROM orden WHERE id = $1', [ordenId]);
    const detallesResult = await pg.query('SELECT * FROM detalle_orden WHERE orden_id = $1', [ordenId]);

    if (ordenResult.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    const orden = ordenResult.rows[0];
    orden.detalles = detallesResult.rows;

    res.json(orden);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener orden' });
  }
};

// Crear una orden con sus detalles y actualizar stock
const crearOrden = async (req, res) => {
  const client = await pg.connect();

  try {
    const { usuario_id, direccion_envio_id, metodo_pago, estado_pago, detalles } = req.body;

    await client.query('BEGIN');

    // Insertar orden principal
    const ordenResult = await client.query(
      'INSERT INTO orden (usuario_id, direccion_envio_id, fecha_orden, metodo_pago, estado_pago, total) VALUES ($1, $2, NOW(), $3, $4, 0) RETURNING *',
      [usuario_id, direccion_envio_id, metodo_pago, estado_pago]
    );

    const ordenId = ordenResult.rows[0].id;
    let totalOrden = 0;

    for (const item of detalles) {
      const { stock_producto_id, cantidad } = item;

      // Obtener precio unitario y stock actual
      const stockResult = await client.query(
        `SELECT sp.stock, p.precio
         FROM stock_producto sp
         JOIN producto p ON sp.producto_id = p.id
         WHERE sp.id = $1`,
        [stock_producto_id]
      );

      if (stockResult.rows.length === 0) {
        throw new Error(`Stock_producto ID ${stock_producto_id} no existe`);
      }

      const { stock, precio } = stockResult.rows[0];

      if (cantidad > stock) {
        throw new Error(`Stock insuficiente para el producto ${stock_producto_id}`);
      }

      // Insertar detalle de orden
      await client.query(
        `INSERT INTO detalle_orden (orden_id, stock_producto_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [ordenId, stock_producto_id, cantidad, precio]
      );

      // Actualizar stock
      await client.query(
        `UPDATE stock_producto SET stock = stock - $1 WHERE id = $2`,
        [cantidad, stock_producto_id]
      );

      totalOrden += precio * cantidad;
    }

    // Actualizar total de la orden
    await client.query('UPDATE orden SET total = $1 WHERE id = $2', [totalOrden, ordenId]);

    await client.query('COMMIT');

    res.status(201).json({ mensaje: 'Orden creada con éxito', orden_id: ordenId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(400).json({ error: err.message || 'Error al crear orden' });
  } finally {
    client.release();
  }
};

// Modificar parcialmente una orden
const patchOrden = async (req, res) => {
  try {
    const campos = Object.keys(req.body);
    const valores = Object.values(req.body);

    if (campos.length === 0) {
      return res.status(400).json({ error: 'No se enviaron campos a modificar' });
    }

    const setClause = campos.map((campo, i) => `${campo} = $${i + 1}`).join(', ');
    const result = await pg.query(
      `UPDATE orden SET ${setClause} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al modificar orden' });
  }
};

// Eliminar orden
const eliminarOrden = async (req, res) => {
  try {
    const result = await pg.query('DELETE FROM orden WHERE id = $1 RETURNING *', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar orden' });
  }
};

module.exports = {
  getOrdenes,
  getOrdenById,
  crearOrden,
  patchOrden,
  eliminarOrden
};