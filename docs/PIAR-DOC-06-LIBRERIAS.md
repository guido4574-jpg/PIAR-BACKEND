# PIAR - Documento 06: Librerías y Frameworks

## 1. Propósito del documento

Este documento lista las librerías y frameworks que aparecen en el proyecto PIAR y describe su uso real en el código existente. La información se basa exclusivamente en [package.json](package.json), [backend/db.js](backend/db.js) y [backend/server.js](backend/server.js).

---

## 2. Tabla de librerías y frameworks

| Librería / Framework | Versión | Para qué sirve | Dónde se utiliza | Justificación técnica |
|---|---:|---|---|---|
| Node.js | No declarada en package.json, pero es el entorno de ejecución del proyecto | Ejecutar el servidor HTTP y los scripts del backend | [backend/server.js](backend/server.js) | Es el entorno base sobre el cual corre la aplicación backend. |
| mysql2 | ^3.22.5 | Conectar y consultar una base de datos MySQL desde Node.js | [backend/db.js](backend/db.js), [backend/server.js](backend/server.js) | Permite ejecutar consultas SQL sobre la tabla `estudiante` y soporta la integración del backend con MySQL. |
| http (módulo nativo de Node.js) | Incluido en Node.js | Crear el servidor HTTP que atiende peticiones | [backend/server.js](backend/server.js) | Es la base del backend actual, sin necesidad de un framework adicional. |
| fs/promises (módulo nativo de Node.js) | Incluido en Node.js | Leer y escribir archivos del sistema, como el archivo JSON de respaldo | [backend/server.js](backend/server.js) | Facilita la manipulación de archivos de forma asíncrona. |
| path (módulo nativo de Node.js) | Incluido en Node.js | Resolver rutas de archivos y directorios | [backend/server.js](backend/server.js) | Permite construir rutas seguras y consistentes para servir contenido estático. |
| vm (módulo nativo de Node.js) | Incluido en Node.js | Ejecutar código JavaScript contenido en un archivo de texto | [backend/server.js](backend/server.js) | Se usa para interpretar el contenido del archivo de datos base del frontend. |

---

## 3. Observaciones importantes

### No se observa un framework web como Express o Fastify
El proyecto actual no usa un framework web para definir rutas ni manejar middlewares. El backend está construido con módulos nativos de Node.js.

### No se observa un framework frontend
No se identifican librerías de interfaz como React, Vue, Angular o Bootstrap en el código actual. El proyecto parece estar orientado a servir recursos estáticos y a exponer una API simple.

---

## 4. Conclusión

El proyecto usa una arquitectura mínima basada en Node.js y una única dependencia externa relevante: `mysql2`. El resto de la funcionalidad se implementa con módulos nativos del entorno de ejecución, lo que mantiene al backend simple y ligero.
