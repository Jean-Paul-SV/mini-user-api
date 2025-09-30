/**
 * Script de configuración inicial del proyecto
 * Instala dependencias y configura el entorno
 * 
 * @author Paul K
 * @version 1.0.0
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Iniciando configuración del proyecto Mini User API...\n');

try {
    // 1. Instalar dependencias
    console.log('Instalando dependencias...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('Dependencias instaladas correctamente\n');

    // 2. Crear archivo .env si no existe
    const envPath = path.join(__dirname, '..', '.env');
    const envExamplePath = path.join(__dirname, '..', 'config.example.env');
    
    if (!fs.existsSync(envPath)) {
        console.log('⚙️  Creando archivo .env...');
        if (fs.existsSync(envExamplePath)) {
            fs.copyFileSync(envExamplePath, envPath);
            console.log('Archivo .env creado desde config.example.env');
            console.log('Recuerda editar .env con tus credenciales de PostgreSQL\n');
        } else {
            console.log('No se encontró config.example.env\n');
        }
    } else {
        console.log('Archivo .env ya existe\n');
    }

    // 3. Verificar estructura de carpetas
    console.log('📁 Verificando estructura de carpetas...');
    const requiredDirs = [
        'src',
        'src/config',
        'src/controllers',
        'src/middleware',
        'src/models',
        'src/routes',
        'database',
        'scripts'
    ];

    requiredDirs.forEach(dir => {
        const dirPath = path.join(__dirname, '..', dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Carpeta ${dir} creada`);
        } else {
            console.log(`Carpeta ${dir} existe`);
        }
    });

    console.log('\n Configuración completada exitosamente!');
    console.log('\n Próximos pasos:');
    console.log('1. Edita el archivo .env con tus credenciales de PostgreSQL');
    console.log('2. Ejecuta: npm run init-db (para inicializar la base de datos)');
    console.log('3. Ejecuta: npm run dev (para iniciar en modo desarrollo)');
    console.log('4. O ejecuta: docker-compose up -d (para usar Docker)');
    console.log('\n La API estará disponible en: http://localhost:3000');
    console.log(' Documentación: http://localhost:3000/api/health');

} catch (error) {
    console.error('Error durante la configuración:', error.message);
    process.exit(1);
}
