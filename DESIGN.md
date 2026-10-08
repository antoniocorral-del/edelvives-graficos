# Sistema de gráficos y métricas Edelvives · guía para IA (kit v0.1, modo web)

Usa este kit para cualquier gráfico o KPI en páginas web de Edelvives. Tú escribes una especificación JSON corta; el script `edelvives-graficos.js` aplica colores, tipografía, medidas y reglas. No dibujes gráficos a mano ni uses otra librería.

## 1. Carga

```html
<script src="https://cdn.jsdelivr.net/gh/antoniocorral-del/edelvives-graficos@v0.1.0/dist/edelvives-graficos.js"></script>
```

Ponlo en el `<head>`, con esta URL exacta. El script carga por su cuenta ECharts y la fuente Titillium Web. No lo copies ni lo reescribas dentro del HTML.

## 2. Uso

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
- Cada componente ya trae su tarjeta, título y subtítulo. No añadas tarjetas, títulos ni estilos alrededor.
- `EG.render` devuelve una promesa con `{ ok, errores, avisos }`. Si hay errores, el componente muestra el motivo: corrige la especificación y vuelve a probar.
- Para actualizar un gráfico, vuelve a llamar a `EG.render` en el mismo destino.

## 3. Elige el componente por la pregunta

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

## 4. Especificaciones

Campos comunes: `tipo`, `titulo` y `unidad` (obligatorios, por ejemplo `"€"`, `"%"`, `"pedidos"`); opcionales: `periodo`, `subtitulo`, `nota`, `decimales`, `abreviar` (`true` muestra `14,2 M€` o `350 mil €`). Pasa los números en bruto, sin formatear: el kit usa el formato español.

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

`rol` de una serie: `actual` (naranja, destacada), `anterior` (gris), `prevision` (discontinua). Sin `rol`, el kit asigna la paleta en orden; la primera serie sin rol se destaca.

## 5. Reglas (el validador las comprueba)

1. Barras agrupadas: máximo 3 series y 6 categorías. Sin valores negativos; el eje parte de cero.
2. Líneas: máximo 4 series. El objetivo va en `datos.objetivo`, nunca como serie.
3. Donut: de 2 a 6 partes, solo positivas. Con más, el kit agrupa las pequeñas en «Otros».
4. Barras de progreso: máximo 8.
5. Toda variación declara su referencia (`referencia`). Todo objetivo se rotula.
6. La unidad es obligatoria.
7. Variación en modo neutro por defecto: subida en naranja, bajada en gris. El modo valorado (verde/rojo) solo si el sentido es inequívoco.
8. Prioriza el gráfico más fácil de leer. Si dudas entre dos, elige el más simple.

## 6. No hagas

- No pongas colores, fuentes, tamaños ni CSS a los componentes: el kit los ignora o los sobrescribe.
- No uses Chart.js, D3, Recharts ni gráficos SVG propios para lo que cubre este kit.
- No formatees los números en los datos (`"14,2 M€"` es un error; usa `14204022` y `abreviar:true`).
- Si necesitas un gráfico que no está en la tabla, dilo al usuario en vez de inventarlo.

## 7. Si el script no carga

Si tu entorno de vista previa bloquea scripts externos, díselo al usuario: la página funcionará al abrirla en el navegador o al alojarla en un servidor. No reproduzcas el kit a mano.

En servidores internos sin salida a internet, aloja el script y llama antes a `EG.configurar({ echarts: ['https://…/echarts.min.js'], fuente: 'https://…/titillium.css' })`.

Fuera de la web (presentaciones, documentos impresos) el kit v0 aún no tiene modo propio: aplica los valores de `tokens.json` y las reglas de este documento, y avisa al usuario de que es una aproximación.
