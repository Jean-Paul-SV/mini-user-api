-- Script de inicialización de la base de datos
-- Mini API de Gestión de Usuarios - Prueba Técnica Backend Jr
-- 
-- @author Jean Paul Serrato Violeth
-- @version 1.0.0

-- Crear la base de datos si no existe
-- Nota: Este comando debe ejecutarse como superusuario
-- CREATE DATABASE mini_user_api;

-- Conectar a la base de datos
-- \c mini_user_api;

-- Crear la tabla de usuarios
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

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo (opcional)
INSERT INTO users (name, email, age, phone, address) VALUES
('Juan Pérez', 'juan.perez@email.com', 28, '+1234567890', 'Calle Principal 123, Ciudad'),
('María García', 'maria.garcia@email.com', 32, '+0987654321', 'Avenida Central 456, Ciudad'),
('Carlos López', 'carlos.lopez@email.com', 25, '+1122334455', 'Plaza Mayor 789, Ciudad'),
('Ana Martínez', 'ana.martinez@email.com', 30, '+5566778899', 'Calle Secundaria 321, Ciudad'),
('Luis Rodríguez', 'luis.rodriguez@email.com', 27, '+9988776655', 'Boulevard Norte 654, Ciudad')
ON CONFLICT (email) DO NOTHING;

-- Mostrar información de la tabla creada
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Mostrar el número de usuarios insertados
SELECT COUNT(*) as total_users FROM users;
