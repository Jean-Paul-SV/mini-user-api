/**
 * Controlador de Usuarios
 * Maneja la lógica de negocio para las operaciones CRUD de usuarios
 * 
 * @author Jean Paul Serrato Violeth
 * @version 1.0.0
 */

const User = require('../models/User');

/**
 * Crear un nuevo usuario
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const createUser = async (req, res) => {
    try {
        const userData = req.validatedData;
        
        // Verificar si el email ya existe
        const existingUser = await User.findByEmail(userData.email);
        if (existingUser) {
            return res.status(409).json({
                error: 'Email duplicado',
                message: 'El email ya está registrado',
                code: 'DUPLICATE_EMAIL'
            });
        }
        
        const user = await User.create(userData);
        
        res.status(201).json({
            message: 'Usuario creado exitosamente',
            data: user.toJSON()
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
};

/**
 * Obtener todos los usuarios con paginación
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getAllUsers = async (req, res) => {
    try {
        const { page, limit, search } = req.validatedQuery;
        
        // Obtener usuarios y total
        const [users, total] = await Promise.all([
            User.findAll({ page, limit, search }),
            User.count(search)
        ]);
        
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        
        res.json({
            message: 'Usuarios obtenidos exitosamente',
            data: users.map(user => user.toJSON()),
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage,
                hasPrevPage
            }
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
};

/**
 * Obtener un usuario por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getUserById = async (req, res) => {
    try {
        const userId = req.validatedId;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                message: `No se encontró un usuario con ID ${userId}`,
                code: 'USER_NOT_FOUND'
            });
        }
        
        res.json({
            message: 'Usuario obtenido exitosamente',
            data: user.toJSON()
        });
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        throw error;
    }
};

/**
 * Actualizar un usuario
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateUser = async (req, res) => {
    try {
        const userId = req.validatedId;
        const updateData = req.validatedData;
        
        // Verificar si el usuario existe
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                message: `No se encontró un usuario con ID ${userId}`,
                code: 'USER_NOT_FOUND'
            });
        }
        
        // Si se está actualizando el email, verificar que no esté en uso por otro usuario
        if (updateData.email && updateData.email !== existingUser.email) {
            const emailExists = await User.findByEmail(updateData.email);
            if (emailExists) {
                return res.status(409).json({
                    error: 'Email duplicado',
                    message: 'El email ya está registrado por otro usuario',
                    code: 'DUPLICATE_EMAIL'
                });
            }
        }
        
        const updatedUser = await User.update(userId, updateData);
        
        res.json({
            message: 'Usuario actualizado exitosamente',
            data: updatedUser.toJSON()
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    }
};

/**
 * Eliminar un usuario
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const deleteUser = async (req, res) => {
    try {
        const userId = req.validatedId;
        
        // Verificar si el usuario existe
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                message: `No se encontró un usuario con ID ${userId}`,
                code: 'USER_NOT_FOUND'
            });
        }
        
        const deleted = await User.delete(userId);
        
        if (deleted) {
            res.json({
                message: 'Usuario eliminado exitosamente',
                data: {
                    id: userId,
                    deletedAt: new Date().toISOString()
                }
            });
        } else {
            res.status(500).json({
                error: 'Error al eliminar',
                message: 'No se pudo eliminar el usuario',
                code: 'DELETE_ERROR'
            });
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw error;
    }
};

/**
 * Buscar usuarios por término de búsqueda
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const searchUsers = async (req, res) => {
    try {
        const { search } = req.validatedQuery;
        
        if (!search || search.trim().length < 2) {
            return res.status(400).json({
                error: 'Término de búsqueda inválido',
                message: 'El término de búsqueda debe tener al menos 2 caracteres',
                code: 'INVALID_SEARCH_TERM'
            });
        }
        
        const users = await User.findAll({ search });
        const total = await User.count(search);
        
        res.json({
            message: `Búsqueda completada. Se encontraron ${total} usuarios`,
            data: users.map(user => user.toJSON()),
            searchTerm: search,
            totalResults: total
        });
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        throw error;
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers
};
