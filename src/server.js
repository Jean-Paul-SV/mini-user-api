/**
 * Servidor principal de la Mini API de Gestión de Usuarios
 * Prueba Técnica - Desarrollador Jr. Backend
 * 
 * @author Jean Paul Serrato Violeth
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const { connectDB } = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());

// Configuración de CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? ['https://tu-dominio.com'] : true,
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP cada 15 minutos
    message: {
        error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
    }
});
app.use(limiter);

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging básico
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas principales
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido a la Mini API de Gestión de Usuarios',
        version: '1.0.0',
        author: 'Paul K',
        endpoints: {
            users: '/api/users',
            health: '/api/health'
        }
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Rutas de usuarios
app.use('/api/users', userRoutes);

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint no encontrado',
        message: `La ruta ${req.originalUrl} no existe`,
        availableEndpoints: [
            'GET /',
            'GET /api/health',
            'GET /api/users',
            'POST /api/users',
            'GET /api/users/:id',
            'PUT /api/users/:id',
            'DELETE /api/users/:id'
        ]
    });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Función para iniciar el servidor
async function startServer() {
    try {
        // Conectar a la base de datos
        await connectDB();
        
        // Iniciar el servidor
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en puerto ${PORT}`);
            console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
            console.log(`URL: http://localhost:${PORT}`);
            console.log(`Documentación: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

// Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
    console.log('Señal SIGTERM recibida. Cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Señal SIGINT recibida. Cerrando servidor...');
    process.exit(0);
});

// Iniciar el servidor
startServer();

module.exports = app;
