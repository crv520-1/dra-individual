const express = require('express');
const router = express.Router();
const visitadoController = require('../controllers/visitadoController');

// Obtener todos los visitados
router.get('/', visitadoController.getVisitados);
// Obtener los visitados de un usuario
router.get('/usuario/:id', visitadoController.getVisitadosByUsuario);
// Obtener personas que han visitado un país
router.get('/pais/:id', visitadoController.getVisitadosByPais);
// Comprobar si un usuario ha visitado un país
router.get('/check/:idUser/:idPais', visitadoController.checkVisitado);
// Crear un nuevo visitado
router.post('/', visitadoController.createVisitado);
// Eliminar un visitado
router.delete('/:id', visitadoController.deleteVisitado);

module.exports = router;