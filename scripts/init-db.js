/**
 * Script de inicialización de la base de datos
 * Ejecuta el script SQL de inicialización
 * 
 * @author Jean Paul Serrato Violeth
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la base de datos
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'mini_user_api',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
});

async function initDatabase() {
    let client;
    
    try {
        console.log('🔄 Iniciando inicialización de la base de datos...');
        
        // Conectar a la base de datos
        client = await pool.connect();
        console.log('Conectado a PostgreSQL');
        
        // Leer el archivo SQL
        const sqlPath = path.join(__dirname, '..', 'database', 'init.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        
        // Ejecutar el script SQL
        console.log('Ejecutando script de inicialización...');
        await client.query(sqlContent);
        
        console.log('Base de datos inicializada exitosamente');
        console.log('Tabla de usuarios creada con datos de ejemplo');
        
        // Verificar que la tabla se creó correctamente
        const result = await client.query('SELECT COUNT(*) as total FROM users');
        console.log(`Total de usuarios en la base de datos: ${result.rows[0].total}`);
        
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error.message);
        process.exit(1);
    } finally {
        if (client) {
            client.release();
        }
        await pool.end();
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    initDatabase();
}

module.exports = { initDatabase };
