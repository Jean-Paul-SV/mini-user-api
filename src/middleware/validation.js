/**
 * Middleware de validación usando Joi
 * 
 * @author Jean Paul Serrato Violeth
 * @version 1.0.0
 */

const Joi = require('joi');

// Esquema de validación para crear usuario
const createUserSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'El nombre debe tener al menos 2 caracteres',
            'string.max': 'El nombre no puede tener más de 100 caracteres',
            'any.required': 'El nombre es requerido'
        }),
    email: Joi.string()
        .email()
        .max(255)
        .required()
        .messages({
            'string.email': 'Debe proporcionar un email válido',
            'string.max': 'El email no puede tener más de 255 caracteres',
            'any.required': 'El email es requerido'
        }),
    age: Joi.number()
        .integer()
        .min(1)
        .max(149)
        .optional()
        .messages({
            'number.min': 'La edad debe ser mayor a 0',
            'number.max': 'La edad debe ser menor a 150',
            'number.integer': 'La edad debe ser un número entero'
        }),
    phone: Joi.string()
        .pattern(/^[\+]?[0-9\s\-\(\)]{7,20}$/)
        .optional()
        .messages({
            'string.pattern.base': 'El teléfono debe tener un formato válido'
        }),
    address: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'La dirección no puede tener más de 500 caracteres'
        })
});

// Esquema de validación para actualizar usuario
const updateUserSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.min': 'El nombre debe tener al menos 2 caracteres',
            'string.max': 'El nombre no puede tener más de 100 caracteres'
        }),
    email: Joi.string()
        .email()
        .max(255)
        .optional()
        .messages({
            'string.email': 'Debe proporcionar un email válido',
            'string.max': 'El email no puede tener más de 255 caracteres'
        }),
    age: Joi.number()
        .integer()
        .min(1)
        .max(149)
        .optional()
        .messages({
            'number.min': 'La edad debe ser mayor a 0',
            'number.max': 'La edad debe ser menor a 150',
            'number.integer': 'La edad debe ser un número entero'
        }),
    phone: Joi.string()
        .pattern(/^[\+]?[0-9\s\-\(\)]{7,20}$/)
        .optional()
        .messages({
            'string.pattern.base': 'El teléfono debe tener un formato válido'
        }),
    address: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'La dirección no puede tener más de 500 caracteres'
        })
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

// Esquema de validación para parámetros de consulta
const queryParamsSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            'number.min': 'La página debe ser mayor a 0',
            'number.integer': 'La página debe ser un número entero'
        }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            'number.min': 'El límite debe ser mayor a 0',
            'number.max': 'El límite no puede ser mayor a 100',
            'number.integer': 'El límite debe ser un número entero'
        }),
    search: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'El término de búsqueda no puede tener más de 100 caracteres'
        })
});

// Esquema de validación para ID de usuario
const userIdSchema = Joi.object({
    id: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.min': 'El ID debe ser mayor a 0',
            'number.integer': 'El ID debe ser un número entero',
            'any.required': 'El ID es requerido'
        })
});

/**
 * Middleware para validar datos de creación de usuario
 */
const validateCreateUser = (req, res, next) => {
    const { error, value } = createUserSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({
            error: 'Datos de validación inválidos',
            details: errorMessages
        });
    }
    
    req.validatedData = value;
    next();
};

/**
 * Middleware para validar datos de actualización de usuario
 */
const validateUpdateUser = (req, res, next) => {
    const { error, value } = updateUserSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({
            error: 'Datos de validación inválidos',
            details: errorMessages
        });
    }
    
    req.validatedData = value;
    next();
};

/**
 * Middleware para validar parámetros de consulta
 */
const validateQueryParams = (req, res, next) => {
    const { error, value } = queryParamsSchema.validate(req.query, { abortEarly: false });
    
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({
            error: 'Parámetros de consulta inválidos',
            details: errorMessages
        });
    }
    
    req.validatedQuery = value;
    next();
};

/**
 * Middleware para validar ID de usuario
 */
const validateUserId = (req, res, next) => {
    const { error, value } = userIdSchema.validate({ id: req.params.id }, { abortEarly: false });
    
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({
            error: 'ID de usuario inválido',
            details: errorMessages
        });
    }
    
    req.validatedId = value.id;
    next();
};

module.exports = {
    validateCreateUser,
    validateUpdateUser,
    validateQueryParams,
    validateUserId
};
