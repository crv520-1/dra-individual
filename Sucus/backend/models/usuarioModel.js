const db = require('../config/db');

// Obtener usuario por ID
const getUsuarioById = async (id) => {
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE idUsuario = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener el usuario por ID:', error);
        throw error;
    }
}

// Obtener un usuario por nombre de usuario
const getUsuarioByNombre = async (nombreUsuario) => {
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE nombreUsuario = ?', [nombreUsuario]);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener el usuario por nombre de usuario:', error);
        throw error;
    }
}

// Crear un nuevo usuario
const createUsuario = async (usuario) => {
    const query = 'INSERT INTO usuarios (nombreUsuario, contrasena, fotoPerfil) VALUES (?, ?, ?)';
    const values = [usuario.nombreUsuario, usuario.contrasena, usuario.fotoPerfil];
    try {
        const [result] = await db.query(query, values);
        return result.insertId;
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw error;
    }
}

// Modificar un usuario existente
const updateUsuario = async (id, usuario) => {
    const query = 'UPDATE usuarios SET nombreUsuario = ?, contrasena = ?, fotoPerfil = ? WHERE idUsuario = ?';
    const values = [usuario.nombreUsuario, usuario.contrasena, usuario.fotoPerfil, id];
    try {
        const [result] = await db.query(query, values);
        return result.affectedRows;
    } catch (error) {
        console.error('Error al modificar el usuario:', error);
        throw error;
    }
}

// Eliminar un usuario
const deleteUsuario = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM usuarios WHERE idUsuario = ?', [id]);
        return result.affectedRows;
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        throw error;
    }
}
