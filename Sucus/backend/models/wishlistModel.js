const db = require('../config/db');

// Obtener todos los wishlists
exports.getAllWishlists = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM wishlist');
        return rows;
    } catch (error) {
        console.error('Error al obtener los wishlists:', error);
        throw error;
    }
}

// Obtener los wishlists de un usuario
exports.getWishlistsByUserId = async (userId) => {
    try {
        const [rows] = await db.query('SELECT * FROM wishlist WHERE idUsuarios = ?', [userId]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los wishlists por ID de usuario:', error);
        throw error;
    }
}

// Obtener las personas que han añadido un país a su wishlist
exports.getUsersByCountryId = async (countryId) => {
    try {
        const [rows] = await db.query('SELECT * FROM wishlist WHERE idCountry = ?', [countryId]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los usuarios por ID de país:', error);
        throw error;
    }
}

// Comprobar si un usuario ha añadido un país a su wishlist
exports.checkWishlist = async (userId, countryId) => {
    try {
        const [rows] = await db.query('SELECT * FROM wishlist WHERE idUsuarios = ? AND idCountry = ?', [userId, countryId]);
        return rows.length > 0;
    } catch (error) {
        console.error('Error al comprobar si el usuario ha añadido el país a su wishlist:', error);
        throw error;
    }
}

// Crear un nuevo wishlist
exports.createWishlist = async (wishlist) => {
    const query = 'INSERT INTO wishlist (idUsuarios, idCountry) VALUES (?, ?)';
    const values = [wishlist.idUsuarios, wishlist.idCountry];
    try {
        const [result] = await db.query(query, values);
        return result.insertId;
    } catch (error) {
        console.error('Error al crear el wishlist:', error);
        throw error;
    }
}

// Eliminar un wishlist
exports.deleteWishlist = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM wishlist WHERE idwishlist = ?', [id]);
        return result.affectedRows;
    } catch (error) {
        console.error('Error al eliminar el wishlist:', error);
        throw error;
    }
}