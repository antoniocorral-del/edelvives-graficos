# Distribución · referencia del kit v0.6

Para mostrar cómo se reparten los valores: su forma, su centro, su dispersión y los casos que se salen. Los campos comunes están en `DESIGN.md`. Pasa los valores en bruto (un número por caso, sin agrupar ni ordenar): el kit calcula los intervalos, los cuartiles, la densidad y los percentiles, y pone en el subtítulo la unidad y el número de casos. `nombreCasos` dice qué es cada caso, en plural (`"alumnos"`, `"pedidos"`; por defecto `"casos"`). `marca` señala el centro: `"mediana"`, `"media"`, `"moda"` (solo en la densidad) o `"ninguna"`.

## `histograma` · `histograma`

¿Cómo se distribuyen los valores de una variable continua? Barras contiguas, una por intervalo, con la mediana marcada (`marca`, por defecto `"mediana"`). Datos: `valores` (≥ 10). El kit elige entre 6 y 16 intervalos de ancho redondo; `intervalo` fija el ancho e `inicio`, el límite inferior del primero (≤ 30 intervalos). Cada intervalo incluye su límite inferior, y el último también el superior. Si solo tienes los recuentos, pasa `limites` (de 4 a 31, de menor a mayor) y `casos` (uno menos): la mediana se estima y se rotula con «≈».

```js
{ tipo:'histograma', titulo:'Puntuación en la prueba de lectura', unidad:'puntos', nombreCasos:'alumnos',
  datos:{ valores:[48,52,61,39,55,70,44,58,63,51,47,66] } }

{ tipo:'histograma', titulo:'Importe de los pedidos', unidad:'€', nombreCasos:'pedidos',
  datos:{ limites:[0,25,50,75,100,125], casos:[140,320,210,90,40] } }
```

## `cajas`

| `variante` | Pregunta | Grupos |
| --- | --- | --- |
| `caja` (por defecto) | ¿Cuál es la mediana, la dispersión y los atípicos de cada grupo? | 1-8, con ≥ 5 valores |
| `violin` | ¿Qué forma tiene la distribución de cada grupo? (con público no técnico, mejor `caja`) | 1-6, con ≥ 10 valores |

Datos: `series`, un grupo por elemento `{ nombre, valores }` con los valores en bruto (para un solo grupo, `datos.valores`). La caja va de Q1 a Q3 con la mediana; los bigotes llegan hasta 1,5 veces el rango intercuartílico y lo que queda fuera son atípicos. El kit lo explica en la nota y, si cabe, rotula Máx., Q3, Mediana, Q1 y Mín. junto al último grupo. Si ya tienes el resumen, en `caja` cada grupo admite `resumen: { minimo, q1, mediana, q3, maximo, atipicos }` en lugar de `valores` (`minimo` y `maximo` son los extremos de los bigotes).

```js
{ tipo:'cajas', titulo:'Puntuación por comunidad', unidad:'puntos', nombreCasos:'alumnos',
  datos:{ series:[ { nombre:'Aragón', valores:[48,52,61,39,55,70,44] }, { nombre:'Madrid', valores:[58,63,51,47,66,72,60] } ] } }

{ tipo:'cajas', titulo:'Plazo de entrega por almacén', unidad:'días',
  datos:{ series:[ { nombre:'Zaragoza', resumen:{ minimo:1, q1:2, mediana:3, q3:4, maximo:6, atipicos:[11] } } ] } }
```

## `casos`

| `variante` | Pregunta | Datos |
| --- | --- | --- |
| `apilados` (por defecto con `valores`) | ¿Cuántos casos hay en cada valor o intervalo? | `valores` (10-100), apilados en columnas |
| `dispersos` (por defecto con `series`) | ¿Cómo se reparten los casos dentro de cada grupo? | `series` (1-6 grupos, ≤ 200 casos cada uno) |
| `enjambre` | ¿Cómo se agrupan los casos sin que se solapen? | `valores` o `series` (1-4 filas, ≤ 300 casos cada una) |

Un punto por caso: con más de 100 casos, usa `histograma`. `marca` por defecto: `"mediana"` en `apilados`, `"media"` en `dispersos` (una raya por grupo) y `"ninguna"` en `enjambre`.

```js
{ tipo:'casos', variante:'apilados', titulo:'Tiempo de respuesta de soporte', unidad:'horas', nombreCasos:'consultas',
  datos:{ valores:[12,18,22,22,25,27,27,28,30,31,33,35,38,41,47] } }

{ tipo:'casos', variante:'dispersos', titulo:'Satisfacción de los centros por etapa', unidad:'puntos', nombreCasos:'centros',
  datos:{ series:[ { nombre:'Infantil', valores:[72,80,65,77,69] }, { nombre:'Primaria', valores:[64,58,70,61,66] } ] } }

{ tipo:'casos', variante:'enjambre', titulo:'Crecimiento de ventas por distribuidor', unidad:'%', nombreCasos:'distribuidores',
  datos:{ valores:[3.2,4.1,-1.5,6.8,2.9,5.5,4.4,0.7,8.2,3.9] } }
```

## `distribucion`

| `variante` | Pregunta | Datos |
| --- | --- | --- |
| `densidad` | ¿Cuál es la forma suavizada de la distribución? | `valores` (≥ 20); marca la moda |
| `normal` | ¿Qué porcentaje de casos cae cerca de la media? | `media` y `desviacion` (típica), o `valores` (≥ 10) para que el kit las calcule |
| `acumulada` | ¿Qué porcentaje de casos queda por debajo de un valor? | `valores` (≥ 10) y `percentil` (de 1 a 99; por defecto 90) |

`normal` dibuja la curva teórica con ±1 desviación sombreada (el 68 % de los casos): úsala para distribuciones teóricas o casi normales. Con `valores`, la nota dice qué parte de los datos reales queda a menos de una desviación. `acumulada` marca la mediana (P50) y el `percentil` clave.

```js
{ tipo:'distribucion', variante:'densidad', titulo:'Importe de los pedidos online', unidad:'€', nombreCasos:'pedidos',
  datos:{ valores:[45,52,38,61,47,55,70,44,58,63,51,49,66,42,57,48,95,53,46,60] } }

{ tipo:'distribucion', variante:'normal', titulo:'Puntuación esperada en la prueba', unidad:'puntos', nombreCasos:'alumnos',
  datos:{ media:52, desviacion:12 } }

{ tipo:'distribucion', variante:'acumulada', titulo:'Plazo de entrega de los pedidos', unidad:'días', nombreCasos:'pedidos', percentil:90,
  datos:{ valores:[2,3,3,4,4,4,5,5,6,7,8,11] } }
```

## `percentiles` · `percentiles`

¿En qué percentil se sitúa cada elemento dentro de su grupo? Escala de 0 a 100 con marcas en P25, P50, P75 y P90; `destacar` es el elemento propio (por defecto, el primero). Datos: `categorias` (1-8) y `valores`, que son los percentiles (de 0 a 100, con `unidad:"percentil"`) o, si añades `grupo` (los valores en bruto de todo el grupo, ≥ 5), el valor de cada elemento en la unidad de la métrica, y el kit calcula su percentil. `referencia` nombra el grupo en el subtítulo.

```js
{ tipo:'percentiles', titulo:'Posición del centro en la prueba', unidad:'percentil', referencia:'entre los centros de Aragón',
  datos:{ categorias:['Nuestro centro','Centro B'], valores:[72,35] } }

{ tipo:'percentiles', titulo:'Ventas por centro: posición de cada delegación', unidad:'€', abreviar:true, destacar:'Aragón',
  datos:{ categorias:['Aragón','Navarra'], valores:[182000,95000], grupo:[60000,95000,120000,150000,182000,210000,240000] } }
```

## `rangos`

| `variante` | Pregunta | Categorías |
| --- | --- | --- |
| `rango` (por defecto) | ¿Entre qué valores oscila cada categoría? Barras horizontales; `orden:'valor'` ordena por el punto | ≤ 10 |
| `min-max` (por defecto con `periodos`) | ¿Cuál es el mínimo, el máximo y la media de cada periodo? | ≤ 12 |
| `intervalo` | ¿Con qué incertidumbre se estima el valor de cada grupo? | ≤ 10 |

Datos: `categorias` (o `periodos`), `minimos`, `maximos` y `valores`, el punto (obligatorio en `intervalo` y opcional en el resto). `nombreValor` lo nombra (por defecto «Media», o «Estimación» en `intervalo`). En `intervalo`, `minimos` y `maximos` son los límites del intervalo y `confianza` (el nivel, en %) es obligatoria; `datos.referencia: { nombre, valor }` añade la línea discontinua de referencia (por ejemplo, la media global).

```js
{ tipo:'rangos', titulo:'Precio del libro de texto por etapa', unidad:'€', nombreValor:'Precio medio',
  datos:{ categorias:['Infantil','Primaria','ESO'], minimos:[18,24,31], maximos:[29,38,47], valores:[23,31,40] } }

{ tipo:'rangos', variante:'min-max', titulo:'Pedidos diarios por mes', unidad:'pedidos',
  datos:{ periodos:['Ene','Feb','Mar'], minimos:[128,114,146], maximos:[302,280,341], valores:[208,190,236] } }

{ tipo:'rangos', variante:'intervalo', titulo:'Satisfacción estimada por canal', unidad:'puntos', confianza:95,
  datos:{ categorias:['Colegios','Librerías'], valores:[58,64], minimos:[50,57], maximos:[66,71], referencia:{ nombre:'Media global', valor:59 } } }
```
