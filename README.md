# Blog API — Backend

API RESTful desarrollada con Node.js y Express que implementa autenticación de usuarios y publicación de comentarios en tiempo real, como parte de una evaluación técnica de desarrollo web.

## Tecnologías utilizadas

- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma 5.22.0
- **Base de datos:** PostgreSQL 17
- **Autenticación:** JWT (JSON Web Tokens)
- **Seguridad:** bcryptjs, Helmet, express-rate-limit, CORS
- **Validación:** Middlewares personalizados
- **Archivos:** Multer para subida de fotos de perfil

## Requisitos previos

- Node.js v18 o superior
- PostgreSQL v14 o superior

> **Importante:** PostgreSQL debe estar instalado y corriendo en el puerto 5432 antes de ejecutar el proyecto. Si no cuenta con él, puede descargarlo desde https://www.postgresql.org/download/ — durante la instalación, establezca una contraseña para el usuario `postgres` y mantenga el puerto en 5432.

## Iniciar PostgreSQL

Antes de correr el proyecto, asegúrese de que PostgreSQL esté en ejecución:

**Windows:**
```bash
pg_ctl start -D "C:\Program Files\PostgreSQL\17\data"
```

**Mac:**
```bash
brew services start postgresql
```

**Linux:**
```bash
sudo service postgresql start
```

Cuando PostgreSQL esté ejecutándose correctamente, podrá continuar con la instalación.

## Construcción e instalación

1. Clona el repositorio:

```bash
git clone https://github.com/Karenvarond/blog-backend
cd blog-backend
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea el archivo `.env` en la raíz del proyecto:

```env
PORT=3000
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura
JWT_EXPIRATION=2h
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/blog_db?schema=public"
FRONTEND_URL=http://localhost:5173
```

> Reemplace `TU_CONTRASEÑA` con la contraseña establecida al instalar PostgreSQL.

4. Aplica las migraciones de base de datos:

```bash
npx prisma migrate dev --name init
```

5. Genera el cliente de Prisma:

```bash
npx prisma generate
```

## Compilación

Este proyecto no requiere compilación — es JavaScript ejecutado directamente con Node.js.

## Ejecución

Modo desarrollo:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

Cuando el servidor inicie correctamente, se mostrará el siguiente mensaje en la terminal:

```
Servidor corriendo en puerto 3000
Conexion a PostgreSQL establecida correctamente
```

## Endpoints de la API

| Método | Ruta | Descripción | Requiere token |
|--------|------|-------------|----------------|
| POST | `/api/register` | Registro de nuevo usuario | No |
| POST | `/api/login` | Inicio de sesión | No |
| GET | `/api/me` | Obtener datos del usuario actual | Sí |
| PUT | `/api/change-password` | Cambiar contraseña | Sí |
| GET | `/api/feed` | Obtener lista de comentarios | Sí |
| POST | `/api/feed` | Publicar nuevo comentario | Sí |

## Códigos de respuesta

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado correctamente |
| 400 | Datos incorrectos, faltantes o cabeceras ausentes en /me |
| 401 | Token inválido o expirado |
| 403 | Token no proporcionado |
| 500 | Error interno del servidor |

## Uso del token

Para acceder a los endpoints protegidos incluye el token en el header:

```
Authorization: Bearer <tu_token>
```

## Ejemplos de uso

**Login — Request:**
```json
{
  "email": "karen@correo.com",
  "password": "MiPass123!"
}
```

**Login — Response exitosa:**
```json
{
  "token_type": "Bearer",
  "access_token": "eyJhbGci...",
  "expiration": "2026-06-07T01:00:00.000Z"
}
```

## Seguridad implementada (OWASP TOP TEN 2025)

- **Inyección SQL:** Prisma ORM con queries parametrizadas
- **Autenticación rota:** JWT con expiración de 2 horas y bcrypt con 12 rondas de salt
- **Exposición de datos:** La contraseña nunca se devuelve en las respuestas
- **Control de acceso:** Rutas protegidas con middleware de verificación de token
- **Configuración incorrecta:** Helmet para cabeceras HTTP seguras, CORS restringido al frontend
- **Fuerza bruta:** Rate limiting de 10 intentos en `/login` cada 15 minutos
- **Enumeración de usuarios:** Mismo mensaje de error para usuario o contraseña incorrectos

## Patrones y arquitectura

- **Patrón MVC:** Separación en controllers, routes y middlewares
- **REST:** Verbos HTTP correctos y status codes semánticos
- **Middlewares:** Validación, autenticación y rate limiting como capas independientes

## Git Flow

Para este proyecto se establecieron las bases de la metodología Git Flow, utilizando ramas principales para separar los entornos:

- `main` — código estable listo para producción
- `develop` — rama de integración de desarrollo

Para ver el historial de commits:

```bash
git log --oneline --graph --all
```

## Uso de Inteligencia Artificial

El desarrollo de este proyecto contó con asistencia de Claude (Anthropic). La metodología empleada fue:

1. **Definición de arquitectura:** Se consultó a la IA para estructurar el proyecto siguiendo el patrón MVC
2. **Implementación de seguridad:** La IA validó que las implementaciones cumplieran con OWASP TOP TEN 2025
3. **Revisión de status codes:** Se verificó que cada endpoint devolviera los códigos exactos requeridos
4. **Resolución de errores:** La IA apoyó en la resolución de problemas de configuración de PostgreSQL y Prisma
5. **Decisiones finales:** Todas las decisiones de diseño e implementación fueron tomadas y validadas por la desarrolladora