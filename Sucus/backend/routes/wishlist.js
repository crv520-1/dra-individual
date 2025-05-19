const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

// Obtener todos los wishlist
router.get('/', wishlistController.getAllWishlists);
// Obtener los wishlist de un usuario
router.get('/user/:userId', wishlistController.getWishlistsByUserId);
// Obtener las personas que han añadido un país a su wishlist
router.get('/country/:countryId', wishlistController.getUsersByCountryId);
// Comprobar si un usuario ha añadido un país a su wishlist
router.post('/check', wishlistController.checkWishlist);
// Crear un nuevo wishlist
router.post('/', wishlistController.createWishlist);
// Eliminar un wishlist
router.delete('/:id', wishlistController.deleteWishlist);

module.exports = router;