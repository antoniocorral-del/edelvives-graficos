# Kit de gráficos Edelvives v0.10 (web, presentaciones e impresión)

Para ver los gráficos, abre con doble clic `vista-previa.html` (los 159 ejemplos, agrupados por familia, con un selector de modo: web, presentación en los dos temas e impresión por columnas) o `demo-dashboard-comercial.html` (el dashboard de la primera prueba, con el kit v0.1 incrustado). Se abren en el navegador y necesitan conexión a internet.

Contenido:

- `dist/edelvives-graficos.js`: el script que dibuja (tokens, validador, renderizador, exportación a SVG y a PowerPoint, iconos de Feather con licencia MIT). Carga ECharts 6.1.0, Titillium Web y, fuera de web, Barlow por su cuenta.
- `dist/mapas/`: los contornos de España por comunidades y por provincias (TopoJSON, en `.js`, que es lo que carga el kit, y en `.json`). Obra derivada de BDLJE CC-BY 4.0 [ign.es](https://www.ign.es/) (Límites municipales, provinciales y autonómicos del IGN, fichero del 28/07/2026; licencia de la Orden FOM/2807/2015, compatible con CC-BY 4.0). Se cargan solo al dibujar un mapa.
- `DESIGN.md`: la guía que lee la IA. Es un índice corto: tabla de selección, reglas comunes y carga.
- `referencias/`: una referencia por familia con el formato, los límites y ejemplos de cada componente. La IA solo lee la que necesita.
- `esquema.json`: el formato de la especificación (JSON Schema).
- `tokens.json`: colores, tipografía por modo, estados y contraste en formato W3C DTCG, con el CMYK FOGRA39 del sistema. Lo genera `herramientas/tokens.py`: no se edita a mano.
- `sistema/tokens-sistema-diseno.json`: los tokens del sistema de diseño de Edelvives (interfaces v6.2, documentos v1.1, presentaciones v1.0), la fuente de verdad de los colores y la tipografía. No se publica en npm.
- `ejemplos/`: una especificación válida por componente.
- `datos/`: CSV ficticios para la prueba del dashboard comercial.
- `herramientas/tokens.py`: traductor de tokens. Lee el sistema y `herramientas/tokens-graficos.json` (lo propio de los gráficos: roles, paletas, estados, mapa y tipografía por modo, que solo nombran tokens del sistema) y escribe `tokens.json` y el bloque de tokens del script. `--comprobar` falla si no coinciden; `--recalcular` rehace los CMYK provisionales (`herramientas/cmyk-provisional.json`); `--figma` escribe además `herramientas/figma-variables.json`, las variables para Figma (colecciones «Primitivos» y «Gráficos» con los modos Web, Presentación blanco, Presentación negro e Impresión, sacadas del propio script).
- `herramientas/generar.py`: regenera `esquema.json` y `vista-previa.html`. `herramientas/mapas.py`: prepara `dist/mapas/` a partir de los shapefiles de la BDDAE (necesita mapshaper). No se publican en npm.

## Novedades de la 0.10.0

El kit se alinea con el sistema de diseño de Edelvives y sale de la web: el sistema manda en la página, la diapositiva o el documento; el kit, dentro del gráfico.

- **Modos.** `EG.configurar({ modo: 'web' | 'presentacion' | 'impresion', tema })`. El modo es de la página y `medio` en la especificación debe coincidir con él. Todo en `referencias/modos.md`.
- **Presentación** (lienzo de 1920 × 1080, temas blanco y negro con los colores `pres-*`, acento naranja-400, Barlow en ejes, leyendas y etiquetas; Titillium en título, unidad y cifras). `EG.pptx(spec)` devuelve el gráfico nativo de PowerPoint para PptxGenJS (barras, líneas, áreas, donut, pie, dispersión, burbujas y radar) o la tabla nativa; funciona también en Node. Las fuentes, como el script de presentaciones del sistema (Barlow con la fuente del tema). `EG.svg(spec)` da la imagen vectorial para el resto. Sin título ni unidad por defecto (los pone la diapositiva) y sin colores de estado.
- **Impresión** (A4 en pt, Barlow 8/9 pt y Titillium). `EG.svg(spec, { columnas: 1-4 })` da el SVG al ancho de la rejilla del A4, solo con colores de tokens y sin transparencias, y el mapa de cada hexadecimal a su CMYK FOGRA39. `fuente` es obligatoria.
- **Tokens del sistema.** `tokens.json` y los colores del script se generan desde el sistema (`herramientas/tokens.py`). Desaparece naranja-200; neutro-300 es #D8D5CE en pantalla y neutro-300-doc #DBD5CE en documentos y presentaciones; el texto de aviso pasa a #886200. naranja-700, neutro-400, neutro-600 y neutro-700 no tienen CMYK en el sistema: el kit los calcula con el perfil FOGRA39, los marca como provisionales y avisa cuando un gráfico de impresión los usa.
- **Paletas.** `paleta: 'foco'` (por defecto: un protagonista en naranja y el resto en neutros; 6 colores en web, 5 en presentación y 4 en impresión) o `paleta: 'gama'` (naranja, azul, verde, amarillo, morado, rosa y rojo; hasta 7). Con gama y 3 series o más sobre fondo claro, `etiquetas: true` (valor junto a cada barra o segmento, nombre y último valor al final de cada línea): verde y amarillo no llegan a 3:1.
- **KPI con `mejor`.** `mejor: 'subir' | 'bajar'` (por defecto `subir`): la variación es favorable (verde) o desfavorable (rojo), con flecha, signo y «mejora» o «empeora». `sentidoPositivo` sigue valiendo como alias en toda la serie 0.x. `modo: 'neutro'` queda para cuando no hay sentido claro.
- **Iconos Feather** (trazo de 1,5 px, sin relleno, licencia MIT) en lugar de Material Symbols.
- **`fuente`** es ahora el origen de los datos (se rotula «Fuente: …» al pie). Para avisar de estilos que el kit ignora, el campo es `tipografia`.
- **Validador:** series por paleta y modo, `etiquetas` con gama, donut de 5 sectores fuera de web, fuente en impresión, tipos solo web fuera de web (pipeline, progresión, cronología vertical, calendario · mes, anidados y tabla jerárquica) y CMYK provisional.
- **Esquema y ejemplos:** `paleta`, `etiquetas`, `fuente` y `mejor` en el esquema; `medio` admite los tres modos. Ejemplos nuevos: `barras-agrupadas-gama`, `lineas-gama-etiquetas` y `kpi-mejor-bajar`.

Cambios visibles en web (gráficos ya publicados con la 0.9):

- Las series 3 a 6 de los gráficos de varias series pasan de naranjas a neutros (paleta foco): áreas, barras apiladas, sectores, treemap, marimekko, mapa de categorías, red y otros. Neutro 300 va el último de la paleta porque es el color de «Otros».
- La variación del KPI deja de ser neutra por defecto: ahora es verde o roja según `mejor`, y el chip lleva «mejora» o «empeora».
- Iconos nuevos en KPI, estados y tablas; «Pendiente» pasa a un reloj y «En proceso», a `loader`.
- Neutro 300 (bordes de tarjeta, pistas, «Otros») pasa de #DBD5CE a #D8D5CE y el texto de aviso, de #8B6200 a #886200. La rampa naranja de Jerarquía pierde naranja-200 (6 tonos en vez de 7).
- Carga de la fuente: el kit espera a que Titillium Web (y Barlow, en presentación e impresión) haya cargado antes de medir y dibujar. Antes, en la primera visita, `document.fonts.load` se pedía antes de leer la hoja de estilos y se resolvía en el acto: los rótulos se medían con la fuente de reserva y salían recortados («Canaria», «Baleare») o mal repartidos. Ahora espera a la hoja y luego a cada peso; si algo falla o tarda más de 5 s, dibuja igual. Barlow se pide a Google Fonts (`EG.configurar({ barlow: url })` para servirla desde otro sitio) y solo fuera de web.

## Novedades de la 0.9.2

Salen de la prueba del dashboard Actividad Comercial (campaña Curso 2026), hecha con la 0.9.1.

- Sankey: cada nodo final se dibuja en la columna siguiente a su origen, no en la última (antes sus cintas cruzaban columnas que no les correspondían). La variante `aluvial` también fija la alineación a la izquierda en ECharts; se dibuja igual.
- Sankey: con 3 niveles o más, si ningún nodo recibe enlaces de más de un origen, el validador avisa de que los datos son un total desglosado en niveles y propone `particion · icicle` o `tabla · jerarquica`. Es aviso, no error: el gráfico se dibuja.
- `referencias/flujo.md` explica cuándo no usar el sankey, y `referencias/jerarquia.md` remite al icicle para los desgloses que venían pensados como sankey.
- KPI y `progreso` · `ritmo`: los rótulos de las barras de escala (objetivo, benchmark, previsión, esperado hoy) ya no se salen de la tarjeta cuando su marca está cerca de un extremo ni se pisan entre sí; se recolocan al cambiar el tamaño y cuando carga la fuente.
- El resto de especificaciones de la 0.9.1 se dibujan igual.

## Novedades de la 0.9.1

- Atribución de los mapas conforme a la licencia del IGN: la nota de cada mapa dice «Contornos: obra derivada de BDLJE CC-BY 4.0 ign.es.», con «ign.es» enlazado a https://www.ign.es/. Los metadatos de `dist/mapas/` llevan la misma mención y el linaje del conjunto derivado.
- Ningún otro cambio: las especificaciones de la 0.9.0 se dibujan igual (solo cambia el texto de la nota de los mapas). La 0.9.0 queda desaconsejada en npm.

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

`https://cdn.jsdelivr.net/npm/edelvives-graficos@0.10.0/dist/edelvives-graficos.js`

Las referencias también se sirven desde ahí: `https://cdn.jsdelivr.net/npm/edelvives-graficos@0.10.0/referencias/comparacion.md`.

El kit se publica en npm (paquete `edelvives-graficos`) y jsDelivr lo sirve desde ahí. Es la misma URL para la skill de Claude (incluidos los artefactos publicados), los Gems de Gemini, los GPT de ChatGPT y los servidores de Edelvives.

## Publicar una versión nueva

1. Si ha cambiado el sistema de diseño, copia su archivo en `sistema/tokens-sistema-diseno.json` y ejecuta `python3 herramientas/tokens.py`. Si has cambiado ejemplos o tipos, ejecuta `python3 herramientas/generar.py`. `python3 herramientas/tokens.py --comprobar` debe pasar antes de publicar.
2. Sube los cambios al repositorio.
3. Cambia `version` en `package.json` y la versión de las URL de `DESIGN.md`.
4. Publica con `npm publish` desde la carpeta del repositorio.
5. Actualiza la skill de Claude: `python3 herramientas/skill.py` genera la carpeta `herramientas/skill/graficos-edelvives/` (SKILL.md desde `herramientas/skill.md`, `referencias/`, `assets/` con el script y `tokens.json`, `scripts/validar.js`) y el .zip para subir a Claude. Los mapas se cargan desde jsDelivr (no hace falta copiar `dist/mapas/` en la skill).
6. Si cambia la cartografía, descarga de nuevo `LINEAS_LIMITE.ZIP` («Límites municipales, provinciales y autonómicos») del Centro de Descargas del CNIG, pon su fecha en `FUENTE` de `herramientas/mapas.py` y ejecuta `python3 herramientas/mapas.py <carpeta con SHP_ETRS89 y SHP_WGS84>`.

Un número de versión publicado en npm no se puede reutilizar: cada cambio necesita una versión nueva.
