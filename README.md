# Prueba técnica — Desarrollador Web

Aplicación para administrar tareas, desarrollada con NestJS, PostgreSQL, Nuxt 3 y Pinia.

## Tecnologías

- Backend: NestJS y TypeScript.
- Base de datos: PostgreSQL con TypeORM.
- Frontend: Nuxt 3, Vue 3 y Pinia.
- Alertas: SweetAlert2.
- Autenticación: token fijo mediante `x-api-token`.
- Gestor de paquetes: **npm**.

## Ejecución local

Se utiliza `npm` para instalar dependencias y ejecutar los proyectos.

### 1. Base de datos

Desde la raíz del repositorio:

```bash
docker compose up -d
```

La aplicación espera una base PostgreSQL local. La tabla `tasks` debe existir con las columnas `id`, `title`, `description`, `completed` y `created_at`. Si aún no existe, créala con:

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Backend

```bash
cd backend
npm install
```

Configura `backend/.env` con los valores de tu entorno local:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=norte70_user
DB_PASSWORD=local_dev_password
DB_DATABASE=norte70
API_TOKEN=norte70-dev-token-2026
```

Inicia el servidor:

```bash
npm run start:dev
```

La API estará disponible en `http://localhost:3000`.

### 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
```

Configura `frontend/.env` con un token que coincida con `API_TOKEN` del backend:

```dotenv
NUXT_PUBLIC_API_TOKEN=norte70-dev-token-2026
```

Inicia la aplicación:

```bash
npm run dev -- --port 3001
```

Abre `http://localhost:3001`.

## Endpoints

Todas las rutas requieren el encabezado `x-api-token`.

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/tasks` | Crear una tarea |
| `GET` | `/tasks` | Listar tareas |
| `GET` | `/tasks/:id` | Consultar una tarea |
| `PATCH` | `/tasks/:id` | Actualizar una tarea |
| `DELETE` | `/tasks/:id` | Eliminar una tarea |

El título es obligatorio y admite hasta 150 caracteres. El backend valida los datos recibidos.

## Ejercicios

- Ejercicios de lógica: `ejercicios-logica/src/ejercicios.ts`
- Consulta SQL del ejercicio 5: `ejercicios-logica/sql/ejercicio5.sql`
- Respuestas teóricas: `docs/respuestas-teoricas.pdf`

Para ejecutar los ejercicios de TypeScript:

```bash
cd ejercicios-logica
npm install
npm run dev
```

La consulta SQL utiliza las tablas `ALUMNO`, `PRESTAMO` y `LIBRO` del enunciado, por lo que debe ejecutarse en una base que contenga ese esquema.

## Decisiones técnicas

- Se eligió PostgreSQL para almacenar las tareas.
- La lógica está separada entre controladores, servicios, DTOs y entidad.
- Las rutas de tareas están protegidas mediante un guard que valida un token fijo.
- El título se limita a 150 caracteres en el frontend y se valida también en el backend.

## Uso de herramientas de IA

Se utilizó una herramienta de IA generativa como apoyo para consultar conceptos, desarrollar y revisar fragmentos de código, resolver errores y preparar la documentación. Revisé y probé el proyecto durante su desarrollo.

## Nota

El token y las credenciales mostradas son únicamente para desarrollo local. No deben utilizarse en producción. No subas archivos `.env` al repositorio.
