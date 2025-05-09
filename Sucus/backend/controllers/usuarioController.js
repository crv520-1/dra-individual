const usuarioModel = require('../models/usuarioModel');

// Obtener un usuario por ID
const getUsuarioById = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await usuarioModel.getUsuarioById(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Obtener un usuario por nombre de usuario
const getUsuarioByNombre = async (req, res) => {
    const nombreUsuario = req.params.nombreUsuario;
    try {
        const usuario = await usuarioModel.getUsuarioByNombre(nombreUsuario);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Crear un nuevo usuario
const createUsuario = async (req, res) => {
    const { nombreUsuario, contrasena, fotoPerfil } = req.body;
    try {
        const nuevoUsuario = { nombreUsuario, contrasena, fotoPerfil };
        const id = await usuarioModel.createUsuario(nuevoUsuario);
        res.status(201).json({ id });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Modificar un usuario existente
const updateUsuario = async (req, res) => {
    const id = req.params.id;
    const { nombreUsuario, contrasena, fotoPerfil } = req.body;
    try {
        const usuarioExistente = await usuarioModel.getUsuarioById(id);
        if (!usuarioExistente) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const usuarioModificado = { nombreUsuario, contrasena, fotoPerfil };
        const filasAfectadas = await usuarioModel.updateUsuario(id, usuarioModificado);
        if (filasAfectadas === 0) {
            return res.status(404).json({ message: 'No se pudo modificar el usuario' });
        }
        res.json({ message: 'Usuario modificado correctamente' });
    } catch (error) {
        console.error('Error al modificar el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Eliminar un usuario
const deleteUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        const usuarioExistente = await usuarioModel.getUsuarioById(id);
        if (!usuarioExistente) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const filasAfectadas = await usuarioModel.deleteUsuario(id);
        if (filasAfectadas === 0) {
            return res.status(404).json({ message: 'No se pudo eliminar el usuario' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}