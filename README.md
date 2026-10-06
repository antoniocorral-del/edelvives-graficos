# Kit de gráficos Edelvives v0.1 (modo web)

Para ver los gráficos, descomprime el zip y abre con doble clic `vista-previa.html` (los 9 componentes) o `demo-dashboard-comercial.html` (el dashboard completo). Se abren en el navegador y necesitan conexión a internet.

Contenido:

- `dist/edelvives-graficos.js`: el script que dibuja (tokens, validador, renderizador, iconos de Material Symbols con licencia Apache 2.0). Carga ECharts 5.6 y Titillium Web por su cuenta.
- `DESIGN.md`: la guía que se le da a la IA. Es lo único que la IA necesita leer.
- `esquema.json`: el formato de la especificación (JSON Schema).
- `tokens.json`: colores, tipografía y contraste en formato W3C DTCG, con CMYK aproximado.
- `ejemplos/`: una especificación válida por componente.
- `datos/`: CSV ficticios para la prueba del dashboard comercial.

## Prueba con una IA

1. Abre una conversación nueva, sin contexto previo.
2. Adjunta `DESIGN.md`, `edelvives-graficos.js` y los dos CSV de `datos/`.
3. Pide, por ejemplo: «Crea una aplicación web con un dashboard comercial a partir de estos CSV. Usa el sistema de gráficos descrito en DESIGN.md.»

## Publicar el script

- npm: desde esta carpeta, `npm publish` (requiere cuenta). La URL quedaría como `https://cdn.jsdelivr.net/npm/edelvives-graficos@0.1.0/dist/edelvives-graficos.js`. El nombre del paquete está pendiente de decidir.
- GitLab Pages: solo si la instancia lo permite y el proyecto es público; no funciona en las páginas publicadas desde Claude.

Cuando haya URL, sustituye `URL_DEL_KIT` en `DESIGN.md`.
