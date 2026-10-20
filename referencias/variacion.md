# Variación · referencia del kit v0.5

Para explicar por qué cambia un valor: desviaciones, contribuciones y puentes entre dos cifras. Los campos comunes están en `DESIGN.md`. La variación es neutra: lo que sube va en naranja y lo que baja en gris oscuro, sin juzgar si es bueno o malo; los totales van en Neutro 400. Pasa los cambios con signo (`-18`, no `18` con un campo aparte).

## `cascada`

¿Cómo se pasa del valor inicial al final y qué aporta cada paso?

| `variante` | Cuándo | Pasos |
| --- | --- | --- |
| `vertical` (por defecto) | Nombres cortos | 1-8 |
| `horizontal` | Nombres largos o más pasos | 1-10 |

Datos: `inicio` (`{ etiqueta, valor }` o un número), `categorias` y `valores` (los pasos, con signo) y `final` (opcional: `{ etiqueta }`; si das `valor`, el kit comprueba que el inicio más los pasos cuadran con él). Las barras parten de cero, así que con pasos muy pequeños frente al inicio se ven finos.

```js
{ tipo:'cascada', titulo:'Centros con adopción: de 2025 a 2026', unidad:'centros',
  datos:{ inicio:{ etiqueta:'2025', valor:620 }, categorias:['Altas','Bajas','Retornos'], valores:[240,-95,60], final:{ etiqueta:'2026', valor:825 } } }

{ tipo:'cascada', variante:'horizontal', titulo:'Qué explica el cambio del margen', unidad:'€', abreviar:true,
  datos:{ inicio:{ etiqueta:'Margen 2025', valor:3210000 }, categorias:['Efecto volumen','Efecto precio','Descuentos comerciales'],
          valores:[1180000,520000,-610000], final:{ etiqueta:'Margen 2026' } } }
```

## `barras-divergentes`

| `variante` | Pregunta | Datos |
| --- | --- | --- |
| `desviacion` | ¿Qué categorías o periodos se desvían de la referencia y en qué sentido? | `categorias` (barras horizontales) o `periodos` (columnas), `valores` con signo; ≤ 12 |
| `desviacion-pct` | ¿Cuánto varía cada periodo o elemento en %? | `periodos` o `categorias`, `valores` en % con `unidad:"%"`; ≤ 12 |
| `contribucion` | ¿Cuánto aporta cada factor al cambio total? | `categorias`, `valores` con signo (≤ 10) y `total` opcional |

`referencia` es obligatoria en las tres: frente a qué se mide (`"vs. plan"`, `"vs. 2025"`) o qué cambio se explica (`"al crecimiento vs. 2025"`). Los valores ya son la diferencia.

- `desviacion`: con `categorias`, las barras salen del eje central y `lados` rotula los dos lados (por defecto `["Por debajo", "Por encima"]`); `orden` por defecto `"natural"`. Con `periodos`, son columnas sobre y bajo el cero.
- `desviacion-pct`: piruletas sobre y bajo el cero, con un decimal por defecto.
- `contribucion`: ordena los factores de mayor a menor magnitud (`«Otros»` al final; `orden:'natural'` mantiene el de los datos) y añade la fila del total (la suma, o `datos.total`, que debe cuadrar con ella). `nombreTotal` cambia su rótulo (por defecto «Total»). Las etiquetas llevan la unidad: para contribuciones a un cambio en %, usa `unidad:"p. p."`.

```js
{ tipo:'barras-divergentes', variante:'desviacion', titulo:'Desviación de ventas frente al plan por línea', unidad:'€', abreviar:true,
  referencia:'vs. plan 2026', lados:['Bajo el plan','Sobre el plan'],
  datos:{ categorias:['Infantil','Primaria','ESO'], valores:[142000,-86000,228000] } }

{ tipo:'barras-divergentes', variante:'desviacion', titulo:'Desviación mensual de pedidos', unidad:'pedidos', referencia:'vs. presupuesto',
  datos:{ periodos:['Ene','Feb','Mar'], valores:[120,-80,150] } }

{ tipo:'barras-divergentes', variante:'desviacion-pct', titulo:'Variación interanual de ventas', unidad:'%', referencia:'vs. el mismo mes de 2025',
  datos:{ periodos:['Ene','Feb','Mar'], valores:[4.2,-2.8,6.1] } }

{ tipo:'barras-divergentes', variante:'contribucion', titulo:'Contribución al crecimiento de ventas', unidad:'p. p.', decimales:1,
  referencia:'al crecimiento vs. 2025', datos:{ categorias:['Volumen','Precio','Descuentos','Otros'], valores:[3.2,2.4,-1.6,3.6], total:7.6 } }
```

## `dos-momentos` · `antes-despues`

¿Qué cambió entre antes y después de una intervención? Columnas agrupadas: la primera serie es el antes (gris) y la segunda, el después (naranja). Bajo cada categoría, el cambio: en % o, si la unidad es `"%"`, en puntos. Exactamente 2 series, ≤ 6 categorías, sin negativos.

```js
{ tipo:'dos-momentos', variante:'antes-despues', titulo:'Uso de la plataforma antes y después de la formación', unidad:'sesiones al mes',
  datos:{ categorias:['Infantil','Primaria','ESO'], series:[ {nombre:'Antes', valores:[40,52,38]}, {nombre:'Después', valores:[55,60,35]} ] } }
```

## `barras` frente a una referencia

| `variante` | Pregunta | Datos |
| --- | --- | --- |
| `vs-anterior` | ¿Cómo se compara cada periodo con el anterior? | `categorias` o `periodos` (≤ 12) y 2 `series`: la actual y la anterior (`rol:'anterior'`) |
| `vs-prevision` | ¿Qué parte es real y qué parte es previsión? | `categorias` o `periodos` (≤ 12), `valores` (lo real, de los primeros periodos) y `prevision: { valores, origen }` (uno por periodo restante) |
| `con-referencia` con `cumplimiento:true` | ¿Qué porcentaje del objetivo ha alcanzado cada categoría? | como `con-referencia` (ver `comparacion.md`); objetivos mayores que cero |

El periodo actual va en columnas naranjas y el anterior en línea gris. La previsión se dibuja sin relleno, con borde discontinuo; `origen` sale en la nota. Con `cumplimiento:true`, las barras van en horizontal con la marca del objetivo y el % alcanzado a la derecha.

```js
{ tipo:'barras', variante:'vs-anterior', titulo:'Pedidos mensuales frente a 2025', unidad:'pedidos',
  datos:{ periodos:['Ene','Feb','Mar'], series:[ {nombre:'2026', valores:[4200,4800,4500]}, {nombre:'2025', rol:'anterior', valores:[3800,4300,4600]} ] } }

{ tipo:'barras', variante:'vs-prevision', titulo:'Ventas de 2026: real y previsión', unidad:'€', abreviar:true,
  datos:{ periodos:['Ene','Feb','Mar','Abr'], valores:[420000,480000], prevision:{ valores:[520000,560000], origen:'plan comercial 2026' } } }

{ tipo:'barras', variante:'con-referencia', cumplimiento:true, titulo:'Cumplimiento del objetivo por proyecto', unidad:'€', abreviar:true,
  datos:{ categorias:['Saber Hacer','Lecturas Edelvives'], valores:[1880000,2320000], objetivos:[2000000,2000000] } }
```

## `descomposicion` · `paneles`

¿Qué tendencia y estacionalidad forman la serie? Un panel por componente con la misma escala temporal: serie observada, tendencia y estacionalidad (`mostrarResiduo:true` añade el residuo). Datos: `periodos` (8-156) y `valores` (la serie observada, sin huecos), y además una de estas dos cosas:

- `ciclo`: los periodos de un ciclo estacional (12 con meses, 4 con trimestres, 7 con días). El kit calcula una descomposición aditiva clásica y lo indica en la nota. Necesita al menos 2 ciclos completos.
- `tendencia` y `estacionalidad` (y, si quieres, `residuo`) ya calculadas, con un valor por periodo.

```js
{ tipo:'descomposicion', titulo:'Ventas mensuales: tendencia y estacionalidad', unidad:'€', abreviar:true,
  datos:{ periodos:['Ene 2024','Feb 2024', /* … 36 meses */], valores:[756000,679000, /* … */], ciclo:12 } }
```
