/**
 * Rutas de Usuarios
 * Define todas las rutas relacionadas con la gestión de usuarios
 * 
 * @author Jean Paul Serrato Violeth
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();

const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers
} = require('../controllers/userController');

const {
    validateCreateUser,
    validateUpdateUser,
    validateQueryParams,
    validateUserId
} = require('../middleware/validation');

const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   POST /api/users
 * @desc    Crear un nuevo usuario
 * @access  Public
 * @body    { name, email, age?, phone?, address? }
 */
router.post('/', validateCreateUser, asyncHandler(createUser));

/**
 * @route   GET /api/users
 * @desc    Obtener todos los usuarios con paginación
 * @access  Public
 * @query   { page?, limit?, search? }
 */
router.get('/', validateQueryParams, asyncHandler(getAllUsers));

/**
 * @route   GET /api/users/search
 * @desc    Buscar usuarios por término de búsqueda
 * @access  Public
 * @query   { search, page?, limit? }
 */
router.get('/search', validateQueryParams, asyncHandler(searchUsers));

/**
 * @route   GET /api/users/:id
 * @desc    Obtener un usuario por ID
 * @access  Public
 * @params  { id }
 */
router.get('/:id', validateUserId, asyncHandler(getUserById));

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar un usuario
 * @access  Public
 * @params  { id }
 * @body    { name?, email?, age?, phone?, address? }
 */
router.put('/:id', validateUserId, validateUpdateUser, asyncHandler(updateUser));

/**
 * @route   DELETE /api/users/:id
 * @desc    Eliminar un usuario
 * @access  Public
 * @params  { id }
 */
router.delete('/:id', validateUserId, asyncHandler(deleteUser));

module.exports = router;
