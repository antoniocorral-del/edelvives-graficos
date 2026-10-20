# Evolución y tendencias · referencia del kit v0.5

Para mostrar cómo cambia una magnitud a lo largo del tiempo. Los campos comunes (`titulo`, `unidad`, `periodo`, `abreviar`…) están en `DESIGN.md`. El eje temporal va en `datos.periodos`, continuo y ordenado (`"Ene"`, `"T1"`, `"S12"`…), y cada serie tiene un valor por periodo.

`rol` de una serie: `actual` (naranja, destacada), `anterior` (gris), `prevision` (discontinua). Sin `rol`, la primera serie se destaca. `ejeDesdeCero:false` ajusta el eje a los datos cuando las variaciones son pequeñas (no en áreas).

## `lineas`

| `variante` | Pregunta | Series y datos |
| --- | --- | --- |
| `simple` | ¿Cómo evoluciona una magnitud? | 1 serie; rotula el último valor |
| `multiples` | ¿Cómo evolucionan varias series y cómo se comparan? | 2-4 series; desde la 3.ª, trazo discontinuo con marcadores |
| `escalonada` | ¿Cuándo cambia un valor que se mantiene constante entre cambios? | 1-4 series (tarifas, niveles, estados); no interpola |
| `tendencia` | ¿Hacia dónde apunta la serie más allá del ruido? | 1 serie, ≥ 4 periodos; el kit calcula la tendencia lineal |
| `acumulada` | ¿Cuánto llevamos acumulado en el periodo? | 1-2 series con los valores de cada periodo; el kit acumula y rotula el total |
| `media-movil` | ¿Cuál es la tendencia suavizada de una serie con ruido? | 1 serie; `ventana` = periodos que promedia (3 por defecto, de 2 a 12) |
| `referencia` | ¿Cómo se sitúa la serie respecto a la media o a un benchmark? | 1-2 series + `datos.referencia` |
| `objetivo` | ¿Cuándo se alcanza o se supera el objetivo? | 1-4 series + `datos.objetivo`; marca el primer cruce |
| `prevision` | ¿Qué se espera que ocurra a partir de hoy? | 1 serie real más corta que `periodos` + `datos.prevision` |
| `vs-prevision` | ¿Cuánto se desvía lo real de lo previsto? | 1 serie real + `datos.prevision` con un valor por periodo |
| `vs-anterior` | ¿Cómo evoluciona respecto al mismo periodo del año anterior? | 2 series; la segunda (o la que lleve `rol:'anterior'`) en gris |

Sin `variante`: con `datos.prevision`, `prevision` o `vs-prevision`; si no, `simple` o `multiples` según el número de series. `datos.objetivo` también se dibuja en `simple` y `multiples`.

```js
{ tipo:'lineas', variante:'simple', titulo:'Pedidos mensuales', unidad:'pedidos', periodo:'2026',
  datos:{ periodos:['Ene','Feb','Mar','Abr'], series:[ {nombre:'Pedidos', valores:[3210,3780,3540,4410]} ] } }

{ tipo:'lineas', variante:'vs-anterior', titulo:'Pedidos frente al año anterior', unidad:'pedidos',
  datos:{ periodos:['Ene','Feb','Mar'], series:[ {nombre:'2026', valores:[3210,3780,3540]}, {nombre:'2025', rol:'anterior', valores:[2880,3150,3020]} ] } }

{ tipo:'lineas', variante:'objetivo', titulo:'Centros activos', unidad:'centros',
  datos:{ periodos:['Ene','Feb','Mar','Abr'], series:[ {nombre:'Centros activos', valores:[318,372,451,612]} ], objetivo:600 } }
  // objetivo: un número (línea fija) o un valor por periodo. Nunca va como serie.

{ tipo:'lineas', variante:'referencia', titulo:'Satisfacción del profesorado', unidad:'puntos',
  datos:{ periodos:['Ene','Feb','Mar'], series:[ {nombre:'Satisfacción', valores:[64,67,66]} ], referencia:{ nombre:'Media del sector', valor:71 } } }
  // referencia.valor: un número o un valor por periodo. El nombre es obligatorio.

{ tipo:'lineas', variante:'media-movil', titulo:'Consultas al soporte', unidad:'consultas', ventana:4,
  datos:{ periodos:['S1','S2','S3','S4','S5','S6'], series:[ {nombre:'Consultas por semana', valores:[312,448,365,520,401,462]} ] } }

{ tipo:'lineas', variante:'prevision', titulo:'Ventas y previsión de cierre', unidad:'€', abreviar:true,
  datos:{ periodos:['Sep','Oct','Nov','Dic'],
          series:[ {nombre:'Real', valores:[2707751,1690000]} ],
          prevision:{ valores:[1210000,980000], minimo:[1040000,820000], maximo:[1380000,1140000], origen:'modelo de previsión comercial' } } }
  // prevision.valores: un valor por cada periodo sin dato real. minimo y maximo (opcionales) dibujan la banda de incertidumbre.

{ tipo:'lineas', variante:'vs-prevision', titulo:'Ventas reales frente a las previstas', unidad:'€', abreviar:true,
  datos:{ periodos:['Ene','Feb','Mar','Abr'], series:[ {nombre:'Real', valores:[893830,792051,838434]} ],
          prevision:{ valores:[910000,780000,860000,920000], origen:'plan comercial 2026' } } }
  // lo real puede acabar antes que la previsión.
```

`prevision.origen` es obligatorio: el kit lo muestra en la nota del gráfico.

## `areas`

| `variante` | Pregunta | Series |
| --- | --- | --- |
| `simple` | ¿Cuánto volumen acumula una serie a lo largo del tiempo? | 1 serie |
| `superpuestas` | ¿Cómo se comparan varias series anidadas en el tiempo? | 2-4 series que no se cruzan; el kit pone la mayor al fondo |
| `apiladas` | ¿Cómo cambia el total y la aportación de cada parte? | 2-5 series; la primera va en la base (la más comparable) |
| `apiladas-100` | ¿Cómo cambia el peso relativo de cada parte en el tiempo? | 2-5 series; pasa valores absolutos y el kit calcula los % |

Sin valores negativos. El eje parte siempre de cero.

```js
{ tipo:'areas', variante:'apiladas', titulo:'Ventas mensuales por canal', unidad:'€', abreviar:true,
  datos:{ periodos:['Ene','Feb','Mar'], series:[ {nombre:'Colegios', valores:[612000,698000,655000]}, {nombre:'Librerías', valores:[402000,431000,415000]} ] } }
```

## `sparkline`

¿Cuál es la tendencia de un vistazo, sin ejes? Una fila por serie (de 1 a 8) con el nombre, la línea y el valor actual (el último, salvo que indiques `valor`).

```js
{ tipo:'sparkline', titulo:'Indicadores de la semana', unidad:'€', periodo:'Últimos 10 días',
  datos:{ series:[ {nombre:'Ventas', valores:[1210,1180,1260,1290,1402]},
                   {nombre:'Usuarios', unidad:'usuarios', valores:[9420,9380,9150,9040,8930]} ] } }
```

Cada serie admite su propia `unidad`. Para una sparkline dentro de una tabla, usa una columna de tipo `"sparkline"` (`comparacion.md`).
