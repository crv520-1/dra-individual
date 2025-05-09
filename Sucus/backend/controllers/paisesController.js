const paisesModel = require('../models/paisesModel');

// Obtener todos los paises
exports.getPaises = async (req, res) => {
    try {
        const paises = await paisesModel.getPaises();
        res.json(paises);
    } catch (error) {
        console.error('Error al obtener los paises:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Obtener un pais por ID
exports.getPaisById = async (req, res) => {
    const id = req.params.id;
    try {
        const pais = await paisesModel.getPaisById(id);
        if (!pais) {
            return res.status(404).json({ message: 'Pais no encontrado' });
        }
        res.json(pais);
    } catch (error) {
        console.error('Error al obtener el pais por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Crear un nuevo pais
exports.createPais = async (req, res) => {
    const { urlScraping, scraping } = req.body;
    try {
        const nuevoPais = { urlScraping, scraping };
        const id = await paisesModel.createPais(nuevoPais);
        res.status(201).json({ id });
    } catch (error) {
        console.error('Error al crear el pais:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}