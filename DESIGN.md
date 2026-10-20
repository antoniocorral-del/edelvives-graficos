# Sistema de gráficos y métricas Edelvives · guía para IA (kit v0.9, modo web)

Usa este kit para cualquier gráfico, tabla de datos o KPI en páginas web de Edelvives. Tú escribes una especificación JSON corta; el script `edelvives-graficos.js` aplica colores, tipografía, medidas y reglas. No dibujes gráficos a mano ni uses otra librería.

## 1. Carga

```html
<script src="https://cdn.jsdelivr.net/npm/edelvives-graficos@0.9.1/dist/edelvives-graficos.js"></script>
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
- Cada componente ya trae su tarjeta, título, subtítulo y leyenda. No añadas tarjetas, títulos ni estilos alrededor.
- `EG.render` devuelve una promesa con `{ ok, errores, avisos }`. Si hay errores, el componente muestra el motivo: corrige la especificación y vuelve a probar.
- Para actualizar un gráfico, vuelve a llamar a `EG.render` en el mismo destino.

## 3. Elige el componente por la pregunta

Localiza la pregunta, anota `tipo` y `variante` y **lee la referencia de esa familia antes de escribir la especificación** (formato, límites y ejemplos). Lee solo las referencias que necesites. Están en la carpeta `referencias/` junto a esta guía y en `https://cdn.jsdelivr.net/npm/edelvives-graficos@0.9.1/referencias/<archivo>`.

| Pregunta | `tipo` · `variante` | Referencia |
| --- | --- | --- |
| ¿Cuánto vale cada categoría? | `barras` · `verticales` (nombres cortos) u `horizontales` (nombres largos) | `comparacion.md` |
| ¿Cómo se comparan varias series en cada categoría? | `barras` · `agrupadas` | `comparacion.md` |
| ¿Cuánto suma el total y cuánto aporta cada parte? | `barras` · `apiladas` | `comparacion.md` |
| ¿Cómo cambia el peso de cada parte entre grupos? | `barras` · `apiladas-100` | `comparacion.md` |
| ¿Alcanza cada categoría su objetivo o referencia? | `barras` · `con-referencia` | `comparacion.md` |
| ¿Qué queda por encima o por debajo de una referencia? | `barras-divergentes` · `centro` | `comparacion.md` |
| ¿Cómo se comparan dos grupos en las mismas categorías? | `barras-divergentes` · `piramide` | `comparacion.md` |
| ¿Cómo se comparan muchas categorías con poca tinta? | `puntos` · `puntos` | `comparacion.md` |
| ¿Qué valor destaca sobre el resto? | `puntos` · `piruleta` | `comparacion.md` |
| ¿Cuánto ha cambiado cada categoría entre dos momentos? | `dos-momentos` · `pesas` o `pendiente` | `comparacion.md` |
| ¿Cuánto se ha logrado frente al objetivo y a los rangos de calidad? | `bullet` | `comparacion.md` |
| ¿Qué posición ocupa la entidad propia? | `ranking` · `lista` | `comparacion.md` |
| ¿Cómo cambia la posición de cada elemento? | `ranking` · `evolucion` | `comparacion.md` |
| ¿Qué cifra exacta, peso o estado tiene cada elemento? | `tabla` · `comparativa`, `con-barras` o `con-estados` | `comparacion.md` |
| ¿Cómo evoluciona una magnitud o varias series en el tiempo? | `lineas` · `simple` o `multiples` | `evolucion.md` |
| ¿Cómo va frente al objetivo, una referencia, la previsión o el año anterior? | `lineas` · `objetivo`, `referencia`, `prevision`, `vs-prevision` o `vs-anterior` | `evolucion.md` |
| ¿Hacia dónde apunta, suavizada o acumulada? | `lineas` · `tendencia`, `media-movil`, `acumulada` o `escalonada` | `evolucion.md` |
| ¿Cuánto volumen acumula y cómo se reparte en el tiempo? | `areas` · `simple`, `superpuestas`, `apiladas` o `apiladas-100` | `evolucion.md` |
| ¿Cuál es la tendencia de un vistazo, sin ejes? | `sparkline` | `evolucion.md` |
| ¿Qué parte del total es cada categoría (y cuál es el total)? | `sectores` · `donut`, `pie` o `semidonut` | `composicion.md` |
| ¿Qué peso tiene cada parte en un total con muchas partes? | `treemap` · `plano` | `composicion.md` |
| ¿Cuánto aporta cada parte, en una sola barra? | `proporcion` · `barra` | `composicion.md` |
| ¿Qué cuota o proporción representa una parte? | `proporcion` · `cuota` o `waffle` | `composicion.md` |
| ¿Qué participación tiene cada elemento en su conjunto? | `proporcion` · `participacion` | `composicion.md` |
| ¿Cómo se reparte el total entre grupos de distinto tamaño? | `marimekko` | `composicion.md` |
| ¿Cómo se pasa del valor inicial al final y qué aporta cada paso? | `cascada` · `vertical` u `horizontal` (nombres largos) | `variacion.md` |
| ¿Qué categorías o periodos se desvían de la referencia, en unidades o en %? | `barras-divergentes` · `desviacion` o `desviacion-pct` | `variacion.md` |
| ¿Cuánto aporta cada factor al cambio total? | `barras-divergentes` · `contribucion` | `variacion.md` |
| ¿Qué cambió entre antes y después de una intervención? | `dos-momentos` · `antes-despues` | `variacion.md` |
| ¿Cómo va cada periodo frente al anterior o qué parte es previsión? | `barras` · `vs-anterior` o `vs-prevision` | `variacion.md` |
| ¿Qué porcentaje del objetivo ha alcanzado cada categoría? | `barras` · `con-referencia` con `cumplimiento:true` | `variacion.md` |
| ¿Qué tendencia y estacionalidad forman una serie? | `descomposicion` · `paneles` | `variacion.md` |
| ¿Cómo se distribuyen los valores de una variable? | `histograma` | `distribucion.md` |
| ¿Cuál es la mediana, la dispersión y los atípicos de cada grupo? | `cajas` · `caja` o `violin` (la forma) | `distribucion.md` |
| ¿Cómo se reparten los casos individuales? | `casos` · `apilados`, `dispersos` (por grupo) o `enjambre` | `distribucion.md` |
| ¿Qué forma tiene la distribución o qué % queda por debajo de un valor? | `distribucion` · `densidad`, `normal` o `acumulada` | `distribucion.md` |
| ¿En qué percentil se sitúa cada elemento dentro de su grupo? | `percentiles` | `distribucion.md` |
| ¿Entre qué valores oscila cada categoría o con qué incertidumbre se estima? | `rangos` · `rango`, `min-max` o `intervalo` | `distribucion.md` |
| ¿Existe relación entre dos variables numéricas y con qué fuerza? | `dispersion` · `simple` o `tendencia` (con R²) | `relacion.md` |
| ¿Qué peso tiene cada caso, además de su posición? | `dispersion` · `burbujas` o `burbujas-categoria` (por grupo) | `relacion.md` |
| ¿Qué casos son prioritarios según dos criterios? | `dispersion` · `cuadrantes` | `relacion.md` |
| ¿Cómo evoluciona la relación entre dos variables en el tiempo? | `dispersion` · `conectada` | `relacion.md` |
| ¿Dónde se concentran los casos cuando hay demasiados puntos? | `dispersion` · `hexagonos` | `relacion.md` |
| ¿Qué variables se mueven juntas y con qué coeficiente? | `matriz` · `correlacion-color` o `correlacion-valores` | `relacion.md` |
| ¿Cuál es el perfil de un elemento en varias dimensiones, solo o frente a otro? | `radar` · `perfil` o `dos-perfiles` | `relacion.md` |
| ¿Cómo se comporta cada caso en varias variables a la vez? | `coordenadas-paralelas` | `relacion.md` |
| ¿Cuántos pasan de una etapa a la siguiente o qué % convierte? | `embudo` · `embudo` o `conversion` | `procesos.md` |
| ¿Qué proporción se conserva y cuánta se pierde con el tiempo? | `embudo` · `retencion` | `procesos.md` |
| ¿Cuántos casos hay en cada etapa y cuáles son? | `etapas` · `pipeline` | `procesos.md` |
| ¿Cuáles son los pasos de un proceso y en cuál estamos? | `etapas` · `proceso` | `procesos.md` |
| ¿En qué etapa está un elemento y cuánto le falta? | `etapas` · `progresion` | `procesos.md` |
| ¿Cómo evoluciona la experiencia a lo largo del recorrido? | `recorrido` | `procesos.md` |
| ¿Cuándo ocurren los hitos o los eventos, juntos o por tipo? | `cronologia` · `hitos` o `carriles` | `temporal.md` |
| ¿Qué hitos se han cumplido y cuáles faltan? | `cronologia` · `vertical` | `temporal.md` |
| ¿Cómo se planifican y avanzan las tareas en el tiempo? | `gantt` | `temporal.md` |
| ¿Qué días concentran más actividad o qué ocurre cada día del mes? | `calendario` · `calor` o `mes` | `temporal.md` |
| ¿Cómo se compara un periodo con otro equivalente o con el del año anterior? | `dos-periodos` · `superpuestos` o `interanual` | `temporal.md` |
| ¿En qué fase de su ciclo de vida está un producto o servicio? | `ciclo-vida` | `temporal.md` |
| ¿Cómo evoluciona cada cohorte con el paso del tiempo? | `matriz` · `cohortes` | `temporal.md` |
| ¿Qué peso tiene cada elemento dentro de su grupo y del total? | `treemap` · `jerarquico` | `jerarquia.md` |
| ¿Cómo se reparte el total en niveles, en anillos o de arriba abajo? | `particion` · `sunburst` o `icicle` (nombres largos) | `jerarquia.md` |
| ¿Cuánto pesa cada elemento y a qué grupo pertenece? | `circulos-anidados` | `jerarquia.md` |
| ¿Cómo se ramifica una estructura o quién depende de quién? | `arbol` · `ramas` u `organigrama` | `jerarquia.md` |
| ¿Cómo se agrupan los elementos por similitud? | `arbol` · `dendrograma` | `jerarquia.md` |
| ¿Qué elementos pertenecen a cada categoría y subcategoría? | `anidados` | `jerarquia.md` |
| ¿Cuánto suma cada nivel de la estructura y cuánto aporta cada parte? | `tabla` · `jerarquica` | `jerarquia.md` |
| ¿Cómo se reparte un flujo entre origen, etapas y destino? | `sankey` · `sankey` | `flujo.md` |
| ¿Cómo cambian de categoría los elementos entre momentos? | `sankey` · `aluvial` | `flujo.md` |
| ¿Por qué pasos avanzan o abandonan las personas? | `sankey` · `recorrido` | `flujo.md` |
| ¿Qué intercambio hay entre pares de grupos? | `cuerdas` | `flujo.md` |
| ¿Cuánto volumen circula entre entidades? | `flujo` · `flechas` | `flujo.md` |
| ¿Cómo se conectan los elementos y qué comunidades forman? | `red` · `comunidades` | `flujo.md` |
| ¿Con qué destinos se conecta cada origen? | `red` · `bipartita` | `flujo.md` |
| ¿Qué se relaciona con una entidad central y de qué modo? | `red` · `radial` | `flujo.md` |
| ¿Qué depende de qué y cuál es la ruta crítica? | `red` · `dependencias` | `flujo.md` |
| ¿Cómo varía una tasa o un porcentaje entre comunidades o provincias? | `mapa` · `coropletas`, `con-ranking` (con su orden) o `cartograma` · `fichas` | `geografia.md` |
| ¿Cuánto pesa cada territorio o cuál concentra más volumen? | `mapa` · `burbujas` o `simbolos` | `geografia.md` |
| ¿A qué zona pertenece cada territorio? | `mapa` · `categorias` | `geografia.md` |
| ¿Dónde están los casos y dónde se concentran? | `mapa` · `puntos`, `rejilla` o `hexagonos` (muchos casos) | `geografia.md` |
| ¿Cuánto se mueve desde un origen, qué ruta se sigue o qué lugares se conectan? | `mapa` · `flujos`, `ruta` o `conexiones` | `geografia.md` |
| ¿Cuánto vale ahora y qué lo acompaña (variación, objetivo, tendencia, estado, ranking…)? | `kpi` con bloques | `kpi.md` |
| ¿Cómo están varios KPI a la vez frente a sus objetivos? | `kpi-rejilla` | `kpi.md` |
| ¿Qué avance lleva cada meta y cuánto falta? | `progreso` · `barras`, `anillo`, `medidor`, `ritmo` o `distancia` | `objetivos.md` |
| ¿Cómo están los indicadores frente a su objetivo, con su estado? | `tabla` · `scorecard` o `semaforo`; `barras-divergentes` · `desviacion-objetivo` | `objetivos.md` |

Un dashboard: fila de 3-4 KPI arriba y 2-4 gráficos debajo, con un solo mensaje. Si dudas entre dos componentes, elige el más simple. Si la pregunta no está en la tabla, dilo al usuario en vez de inventar un gráfico.

## 4. Campos comunes

`tipo`, `titulo` y `unidad` son obligatorios (unidad, por ejemplo `"€"`, `"%"`, `"pedidos"`; en `dispersion` puede ir en cada eje, la `matriz` de correlación no lleva, `etapas` solo la necesita con importes y `cronologia`, `gantt`, `calendario` · `mes`, `ciclo-vida`, `arbol`, `anidados`, `red` y los `mapa` de puntos, celdas, áreas, rutas y conexiones no la llevan). Opcionales: `variante`, `periodo`, `subtitulo`, `nota`, `decimales`, `abreviar` (`true` muestra `14,2 M€` o `350 mil €`). Pasa los números en bruto, sin formatear: el kit usa el formato español. Las fechas, en ISO: `"2026-04-20"` o `"2026-04"`.

## 5. Reglas (el validador las comprueba)

1. La unidad es obligatoria y toda comparación declara su referencia (`referencia`, `objetivo`, `rol: 'anterior'`…).
2. Las barras parten de cero: sin valores negativos. Para valores con signo usa `barras-divergentes` o `cascada`.
3. Respeta los límites de series, categorías y partes de cada componente (están en su referencia).
4. Un solo foco por gráfico: `destacar` resalta un elemento en naranja; el resto va en neutro.
5. Variación en modo neutro por defecto: subida en naranja, bajada en gris.
6. Los estados siempre llevan icono y texto, nunca solo color (el kit lo hace en `tabla` · `con-estados`).

## 6. No hagas

- No pongas colores, fuentes, tamaños ni CSS a los componentes: el kit los ignora o los sobrescribe.
- No uses Chart.js, D3, Recharts ni gráficos SVG propios para lo que cubre este kit.
- No formatees los números en los datos (`"14,2 M€"` es un error; usa `14204022` y `abreviar:true`).

## 7. Si el script no carga

Si tu entorno de vista previa bloquea scripts externos, díselo al usuario: la página funcionará al abrirla en el navegador o al alojarla en un servidor. No reproduzcas el kit a mano.

En servidores internos sin salida a internet, aloja el script y llama antes a `EG.configurar({ echarts: ['https://…/echarts.min.js'], fuente: 'https://…/titillium.css' })` (ECharts 6.1.0). Para los mapas, copia también la carpeta `dist/mapas/` del paquete y añade `mapas: 'https://…/mapas/'`.

Fuera de la web (presentaciones, documentos impresos) el kit aún no tiene modo propio: aplica los valores de `tokens.json` y las reglas de esta guía, y avisa al usuario de que es una aproximación.
