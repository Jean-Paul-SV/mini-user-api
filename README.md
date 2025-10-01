# Mini API de Gestión de Usuarios

## Descripción

API RESTful básica para la gestión de usuarios desarrollada como parte de una prueba técnica para Desarrollador Jr. Backend. La aplicación permite realizar operaciones CRUD completas sobre una entidad de usuario.

## Características

- **CRUD Completo**: Crear, leer, actualizar y eliminar usuarios
- **Validación de Datos**: Validación robusta usando Joi
- **Paginación**: Soporte para paginación en listados
- **Búsqueda**: Búsqueda por nombre y email
- **Manejo de Errores**: Sistema centralizado de manejo de errores
- **Seguridad**: Rate limiting, CORS, Helmet
- **Docker**: Contenedorización completa con Docker Compose
- **Base de Datos**: PostgreSQL con triggers automáticos
- **Documentación**: API completamente documentada

## Tecnologías Utilizadas

- **Backend**: Node.js + Express.js
- **Base de Datos**: PostgreSQL
- **Validación**: Joi
- **Contenedores**: Docker + Docker Compose
- **Seguridad**: Helmet, CORS, Rate Limiting

## Estructura del Proyecto

```
mini-user-api/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de PostgreSQL
│   ├── controllers/
│   │   └── userController.js    # Lógica de negocio
│   ├── middleware/
│   │   ├── errorHandler.js      # Manejo de errores
│   │   └── validation.js        # Validación de datos
│   ├── models/
│   │   └── User.js              # Modelo de datos
│   ├── routes/
│   │   └── userRoutes.js        # Definición de rutas
│   └── server.js                # Servidor principal
├── database/
│   └── init.sql                 # Script de inicialización
├── scripts/
│   └── init-db.js              # Script de inicialización Node.js
├── docker-compose.yml           # Orquestación de contenedores
├── Dockerfile                   # Imagen de la aplicación
└── package.json                 # Dependencias del proyecto
```

## Instalación y Ejecución

### Opción 1: Con Docker (Recomendado)

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd mini-user-api
   ```

2. **Ejecutar con Docker Compose**
   ```bash
   docker compose up -d --build
   ```

3. **Verificar que los servicios estén funcionando**
   ```bash
   docker compose ps
   ```

4. **Acceder a la aplicación**
   - API: http://localhost:3000
   - Documentación simple: http://localhost:3000/api
   - Adminer (DB Admin): http://localhost:8080

### Opción 2: Instalación Local

1. **Prerrequisitos**
   - Node.js 18+
   - PostgreSQL 12+

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp config.example.env .env
   # Editar .env con tus credenciales de PostgreSQL
   ```

4. **Inicializar la base de datos**
   ```bash
   npm run init-db
   ```

5. **Ejecutar la aplicación**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   ```

## Documentación de la API

### Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Información general de la API |
| GET | `/api/health` | Health check |
| GET | `/api` | Listado simple de rutas y métodos |
| POST | `/api/users` | Crear usuario |
| GET | `/api/users` | Listar usuarios (con paginación) |
| GET | `/api/users/search` | Buscar usuarios |
| GET | `/api/users/:id` | Obtener usuario por ID |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |

### Ejemplos de Uso

#### 1. Crear un Usuario
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "age": 28,
    "phone": "+1234567890",
    "address": "Calle Principal 123"
  }'
```

#### 2. Obtener Todos los Usuarios
```bash
curl http://localhost:3000/api/users?page=1&limit=10
```

#### 3. Buscar Usuarios
```bash
curl http://localhost:3000/api/users/search?search=juan
```

#### 4. Obtener Usuario por ID
```bash
curl http://localhost:3000/api/users/1
```

#### 5. Actualizar Usuario
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Carlos Pérez",
    "age": 29
  }'
```

#### 6. Eliminar Usuario
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

### Respuestas de la API

#### Respuesta Exitosa
```json
{
  "message": "Usuario creado exitosamente",
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "age": 28,
    "phone": "+1234567890",
    "address": "Calle Principal 123",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Respuesta de Error
```json
{
  "error": "Datos de validación inválidos",
  "details": [
    "El email es requerido",
    "El nombre debe tener al menos 2 caracteres"
  ]
}
```

## Configuración

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | 3000 |
| `NODE_ENV` | Entorno de ejecución | development |
| `DB_HOST` | Host de PostgreSQL | localhost |
| `DB_PORT` | Puerto de PostgreSQL | 5432 |
| `DB_NAME` | Nombre de la base de datos | mini_user_api |
| `DB_USER` | Usuario de PostgreSQL | postgres |
| `DB_PASSWORD` | Contraseña de PostgreSQL | - |

## Docker

### Comandos Docker Útiles

```bash
# Construir imagen
docker build -t mini-user-api .

# Ejecutar contenedor
docker run -p 3000:3000 mini-user-api

# Ver logs
docker-compose logs -f api

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

## Testing

Para probar la API, puedes usar:

1. **cURL** (ejemplos arriba)
2. **Postman** - Importar la colección
3. **Thunder Client** (VS Code)
4. **Insomnia**

## Monitoreo

- **Health Check**: `GET /api/health`
- **Logs**: Los logs se muestran en consola
- **Métricas**: Uptime disponible en health check

## Seguridad

- Rate limiting (100 requests/15min)
- CORS configurado
- Helmet para headers de seguridad
- Validación de entrada
- Sanitización de datos
- Manejo seguro de errores

## Despliegue

### Producción con Docker

1. Configurar variables de entorno de producción
2. Usar `docker-compose.prod.yml` (crear si es necesario)
3. Configurar reverse proxy (Nginx)
4. Configurar SSL/TLS
5. Monitoreo y logs

## Patrones de Diseño Implementados

### 1. **Repository Pattern**
- Separación entre lógica de negocio y acceso a datos
- Modelo `User` encapsula operaciones de base de datos

### 2. **Middleware Pattern**
- Validación, manejo de errores y logging como middlewares
- Reutilización y composición de funcionalidades

### 3. **Controller Pattern**
- Separación de responsabilidades
- Controladores manejan HTTP, modelos manejan datos

### 4. **Error Handler Pattern**
- Manejo centralizado de errores
- Respuestas consistentes de error

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC.

## Autor

**Jean Paul Serrato Violeth** - Desarrollador Backend Jr.

---

## Aprendizajes y Mejoras

Ver el archivo [APRENDIZAJES.md](./APRENDIZAJES.md) para una reflexión detallada sobre el desarrollo de este proyecto.
