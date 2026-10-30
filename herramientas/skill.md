---
name: graficos-edelvives
description: "Sistema de gráficos y métricas de Edelvives (kit v{{CORTA}}) para web, presentaciones y documentos impresos: KPI, barras, líneas, sectores, variaciones, distribuciones, dispersión, embudos, cronologías, jerarquías, flujos y mapas de España. Úsala SIEMPRE que haya que crear o modificar un gráfico, un KPI, una métrica, una tabla de datos, un mapa o un dashboard para Edelvives, en una página web, una aplicación, un artefacto, una diapositiva de PowerPoint o un documento (informe, dossier, PDF), aunque el usuario no mencione el kit ni la marca: por ejemplo «grafica estas ventas», «hazme un dashboard con estos CSV», «pon estos datos por comunidades en un mapa», «mete un gráfico en esta presentación», «añade una gráfica al informe». Reparto: el sistema de diseño de Edelvives manda en la página, la diapositiva o el documento; este kit, dentro del gráfico. Incluye el script (URL pública y copia), una referencia por familia y por modo y un validador."
---

# Gráficos y métricas Edelvives (kit v{{CORTA}})

Usa este kit para cualquier gráfico, tabla de datos o KPI de Edelvives, en web, en presentaciones y en documentos. Tú escribes una especificación JSON corta; el script `edelvives-graficos.js` aplica colores, tipografía, medidas y reglas del sistema de diseño. No dibujes gráficos a mano ni uses otra librería.

**Reparto:** el sistema de diseño de Edelvives manda en la página, la diapositiva o el documento (márgenes, título de la diapositiva, rejilla del A4, notas, pies); el kit manda dentro del gráfico. Si también usas la skill o el script de presentaciones o de documentos del sistema, ellos ponen la diapositiva o la página y este kit pone el gráfico.

## 1. Elige el modo

| Dónde va el gráfico | Modo | Cómo |
| --- | --- | --- |
| Página web, dashboard, aplicación o artefacto | `web` (por defecto) | `EG.render` en el navegador (apartados 2 y 3) |
| Diapositiva de PowerPoint (1920 × 1080) | `presentacion`, tema `blanco` o `negro` | `EG.pptx` en Node: gráfico nativo y editable (apartado 4) |
| Documento A4 (informe, dossier, PDF) | `impresion` | `EG.svg` en un navegador: SVG en pt con colores de imprenta (apartado 5) |

Lee `referencias/modos.md` siempre que el gráfico no sea para web.

## 2. Carga (web)

```html
<script src="https://cdn.jsdelivr.net/npm/edelvives-graficos@{{VERSION}}/dist/edelvives-graficos.js"></script>
```

Ponlo en el `<head>`, con esta URL exacta. El script carga por su cuenta ECharts y la fuente Titillium Web. No lo copies ni lo reescribas dentro del HTML.

## 3. Uso (web)

```html
<body class="eg-pagina">
  <div class="eg-rejilla-kpi"> <div id="k1"></div> <div id="k2"></div> </div>
  <div class="eg-rejilla"> <div id="g1" class="eg-doble"></div> <div id="g2"></div> </div>
  <script>
    EG.render('#k1', { /* especificación */ });
    EG.render('#g1', { /* especificación */ });
  </script>
</body>
```

- `eg-pagina`: fondo y fuente de página. `eg-rejilla-kpi`: fila de KPI. `eg-rejilla`: gráficos (3 columnas en escritorio). `eg-doble`: ocupa 2 columnas.
- Cada componente ya trae su tarjeta, título, subtítulo y leyenda. No añadas tarjetas, títulos ni estilos alrededor.
- `EG.render` devuelve una promesa con `{ ok, errores, avisos }`. Si hay errores, el componente muestra el motivo: corrige la especificación y vuelve a probar.

## 4. Presentaciones (PowerPoint)

`EG.pptx` es una función pura: funciona en Node con la copia del script de `assets/`, sin navegador.

```javascript
const EG = require('<carpeta-de-la-skill>/assets/edelvives-graficos.js');
const r = EG.pptx(spec, { tema: 'negro' });          // el tema de la presentación: 'negro' o 'blanco'
pres.theme = r.tema;                                 // { headFontFace: 'Titillium Web Light', bodyFontFace: 'Barlow' }
if (r.ok && r.nativo && r.tipo === 'tabla') slide.addTable(r.filas, r.opciones);
else if (r.ok && r.nativo) slide.addChart(r.tipo, r.datos, r.opciones);
// r.ok false: corrige con r.errores. r.nativo false: elige un tipo con gráfico nativo o usa EG.svg (apartado 5)
// r.nota: la nota y la fuente, para el pie de la diapositiva (y 960)
```

- El gráfico no lleva título ni unidad: ponlos en el título y el subtítulo o la entradilla de la diapositiva. Por defecto ocupa el área de contenido (x 136, y 320, 1648 × 610 px); `{ x, y, ancho, alto }` en px lo cambia.
- Tienen gráfico nativo `barras`, `lineas`, `areas`, `sectores` (donut y pie), `dispersion` (simple y burbujas), `radar` y las tablas `comparativa`, `con-estados`, `scorecard` y `semaforo`.
- Si usas el script de presentaciones del sistema, crea la diapositiva con su modelo de contenido y añade el gráfico con `slide.addChart` como arriba.
- Para dos o tres cifras sueltas, el modelo «Métricas» del sistema de presentaciones suele ser mejor que un KPI del kit (el KPI no tiene gráfico nativo y saldría como imagen).

## 5. Documentos impresos (y SVG en presentaciones)

`EG.svg` necesita un navegador (dibuja con ECharts): una página con el script y `EG.configurar({ modo: 'impresion' })`, abierta con Playwright o en el navegador del usuario.

```javascript
EG.configurar({ modo: 'impresion' });
const r = await EG.svg(spec, { columnas: 2 });       // 1 a 4 columnas de la rejilla del A4 (100,63 · 218,27 · 335,91 · 453,54 pt)
// r.svg: SVG con width y height en pt; r.cmyk: { '#F56A00': [0, 70, 100, 0], … }; r.avisos
```

- `fuente` (el origen de los datos) es obligatoria en impresión.
- El SVG solo lleva colores de tokens de impresión, sin transparencias: el servidor de documentos puede cambiar cada hexadecimal por su CMYK exacto con `r.cmyk`.
- Si el kit avisa de CMYK provisional, díselo al usuario: hace falta prueba de color.

## 6. Elige el componente por la pregunta

Localiza la pregunta, anota `tipo` y `variante` y **lee la referencia de esa familia antes de escribir la especificación** (formato, límites y ejemplos). Lee solo las referencias que necesites. Están en la carpeta `referencias/` de esta skill (`<carpeta-de-la-skill>/referencias/<archivo>`) y en `https://cdn.jsdelivr.net/npm/edelvives-graficos@{{VERSION}}/referencias/<archivo>`.

{{TABLA}}

Un dashboard: fila de 3-4 KPI arriba y 2-4 gráficos debajo, con un solo mensaje. Una diapositiva: un gráfico y su lectura. Si dudas entre dos componentes, elige el más simple. Si la pregunta no está en la tabla, dilo al usuario en vez de inventar un gráfico.

## 7. Campos comunes

{{CAMPOS}}

## 8. Reglas (el validador las comprueba)

{{REGLAS}}

## 9. Valida y entrega

1. Valida las especificaciones antes de entregar. Guárdalas en un JSON (`{ "k1": {...}, "g1": {...} }`) y ejecuta, con el modo del soporte:

   ```bash
   node <carpeta-de-la-skill>/scripts/validar.js especificaciones.json --modo web
   ```
   (`--modo presentacion --tema negro` o `--modo impresion` fuera de web; `<carpeta-de-la-skill>` es la ruta de esta skill que aparece en tu lista de skills). Corrige hasta que no haya errores; los avisos también merecen revisión. Si no puedes ejecutar el validador, no te detengas ni pidas archivos al usuario: el kit también valida al dibujar.
2. Entrega: en web, publica la página como artefacto o entrégala como HTML para los servidores de Edelvives, con la misma etiqueta `<script>`. En presentaciones, el .pptx con los gráficos nativos. En documentos, los SVG (con su mapa de CMYK) o el documento que los incluye.

Los datos pueden venir de donde sea (un CSV convertido, una API propia…): el kit solo recibe la especificación ya calculada.

## 10. No hagas

- No pongas colores, fuentes, tamaños ni CSS a los componentes: el kit los ignora o los sobrescribe.
- No uses Chart.js, D3, Recharts, gráficos de PowerPoint hechos a mano ni SVG propios para lo que cubre este kit.
- No formatees los números en los datos (`"14,2 M€"` es un error; usa `14204022` y `abreviar:true`).
- No quites ni repitas la atribución de los mapas: el kit la añade sola a la nota.
- No mezcles modos en una página ni pongas el título del gráfico dentro de la diapositiva y del gráfico a la vez.
- No copies el contenido del script en la página ni en tu respuesta: en web se carga desde la URL. La copia de `assets/` es para el validador y para `EG.pptx` en Node.

## 11. Si el script no carga

Si tu entorno de vista previa bloquea scripts externos, díselo al usuario: la página funcionará al abrirla en el navegador o al alojarla en un servidor. No reproduzcas el kit a mano.

En servidores internos sin salida a internet, aloja el script y llama antes a `EG.configurar({ echarts: ['https://…/echarts.min.js'], fuente: 'https://…/titillium.css', barlow: 'https://…/barlow.css' })` (ECharts 6.1.0; Barlow solo se carga en presentación e impresión). Para los mapas, copia también la carpeta `dist/mapas/` del paquete y añade `mapas: 'https://…/mapas/'`.
