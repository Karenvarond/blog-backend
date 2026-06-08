# Blog API — Backend

API RESTful desarrollada con Node.js y Express que implementa autenticación de usuarios y publicación de comentarios en tiempo real, como parte de una evaluación técnica de desarrollo web.

## Tecnologías utilizadas

- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma 5
- **Base de datos:** SQLite
- **Autenticación:** JWT (JSON Web Tokens)
- **Seguridad:** bcryptjs, validación estricta de tipos (typeof)
- **Validación:** Middlewares personalizados
- **Archivos:** Multer para subida de fotos de perfil

## Requisitos previos

- Node.js v18 o superior

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
DATABASE_URL="file:./dev.db"
```

4. Genera el cliente de Prisma y sincroniza la base de datos:

```bash
npx prisma generate
npx prisma db push
```

## Compilación

Este proyecto no requiere compilación — es JavaScript ejecutado directamente con Node.js.

## Ejecución

Modo desarrollo:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Endpoints de la API

| Método | Ruta | Descripción | Requiere token |
|--------|------|-------------|----------------|
| POST | `/register` | Registro de nuevo usuario | No |
| POST | `/login` | Inicio de sesión | No |
| GET | `/me` | Obtener datos del usuario actual | Sí |
| PUT | `/change-password` | Cambiar contraseña | Sí |
| GET | `/feed` | Obtener lista de comentarios | Sí |
| POST | `/feed` | Publicar nuevo comentario | Sí |

## Códigos de respuesta

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado correctamente |
| 400 | Datos incorrectos, faltantes o cabeceras ausentes en /me |
| 401 | Token inválido o expirado, o credenciales erróneas |
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
  "username": "karenDiaz",
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

- **Inyección:** Prisma ORM con queries parametrizadas y validación estricta de tipos (`typeof`) en inputs.
- **Autenticación rota:** JWT con expiración de 2 horas y bcrypt con 12 rondas de salt.
- **Exposición de datos:** La contraseña nunca se devuelve en las respuestas.
- **Control de acceso:** Rutas protegidas con middleware de verificación de token discriminando errores 403 y 401.
- **Enumeración de usuarios:** Mismo mensaje de error para usuario o contraseña incorrectos.

## Patrones y arquitectura

- **Patrón MVC:** Separación en controllers, routes y middlewares.
- **REST:** Verbos HTTP correctos y status codes semánticos.
- **Middlewares:** Validación y autenticación como capas independientes.

## Git Flow

Este proyecto sigue la metodología Git Flow:

- `main` — código estable listo para producción
- `develop` — rama de integración de desarrollo
- `feature/*` — ramas para cada funcionalidad

Para ver el historial de commits:

```bash
git log --oneline --graph --all
```

## Uso de Inteligencia Artificial

El desarrollo de este proyecto contó con asistencia de Inteligencia Artificial. La metodología empleada fue:

1. **Definición de arquitectura:** Se consultó a la IA para estructurar el proyecto siguiendo el patrón MVC.
2. **Implementación de seguridad:** La IA validó que las implementaciones cumplieran con OWASP TOP TEN 2025.
3. **Revisión de status codes:** Se verificó que cada endpoint devolviera los códigos exactos requeridos.
4. **Resolución de errores:** La IA apoyó en la depuración de la lógica de validación de contraseñas.
5. **Decisiones finales:** Todas las decisiones de diseño e implementación fueron tomadas y validadas por la desarrolladora.