const db = require('../config/db');

// Obtener todos los visitados
const getVisitados = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM visitados');
        return rows;
    } catch (error) {
        console.error('Error al obtener los visitados:', error);
        throw error;
    }
}

// Obtener los visitados de un usuario
const getVisitadosByUsuario = async (idUsuario) => {
    try {
        const [rows] = await db.query('SELECT * FROM visitados WHERE idUser = ?', [idUsuario]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los visitados del usuario:', error);
        throw error;
    }
}

// Obtener personas que han visitado un país
const getVisitadosByPais = async (idPais) => {
    try {
        const [rows] = await db.query('SELECT * FROM visitados WHERE idPais = ?', [idPais]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los visitados del país:', error);
        throw error;
    }
}

// Crear un nuevo visitado
const createVisitado = async (visitado) => {
    const query = 'INSERT INTO visitados (idUser, idPais) VALUES (?, ?)';
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
const deleteVisitado = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM visitados WHERE idvisitado = ?', [id]);
        return result.affectedRows;
    } catch (error) {
        console.error('Error al eliminar el visitado:', error);
        throw error;
    }
}