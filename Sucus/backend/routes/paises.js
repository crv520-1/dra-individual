const express = require('express');
const router = express.Router();
const paisesController = require('../controllers/paisesController');

// Obtener todos los paises
router.get('/', paisesController.getPaises);
// Obtener un pais por ID
router.get('/:id', paisesController.getPaisById);
// Crear un nuevo pais
router.post('/', paisesController.createPais);

module.exports = router;