# Guía de Instalación Rápida

## Opción 1: Con Docker (Recomendado)

```bash
# 1. Clonar el repositorio
git clone <https://github.com/Jean-Paul-SV/mini-user-api>
cd mini-user-api

# 2. Ejecutar con Docker Compose
docker-compose up -d

# 3. ¡Listo! La API estará en http://localhost:3000
```

### Opción 2: Instalación Local

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd mini-user-api

# 2. Configurar automáticamente
npm run setup

# 3. Editar credenciales de base de datos
# Editar archivo .env con tus credenciales de PostgreSQL

# 4. Inicializar base de datos
npm run init-db

# 5. Ejecutar aplicación
npm run dev
```

## Prerrequisitos

### Para Docker (Opción 1)
- Docker
- Docker Compose

### Para Instalación Local (Opción 2)
- Node.js 18+
- PostgreSQL 12+

## Verificación

Una vez instalado, verifica que todo funciona:

```bash
# Health check
curl http://localhost:3000/api/health

# Información general
curl http://localhost:3000/

# Listar usuarios
curl http://localhost:3000/api/users
```

## Servicios Docker

- **API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Adminer (DB Admin)**: http://localhost:8080

## Solución de Problemas

### Error de conexión a base de datos
```bash
# Verificar que PostgreSQL esté ejecutándose
docker-compose ps

# Ver logs
docker-compose logs postgres
```

### Puerto ocupado
```bash
# Cambiar puerto en docker-compose.yml
# O detener servicios que usen el puerto 3000
```

### Error de permisos
```bash
# En Linux/Mac
sudo chown -R $USER:$USER .
```

## Próximos Pasos

1. Importar colección de Postman desde `docs/Mini-User-API.postman_collection.json`
2. Leer documentación completa en `README.md`
3. Revisar aprendizajes en `APRENDIZAJES.md`

---

**¿Necesitas ayuda?** Revisa la documentación completa en `README.md` o los logs de la aplicación.
