# Modos: web, presentación e impresión · referencia del kit v0.10

El kit dibuja el mismo gráfico para tres soportes. **El sistema de diseño de Edelvives manda en la página, la diapositiva o el documento** (márgenes, título de la diapositiva, rejilla del A4, notas y pies); **el kit manda dentro del gráfico** (colores, tipografía, escalas, rótulos y reglas). No pongas el gráfico dentro de otra tarjeta ni le cambies colores o fuentes.

## Elegir el modo

El modo es de toda la página: fíjalo una vez, antes de dibujar.

```javascript
EG.configurar({ modo: 'web' });                                // por defecto: páginas, dashboards y artefactos
EG.configurar({ modo: 'presentacion', tema: 'negro' });        // diapositivas 1920 × 1080; tema 'blanco' o 'negro'
EG.configurar({ modo: 'impresion' });                          // documentos A4 (medidas en pt, colores con CMYK)
```

`medio` en una especificación es opcional; si lo pones, tiene que coincidir con el modo de la página (si no, es un error). No mezcles modos en una página.

| Modo | Tipografía | Colores | Cómo se entrega |
| --- | --- | --- | --- |
| `web` | Titillium Web | interfaces del sistema | `EG.render(destino, spec)` |
| `presentacion` | Barlow en ejes, leyendas y etiquetas de datos; Titillium en título, unidad y cifras | `pres-*` del tema; acento naranja-400 | `EG.pptx(spec)` (gráfico nativo de PowerPoint) o `EG.svg(spec)` (imagen vectorial) |
| `impresion` | Barlow 8 pt en ejes, 9 pt en la leyenda y SemiBold 9 pt en las etiquetas de datos; Titillium en título y unidad | tonos con CMYK FOGRA39 | `EG.svg(spec, { columnas })` |

## Presentación

- **Gráfico nativo:** `EG.pptx(spec, { tema })` es una función pura (funciona en Node, sin navegador) que devuelve lo que pide PptxGenJS:

  ```javascript
  const r = EG.pptx(spec, { tema: 'negro' });
  if (r.ok && r.nativo && r.tipo !== 'tabla') slide.addChart(r.tipo, r.datos, r.opciones);
  if (r.ok && r.tipo === 'tabla') slide.addTable(r.filas, r.opciones);
  if (r.ok && !r.nativo) { /* r.motivo: usa EG.svg en el navegador */ }
  pres.theme = r.tema;   // { headFontFace: 'Titillium Web Light', bodyFontFace: 'Barlow' }: el gráfico usa la fuente del tema
  ```

  Tienen gráfico nativo `barras` (verticales, horizontales, agrupadas, apiladas y apiladas-100), `lineas` (simple, múltiples, acumulada y vs-anterior), `areas` (simple, apiladas y apiladas-100), `sectores` (donut y pie, con el % en la leyenda), `dispersion` (simple y burbujas) y `radar`; y tabla nativa `tabla` · `comparativa`, `con-estados`, `scorecard` y `semaforo`. El resto devuelve `nativo: false`.
- **Imagen vectorial:** `EG.svg(spec)` (en el navegador) devuelve `{ svg, ancho, alto, nota, avisos }`: 1648 px de ancho (el ancho útil de la diapositiva) y el alto que necesite; avisa si pasa del hueco de contenido (610 px).
- **Sin título ni unidad:** los pone la diapositiva (título del modelo, subtítulo o entradilla). `EG.pptx` y `EG.svg` los omiten por defecto; `{ titulo: true }` los incluye. La nota y la fuente tampoco van en el gráfico: `r.nota` es el texto para el pie de la diapositiva (y 960).
- **Sin colores de estado:** la variación del KPI va con flecha, signo y «mejora» o «empeora» en el acento (favorable) o en el color de texto (desfavorable); los estados, con icono y texto en el color de texto.
- Medidas de PowerPoint: 1 px = 1/144 in y los tamaños en pt = px / 2 (`opciones` ya vienen así). `{ x, y, ancho, alto }` en px cambian la posición (por defecto, x 136, y 320, 1648 × 610).

## Impresión

- `EG.svg(spec, { columnas: 1-4 })` devuelve `{ svg, cmyk, ancho, alto, avisos }`. El ancho es el de las columnas de la rejilla del A4 (n × 100,63 pt + (n − 1) × 17,008 pt: 100,63 · 218,27 · 335,91 · 453,54 pt); `width` y `height` del SVG van en pt.
- **`fuente` es obligatoria** en impresión (el origen de los datos; el kit lo rotula «Fuente: …» al pie). El título, la unidad y la nota van en el SVG.
- **Solo colores de tokens:** cada color del SVG es un token de impresión, en hexadecimal, y no hay transparencias. `cmyk` es el mapa `{ '#F56A00': [0, 70, 100, 0], … }` para que el servidor cambie cada hexadecimal por su CMYK exacto. Si algo no cumple, `EG.svg` da error.
- **CMYK provisional:** naranja-700, neutro-400, neutro-600 y neutro-700 no tienen CMYK en el sistema; el kit los calcula con el perfil FOGRA39 y avisa cuando un gráfico los usa (mapas, calendario de calor, cohortes, correlación, hexágonos y Jerarquía). Pide prueba de color.
- A una columna solo caben bien `sparkline`, `kpi` y `progreso`; con el resto, el kit avisa. Si un gráfico no cabe en su ancho, avisa también.

## Límites fuera de web

| | web | presentación | impresión |
| --- | --- | --- | --- |
| Paleta `foco` (por defecto) | 6 colores | 5 (`pres-serie-1…5`) | 4 (naranja-500, neutro-500, neutro-300-doc, neutro-800) |
| Paleta `gama` | 7 | 7 (`pres-grafica-1…7`) | 7 |
| Donut y pie | 6 sectores (7 con `gama`) | 5 | 5 |
| Mapas y calor | 5 clases | naranja-100, 400, 500, 600 y 700 | naranja-100, 400, 500, 600 y 700 |

Con la paleta `gama` sobre fondo claro (web, impresión y el tema blanco), verde-500 y amarillo-500 no llegan a 3:1: con 3 series o más hace falta `etiquetas: true` (valor junto a cada elemento, o nombre y último valor al final de cada línea). En los tipos que no pueden rotular cada elemento, la gama se salta esos dos colores.

## Tipos solo web

Son HTML interactivo y fuera de web dan error con la alternativa: `etapas` · `pipeline` (usa `embudo` o barras) y `progresion` (usa `progreso` · `barras` o `etapas` · `proceso`), `cronologia` · `vertical` (usa `hitos`), `calendario` · `mes` (usa `cronologia` · `hitos`), `anidados` (usa `treemap` · `jerarquico` o `arbol` · `ramas`) y `tabla` · `jerarquica` (usa `particion` · `icicle` o `arbol` · `ramas`). El selector de `periodos` del KPI tampoco sirve fuera de web: haz un KPI por periodo.

```js
// Presentación: una diapositiva con el gráfico nativo
// EG.configurar({ modo: 'presentacion', tema: 'negro' });
{ tipo:'barras', variante:'agrupadas', titulo:'Ventas por canal', unidad:'€', abreviar:true,
  datos:{ categorias:['Colegios','Librerías','Online'], series:[ {nombre:'2025', rol:'anterior', valores:[7075590,4476513,1713215]}, {nombre:'2026', valores:[7382064,4687990,2133968]} ] } }
// Impresión: la fuente es obligatoria
{ tipo:'lineas', variante:'simple', titulo:'Pedidos', unidad:'pedidos', fuente:'Datos internos de Edelvives',
  datos:{ periodos:['Ene','Feb','Mar','Abr'], series:[ {nombre:'2026', valores:[3210,3780,3540,4410]} ] } }
```
