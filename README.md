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
2. Adjunta solo `DESIGN.md` y los dos CSV de `datos/`. El script se carga desde la URL pública.
3. Pide, por ejemplo: «Crea una aplicación web con un dashboard comercial a partir de estos CSV. Usa el sistema de gráficos descrito en DESIGN.md.»

## URL pública

`https://cdn.jsdelivr.net/npm/edelvives-graficos@0.1.0/dist/edelvives-graficos.js`

El kit se publica en npm (paquete `edelvives-graficos`) y jsDelivr lo sirve desde ahí. Es la misma URL para la skill de Claude (incluidos los artefactos publicados), los Gems de Gemini, los GPT de ChatGPT y los servidores de Edelvives.

Para una versión nueva:

1. Sube los cambios al repositorio.
2. Cambia `version` en `package.json` (por ejemplo `0.2.0`) y la versión en la URL de `DESIGN.md`.
3. Publica con `npm publish` desde la carpeta del repositorio.
4. Actualiza la URL y la copia de `dist/edelvives-graficos.js` en la skill de Claude.

Un número de versión publicado en npm no se puede reutilizar: cada cambio necesita una versión nueva.
