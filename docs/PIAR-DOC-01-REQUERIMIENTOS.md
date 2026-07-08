# PIAR - Documento 01: Requerimientos del Sistema

## 1. Propósito del documento

Este documento recopila los requerimientos del sistema que pueden verificarse directamente en el código actual del proyecto PIAR. La información fue extraída de los archivos [backend/server.js](backend/server.js), [backend/db.js](backend/db.js), [package.json](package.json), [README.md](README.md) y [data/db.json](data/db.json).

---

## 2. Requerimientos funcionales

### RF-01: Servir contenido estático del proyecto
- Descripción: El sistema debe entregar archivos estáticos como HTML, CSS, JavaScript y otros recursos desde el directorio raíz del proyecto.
- Evidencia en código: La función `serveStatic()` en [backend/server.js](backend/server.js) resuelve rutas como `/` a `/index.html` y entrega archivos desde la raíz del proyecto.
- Relación con el código: Si la ruta no corresponde a una API, el servidor intenta leer el recurso solicitado desde el disco.

### RF-02: Exponer una ruta de verificación del servicio
- Descripción: El sistema debe responder a una solicitud de verificación para confirmar que la API está disponible.
- Evidencia en código: La ruta `GET /api/health` devuelve un objeto JSON con estado `ok: true` y el servicio `PIAR API`.
- Relación con el código: Se implementa directamente en `handleApi()` en [backend/server.js](backend/server.js).

### RF-03: Exponer datos del sistema a través de una API
- Descripción: El sistema debe proporcionar un endpoint para consultar datos del proyecto.
- Evidencia en código: La ruta `GET /api/data` devuelve un objeto con información institucional, autenticación, estudiantes, docentes, PIAR, tipos de reporte, discapacidades, grados y áreas.
- Relación con el código: La función `readDbFromMysql()` arma esa respuesta a partir de los datos recuperados desde MySQL y de los valores definidos en el mismo servidor.

### RF-04: Gestionar estudiantes por medio de operaciones CRUD
- Descripción: El sistema debe permitir consultar, crear, actualizar y eliminar estudiantes mediante la API.
- Evidencia en código:
  - `GET /api/estudiantes` consulta estudiantes.
  - `POST /api/estudiantes` crea un estudiante.
  - `PUT /api/estudiantes/:id` actualiza un estudiante.
  - `DELETE /api/estudiantes/:id` elimina un estudiante.
- Relación con el código: Estas rutas están implementadas en `handleApi()` y usan consultas SQL sobre la tabla `estudiante` en [backend/server.js](backend/server.js).

### RF-05: Adaptar datos de estudiantes al contrato esperado por el frontend
- Descripción: El sistema debe transformar los registros almacenados en MySQL al formato que consume el frontend.
- Evidencia en código: Las funciones `getStudentsFromMysql()`, `mapStudentRowToFrontend()` y `normalizeStudentPayload()` transforman los datos antes de responder o guardar.
- Relación con el código: Esto permite que los endpoints de estudiantes respondan con un contrato más amplio que el esquema actual de MySQL.

### RF-06: Permitir reiniciar los datos desde un conjunto base
- Descripción: El sistema debe permitir restaurar los datos desde un conjunto inicial definido en el proyecto.
- Evidencia en código: La ruta `POST /api/reset` lee un conjunto de datos base desde el archivo de datos del frontend y lo escribe en la persistencia activa.
- Relación con el código: Usa `readSeedData()` y `writeDb()` en [backend/server.js](backend/server.js).

### RF-07: Soportar solicitudes preflight para CORS
- Descripción: El sistema debe responder a solicitudes `OPTIONS` para habilitar el uso de la API desde clientes web.
- Evidencia en código: El bloque que atiende `request.method === "OPTIONS"` responde con un JSON de confirmación.
- Relación con el código: Esto se implementa en [backend/server.js](backend/server.js).

---

## 3. Requerimientos no funcionales

### RNF-01: Puerto configurable del servidor
- Descripción: El servidor debe poder iniciarse en un puerto configurable desde variables de entorno.
- Evidencia en código: `const PORT = Number(process.env.PORT || 8080);`
- Relación con el código: El arranque del servidor usa esa variable en [backend/server.js](backend/server.js).

### RNF-02: Uso de un motor de base de datos relacional
- Descripción: El sistema requiere una conexión a MySQL para operaciones de estudiantes.
- Evidencia en código: La conexión se realiza con `mysql2` en [backend/db.js](backend/db.js).
- Relación con el código: El backend ejecuta consultas SQL sobre la base de datos `piar`.

### RNF-03: Respuesta JSON para la API
- Descripción: Los endpoints expuestos por la API deben responder en formato JSON.
- Evidencia en código: La función `sendJson()` establece `Content-Type: application/json` y envía la respuesta serializada con `JSON.stringify()`.
- Relación con el código: Todas las respuestas de la API se estructuran de esta forma en [backend/server.js](backend/server.js).

### RNF-04: Manejo explícito de errores HTTP
- Descripción: El sistema debe responder con códigos de estado HTTP claros cuando ocurre un error o cuando una ruta no existe.
- Evidencia en código: Se utilizan respuestas `500`, `404`, `403` y `200`/`201` según el caso.
- Relación con el código: El bloque `try/catch` y las funciones de respuesta manejan estas condiciones directamente.

### RNF-05: Validación básica de rutas estáticas
- Descripción: El sistema debe evitar accesos fuera del directorio raíz al servir archivos.
- Evidencia en código: `serveStatic()` valida que la ruta resuelta permanezca dentro del directorio raíz del proyecto antes de leer archivos.
- Relación con el código: Se implementa un control de seguridad básico contra rutas maliciosas o fuera del alcance del proyecto.

---

## 4. Explicación de los requerimientos

Los requerimientos anteriores se derivan de la implementación concreta del servidor y de la interacción con la base de datos. No se incorporan funcionalidades que no aparezcan en el código. El proyecto actual se enfoca en:

- ofrecer una interfaz web estática,
- exponer una API simple,
- integrar datos de estudiantes con MySQL,
- y mantener una persistencia de respaldo basada en un archivo JSON.

---

## 5. Relación con el código existente

| Área | Archivo | Evidencia |
|---|---|---|
| Servidor HTTP | [backend/server.js](backend/server.js) | Definición del servidor, rutas API, manejo de archivos estáticos y transformación de datos |
| Conexión MySQL | [backend/db.js](backend/db.js) | Configuración de conexión a MySQL |
| Dependencias | [package.json](package.json) | Declara `mysql2` como dependencia |
| Documentación general | [README.md](README.md) | Indica cómo ejecutar la aplicación y la URL base |
| Datos base | [data/db.json](data/db.json) | Contiene datos institucionales, auth y ejemplos de estudiantes |

---

## 6. Conclusión

El sistema actual implementa un backend ligero basado en Node.js que expone servicios para consumo web, gestiona estudiantes con MySQL y ofrece también una ruta de respaldo basada en archivos JSON. Los requerimientos documentados aquí corresponden únicamente a lo que el código realiza hoy.
