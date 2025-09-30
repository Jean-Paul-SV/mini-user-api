/**
 * Configuración de la base de datos PostgreSQL
 * 
 * @author Paul K
 * @version 1.0.0
 */

const { Pool } = require('pg');

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'mini_user_api',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    max: 20, // máximo 20 conexiones en el pool
    idleTimeoutMillis: 30000, // cerrar conexiones inactivas después de 30 segundos
    connectionTimeoutMillis: 2000, // timeout de conexión de 2 segundos
});

// Función para conectar a la base de datos
async function connectDB() {
    try {
        // Probar la conexión
        const client = await pool.connect();
        console.log('Conectado a PostgreSQL exitosamente');
        
        // Crear la tabla de usuarios si no existe
        await createUsersTable();
        
        client.release();
    } catch (error) {
        console.error('Error al conectar con PostgreSQL:', error.message);
        throw error;
    }
}

// Función para crear la tabla de usuarios
async function createUsersTable() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            age INTEGER CHECK (age > 0 AND age < 150),
            phone VARCHAR(20),
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(createTableQuery);
        console.log('Tabla de usuarios creada/verificada exitosamente');
    } catch (error) {
        console.error('Error al crear la tabla de usuarios:', error.message);
        throw error;
    }
}

// Función para obtener una conexión del pool
function getPool() {
    return pool;
}

// Función para cerrar todas las conexiones
async function closePool() {
    try {
        await pool.end();
        console.log('Pool de conexiones cerrado');
    } catch (error) {
        console.error('Error al cerrar el pool de conexiones:', error.message);
    }
}

module.exports = {
    connectDB,
    getPool,
    closePool
};
