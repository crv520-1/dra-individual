const db = require('../config/db');

// Obtener todos los visitados
exports.getVisitados = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM visitado');
        return rows;
    } catch (error) {
        console.error('Error al obtener los visitados:', error);
        throw error;
    }
}

// Obtener los visitados de un usuario
exports.getVisitadosByUsuario = async (idUsuario) => {
    try {
        const [rows] = await db.query('SELECT * FROM visitado WHERE idUser = ?', [idUsuario]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los visitados del usuario:', error);
        throw error;
    }
}

// Obtener personas que han visitado un país
exports.getVisitadosByPais = async (idPais) => {
    try {
        const [rows] = await db.query('SELECT * FROM visitado WHERE idPais = ?', [idPais]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los visitados del país:', error);
        throw error;
    }
}

// Comprobar si un usuario ha visitado un país
exports.checkVisitado = async (idUser, idPais) => {
    try {
        const [rows] = await db.query('SELECT * FROM visitado WHERE idUser = ? AND idPais = ?', [idUser, idPais]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error al comprobar si el usuario ha visitado el país:', error);
        throw error;
    }
}

// Crear un nuevo visitado
exports.createVisitado = async (visitado) => {
    const query = 'INSERT INTO visitado (idUser, idPais) VALUES (?, ?)';
    const values = [visitado.idUser, visitado.idPais];
    try {
        const [result] = await db.query(query, values);
        return result.insertId;
    } catch (error) {
        console.error('Error al crear el visitado:', error);
        throw error;
    }
}

// Eliminar un visitado
exports.deleteVisitado = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM visitado WHERE idvisitado = ?', [id]);
        return result.affectedRows;
    } catch (error) {
        console.error('Error al eliminar el visitado:', error);
        throw error;
    }
}