const db = require('../config/db');

// Obtener todos los paises
const getPaises = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM paises');
        return rows;
    } catch (error) {
        console.error('Error al obtener los paises:', error);
        throw error;
    }
}

// Obtener un pais por ID
const getPaisById = async (id) => {
    try {
        const [rows] = await db.query('SELECT * FROM paises WHERE idPaises = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener el pais por ID:', error);
        throw error;
    }
}

// Crear un nuevo pais
const createPais = async (pais) => {
    const query = 'INSERT INTO paises (urlScraping, scraping) VALUES (?, ?)';
    const values = [pais.urlScraping, pais.scraping];
    try {
        const [result] = await db.query(query, values);
        return result.insertId;
    } catch (error) {
        console.error('Error al crear el pais:', error);
        throw error;
    }
}