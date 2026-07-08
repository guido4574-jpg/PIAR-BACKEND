# PIAR - Documento 08: Pruebas unitarias y funcionales

## 1. Propósito del documento

Este documento recopila las pruebas que pueden documentarse con base en la implementación actual del proyecto PIAR. La información se apoya en verificaciones reales del backend y en el comportamiento visible del código fuente.

---

## 2. Pruebas realizadas

### 2.1 Prueba de sintaxis del backend

| Aspecto | Detalle | Resultado |
|---|---|---|
| Comando ejecutado | `node --check backend/server.js` | Exitoso |
| Evidencia | El comando no generó mensajes de error | Sí |
| Observación | El archivo principal del backend está libre de errores de sintaxis según la verificación realizada |

### 2.2 Verificación de ruta de salud de la API

| Aspecto | Detalle | Resultado |
|---|---|---|
| Ruta evaluada | `GET /api/health` | Implementada en el código |
| Comportamiento esperado | Responder con un JSON indicando que el servicio está activo | Confirmado por la lógica del backend |
| Evidencia | Se encuentra en [backend/server.js](backend/server.js) | Sí |

### 2.3 Verificación de consulta de estudiantes

| Aspecto | Detalle | Resultado |
|---|---|---|
| Ruta evaluada | `GET /api/estudiantes` | Implementada en el código |
| Comportamiento esperado | Consultar estudiantes desde MySQL y devolverlos transformados | Confirmado por la función `getStudentsFromMysql()` |
| Evidencia | Se encuentra en [backend/server.js](backend/server.js) | Sí |

### 2.4 Verificación de consulta de datos generales

| Aspecto | Detalle | Resultado |
|---|---|---|
| Ruta evaluada | `GET /api/data` | Implementada en el código |
| Comportamiento esperado | Devolver un objeto con información institucional, auth y estudiantes | Confirmado por `readDbFromMysql()` |
| Evidencia | Se encuentra en [backend/server.js](backend/server.js) | Sí |

### 2.5 Verificación de creación y actualización de estudiantes

| Aspecto | Detalle | Resultado |
|---|---|---|
| Ruta evaluada | `POST /api/estudiantes` y `PUT /api/estudiantes/:id` | Implementadas en el código |
| Comportamiento esperado | Insertar o actualizar un estudiante en MySQL con payload normalizado | Confirmado por las consultas SQL y `normalizeStudentPayload()` |
| Evidencia | Se encuentra en [backend/server.js](backend/server.js) | Sí |

### 2.6 Verificación de eliminación de estudiantes

| Aspecto | Detalle | Resultado |
|---|---|---|
| Ruta evaluada | `DELETE /api/estudiantes/:id` | Implementada en el código |
| Comportamiento esperado | Eliminar un registro de la tabla `estudiante` | Confirmado por la consulta SQL `DELETE FROM estudiante WHERE id_estudiante = ?` |
| Evidencia | Se encuentra en [backend/server.js](backend/server.js) | Sí |

---

## 3. Casos de prueba identificados

| Caso | Módulo | Entrada | Resultado esperado | Estado |
|---|---|---|---|---|
| CT-01 | Salud del servicio | Solicitud a `/api/health` | Respuesta JSON con `ok: true` | Implementado |
| CT-02 | Consulta de estudiantes | Solicitud a `/api/estudiantes` | Lista de estudiantes en formato adaptado | Implementado |
| CT-03 | Datos generales | Solicitud a `/api/data` | Objeto estructurado con datos institucionales y estudiantes | Implementado |
| CT-04 | Creación | Payload con datos de estudiante | Inserción en MySQL y respuesta con el estudiante creado | Implementado |
| CT-05 | Actualización | Payload de actualización | Actualización de un estudiante existente | Implementado |
| CT-06 | Eliminación | ID de estudiante | Eliminación del registro correspondiente | Implementado |

---

## 4. Evidencias disponibles

### Evidencia 1: Verificación de sintaxis
- Archivo revisado: [backend/server.js](backend/server.js)
- Comando ejecutado: `node --check backend/server.js`
- Resultado: sin errores

### Evidencia 2: Código de rutas API
- Archivo revisado: [backend/server.js](backend/server.js)
- Rutas documentadas:
  - `/api/health`
  - `/api/data`
  - `/api/estudiantes`
  - `/api/reset`

### Evidencia 3: Transformación de estudiantes
- Archivo revisado: [backend/server.js](backend/server.js)
- Funciones relevantes:
  - `getStudentsFromMysql()`
  - `mapStudentRowToFrontend()`
  - `normalizeStudentPayload()`

---

## 5. Resultados generales

El backend implementa rutas funcionales para:
- verificar el estado del servicio,
- consultar estudiantes,
- consultar datos generales,
- crear, actualizar y eliminar estudiantes,
- y restaurar datos base.

La verificación de sintaxis realizada sobre [backend/server.js](backend/server.js) no reportó errores. Los demás casos de prueba pueden considerarse implementados en el código, aunque su ejecución real dependerá de la disponibilidad de MySQL y del entorno de ejecución.

---

