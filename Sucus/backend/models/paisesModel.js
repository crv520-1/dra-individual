const db = require('../config/db');

// Obtener todos los paises
exports.getPaises = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM paises');
        return rows;
    } catch (error) {
        console.error('Error al obtener los paises:', error);
        throw error;
    }
}

// Obtener un pais por ID
exports.getPaisById = async (id) => {
    try {
        const [rows] = await db.query('SELECT * FROM paises WHERE idPaises = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener el pais por ID:', error);
        throw error;
    }
}

// Obtener un pais por nombre
exports.getPaisByName = async (nombre) => {
    try {
        const [rows] = await db.query('SELECT * FROM paises WHERE nombrePais = ?', [nombre]);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener el pais por nombre:', error);
        throw error;
    }
}

// Crear un nuevo pais
exports.createPais = async (pais) => {
    const query = 'INSERT INTO paises (urlScraping, nombrePais) VALUES (?, ?)';
    const values = [pais.urlScraping, pais.nombrePais];
    try {
        const [result] = await db.query(query, values);
        return result.insertId;
    } catch (error) {
        console.error('Error al crear el pais:', error);
        throw error;
    }
}