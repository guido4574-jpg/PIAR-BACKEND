# PIAR - Documento 09: Configuración del servidor y base de datos

## 1. Propósito del documento

Este documento recopila la configuración del servidor y la base de datos del proyecto PIAR con base en el código real del repositorio. La información se extrae de [backend/server.js](backend/server.js), [backend/db.js](backend/db.js), [package.json](package.json) y [README.md](README.md).

---

## 2. Node.js

### Entorno de ejecución
- El proyecto se ejecuta sobre Node.js.
- El archivo principal del backend se inicia con `node backend/server.js` según [README.md](README.md).

### Evidencia en código
- El servidor está implementado con módulos nativos de Node.js como `http`, `fs/promises`, `path` y `vm` en [backend/server.js](backend/server.js).

### Observación
No se define una versión específica de Node.js en [package.json](package.json), por lo que la documentación debe referirse al entorno de ejecución actual del proyecto.

---

## 3. MySQL

### Motor de base de datos
- El proyecto usa MySQL como motor principal para las operaciones de estudiantes.
- La conexión se configura en [backend/db.js](backend/db.js).

### Configuración identificada
- Host: `127.0.0.1`
- Usuario: `root`
- Contraseña: `123456`
- Base de datos: `piar`
- Puerto: `3306`

### Evidencia en código
```js
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "123456",
    database: "piar",
    port: 3306
});
```

### Observación técnica
El backend realiza consultas SQL sobre la tabla `estudiante` para operaciones de consulta, inserción, actualización y eliminación.

---

## 4. Configuración del backend

### Archivo principal
- [backend/server.js](backend/server.js)

### Puerto del servidor
- El puerto se define con:

```js
const PORT = Number(process.env.PORT || 8080);
```

### URL de ejecución
- Según [README.md](README.md), la aplicación se ejecuta en:
  - `http://localhost:8080`

### API expuesta
El backend implementa las siguientes rutas:

| Ruta | Método | Función |
|---|---|---|
| `/api/health` | GET | Verificar disponibilidad del servicio |
| `/api/data` | GET | Entregar datos generales del sistema |
| `/api/estudiantes` | GET | Consultar estudiantes |
| `/api/estudiantes` | POST | Crear estudiante |
| `/api/estudiantes/:id` | PUT | Actualizar estudiante |
| `/api/estudiantes/:id` | DELETE | Eliminar estudiante |
| `/api/reset` | POST | Restaurar datos base |

### Observación
El servidor responde en formato JSON mediante la función `sendJson()`.

---

## 5. Configuración del frontend

### Estado del frontend en el repositorio
No se encuentra en el árbol actual un frontend completo implementado como carpeta de código visible en el repositorio. Lo que sí se observa es:
- el uso de un archivo JSON de respaldo en [data/db.json](data/db.json),
- y la referencia a un recurso estático que se sirve desde la raíz del proyecto.

### Lo que se puede documentar con certeza
- El servidor sirve archivos estáticos desde la raíz.
- La ruta `/` se resuelve a `/index.html`.
- El proyecto está preparado para entregar contenido estático al navegador.

### Limitación observada
No se identifican archivos frontend adicionales como `js/`, `css/` o `index.html` en el árbol actual del repositorio, por lo que la documentación debe ser precisa y no asumir una estructura frontend inexistente.

---

## 6. Variables utilizadas

| Variable | Valor | Uso |
|---|---|---|
| `PORT` | `process.env.PORT || 8080` | Define el puerto del servidor |
| `ROOT` | `path.resolve(__dirname, "..")` | Define la raíz del proyecto |
| `DB_PATH` | `path.join(ROOT, "data", "db.json")` | Ruta del archivo JSON de respaldo |

### Observación
No aparecen variables de entorno adicionales para MySQL en el código actual. La configuración de conexión está escrita directamente en [backend/db.js](backend/db.js).

---

## 7. Puertos

| Componente | Puerto |
|---|---:|
| Servidor backend | 8080 |
| MySQL | 3306 |

---

## 8. API del proyecto

### Endpoints observados

#### 1. Health check
- Ruta: `/api/health`
- Método: `GET`
- Resultado: responde con un JSON indicando que el servicio está disponible.

#### 2. Datos generales
- Ruta: `/api/data`
- Método: `GET`
- Resultado: devuelve un objeto con información institucional, auth, estudiantes, docentes, PIAR y otros datos de apoyo.

#### 3. Estudiantes
- Ruta: `/api/estudiantes`
- Método: `GET`, `POST`
- Resultado: consulta o crea estudiantes.

#### 4. Estudiante por ID
- Ruta: `/api/estudiantes/:id`
- Método: `PUT`, `DELETE`
- Resultado: actualiza o elimina un estudiante por su identificador.

#### 5. Reset de datos
- Ruta: `/api/reset`
- Método: `POST`
- Resultado: restaura un conjunto de datos inicial desde el origen definido en el código.

---

## 9. Capturas recomendadas para evidencia

Para complementar la documentación final, se recomiendan estas capturas:

1. Captura del archivo [backend/server.js](backend/server.js) mostrando la definición de `PORT` y las rutas de la API.
2. Captura del archivo [backend/db.js](backend/db.js) mostrando la configuración de MySQL.
3. Captura de [README.md](README.md) con las instrucciones de ejecución del proyecto.
4. Captura de [data/db.json](data/db.json) como evidencia de los datos base del sistema.
5. Captura del navegador accediendo a `http://localhost:8080/api/health` o a la ruta principal del proyecto.

---

## 10. Conclusión

El proyecto PIAR cuenta con un backend basado en Node.js que escucha en el puerto `8080`, se conecta a MySQL en el puerto `3306` y expone una API simple para consultar y gestionar estudiantes. La configuración es funcional, aunque en el código actual algunas credenciales y parámetros de conexión aparecen definidos directamente en el archivo fuente.
