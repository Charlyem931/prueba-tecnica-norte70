# Prueba técnica - Norte70

## Tecnologías
- Backend: NestJS, TypeORM y PostgreSQL.
- Frontend: Nuxt 3, Vue 3 y Pinia.
- Lógica: TypeScript.
- Autenticación: token fijo mediante `x-api-token`.
- Gestor de paquetes: **npm**.

## Ejecución

1. Iniciar la base de datos:
   `docker compose up -d`

2. Configurar las variables de entorno en los archivos `.env` del backend y frontend.

3. Iniciar el backend:
   `cd backend && npm install && npm run start:dev`

4. Iniciar el frontend:
   `cd frontend && npm install && npm run dev`

5. Ejecutar los ejercicios de lógica:
   `cd ejercicios-logica && npm install && npm run dev`


## Ejercicios

- Ejercicios de lógica: `ejercicios-logica/src/ejercicios.ts`
- Consulta SQL del ejercicio 5: `ejercicios-logica/sql/ejercicio5.sql`
- Respuestas teóricas: `docs/respuestas-teoricas.pdf`


## Uso de IA

Se utilizó IA generativa como apoyo durante el desarrollo, la resolución de errores y la documentación. Revisé y probé el código durante la implementación.   


