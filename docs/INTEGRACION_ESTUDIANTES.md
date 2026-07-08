# Integracion Backend-Frontend: Modulo Estudiantes

## Objetivo
Adaptar el backend para entregar estudiantes con el contrato funcional que consume la SPA oficial, sin modificar la estructura fisica actual de MySQL y sin cambiar URLs existentes.

## Archivo modificado
- `backend/server.js`

## Motivo del cambio
La tabla actual `estudiante` contiene campos basicos (`nombre`, `documento`, `edad`, `curso`, `condicion_especial`), mientras el frontend espera un modelo mas amplio (`nombres`, `apellidos`, `grado`, `discapacidad`, `diagnostico`, `estado`, apoyos, barreras, etc.).

## Funciones nuevas

### `getStudentsFromMysql(callback)`
Obtiene registros desde MySQL usando la tabla `estudiante` y aplica una transformacion antes de responder al frontend.

### `mapStudentRowToFrontend(row)`
Convierte una fila de MySQL al contrato esperado por la SPA oficial. Conserva propiedades legacy como `id_estudiante`, `nombre`, `curso` y `condicion_especial` para compatibilidad.

### `normalizeStudentPayload(payload)`
Acepta datos enviados por clientes antiguos (`nombre`, `curso`, `condicion_especial`) o por el frontend nuevo (`nombres`, `apellidos`, `grado`, `discapacidad`, `diagnostico`) y los adapta a las columnas actuales de MySQL.

### `splitStudentName(nombre)`
Divide temporalmente el campo `nombre` en `nombres` y `apellidos` sin modificar la base de datos.

## Funciones modificadas

### `handleApi(request, response, url)`
- `GET /api/estudiantes` ahora responde estudiantes transformados.
- `POST /api/estudiantes` acepta contrato nuevo y lo normaliza hacia MySQL actual.
- `PUT /api/estudiantes/:id` acepta contrato nuevo y lo normaliza hacia MySQL actual.
- `DELETE /api/estudiantes/:id` se mantiene, usando la tabla actual `estudiante`.

### `readDbFromMysql()`
Ahora reutiliza `getStudentsFromMysql()` para que `/api/data` y `/api/estudiantes` entreguen el mismo contrato de estudiantes.

## Explicacion tecnica
Se implemento una capa de transformacion dentro del backend. Esta capa permite que el frontend trabaje con el modelo completo sin exigir todavia cambios fisicos en MySQL. Es una migracion incremental: primero se estabiliza el contrato API, luego se podran ampliar tablas.

## Explicacion para un estudiante
La base de datos todavia guarda pocos datos del estudiante, pero la pantalla necesita mas informacion. Entonces el backend actua como traductor: toma lo que existe en MySQL y lo convierte al formato que la pantalla entiende.

## Riesgos
- Algunos campos llegan vacios porque aun no existen columnas reales en MySQL.
- `nombres` y `apellidos` se calculan dividiendo `nombre`, lo cual no siempre sera perfecto.
- `diagnostico` y `discapacidad` usan temporalmente `condicion_especial`.

## Ventajas
- No se rompe el frontend.
- No se modifica MySQL todavia.
- Se mantienen endpoints existentes.
- El modulo estudiantes ya consume datos transformados desde backend.

## Forma de revertir
Revertir los cambios en `backend/server.js` al commit anterior o restaurar las rutas para que consulten directamente `SELECT * FROM estudiante` sin `mapStudentRowToFrontend()`.

## Pruebas realizadas
- `node --check backend/server.js`
- `GET /api/health`
- `GET /api/estudiantes`
- `GET /api/data`
- `POST /api/estudiantes` con estudiante temporal
- `PUT /api/estudiantes/:id` sobre estudiante temporal
- `DELETE /api/estudiantes/:id` para eliminar el estudiante temporal
- Carga del frontend oficial en `http://localhost:5500/`
- Verificacion de `js/config.js` apuntando a `http://localhost:8080`
