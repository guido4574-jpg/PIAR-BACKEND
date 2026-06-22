# Proyecto PIAR

Aplicacion web para seguimiento PIAR/PR, estudiantes, docentes, observaciones y reportes.

## Estructura

```text
assets/       Recursos visuales
backend/      Servidor Node temporal y API local de apoyo
css/          Estilos de la aplicacion
data/         Datos persistidos en JSON para pruebas locales
docs/         Documentacion del proyecto
js/           Logica frontend, configuracion y datos base
logs/         Salidas del servidor local
index.html    Entrada principal de la aplicacion
```

## Ejecutar

```bash
node backend/server.js
```

Luego abrir:

```text
http://localhost:8080
```

La API local queda en:

```text
http://localhost:8080/api
```
