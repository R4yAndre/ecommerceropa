const { pg } = require('../config/db');

// Obtener todos los usuarios desde PostgreSQL
const getUsuarios = async (req, res) => {
  try {
    const result = await pg.query('SELECT * FROM usuario');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener un usuario por ID (PostgreSQL)
const getUsuarioById = async (req, res) => {
  try {
    const result = await pg.query('SELECT * FROM usuario WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Crear un nuevo usuario en PostgreSQL
const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, contraseña, fecha_creacion } = req.body;
    const result = await pg.query(
      'INSERT INTO usuario (nombre, email, contraseña, fecha_creacion) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, contraseña, fecha_creacion || new Date()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Reemplazar completamente un usuario (PUT) en PostgreSQL
const actualizarUsuario = async (req, res) => {
  try {
    const { nombre, email, contraseña, fecha_creacion } = req.body;
    const result = await pg.query(
      'UPDATE usuario SET nombre = $1, email = $2, contraseña = $3, fecha_creacion = $4 WHERE id = $5 RETURNING *',
      [nombre, email, contraseña, fecha_creacion || new Date(), req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Modificar parcialmente un usuario (PATCH) en PostgreSQL
const modificarParcialUsuario = async (req, res) => {
  try {
    // Solo permite modificar campos enviados en el body
    const campos = Object.keys(req.body);
    const valores = Object.values(req.body);

    if (campos.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos a modificar' });
    }

    const setClause = campos.map((campo, index) => `${campo} = $${index + 1}`).join(', ');
    const query = `UPDATE usuario SET ${setClause} WHERE id = $${campos.length + 1} RETURNING *`;

    const result = await pg.query(query, [...valores, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al modificar usuario' });
  }
};

// Eliminar un usuario de PostgreSQL
const eliminarUsuario = async (req, res) => {
  try {
    const result = await pg.query('DELETE FROM usuario WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(204).send(); // Sin contenido, pero eliminación exitosa
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  crearUsuario,
  actualizarUsuario,
  modificarParcialUsuario,
  eliminarUsuario
};