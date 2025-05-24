const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
const usuarioRoutes = require('./routes/usuario');
const paisesRoutes = require('./routes/paises');
const visitadoRoutes = require('./routes/visitado');
const wishlistRoutes = require('./routes/wishlist');

// Usar rutas
app.use('/api/usuario', usuarioRoutes);
app.use('/api/paises', paisesRoutes);
app.use('/api/visitado', visitadoRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
