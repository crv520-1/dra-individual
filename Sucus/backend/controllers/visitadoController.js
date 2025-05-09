const visitadoModel = require('../models/visitadoModel');

// Obtener todos los visitados
exports.getVisitados = async (req, res) => {
    try {
        const visitados = await visitadoModel.getVisitados();
        res.json(visitados);
    } catch (error) {
        console.error('Error al obtener los visitados:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Obtener los visitados de un usuario
exports.getVisitadosByUsuario = async (req, res) => {
    const idUsuario = req.params.id;
    try {
        const visitados = await visitadoModel.getVisitadosByUsuario(idUsuario);
        res.json(visitados);
    } catch (error) {
        console.error('Error al obtener los visitados del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Obtener personas que han visitado un país
exports.getVisitadosByPais = async (req, res) => {
    const idPais = req.params.id;
    try {
        const visitados = await visitadoModel.getVisitadosByPais(idPais);
        res.json(visitados);
    } catch (error) {
        console.error('Error al obtener los visitados del país:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Crear un nuevo visitado
exports.createVisitado = async (req, res) => {
    const { idUser, idPais } = req.body;
    try {
        const nuevoVisitado = { idUser, idPais };
        const id = await visitadoModel.createVisitado(nuevoVisitado);
        res.status(201).json({ id });
    } catch (error) {
        console.error('Error al crear el visitado:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Eliminar un visitado
exports.deleteVisitado = async (req, res) => {
    const id = req.params.id;
    try {
        const filasAfectadas = await visitadoModel.deleteVisitado(id);
        if (filasAfectadas === 0) {
            return res.status(404).json({ message: 'Visitado no encontrado' });
        }
        res.json({ message: 'Visitado eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el visitado:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}