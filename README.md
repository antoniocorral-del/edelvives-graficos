# Kit de gráficos Edelvives v0.9 (modo web)

Para ver los gráficos, abre con doble clic `vista-previa.html` (los 156 componentes, agrupados por familia) o `demo-dashboard-comercial.html` (el dashboard de la primera prueba, con el kit v0.1 incrustado). Se abren en el navegador y necesitan conexión a internet.

Contenido:

- `dist/edelvives-graficos.js`: el script que dibuja (tokens, validador, renderizador, iconos de Material Symbols con licencia Apache 2.0). Carga ECharts 6.1.0 y Titillium Web por su cuenta.
- `dist/mapas/`: los contornos de España por comunidades y por provincias (TopoJSON, en `.js`, que es lo que carga el kit, y en `.json`). Base de Datos de Divisiones Administrativas © Instituto Geográfico Nacional, licencia CC BY 4.0. Se cargan solo al dibujar un mapa.
- `DESIGN.md`: la guía que lee la IA. Es un índice corto: tabla de selección, reglas comunes y carga.
- `referencias/`: una referencia por familia con el formato, los límites y ejemplos de cada componente. La IA solo lee la que necesita.
- `esquema.json`: el formato de la especificación (JSON Schema).
- `tokens.json`: colores, tipografía, estados y contraste en formato W3C DTCG, con CMYK aproximado.
- `ejemplos/`: una especificación válida por componente.
- `datos/`: CSV ficticios para la prueba del dashboard comercial.
- `herramientas/generar.py`: regenera `esquema.json` y `vista-previa.html`. `herramientas/mapas.py`: prepara `dist/mapas/` a partir de los shapefiles de la BDDAE (necesita mapshaper). No se publican en npm.

## Novedades de la 0.9.0

- Familia Geografía completa, con la referencia nueva `referencias/geografia.md`. Con ella están los 157 componentes del archivo de Figma.
  - `mapa` · `coropletas` (5 clases de igual amplitud con cortes redondos, o `umbrales`), `con-ranking` (mapa y ranking con los mismos colores), `burbujas` y `simbolos` (área proporcional, con leyenda de tamaños), `categorias` (paleta de series), `puntos` (con `lat`/`lon` o por densidad con `porPunto`), `rejilla` y `hexagonos` (el kit cuenta los casos en celdas de `celda` km), `flujos`, `ruta` y `conexiones`.
  - `cartograma` · `fichas`: una ficha igual por comunidad.
- `mapa: 'comunidades'` o `'provincias'` (si no se indica, el kit lo deduce de los nombres). Admite nombres habituales y oficiales («Comunidad Valenciana», «Alacant/Alicante», «Vizcaya»…) y el código INE; un lugar puede ser una zona (se sitúa en su capital) o `{ nombre, lat, lon }`.
- «Sin dato» con trama (nunca blanco); el kit avisa si una coropleta usa totales en vez de tasas o si faltan zonas. La nota de cada mapa cita «© Instituto Geográfico Nacional (CC BY 4.0)».
- Los contornos están fuera del script (`dist/mapas/`) y se cargan como script solo al dibujar un mapa, desde la misma URL de jsDelivr; en servidores internos, `EG.configurar({ mapas: 'https://…/mapas/' })`.
- Las especificaciones de la 0.8.1 siguen siendo válidas y se dibujan igual.

## Novedades de la 0.8.1

- Familia Flujo y relaciones completa, con la referencia nueva `referencias/flujo.md`. Casi todos los tipos usan `datos.enlaces` (`{ origen, destino, valor }`); los nodos se deducen de los enlaces y `datos.nodos` (opcional) fija el orden, el `grupo` o la `duracion`. El kit rechaza los enlaces repetidos o a sí mismos y, donde el flujo va de izquierda a derecha, los ciclos (y dice cuál es).
  - `sankey` · `sankey` (un único camino destacado, por defecto el del mayor origen), `aluvial` (momentos, 2-3 categorías y una matriz de cambios por paso; el kit comprueba que cuadran) y `recorrido` (pasos con los que llegan a cada uno y salidas hacia abajo).
  - `cuerdas`: intercambio entre pares de grupos, con las cintas del grupo destacado en naranja.
  - `flujo` · `flechas`: entidades en columnas y flechas con grosor proporcional al valor.
  - `red` · `comunidades` (el kit calcula las comunidades por modularidad si no se dan), `bipartita`, `radial` (relaciones rotuladas alrededor de una entidad central) y `dependencias` (ruta crítica por duración o por número de tareas, o fijada con `ruta`).
- `red` no lleva `unidad` (en `dependencias`, la `unidad` es la de la duración).
- Las especificaciones de la 0.8.0 siguen siendo válidas y se dibujan igual.

## Novedades de la 0.8.0

- Familia Jerarquía completa, con la referencia nueva `referencias/jerarquia.md`. Todos los tipos aceptan el árbol anidado `{ nombre, valor, hijos }` o filas planas con un nombre por nivel y el valor al final (lo más corto si se parte de un CSV); los valores van en los elementos finales y el kit suma hacia arriba. Un nombre repetido en ramas distintas se identifica por su ruta (`"Área B / Equipo 3"`).
  - `treemap` gana la variante `jerarquico`: cada grupo con su cabecera y su familia de tonos (el destacado en naranja, el resto en neutros).
  - `particion` · `sunburst` (hasta 3 anillos, con el total en el centro) e `icicle` (el total arriba y una franja por nivel).
  - `circulos-anidados`: círculos empaquetados sin solapamiento, con el área proporcional al valor.
  - `arbol` · `ramas` (raíz a la izquierda), `organigrama` (cajas con conectores ortogonales; si no cabe, apila el último nivel bajo su responsable) y `dendrograma` (el kit agrupa a partir de los datos en bruto, por enlace medio, o acepta el árbol con la altura de cada unión; corta en el mayor salto o en los `grupos` pedidos).
  - `anidados` · `contenedores`: categorías, subcategorías y elementos en HTML.
  - `tabla` gana la variante `jerarquica`: lista indentada con una barra por fila y los totales plegables.
- `arbol` y `anidados` no llevan `unidad`.
- Las especificaciones de la 0.7.1 siguen siendo válidas y se dibujan igual.

## Novedades de la 0.7.1

- Familia Temporal especializado completa, con la referencia nueva `referencias/temporal.md`. Las fechas van en ISO (`"2026-04-20"` o `"2026-04"`) y `hoy` dibuja la línea «Hoy» (una fecha o `true`, el día en que se abre la página). Cinco tipos nuevos:
  - `cronologia` · `hitos` (eje continuo con los hitos alternados arriba y abajo; sin `destacar`, se destaca el próximo a «hoy»), `carriles` (un carril por tipo de evento, con eventos puntuales o con duración) y `vertical` (los hitos cumplidos, el que está en curso y los pendientes).
  - `gantt`: lo previsto y lo realizado (`avance`) de cada tarea, los hitos y la línea de «Hoy».
  - `calendario` · `calor` (un año como máximo, con 5 clases y el total o la media al pie) y `mes` (hoy, eventos, festivos y fines de semana).
  - `dos-periodos` · `superpuestos` (los dos periodos alineados por posición, con el total o la media de cada uno y la variación; admite un periodo actual sin terminar) e `interanual` (columnas de los dos años con la variación debajo).
  - `ciclo-vida` · `fases`: curva orientativa con la fase actual y el elemento marcado.
- `matriz` gana la variante `cohortes`: el kit calcula el % sobre el primer periodo de cada cohorte si se le pasan recuentos.
- El tipo de la comparación entre periodos se llama `dos-periodos` (no `periodos`) para no confundirlo con `datos.periodos`.
- Las especificaciones de la 0.7.0 siguen siendo válidas y se dibujan igual.

## Novedades de la 0.7.0

- Familia Procesos y conversión completa, con la referencia nueva `referencias/procesos.md`. Tres tipos nuevos:
  - `embudo` · `embudo` (trapecios con el valor de cada etapa), `conversion` (la tasa sobre la etapa anterior y la conversión global) y `retencion` (columnas al 100 % con la caída entre hitos en puntos; acepta recuentos o %). El validador rechaza una etapa que supere a la anterior.
  - `etapas` · `pipeline` (una columna por etapa con una tarjeta por caso y, si se quiere, su importe), `proceso` (pasos con su estado y decisiones en rombo con su alternativa) y `progresion` (la etapa actual y el % de avance, que cuenta las etapas completadas). No lleva `unidad`, salvo el pipeline con importes.
  - `recorrido` · `experiencia`: la curva de la experiencia sobre las etapas, con la escala declarada (`minimo` y `maximo`) y los puntos de contacto.
- Las especificaciones de la 0.6.1 siguen siendo válidas y se dibujan igual.

## Novedades de la 0.6.1

- Familia Relación y correlación completa, con la referencia nueva `referencias/relacion.md`. Cuatro tipos nuevos:
  - `dispersion` · `simple`, `tendencia` (recta de mínimos cuadrados y R²), `burbujas`, `burbujas-categoria`, `cuadrantes`, `conectada` (los puntos unidos en orden cronológico) y `hexagonos` (para cientos o miles de casos). Cada eje lleva su nombre y su unidad en `ejes`.
  - `matriz` · `correlacion-color` y `correlacion-valores`: el kit calcula el coeficiente de Pearson a partir de los valores en bruto o acepta los coeficientes ya calculados. La variante `cohortes` llega con la familia Temporal especializado.
  - `radar` · `perfil` y `dos-perfiles`.
  - `coordenadas-paralelas`: un eje por variable con la misma escala y un caso destacado.
- Las especificaciones de la 0.6.0 siguen siendo válidas y se dibujan igual.

## Novedades de la 0.6.0

- Familia Distribución completa, con la referencia nueva `referencias/distribucion.md`. Seis tipos nuevos:
  - `histograma`: el kit calcula los intervalos a partir de los valores en bruto (o acepta los recuentos ya hechos) y marca la mediana o la media.
  - `cajas` · `caja` y `violin`: cuartiles, bigotes hasta 1,5 veces el rango intercuartílico y atípicos, explicados en la nota y junto al último grupo. La caja admite el resumen ya calculado.
  - `casos` · `apilados` (dot plot), `dispersos` (strip plot) y `enjambre` (beeswarm): un punto por caso.
  - `distribucion` · `densidad`, `normal` (curva teórica con ±1 desviación) y `acumulada` (con la mediana y un percentil clave).
  - `percentiles`: la posición de cada elemento en su grupo; el kit calcula el percentil si se le pasan los valores del grupo.
  - `rangos` · `rango`, `min-max` e `intervalo` (con el nivel de confianza obligatorio).
- Campo nuevo `nombreCasos` (qué es cada caso, en plural): el subtítulo muestra la unidad y el número de casos.
- Las especificaciones de la 0.5.1 siguen siendo válidas y se dibujan igual.

## Novedades de la 0.5.1

- Familia Variación completa, con la referencia nueva `referencias/variacion.md`:
  - Tipos nuevos `cascada` (vertical y horizontal) y `descomposicion` (tendencia, estacionalidad y, opcionalmente, residuo; el kit la calcula a partir de `ciclo` o acepta los componentes ya calculados).
  - `barras-divergentes` gana `desviacion` (en barras con `categorias` o en columnas con `periodos`), `desviacion-pct` y `contribucion`.
  - `barras` gana `vs-anterior` y `vs-prevision`, y `con-referencia` admite `cumplimiento: true` (barras horizontales con el % del objetivo alcanzado).
  - `dos-momentos` gana `antes-despues`.
- El validador comprueba que la cascada y la contribución cuadran con el total que se declare.
- Las especificaciones de la 0.5.0 siguen siendo válidas y se dibujan igual.

## Novedades de la 0.5.0

- Familia Composición completa: tipo `sectores` (donut, pie y semidonut), `treemap` (plano), `proporcion` (barra parte-todo, cuota, participación y waffle) y `marimekko`.
- `donut` pasa a ser `sectores` con `variante: 'donut'`. El nombre antiguo sigue funcionando como alias durante toda la serie 0.x y se dibuja igual.
- Las partes que no caben se agrupan solas en «Otros» (Neutro 300), y una categoría llamada «Otros», «Otras…» o «Resto» se pinta también en Neutro 300 y al final.

## Novedades de la 0.4.0

- Patrones de KPI completos en un único tipo `kpi` con bloques: el valor, un bloque de comparación (variación, tendencia, objetivo, anterior, previsión, estado, ranking, comparado o benchmark), un bloque visual (serie, barras, desglose, componentes, secundarios o progreso) y el contexto. Incluye selector de periodo y la rejilla de KPI (`kpi-rejilla`).
- Familia Objetivos y cumplimiento: tipo `progreso` (barras, anillo, medidor, ritmo y distancia), `tabla` · `scorecard` y `semaforo`, `barras-divergentes` · `desviacion-objetivo` y los estados frente al objetivo (en objetivo, en riesgo, fuera).
- `kpi-simple`, `kpi-variacion`, `kpi-objetivo`, `kpi-sparkline`, `kpi-contexto` y `barras-progreso` siguen funcionando como alias y se dibujan igual.

## Novedades de la 0.3.0

- Familia Evolución y tendencias completa: `lineas` gana 11 variantes (simple, múltiples, escalonada, tendencia, acumulada, media móvil, referencia, objetivo, previsión con banda, real frente a previsión y frente al año anterior) y llegan los tipos `areas` (4 variantes) y `sparkline`.
- `lineas` rotula el último valor en las variantes que lo piden y, desde la 3.ª serie, usa trazo discontinuo con marcadores. Las especificaciones de la 0.2 siguen siendo válidas.
- `tabla` admite columnas de tipo `sparkline`.

## Novedades de la 0.2.0

- Familia Comparación completa: tipos `barras` (6 variantes), `barras-divergentes`, `puntos`, `dos-momentos`, `bullet`, `ranking` y `tabla`.
- Motor ECharts 6.1.0 (antes 5.6.0). Los 9 componentes de la 0.1 se dibujan igual.
- `barras-agrupadas` pasa a ser `barras` con `variante: 'agrupadas'`. El nombre antiguo sigue funcionando como alias durante toda la serie 0.x.
- La guía se divide en `DESIGN.md` (índice) y `referencias/` (una por familia) para que la IA consuma menos.

## Prueba con una IA

1. Abre una conversación nueva, sin contexto previo.
2. Adjunta `DESIGN.md`, la referencia de la familia que vayas a probar (por ejemplo `referencias/comparacion.md`) y los CSV de `datos/`. El script se carga desde la URL pública.
3. Pide, por ejemplo: «Crea una aplicación web con un dashboard comercial a partir de estos CSV. Usa el sistema de gráficos descrito en DESIGN.md.»

## URL pública

`https://cdn.jsdelivr.net/npm/edelvives-graficos@0.9.0/dist/edelvives-graficos.js`

Las referencias también se sirven desde ahí: `https://cdn.jsdelivr.net/npm/edelvives-graficos@0.9.0/referencias/comparacion.md`.

El kit se publica en npm (paquete `edelvives-graficos`) y jsDelivr lo sirve desde ahí. Es la misma URL para la skill de Claude (incluidos los artefactos publicados), los Gems de Gemini, los GPT de ChatGPT y los servidores de Edelvives.

## Publicar una versión nueva

1. Si has cambiado ejemplos o tipos, ejecuta `python3 herramientas/generar.py`.
2. Sube los cambios al repositorio.
3. Cambia `version` en `package.json` y la versión de las URL de `DESIGN.md`.
4. Publica con `npm publish` desde la carpeta del repositorio.
5. Actualiza la skill de Claude: sustituye su guía por el contenido de `DESIGN.md` (conservando la cabecera de la skill), copia la carpeta `referencias/` junto a ella y actualiza la copia de `dist/edelvives-graficos.js`. Los mapas se cargan desde jsDelivr (no hace falta copiar `dist/mapas/` en la skill).
6. Si cambia la cartografía, descarga de nuevo la BDDAE del Centro de Descargas del CNIG y ejecuta `python3 herramientas/mapas.py <carpeta con SHP_ETRS89 y SHP_WGS84>`.

Un número de versión publicado en npm no se puede reutilizar: cada cambio necesita una versión nueva.
