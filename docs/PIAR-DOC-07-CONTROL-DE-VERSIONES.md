# PIAR - Documento 07: Control de versiones

## 1. Propósito del documento

Este documento describe el control de versiones del proyecto PIAR a partir de la información verificada en el repositorio Git local. La evidencia fue extraída mediante comandos de Git sobre el estado actual del proyecto.

---

## 2. Sistema de control de versiones utilizado

El proyecto usa Git como sistema de control de versiones.

### Evidencia verificada
Se comprobó que el repositorio está en la rama principal:

- Rama actual: `main`

También se identificaron los commits más recientes del historial:

- `0709366` - `Configuracion inicial backend`
- `fcd8c85` - `Primer commit backend PIAR`

---

## 3. Rama principal

### Rama identificada
- `main`

### Observación
El repositorio actual trabaja sobre una rama principal única. No se observaron ramas adicionales en la revisión realizada.

---

## 4. Commits relevantes

| Commit | Mensaje | Observación |
|---|---|---|
| `0709366` | `Configuracion inicial backend` | Representa el estado más reciente del repositorio revisado. |
| `fcd8c85` | `Primer commit backend PIAR` | Corresponde al inicio del backend del proyecto. |

### Interpretación
El historial del proyecto es corto y muestra un inicio del backend con una configuración inicial y un primer commit base.

---

## 5. Estado actual del repositorio

La revisión del estado actual mostró lo siguiente:

- Archivos modificados:
  - [backend/db.js](backend/db.js)
  - [backend/server.js](backend/server.js)
- Archivos no rastreados:
  - [backend/query](backend/query)
  - [docs](docs)

### Observación técnica
El repositorio tiene cambios pendientes en el backend y nuevos elementos de documentación que aún no han sido agregados al control de versiones.

---

## 6. Flujo de trabajo observado

El flujo de trabajo actual es simple y directo:

1. Se trabaja sobre la rama `main`.
2. Se modifican archivos del backend o de documentación.
3. Los cambios quedan pendientes en el área de trabajo hasta ser añadidos al índice y confirmados.

### Limitaciones observadas
- No se evidencia un flujo con ramas de desarrollo, integración o release.
- No se observan etiquetas ni versiones explícitas en el historial revisado.
- No se observa una política formal de commits o pull requests.

---

## 7. Organización del repositorio

La estructura del repositorio está organizada en carpetas principales:

- [backend](backend) para la lógica del servidor y la conexión a MySQL.
- [data](data) para datos de respaldo o prueba.
- [docs](docs) para documentación técnica.
- [package.json](package.json) para dependencias del proyecto.

### Relación con Git
El control de versiones está siendo aplicado sobre esta estructura de archivos, especialmente sobre los componentes del backend y la documentación.

---

## 8. Capturas recomendadas para evidenciar Git

Para incluir evidencia visual del control de versiones en la documentación de SENA, se recomiendan las siguientes capturas manuales:

1. Captura del estado de Git con `git status`.
2. Captura de la rama actual con `git branch` o `git branch --show-current`.
3. Captura del historial de commits con `git log --oneline --decorate`.
4. Captura de la estructura del repositorio en el explorador o en VS Code.
5. Captura de los archivos modificados en el editor, si se requiere mostrar el avance del proyecto.

### Comandos recomendados

```bash
git status
git branch --show-current
git log --oneline --decorate -10
```

---

## 9. Conclusión

El proyecto PIAR usa Git de forma básica y directa. Actualmente se trabaja sobre la rama `main`, con un historial corto de commits y cambios pendientes en archivos del backend y de documentación. El control de versiones es funcional, aunque aún no muestra un flujo más formal de ramas o liberaciones.
