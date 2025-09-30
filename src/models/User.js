/**
 * Modelo de Usuario
 * Maneja todas las operaciones de base de datos relacionadas con usuarios
 * 
 * @author Jean Paul Serrato Violeth
 * @version 1.0.0
 */

const { getPool } = require('../config/database');

class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.age = data.age;
        this.phone = data.phone;
        this.address = data.address;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    /**
     * Crear un nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @returns {Promise<User>} Usuario creado
     */
    static async create(userData) {
        const pool = getPool();
        const { name, email, age, phone, address } = userData;
        
        const query = `
            INSERT INTO users (name, email, age, phone, address)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        
        const values = [name, email, age, phone, address];
        
        try {
            const result = await pool.query(query, values);
            return new User(result.rows[0]);
        } catch (error) {
            if (error.code === '23505') { // Violación de constraint único
                throw new Error('El email ya está registrado');
            }
            throw error;
        }
    }

    /**
     * Obtener todos los usuarios
     * @param {Object} options - Opciones de paginación y filtrado
     * @returns {Promise<Array>} Lista de usuarios
     */
    static async findAll(options = {}) {
        const pool = getPool();
        const { page = 1, limit = 10, search = '' } = options;
        const offset = (page - 1) * limit;
        
        let query = 'SELECT * FROM users';
        let values = [];
        
        // Agregar búsqueda si se proporciona
        if (search) {
            query += ' WHERE name ILIKE $1 OR email ILIKE $1';
            values.push(`%${search}%`);
        }
        
        query += ' ORDER BY created_at DESC LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
        values.push(limit, offset);
        
        try {
            const result = await pool.query(query, values);
            return result.rows.map(row => new User(row));
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener un usuario por ID
     * @param {number} id - ID del usuario
     * @returns {Promise<User|null>} Usuario encontrado o null
     */
    static async findById(id) {
        const pool = getPool();
        const query = 'SELECT * FROM users WHERE id = $1';
        
        try {
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                return null;
            }
            return new User(result.rows[0]);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener un usuario por email
     * @param {string} email - Email del usuario
     * @returns {Promise<User|null>} Usuario encontrado o null
     */
    static async findByEmail(email) {
        const pool = getPool();
        const query = 'SELECT * FROM users WHERE email = $1';
        
        try {
            const result = await pool.query(query, [email]);
            if (result.rows.length === 0) {
                return null;
            }
            return new User(result.rows[0]);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Actualizar un usuario
     * @param {number} id - ID del usuario
     * @param {Object} updateData - Datos a actualizar
     * @returns {Promise<User|null>} Usuario actualizado o null
     */
    static async update(id, updateData) {
        const pool = getPool();
        const { name, email, age, phone, address } = updateData;
        
        // Construir query dinámicamente basado en los campos proporcionados
        const fields = [];
        const values = [];
        let paramCount = 1;
        
        if (name !== undefined) {
            fields.push(`name = $${paramCount}`);
            values.push(name);
            paramCount++;
        }
        
        if (email !== undefined) {
            fields.push(`email = $${paramCount}`);
            values.push(email);
            paramCount++;
        }
        
        if (age !== undefined) {
            fields.push(`age = $${paramCount}`);
            values.push(age);
            paramCount++;
        }
        
        if (phone !== undefined) {
            fields.push(`phone = $${paramCount}`);
            values.push(phone);
            paramCount++;
        }
        
        if (address !== undefined) {
            fields.push(`address = $${paramCount}`);
            values.push(address);
            paramCount++;
        }
        
        if (fields.length === 0) {
            throw new Error('No hay campos para actualizar');
        }
        
        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);
        
        const query = `
            UPDATE users 
            SET ${fields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `;
        
        try {
            const result = await pool.query(query, values);
            if (result.rows.length === 0) {
                return null;
            }
            return new User(result.rows[0]);
        } catch (error) {
            if (error.code === '23505') { // Violación de constraint único
                throw new Error('El email ya está registrado');
            }
            throw error;
        }
    }

    /**
     * Eliminar un usuario
     * @param {number} id - ID del usuario
     * @returns {Promise<boolean>} True si se eliminó, false si no existía
     */
    static async delete(id) {
        const pool = getPool();
        const query = 'DELETE FROM users WHERE id = $1';
        
        try {
            const result = await pool.query(query, [id]);
            return result.rowCount > 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Contar el total de usuarios
     * @param {string} search - Término de búsqueda opcional
     * @returns {Promise<number>} Total de usuarios
     */
    static async count(search = '') {
        const pool = getPool();
        
        let query = 'SELECT COUNT(*) FROM users';
        let values = [];
        
        if (search) {
            query += ' WHERE name ILIKE $1 OR email ILIKE $1';
            values.push(`%${search}%`);
        }
        
        try {
            const result = await pool.query(query, values);
            return parseInt(result.rows[0].count);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Convertir el usuario a objeto JSON
     * @returns {Object} Usuario como objeto JSON
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            age: this.age,
            phone: this.phone,
            address: this.address,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

module.exports = User;
