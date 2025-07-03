const { pg } = require('../config/db');

const getDirecciones = async (req, res) => {
  try {
    const result = await pg.query('SELECT * FROM direccion_envio');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener direcciones' });
  }
};

const getDireccionById = async (req, res) => {
  try {
    const result = await pg.query('SELECT * FROM direccion_envio WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener dirección' });
  }
};

const crearDireccion = async (req, res) => {
  try {
    const { id_usuario, direccion, ciudad, pais, codigo_postal } = req.body;
    const result = await pg.query(
      'INSERT INTO direccion_envio (id_usuario, direccion, ciudad, pais, codigo_postal) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id_usuario, direccion, ciudad, pais, codigo_postal]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear dirección' });
  }
};

const actualizarDireccion = async (req, res) => {
  try {
    const { id_usuario, direccion, ciudad, pais, codigo_postal } = req.body;
    const result = await pg.query(
      'UPDATE direccion_envio SET id_usuario = $1, direccion = $2, ciudad = $3, pais = $4, codigo_postal = $5 WHERE id = $6 RETURNING *',
      [id_usuario, direccion, ciudad, pais, codigo_postal, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar dirección' });
  }
};

const modificarParcialDireccion = async (req, res) => {
  try {
    const campos = Object.keys(req.body);
    const valores = Object.values(req.body);

    if (campos.length === 0) {
      return res.status(400).json({ error: 'No se enviaron campos a modificar' });
    }

    const setClause = campos.map((campo, i) => `${campo} = $${i + 1}`).join(', ');
    const result = await pg.query(
      `UPDATE direccion_envio SET ${setClause} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al modificar dirección' });
  }
};

const eliminarDireccion = async (req, res) => {
  try {
    const result = await pg.query('DELETE FROM direccion_envio WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar dirección' });
  }
};

module.exports = {
  getDirecciones,
  getDireccionById,
  crearDireccion,
  actualizarDireccion,
  modificarParcialDireccion,
  eliminarDireccion
};