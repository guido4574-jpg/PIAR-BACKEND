# PIAR - Documento 10: Ambientes de desarrollo y pruebas

## 1. Propósito del documento

Este documento describe los ambientes de desarrollo y pruebas del proyecto PIAR con base en lo que puede verificarse en el repositorio y en la implementación actual del backend. La información se basa en [README.md](README.md), [backend/server.js](backend/server.js), [backend/db.js](backend/db.js) y [package.json](package.json).

---

## 2. Sistema operativo

### Ambiente identificado
- El proyecto se está desarrollando en Windows, según la información del entorno de trabajo actual.

### Evidencia práctica
- El repositorio se trabaja desde la ruta local `c:\Users\Catalina Plazas\Desktop\PIAR-BACKEND`.
- Los comandos de ejecución se ejecutan en terminal PowerShell.

### Observación
No existe en el código una referencia explícita a un sistema operativo específico, pero el entorno de ejecución del proyecto corresponde a Windows en este caso.

---

## 3. Visual Studio Code

### Herramienta utilizada
- El proyecto está siendo desarrollado en Visual Studio Code.

### Evidencia
- El entorno de trabajo actual corresponde a una sesión de VS Code.
- El archivo de documentación se está editando directamente en el editor.

### Observación
No existe un archivo de configuración específico de VS Code en el repositorio, pero el proyecto se desarrolla de forma natural en este entorno.

---

## 4. Node.js

### Ambiente de ejecución
- El backend se ejecuta con Node.js.

### Evidencia en código y documentación
- [README.md](README.md) indica que la aplicación se inicia con:

```bash
node backend/server.js
```

- [backend/server.js](backend/server.js) usa módulos nativos de Node.js.

### Observación
No se declara una versión específica de Node.js en [package.json](package.json), por lo que la documentación debe referirse al entorno actual en el que se ejecuta el proyecto.

---

## 5. MySQL

### Ambiente de base de datos
- El proyecto usa MySQL como motor de base de datos para operaciones reales sobre estudiantes.

### Configuración observada
- Host: `127.0.0.1`
- Puerto: `3306`
- Base de datos: `piar`

### Evidencia
- [backend/db.js](backend/db.js)

### Observación
El proyecto necesita un servidor MySQL activo para que las rutas de estudiantes funcionen correctamente.

---

## 6. Navegador

### Ambiente de interacción
- El sistema se visualiza a través de un navegador web.

### Evidencia disponible
- [README.md](README.md) indica que la aplicación se debe abrir en:

```text
http://localhost:8080
```

### Observación
No se identifica un navegador específico en el código, por lo que se debe entender que la interacción ocurre desde un navegador convencional.

---

## 7. Live Server

### Estado del proyecto
- No se evidencia el uso de Live Server en el código del repositorio.

### Observación
El proyecto actual no declara ni configura Live Server como herramienta de ejecución. La ejecución del backend se realiza mediante Node.js y el servidor HTTP propio del proyecto.

---

## 8. Herramientas utilizadas

| Herramienta | Uso en el proyecto | Evidencia |
|---|---|---|
| Visual Studio Code | Edición y desarrollo del proyecto | Entorno actual de trabajo |
| Node.js | Ejecutar el servidor backend | [README.md](README.md), [backend/server.js](backend/server.js) |
| MySQL | Almacenamiento y consulta de datos | [backend/db.js](backend/db.js) |
| PowerShell | Ejecución de comandos y verificación del entorno | Entorno actual |
| Git | Control de versiones | Comandos `git status`, `git log`, `git branch` |

---

## 9. Ambientes de desarrollo y pruebas

### Ambiente de desarrollo
- Entorno local en Windows.
- VS Code como editor.
- Node.js ejecutando el backend.
- MySQL como motor de base de datos.

### Ambiente de pruebas
- Se puede probar la lógica del backend mediante:
  - validación de sintaxis con `node --check backend/server.js`,
  - prueba de rutas API como `/api/health`, `/api/data` y `/api/estudiantes`,
  - y revisión de la lógica de transformación de datos en [backend/server.js](backend/server.js).

### Limitación observada
La ejecución completa de las rutas de estudiantes depende de que la base de datos MySQL esté disponible y configurada correctamente.

---

## 10. Capturas recomendadas para evidencia

Para la documentación final del SENA, se recomiendan estas capturas:

1. Captura de la terminal ejecutando `node backend/server.js`.
2. Captura del navegador accediendo a `http://localhost:8080` o `http://localhost:8080/api/health`.
3. Captura de [backend/db.js](backend/db.js) mostrando la configuración de MySQL.
4. Captura del editor VS Code con la estructura del proyecto abierta.
5. Captura de [README.md](README.md) con las instrucciones de ejecución.

---

## 11. Conclusión

El proyecto PIAR se desarrolla en un ambiente local basado en Windows, Visual Studio Code, Node.js y MySQL. El backend se ejecuta directamente con Node.js y expone una API accesible desde el navegador. No se observa el uso de Live Server ni de un framework frontend adicional en el código real del repositorio.
