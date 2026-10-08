# Sistema de gráficos y métricas Edelvives (kit v0.1, modo web)

Instrucciones para cualquier asistente de IA (Gemini, ChatGPT, Claude…). Aplícalas siempre que haya que crear o modificar un dashboard, gráfico, KPI o visualización de datos para Edelvives, aunque el usuario no mencione el sistema. Los valores de diseño están en `edelvives-graficos.tokens.json`; no hace falta que los uses en web, porque el script ya los aplica.

**Principio:** tú escribes especificaciones JSON cortas; el script `edelvives-graficos.js` dibuja el gráfico con los colores, la tipografía, las medidas y las reglas corporativas. No dibujes gráficos a mano ni uses otra librería.

## 1. Cómo crear una página

1. Prepara los datos (CSV, Excel…) y calcula los valores. Pasa números en bruto.
2. Crea una página HTML y pon en el `<head>` exactamente esta línea:

   ```html
   <script src="https://cdn.jsdelivr.net/gh/antoniocorral-del/edelvives-graficos@v0.1.0/dist/edelvives-graficos.js"></script>
   ```
   No copies ni reescribas el contenido del script. El kit carga por su cuenta ECharts (cdnjs) y la fuente Titillium Web (Google Fonts).
3. Estructura:

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
   - `eg-pagina`: fondo y fuente. `eg-rejilla-kpi`: fila de KPI. `eg-rejilla`: gráficos (3 columnas en escritorio). `eg-doble`: ocupa 2 columnas.
   - Cada componente trae su tarjeta, título y subtítulo. No añadas tarjetas, títulos ni estilos alrededor.
4. Comprueba: `EG.render` devuelve una promesa con `{ ok, errores, avisos }`, y si hay errores el componente muestra el motivo en pantalla. También existe `EG.validar(especificacion)`. Corrige hasta que no haya errores.
5. Para actualizar un gráfico, vuelve a llamar a `EG.render` en el mismo destino.

Para servidores internos de Edelvives: IT puede alojar el script y cambiar la URL de `src`. Si no hay salida a internet, llamar antes a `EG.configurar({ echarts: ['https://…/echarts.min.js'], fuente: 'https://…/titillium.css' })`.

## 2. Elige el componente por la pregunta

| Pregunta | `tipo` |
| --- | --- |
| ¿Cuánto vale ahora? | `kpi-simple` |
| ¿Ha subido o bajado respecto a una referencia? | `kpi-variacion` |
| ¿Qué % del objetivo llevamos? | `kpi-objetivo` |
| ¿Cómo ha evolucionado hasta este valor? | `kpi-sparkline` |
| ¿Qué significa exactamente esta cifra? | `kpi-contexto` |
| ¿Cómo se comparan varias series en cada categoría? | `barras-agrupadas` |
| ¿Cómo evoluciona en el tiempo, y frente al objetivo? | `lineas` |
| ¿Qué parte del total es cada categoría? | `donut` |
| ¿Qué % de avance lleva cada meta? | `barras-progreso` |

Un dashboard: fila de 3-4 KPI arriba y 2-4 gráficos debajo, con un solo mensaje.

## 3. Especificaciones

Campos comunes: `tipo`, `titulo` y `unidad` (obligatorios: `"€"`, `"%"`, `"pedidos"`…). Opcionales: `periodo`, `subtitulo`, `nota`, `decimales`, `abreviar` (`true` muestra `14,2 M€` o `350 mil €`). Números en bruto; el kit aplica el formato español.

```js
{ tipo:'kpi-simple', titulo:'Clientes activos', unidad:'clientes', valor:1284 }
{ tipo:'kpi-variacion', titulo:'Ventas', unidad:'€', abreviar:true, valor:14204022, anterior:13265318, referencia:'vs. 2025' }
  // o variacion:7.1 (en %) en vez de anterior. modo:'valorado' + sentidoPositivo:'subir'|'bajar' para verde/rojo; por defecto, neutro.
{ tipo:'kpi-objetivo', titulo:'Ventas frente al objetivo', unidad:'€', abreviar:true, valor:14204022, objetivo:14867198 }
{ tipo:'kpi-sparkline', titulo:'Pedidos', unidad:'pedidos', valor:70991, serie:[4453,4067,5523,7818], periodo:'Enero–abril' }
{ tipo:'kpi-contexto', titulo:'Ticket medio', unidad:'€', valor:200, decimales:0, contexto:['Ventas entre pedidos, todos los canales.','Fuente: ERP.'] }

{ tipo:'barras-agrupadas', titulo:'Ventas por canal', unidad:'€', abreviar:true, periodo:'Enero–septiembre',
  datos:{ categorias:['Colegios','Librerías','Online'],
          series:[ {nombre:'2025', rol:'anterior', valores:[7075590,4476513,1713215]}, {nombre:'2026', valores:[7382064,4687990,2133968]} ] } }

{ tipo:'lineas', titulo:'Ventas mensuales', unidad:'€', abreviar:true,
  datos:{ periodos:['Ene','Feb','Mar'],
          series:[ {nombre:'2026', valores:[893830,792051,838434]}, {nombre:'2025', rol:'anterior', valores:[833696,743277,777051]} ],
          objetivo:[933980,830789,874037] } }   // objetivo: un número (línea fija) o un valor por periodo

{ tipo:'donut', titulo:'Ventas por línea', unidad:'€', abreviar:true,
  datos:{ categorias:['Primaria','Infantil','ESO'], valores:[5397528,2982845,2698764] }, centro:{ etiqueta:'Total' } }

{ tipo:'barras-progreso', titulo:'Cumplimiento por comunidad', unidad:'€', abreviar:true,
  datos:{ categorias:['Aragón','Madrid'], valores:[1833166,3962215], objetivos:[1755917,4040294] } }
  // sin objetivos: valores en % y unidad '%'
```

`rol` de una serie: `actual` (naranja, destacada), `anterior` (gris), `prevision` (discontinua). Sin `rol`, el kit asigna la paleta en orden y destaca la primera serie sin rol.

## 4. Reglas (el kit las comprueba)

1. Barras agrupadas: máximo 3 series y 6 categorías. Sin valores negativos; el eje parte de cero.
2. Líneas: máximo 4 series. El objetivo va en `datos.objetivo`, nunca como serie.
3. Donut: de 2 a 6 partes, solo positivas. Con más, el kit agrupa las pequeñas en «Otros».
4. Barras de progreso: máximo 8.
5. Toda variación declara su referencia (`referencia`). Todo objetivo se rotula.
6. La unidad es obligatoria.
7. Variación neutra por defecto: subida en naranja, bajada en gris. Modo valorado (verde/rojo) solo si el sentido es inequívoco.
8. Prioriza el gráfico más fácil de leer. Si dudas entre dos, elige el más simple.

## 5. No hagas

- No pongas colores, fuentes, tamaños ni CSS a los componentes: el kit los ignora o los sobrescribe.
- No uses Chart.js, D3, Recharts ni SVG propios para lo que cubre este kit.
- No formatees los números (`"14,2 M€"` es un error; usa `14204022` y `abreviar:true`).
- Si necesitas un gráfico que no está en la tabla, díselo al usuario en vez de inventarlo.

## 6. Si el script no carga

Si tu entorno de vista previa bloquea scripts externos, díselo al usuario: la página funcionará al abrirla en el navegador o al alojarla en un servidor. No reproduzcas el kit a mano.

Fuera de la web (presentaciones, documentos impresos) el kit v0 aún no tiene modo propio. En ese caso aplica los valores de `edelvives-graficos.tokens.json` y las reglas de este documento, y avisa al usuario de que es una aproximación.
