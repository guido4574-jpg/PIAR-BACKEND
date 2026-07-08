# PIAR - Documento 04: Seguridad

## 1. Propósito del documento

Este documento describe los aspectos de seguridad que pueden verificarse en el código actual del proyecto PIAR. La información se basa exclusivamente en los archivos [backend/server.js](backend/server.js), [backend/db.js](backend/db.js), [data/db.json](data/db.json) y [package.json](package.json).

---

## 2. Autenticación

### Estado actual
No existe un sistema de autenticación implementado en el backend para proteger rutas o sesiones de usuario.

### Evidencia en código
- No se identifican funciones de login, generación de tokens o verificación de credenciales.
- La ruta `GET /api/health` está abierta.
- El endpoint `GET /api/data` también está disponible sin comprobación de identidad.

### Observación técnica
La autenticación que aparece en el proyecto está contenida en los datos de ejemplo del archivo [data/db.json](data/db.json), donde se definen `validEmail` y `validPassword`, pero no se usan como mecanismo real de validación en el servidor actual.

---

## 3. Autorización

### Estado actual
No se observa un mecanismo de autorización por roles ni permisos por ruta.

### Evidencia en código
- Todas las rutas API están expuestas a cualquier cliente que haga la petición.
- No hay comprobación de usuario autenticado antes de consultar, crear, actualizar o eliminar estudiantes.

### Observación técnica
El backend actual funciona como un servicio abierto y no implementa control de acceso por perfiles.

---

## 4. Validaciones

### Validaciones existentes
Se observan validaciones muy básicas:
- La ruta estática es verificada para evitar que se salgan del directorio raíz del proyecto.
- El cuerpo de la petición se intenta parsear como JSON.
- El servidor responde con errores cuando ocurre una excepción no controlada.

### Limitaciones
- No existe validación formal de campos obligatorios antes de insertar o actualizar estudiantes.
- No se valida que `documento`, `edad`, `curso` o `condicion_especial` cumplan reglas específicas.
- No se valida el tipo de datos de entrada antes de persistir.

### Evidencia en código
- La función `readJsonBody()` intenta convertir el cuerpo a JSON.
- En `normalizeStudentPayload()` se construye un payload con valores tomados directamente de la petición.

---

## 5. Protección de datos

### Estado actual
La información sensible se maneja de forma limitada y sin cifrado aparente.

### Evidencia en código
- La conexión a MySQL usa credenciales explícitas en [backend/db.js](backend/db.js):
  - usuario: `root`
  - contraseña: `123456`
  - base de datos: `piar`
- El archivo [data/db.json](data/db.json) contiene datos de ejemplo que incluyen nombres, documentos, teléfonos, correos y datos de contacto.

### Riesgo observado
Las credenciales de acceso a la base de datos se encuentran visibles en el código fuente.

---

## 6. Riesgos actuales

| Riesgo | Descripción | Evidencia |
|---|---|---|
| Credenciales expuestas | La contraseña de MySQL está escrita directamente en el código | [backend/db.js](backend/db.js) |
| Falta de autenticación | No hay control de acceso para las rutas API | [backend/server.js](backend/server.js) |
| Falta de autorización | No existen roles ni permisos por recurso | [backend/server.js](backend/server.js) |
| Validaciones débiles | No se verifican reglas de negocio ni tipos de datos | [backend/server.js](backend/server.js) |
| Exposición de datos de ejemplo | El archivo JSON contiene información personal de ejemplo | [data/db.json](data/db.json) |

---

## 7. Recomendaciones

### Recomendación 1: Externalizar credenciales
- Mover las credenciales de MySQL a variables de entorno.
- Evitar escribir contraseñas directamente en archivos fuente.

### Recomendación 2: Implementar autenticación básica
- Añadir un mecanismo de login o token para proteger las rutas sensibles.
- Limitar el acceso a endpoints como `POST`, `PUT` y `DELETE`.

### Recomendación 3: Definir autorización por roles
- Establecer reglas para distinguir entre usuarios con permisos de lectura y permisos de escritura.

### Recomendación 4: Fortalecer validaciones
- Validar campos obligatorios antes de insertar o actualizar.
- Asegurar que los tipos de datos sean coherentes.

### Recomendación 5: Evitar exponer datos sensibles en archivos de ejemplo
- Mantener datos de prueba con información ficticia o anonimizada.

---

## 8. Resumen de seguridad

El proyecto actual presenta un nivel de seguridad muy básico. La aplicación ofrece servicios funcionales, pero no implementa mecanismos reales de autenticación, autorización ni validación robusta. El principal riesgo identificado es la exposición directa de credenciales en el código y la ausencia de control de acceso a la API.
