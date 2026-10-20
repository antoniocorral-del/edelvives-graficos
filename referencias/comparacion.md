# Comparación · referencia del kit v0.5

Para comparar magnitudes entre categorías, productos, territorios, periodos o grupos. Los campos comunes (`titulo`, `unidad`, `periodo`, `abreviar`…) están en `DESIGN.md`.

Campos de esta familia:

- `orden`: `"valor"` (de mayor a menor) o `"natural"` (el orden de los datos). Cada variante indica su orden por defecto.
- `destacar`: nombre exacto del único elemento que se resalta en naranja.
- `rol` de una serie: `actual` (naranja), `anterior` (gris), `prevision` (discontinua).

## `barras`

| `variante` | Pregunta | Límites |
| --- | --- | --- |
| `verticales` | ¿Cuánto vale cada categoría? | 1 serie, ≤ 8 categorías con nombres cortos |
| `horizontales` | ¿Cómo se comparan categorías con nombres largos? | 1 serie, ≤ 12 categorías; `orden` por defecto `"valor"` |
| `agrupadas` | ¿Cómo se comparan varias series en cada categoría? | 1-3 series, ≤ 6 categorías |
| `apiladas` | ¿Cuánto suma el total y cuánto aporta cada parte? | 2-5 series (partes), ≤ 8 categorías; el kit rotula el total |
| `apiladas-100` | ¿Cómo cambia el peso de cada parte entre grupos? | 2-5 series, ≤ 8 categorías; pasa valores absolutos y el kit calcula los % |
| `con-referencia` | ¿Alcanza cada categoría su objetivo o referencia? | 1 serie, ≤ 8 categorías; el objetivo es una marca fina |

Sin valores negativos. Sin `variante`, una serie se dibuja como `verticales` y varias como `agrupadas`. Frente al periodo anterior o a la previsión (`vs-anterior`, `vs-prevision`) y el % de objetivo alcanzado (`con-referencia` con `cumplimiento:true`): ver `variacion.md`.

```js
{ tipo:'barras', variante:'verticales', titulo:'Pedidos por delegación', unidad:'pedidos', periodo:'Enero–septiembre',
  datos:{ categorias:['Norte','Centro','Este','Sur'], valores:[4210,6380,5120,4870] } }

{ tipo:'barras', variante:'agrupadas', titulo:'Ventas por canal', unidad:'€', abreviar:true,
  datos:{ categorias:['Colegios','Librerías','Online'],
          series:[ {nombre:'2025', rol:'anterior', valores:[7075590,4476513,1713215]}, {nombre:'2026', valores:[7382064,4687990,2133968]} ] } }
  // apiladas y apiladas-100: el mismo formato; cada serie es una parte del total.

{ tipo:'barras', variante:'con-referencia', titulo:'Ventas frente al objetivo', unidad:'€', abreviar:true,
  datos:{ categorias:['Norte','Centro','Este'], valores:[1833166,3962215,2859096], objetivos:[1755917,4040294,2975862] } }
  // objetivos: una lista (uno por categoría) o un número. nombreObjetivo:'Media' si la referencia no es un objetivo.
```

## `barras-divergentes`

| `variante` | Pregunta | Límites |
| --- | --- | --- |
| `centro` | ¿Qué categorías quedan por encima o por debajo de una referencia? | ≤ 12 categorías, valores con signo; `referencia` obligatoria; `orden` por defecto `"valor"` |
| `piramide` | ¿Cómo se comparan dos grupos frente a las mismas categorías? | exactamente 2 series, ≤ 12 categorías, misma escala a ambos lados |
| `desviacion-objetivo` | ¿Cuánto se desvía cada indicador de su objetivo? | con estados; ver `objetivos.md` |
| `desviacion`, `desviacion-pct`, `contribucion` | Desviaciones frente al plan y aportaciones al cambio | ver `variacion.md` |

```js
{ tipo:'barras-divergentes', variante:'centro', titulo:'Variación de ventas por comunidad', unidad:'%', decimales:1,
  referencia:'vs. ene–sep 2025', datos:{ categorias:['Aragón','Galicia','Madrid'], valores:[-3.1,1.5,9.4] } }

{ tipo:'barras-divergentes', variante:'piramide', titulo:'Docentes por edad', unidad:'docentes',
  datos:{ categorias:['Menos de 30','30–39','40–49'], series:[ {nombre:'Mujeres', valores:[1840,4210,5120]}, {nombre:'Hombres', valores:[620,1580,2240]} ] } }
```

`referencia` nombra el eje central: el cero, la media o el objetivo (`"vs. media nacional"`). Los valores ya son la diferencia frente a ella.

## `puntos`

| `variante` | Pregunta | Límites |
| --- | --- | --- |
| `puntos` | ¿Cómo se comparan muchas categorías con poca tinta? | ≤ 15 categorías; `orden` por defecto `"valor"` |
| `piruleta` | ¿Qué valor destaca sobre el resto? | ≤ 12 categorías con nombres cortos, sin negativos; `orden` por defecto `"natural"` |

```js
{ tipo:'puntos', variante:'puntos', titulo:'Satisfacción por servicio', unidad:'puntos (0–100)', destacar:'Atención comercial',
  datos:{ categorias:['Atención comercial','Plataforma digital','Logística'], valores:[82,74,63] } }
```

Sin `destacar`, se resalta el valor mayor. En `puntos`, `ejeDesdeCero:false` ajusta el eje a los datos.

## `dos-momentos`

| `variante` | Pregunta | Límites |
| --- | --- | --- |
| `pesas` | ¿Cuánto ha cambiado cada categoría entre dos momentos o grupos? | exactamente 2 series, ≤ 10 categorías |
| `pendiente` | ¿Qué categorías suben o bajan entre dos momentos? | exactamente 2 series, ≤ 8 categorías |

```js
{ tipo:'dos-momentos', variante:'pesas', titulo:'Cuota de mercado por comunidad', unidad:'%', decimales:1,
  datos:{ categorias:['Andalucía','Cataluña','Galicia'], series:[ {nombre:'2025', valores:[11.2,8.4,9.3]}, {nombre:'2026', valores:[12.0,9.7,9.6]} ] } }
```

La primera serie es el inicio (gris) y la segunda, el final (naranja). En `pendiente`, sin `destacar` se resalta la categoría con mayor cambio. Para antes y después de una intervención, en columnas, usa `antes-despues` (ver `variacion.md`).

## `bullet`

¿Cuánto se ha logrado frente al objetivo y a los rangos de calidad? De 1 a 5 métricas con la misma unidad.

```js
{ tipo:'bullet', titulo:'Cobertura de colegios por zona', unidad:'%',
  datos:{ metricas:[ {nombre:'Norte', valor:68, objetivo:80, rangos:[50,70,100]}, {nombre:'Sur', valor:45, objetivo:70, rangos:[50,70,100]} ] } }
```

`rangos`: los límites superiores de los tramos bajo, medio y alto, crecientes.

## `ranking`

| `variante` | Pregunta | Límites |
| --- | --- | --- |
| `lista` | ¿Qué posición ocupa cada elemento, en especial el nuestro? | `destacar` obligatorio; ≤ 30 elementos, se muestran `limite` (10 por defecto, de 3 a 15) |
| `evolucion` | ¿Cómo cambia la posición de cada elemento? | 2-5 series, 2-8 periodos |

```js
{ tipo:'ranking', variante:'lista', titulo:'Cumplimiento por delegación', unidad:'%', destacar:'Centro',
  datos:{ categorias:['Norte','Centro','Este','Sur'], valores:[104,98,96,93] } }

{ tipo:'ranking', variante:'evolucion', titulo:'Posición de cada línea por ventas', unidad:'€', destacar:'ESO',
  datos:{ periodos:['T1','T2','T3'], series:[ {nombre:'Primaria', valores:[980,1200,1900]}, {nombre:'ESO', valores:[540,880,1320]}, {nombre:'Infantil', valores:[760,980,1250]} ] } }
```

`lista` ordena de mayor a menor y numera. Si la entidad destacada queda fuera del límite, se muestra al final con su posición real. En `evolucion`, el kit calcula las posiciones a partir de `valores` (el mayor es el 1.º); si ya las tienes, usa `posiciones` en todas las series.

## `tabla`

| `variante` | Pregunta |
| --- | --- |
| `comparativa` | ¿Qué cifra exacta tiene cada categoría en cada métrica? |
| `con-barras` | ¿Cuánto pesa cada valor dentro de la tabla? |
| `con-estados` | ¿En qué estado está cada elemento? |
| `scorecard`, `semaforo` | Indicadores frente a su objetivo: ver `objetivos.md` |

De 2 a 8 columnas y hasta 20 filas. Cada columna lleva `titulo` y `tipo`:

- `texto` (por defecto la primera) y `fecha` (texto alineado a la derecha).
- `numero`, `porcentaje` (valor en %) y `variacion` (en %, con signo y sin color). Admiten `decimales`; `numero` admite `abreviar`.
- `barra`: barra naranja con el valor al final. `unidad:'%'` si el valor es un porcentaje.
- `sparkline`: la tendencia de la fila, sin ejes. Cada celda es una lista de al menos 3 números.
- `estado`: `"entregado"`, `"en-proceso"`, `"incidencia"` o `"pendiente"` (o los estados frente a un objetivo: `"en-objetivo"`, `"en-riesgo"`, `"fuera"`), o `{ estado:'en-proceso', texto:'En revisión' }`. El kit pone icono, texto y color.

```js
{ tipo:'tabla', variante:'comparativa', titulo:'Ventas por delegación', unidad:'€', periodo:'Tercer trimestre',
  datos:{ columnas:[ {titulo:'Delegación'}, {titulo:'Jul', tipo:'numero'}, {titulo:'Ago', tipo:'numero'}, {titulo:'Var. vs. 2025', tipo:'variacion'} ],
          filas:[ ['Norte',124000,131000,7.0], ['Centro',298000,302000,9.3] ] } }

{ tipo:'tabla', variante:'con-estados', titulo:'Pedidos de la semana', unidad:'pedidos',
  datos:{ columnas:[ {titulo:'Pedido'}, {titulo:'Estado', tipo:'estado'}, {titulo:'Fecha', tipo:'fecha'} ],
          filas:[ ['P-1001','entregado','12 oct'], ['P-1003','en-proceso','14 oct'] ] } }
```

Una celda vacía (`null`) se muestra como «–». Para más de 20 filas, muestra las principales o divide la tabla. Para totales y subtotales en niveles que se pliegan, usa `tabla` · `jerarquica` (en `jerarquia.md`).
