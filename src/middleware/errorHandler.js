/**
 * Middleware de manejo de errores centralizado
 * 
 * @author Jean Paul Serrato Violeth
 * @version 1.0.0
 */

/**
 * Middleware de manejo de errores
 * @param {Error} err - Error capturado
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error capturado:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Error de validación de base de datos
    if (err.code === '23505') { // Violación de constraint único
        return res.status(409).json({
            error: 'Conflicto de datos',
            message: 'El email ya está registrado',
            code: 'DUPLICATE_EMAIL'
        });
    }

    // Error de foreign key constraint
    if (err.code === '23503') {
        return res.status(400).json({
            error: 'Referencia inválida',
            message: 'La referencia proporcionada no existe',
            code: 'INVALID_REFERENCE'
        });
    }

    // Error de constraint check
    if (err.code === '23514') {
        return res.status(400).json({
            error: 'Datos inválidos',
            message: 'Los datos proporcionados no cumplen con las restricciones de la base de datos',
            code: 'CONSTRAINT_VIOLATION'
        });
    }

    // Error de conexión a base de datos
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        return res.status(503).json({
            error: 'Servicio no disponible',
            message: 'No se puede conectar con la base de datos',
            code: 'DATABASE_CONNECTION_ERROR'
        });
    }

    // Error de timeout
    if (err.code === 'ETIMEDOUT') {
        return res.status(504).json({
            error: 'Timeout',
            message: 'La operación tardó demasiado tiempo',
            code: 'TIMEOUT_ERROR'
        });
    }

    // Error de validación personalizado
    if (err.message === 'El email ya está registrado') {
        return res.status(409).json({
            error: 'Email duplicado',
            message: err.message,
            code: 'DUPLICATE_EMAIL'
        });
    }

    // Error de usuario no encontrado
    if (err.message === 'Usuario no encontrado') {
        return res.status(404).json({
            error: 'Usuario no encontrado',
            message: err.message,
            code: 'USER_NOT_FOUND'
        });
    }

    // Error de validación de datos
    if (err.message.includes('validation') || err.message.includes('validación')) {
        return res.status(400).json({
            error: 'Datos inválidos',
            message: err.message,
            code: 'VALIDATION_ERROR'
        });
    }

    // Error de sintaxis JSON
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: 'JSON inválido',
            message: 'El cuerpo de la petición no es un JSON válido',
            code: 'INVALID_JSON'
        });
    }

    // Error de límite de tamaño
    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            error: 'Archivo muy grande',
            message: 'El tamaño del archivo excede el límite permitido',
            code: 'FILE_TOO_LARGE'
        });
    }

    // Error interno del servidor (por defecto)
    const statusCode = err.statusCode || err.status || 500;
    const message = process.env.NODE_ENV === 'production' 
        ? 'Error interno del servidor' 
        : err.message;

    res.status(statusCode).json({
        error: 'Error interno del servidor',
        message: message,
        code: 'INTERNAL_SERVER_ERROR',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};

/**
 * Middleware para manejar rutas no encontradas
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

/**
 * Middleware para capturar errores de promesas no manejadas
 * @param {Function} fn - Función async
 * @returns {Function} Función envuelta con manejo de errores
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler
};
