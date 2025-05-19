const wishlistModel = require('../models/wishlistModel');

// Obtener todos los wishlists
exports.getAllWishlists = async (req, res) => {
    try {
        const wishlists = await wishlistModel.getAllWishlists();
        res.json(wishlists);
    } catch (error) {
        console.error('Error al obtener los wishlists:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Obtener los wishlists de un usuario
exports.getWishlistsByUserId = async (req, res) => {
    const idUsuarios = req.params.idUsuarios;
    try {
        const wishlists = await wishlistModel.getWishlistsByUserId(idUsuarios);
        res.json(wishlists);
    } catch (error) {
        console.error('Error al obtener los wishlists por ID de usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Obtener las personas que han añadido un país a su wishlist
exports.getUsersByCountryId = async (req, res) => {
    const countryId = req.params.countryId;
    try {
        const users = await wishlistModel.getUsersByCountryId(countryId);
        res.json(users);
    }
    catch (error) {
        console.error('Error al obtener los usuarios por ID de país:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Comprobar si un usuario ha añadido un país a su wishlist
exports.checkWishlist = async (req, res) => {
    const { idUsuarios, idCountry } = req.params;
    try {
        const wishlist = await wishlistModel.checkWishlist(idUsuarios, idCountry);
        res.status(200).json(wishlist);
    } catch (error) {
        console.error('Error al comprobar el wishlist:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Crear un nuevo wishlist
exports.createWishlist = async (req, res) => {
    const { idUsuarios, idCountry } = req.body;
    try {
        const nuevoWishlist = { idUsuarios, idCountry };
        const id = await wishlistModel.createWishlist(nuevoWishlist);
        res.status(201).json({ id });
    } catch (error) {
        console.error('Error al crear el wishlist:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Eliminar un wishlist
exports.deleteWishlist = async (req, res) => {
    const id = req.params.id;
    try {
        const filasAfectadas = await wishlistModel.deleteWishlist(id);
        if (filasAfectadas === 0) {
            return res.status(404).json({ message: 'Wishlist no encontrado' });
        }
        res.json({ message: 'Wishlist eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el wishlist:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}