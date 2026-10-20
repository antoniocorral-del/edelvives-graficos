# Composición · referencia del kit v0.5

Para mostrar qué parte del total representa cada categoría. Los campos comunes están en `DESIGN.md`. Pasa los valores en bruto: el kit calcula los porcentajes. Todas las partes son positivas (para valores con signo usa `barras-divergentes`). Si hay más partes de las permitidas, el kit agrupa las pequeñas en «Otros» (Neutro 300) y lo avisa; una categoría que se llame «Otros», «Otras…» o «Resto» también va en Neutro 300 y al final.

## `sectores`

| `variante` | Pregunta | Partes |
| --- | --- | --- |
| `donut` (por defecto) | ¿Qué parte del total es cada categoría y cuál es el total? | 2-6 |
| `pie` | ¿Qué parte del total es cada categoría? (sin cifra central) | 2-6 |
| `semidonut` | ¿Cómo se reparte un total en pocas partes y cuál es el dato central? (poco espacio) | 2-4 |

Datos: `categorias` y `valores`. Las partes van de mayor a menor desde las 12 h. En `donut` y `semidonut`, el centro muestra el total; `centro.valor` lo sustituye por otra cifra y `centro.etiqueta` cambia el texto (por defecto «Total»). `donut` sigue funcionando como alias de `sectores` · `donut`.

```js
{ tipo:'sectores', variante:'donut', titulo:'Ventas por línea', unidad:'€', abreviar:true,
  datos:{ categorias:['Primaria','Infantil','ESO'], valores:[5397528,2982845,2698764] }, centro:{ etiqueta:'Total' } }

{ tipo:'sectores', variante:'semidonut', titulo:'Adopciones por etapa', unidad:'centros',
  datos:{ categorias:['Primaria','Infantil','ESO','Bachillerato'], valores:[570,347,198,125] }, centro:{ etiqueta:'Centros con adopción' } }
```

## `treemap` · `plano`

¿Qué peso tiene cada parte en un total con muchas partes? De 3 a 7 rectángulos (con más, las pequeñas van a «Otros»). Solo se rotulan los rectángulos con espacio; el resto se lee en el tooltip. Datos: `categorias` y `valores`. Para grupos con sus elementos dentro, usa `treemap` · `jerarquico` (en `jerarquia.md`).

```js
{ tipo:'treemap', titulo:'Ventas por comunidad', unidad:'€', abreviar:true,
  datos:{ categorias:['Madrid','Andalucía','Cataluña','Galicia','Otras comunidades'], valores:[3420500,2810300,1985400,760300,1407400] } }
```

## `proporcion`

| `variante` | Pregunta | Datos |
| --- | --- | --- |
| `barra` (con `categorias`) | ¿Cuánto aporta cada parte al total, en una sola barra? | `categorias`, `valores` (2-6) |
| `cuota` (con `valor`) | ¿Qué cuota tenemos sobre el total? | `valor`, `anterior`, `etiqueta`, `resto` |
| `waffle` | ¿Qué proporción representa la parte destacada? (100 celdas = 100 %) | `valor`, `etiqueta`, `resto`, `base` |
| `participacion` | ¿Qué participación tiene cada elemento en su conjunto? (una pista por elemento) | `categorias`, `valores` (≤ 8) |

En `cuota`, `waffle` y `participacion` los valores son porcentajes con `unidad:"%"`; si los tienes en otra unidad, añade `datos.total` y el kit calcula el %. En `cuota` indica la referencia `anterior` (en la misma escala que `valor`): se muestra con la diferencia en puntos. `etiqueta` y `resto` nombran la parte y lo demás en la leyenda; `base` cambia el texto bajo la cifra («del total», «cuota»). `barra` y `participacion` se ordenan de mayor a menor (`orden:'natural'` mantiene el de los datos).

```js
{ tipo:'proporcion', variante:'barra', titulo:'Composición de las ventas', unidad:'€', abreviar:true,
  datos:{ categorias:['Libro de texto','Digital','Literatura'], valores:[6630000,4035000,2310000] } }

{ tipo:'proporcion', variante:'cuota', titulo:'Cuota de mercado en Primaria', unidad:'%',
  datos:{ valor:24, anterior:21, etiqueta:'Edelvives', resto:'Resto del mercado' } }

{ tipo:'proporcion', variante:'waffle', titulo:'Centros con plataforma digital', unidad:'centros',
  datos:{ valor:769, total:1240, etiqueta:'Con plataforma', resto:'Sin plataforma' } }

{ tipo:'proporcion', variante:'participacion', titulo:'Participación por canal', unidad:'%',
  datos:{ categorias:['Distribuidores','Venta directa','Tienda online'], valores:[42,31,18] } }
```

## `marimekko`

¿Cómo se reparte el total entre grupos de distinto tamaño y qué compone cada uno? El ancho de cada columna es el peso del grupo en el total; el alto, el reparto interno al 100 %. De 2 a 4 grupos (`grupos`) y de 2 a 3 `series` (los segmentos, de abajo arriba), con un valor por grupo.

```js
{ tipo:'marimekko', titulo:'Ventas por etapa y formato', unidad:'€', abreviar:true,
  datos:{ grupos:['Primaria','Infantil','ESO'],
          series:[ {nombre:'Papel', valores:[2700000,1790000,1350000]}, {nombre:'Digital', valores:[1620000,800000,960000]} ] } }
```
