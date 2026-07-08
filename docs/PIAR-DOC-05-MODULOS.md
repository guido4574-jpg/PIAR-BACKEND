# PIAR - Documento 05: Codificación de módulos

## 1. Propósito del documento

Este documento analiza los módulos que pueden identificarse en el código actual del proyecto PIAR. La documentación se fundamenta exclusivamente en la implementación real presente en [backend/server.js](backend/server.js), [backend/db.js](backend/db.js) y [data/db.json](data/db.json).

---

## 2. Módulo principal: servidor HTTP

### Objetivo
Atender peticiones HTTP, entregar recursos estáticos y procesar la API del proyecto.

### Archivos que lo implementan
- [backend/server.js](backend/server.js)

### Funciones principales

#### 1. `handleApi(request, response, url)`
- Función: gestionar todas las rutas bajo `/api`.
- Fragmento importante:

```js
if (url.pathname.startsWith("/api")) {
    await handleApi(request, response, url);
    return;
}
```

- Explicación: define el punto de entrada para la API y separa el procesamiento del servidor de los recursos estáticos.

#### 2. `serveStatic(response, pathname)`
- Función: entregar archivos estáticos desde la raíz del proyecto.
- Fragmento importante:

```js
const safePath = pathname === "/" ? "/index.html" : pathname;
const filePath = path.normalize(path.join(ROOT, safePath));
```

- Explicación: construye la ruta del recurso solicitado y valida que no salga fuera del directorio del proyecto.

#### 3. `readDbFromMysql()`
- Función: construir el objeto de respuesta de la API `/api/data` a partir de datos recuperados desde MySQL.
- Fragmento importante:

```js
resolve({
    institution: {
        name: "Institucion Educativa Reynaldo Matiz"
    },
    auth: {
        validEmail: "guido4574@gmail.com",
        validPassword: "IRMA4574"
    },
    students: estudiantes,
    teachers: [],
    piars: [],
    reportTypes: ["Seguimiento individual", "PIAR institucional"],
    discapacidades: ["Visual", "Auditiva", "Fisica", "Cognitiva"],
    grados: ["6A", "6B", "7A", "7B"],
    areas: ["Matematicas", "Lenguaje"]
});
```

- Explicación: esta función compone un payload de datos estructurado para consumo del frontend.

#### 4. `getStudentsFromMysql(callback)`
- Función: obtener estudiantes desde MySQL y adaptarlos al contrato esperado por el frontend.
- Fragmento importante:

```js
db.query(
    "SELECT * FROM estudiante ORDER BY id_estudiante",
    (err, rows) => {
        if (err) {
            callback(err);
            return;
        }

        callback(null, rows.map(mapStudentRowToFrontend));
    }
);
```

- Explicación: realiza la lectura de datos desde la tabla `estudiante` y aplica una transformación sobre cada fila.

#### 5. `mapStudentRowToFrontend(row)`
- Función: transformar un registro de MySQL al modelo que consume la SPA.
- Fragmento importante:

```js
return {
    id: row.id_estudiante,
    id_estudiante: row.id_estudiante,
    nombres: nameParts.nombres,
    apellidos: nameParts.apellidos,
    nombre: row.nombre,
    documento: row.documento,
    edad: row.edad ?? "",
    grado: grade,
    curso: grade,
    discapacidad: disability,
    condicion_especial: disability,
    diagnostico: disability,
    estado: "activo"
};
```

- Explicación: adapta campos antiguos a un contrato más amplio y conserva compatibilidad con propiedades previas.

#### 6. `normalizeStudentPayload(payload)`
- Función: normalizar un payload recibido desde un cliente antiguo o nuevo.
- Fragmento importante:

```js
const fullName = [payload.nombres, payload.apellidos].filter(Boolean).join(" ").trim();

return {
    nombre: payload.nombre || fullName,
    documento: payload.documento,
    edad: payload.edad || null,
    curso: payload.curso || payload.grado || null,
    condicion_especial: payload.condicion_especial || payload.discapacidad || payload.diagnostico || null
};
```

- Explicación: permite que el backend procese solicitudes con distintos nombres de campos sin romper el esquema actual.

#### 7. `splitStudentName(nombre)`
- Función: dividir el campo `nombre` en `nombres` y `apellidos` de manera temporal.
- Fragmento importante:

```js
const parts = nombre.trim().split(/\s+/).filter(Boolean);
```

- Explicación: esta estrategia permite responder con un formato más completo sin modificar la base de datos.

### Buenas prácticas observadas
- Se separan responsabilidades en funciones pequeñas.
- Se centraliza el envío de respuestas JSON en `sendJson()`.
- Se implementa manejo de errores en bloques `try/catch` y callbacks.

### Patrones de diseño encontrados
- Patrón de función de servicio: el servidor centraliza lógica de negocio y rutas.
- Transformación de datos: se aplica una adaptación explícita al formato de salida.

---

## 3. Módulo de conexión a base de datos

### Objetivo
Establecer la comunicación con MySQL usando la librería `mysql2`.

### Archivos que lo implementan
- [backend/db.js](backend/db.js)

### Funciones principales

#### 1. Creación de la conexión
- Fragmento importante:

```js
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "123456",
    database: "piar",
    port: 3306
});
```

- Explicación: define la configuración de acceso a la base de datos MySQL.

#### 2. Conexión inicial
- Fragmento importante:

```js
db.connect((err) => {
    if (err) {
        console.error("Error de conexión:", err);
        return;
    }

    console.log("✅ Conectado a MySQL");
});
```

- Explicación: valida el estado inicial de la conexión y publica un mensaje al iniciar el backend.

### Buenas prácticas observadas
- Se encapsula la conexión en un módulo independiente.
- La configuración se mantiene en un solo archivo.

### Patrones de diseño encontrados
- Módulo de infraestructura: separa la conexión a la base de datos del resto de la lógica de negocio.

---

## 4. Módulo de persistencia basada en archivo JSON

### Objetivo
Mantener una fuente de datos de respaldo o de prueba para el proyecto.

### Archivos que lo implementan
- [backend/server.js](backend/server.js)
- [data/db.json](data/db.json)

### Funciones principales

#### 1. `readDb()`
- Función: leer el contenido del archivo JSON.
- Fragmento importante:

```js
async function readDb() {
    return JSON.parse(await fs.readFile(DB_PATH, "utf8"));
}
```

- Explicación: permite cargar el contenido persistido desde el disco.

#### 2. `writeDb(data)`
- Función: escribir el contenido del archivo JSON.
- Fragmento importante:

```js
async function writeDb(data) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
}
```

- Explicación: permite actualizar el archivo de respaldo con nuevos datos.

#### 3. `readSeedData()`
- Función: leer el conjunto de datos base del frontend.
- Fragmento importante:

```js
const source = await fs.readFile(path.join(ROOT, "js", "data.js"), "utf8");
```

- Explicación: aunque el archivo `js/data.js` no está presente en el árbol actual, esta función es parte del código real y demuestra el mecanismo usado para restaurar datos base.

### Buenas prácticas observadas
- Se usa lectura y escritura asíncrona con `fs/promises`.
- Se preserva el formato JSON con indentación legible.

### Patrones de diseño encontrados
- Persistencia simple basada en archivo.

---

## 5. Módulo de utilidad de respuestas HTTP

### Objetivo
Centralizar la construcción de respuestas JSON para la API.

### Archivos que lo implementan
- [backend/server.js](backend/server.js)

### Función principal

#### `sendJson(response, status, data)`
- Fragmento importante:

```js
response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
});
```

- Explicación: estandariza las respuestas de la API y añade cabeceras de control de acceso.

### Buenas prácticas observadas
- Se evita repetir la lógica de serialización y cabeceras en cada ruta.

---

## 6. Módulo de lectura de cuerpo de solicitudes

### Objetivo
Recibir y parsear el cuerpo de una petición HTTP en formato JSON.

### Archivos que lo implementan
- [backend/server.js](backend/server.js)

### Función principal

#### `readJsonBody(request)`
- Fragmento importante:

```js
request.on("data", chunk => {
    body += chunk;
});
request.on("end", () => {
    try {
        resolve(body ? JSON.parse(body) : {});
    } catch (error) {
```

- Explicación: transforma la entrada del cliente a un objeto JavaScript para su procesamiento.

### Buenas prácticas observadas
- El cuerpo se procesa de forma asíncrona.
- Se maneja el caso de un cuerpo vacío.

---

## 7. Conclusión

El proyecto actual organiza su lógica en módulos funcionales muy simples: servidor HTTP, conexión a MySQL, persistencia basada en archivo JSON, respuestas HTTP y lectura de cuerpos de solicitud. La organización es básica, pero se observa una intención clara de separar responsabilidades de forma práctica y comprensible.
