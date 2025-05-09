const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Obtener un usuario por ID
router.get('/:id', usuarioController.getUsuarioById);
// Obtener un usuario por nombre de usuario
router.get('/nombre/:nombreUsuario', usuarioController.getUsuarioByNombre);
// Crear un nuevo usuario
router.post('/', usuarioController.createUsuario);
// Modificar un usuario existente
router.put('/:id', usuarioController.updateUsuario);
// Eliminar un usuario
router.delete('/:id', usuarioController.deleteUsuario);

module.exports = router;