const { pg } = require('../config/db');

// Obtener todos los productos
const getProductos = async (req, res) => {
  try {
    const result = await pg.query('SELECT * FROM producto');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener un producto por ID
const getProductoById = async (req, res) => {
  try {
    const result = await pg.query('SELECT * FROM producto WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

// Crear un nuevo producto con validación de categoria_id
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria_id } = req.body;

    const categoria = await pg.query('SELECT id FROM categoria WHERE id = $1', [categoria_id]);
    if (categoria.rowCount === 0) {
      return res.status(400).json({ error: 'El ID de categoría no está registrado en la tabla categoria' });
    }

    const result = await pg.query(
      'INSERT INTO producto (nombre, descripcion, precio, categoria_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, descripcion, precio, categoria_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// Reemplazar completamente un producto (PUT)
const actualizarProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria_id } = req.body;

    // Validar campos obligatorios
    if (!nombre || !descripcion || !precio || !categoria_id) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios: nombre, descripcion, precio, categoria_id'
      });
    }

    // Verificar que la categoría exista
    const categoria = await pg.query('SELECT id FROM categoria WHERE id = $1', [categoria_id]);
    if (categoria.rowCount === 0) {
      return res.status(400).json({ error: 'El ID de categoría no está registrado en la tabla categoria' });
    }

    // Actualizar producto
    const result = await pg.query(
      'UPDATE producto SET nombre = $1, descripcion = $2, precio = $3, categoria_id = $4 WHERE id = $5 RETURNING *',
      [nombre, descripcion, precio, categoria_id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// Modificar parcialmente un producto (PATCH)
const modificarParcialProducto = async (req, res) => {
  try {
    const campos = Object.keys(req.body);
    const valores = Object.values(req.body);

    if (campos.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos a modificar' });
    }

    if (req.body.categoria_id !== undefined) {
      const categoria = await pg.query('SELECT id FROM categoria WHERE id = $1', [req.body.categoria_id]);
      if (categoria.rowCount === 0) {
        return res.status(400).json({ error: 'El ID de categoría no está registrado en la tabla categoria' });
      }
    }

    const setClause = campos.map((campo, i) => `${campo} = $${i + 1}`).join(', ');
    const query = `UPDATE producto SET ${setClause} WHERE id = $${campos.length + 1} RETURNING *`;

    const result = await pg.query(query, [...valores, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al modificar producto' });
  }
};

// Eliminar un producto por ID
const eliminarProducto = async (req, res) => {
  try {
    const result = await pg.query('DELETE FROM producto WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

module.exports = {
    getProductos,
    getProductoById,
    crearProducto,
    actualizarProducto,
    modificarParcialProducto,
    eliminarProducto
  };
  