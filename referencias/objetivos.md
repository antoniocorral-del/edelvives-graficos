# Objetivos y cumplimiento · referencia del kit v0.5

Para mostrar el avance hacia una meta y el estado frente al objetivo. Los campos comunes están en `DESIGN.md`. Para un único KPI con su objetivo usa `kpi` (`kpi.md`); para logro frente a objetivo y rangos de calidad, `bullet` (`comparacion.md`).

## `progreso`

| `variante` | Pregunta | Datos |
| --- | --- | --- |
| `barras` | ¿Qué porcentaje de avance lleva cada meta? | `categorias`, `valores` y `objetivos` (≤ 8) |
| `anillo` | ¿Qué avance lleva una meta, en poco espacio? | igual, de 1 a 3 metas |
| `medidor` | ¿En qué punto de la escala está el valor y cuánto queda para el objetivo? | `valor`, `objetivo`, `minimo`, `maximo`, `etiqueta`; un solo medidor por bloque |
| `ritmo` | ¿Voy al ritmo esperado para llegar a la meta? | `valor`, `meta`, `esperado` (lo previsto a día de hoy), `etiqueta`, `restante` |
| `distancia` | ¿Cuánto falta para llegar al objetivo? | `categorias`, `valores` y `objetivos` (≤ 8) |

En `barras` y `anillo`, sin `objetivos` los valores son porcentajes y `unidad` debe ser `"%"`. En `medidor` con `"%"`, la escala va de 0 a 100 por defecto. `barras-progreso` sigue funcionando como alias de `progreso` · `barras`.

```js
{ tipo:'progreso', variante:'barras', titulo:'Cumplimiento por comunidad', unidad:'€', abreviar:true,
  datos:{ categorias:['Aragón','Madrid'], valores:[1833166,3962215], objetivos:[1755917,4040294] } }

{ tipo:'progreso', variante:'medidor', titulo:'Cumplimiento del plan', unidad:'%', datos:{ valor:72, objetivo:85, etiqueta:'Cumplimiento' } }

{ tipo:'progreso', variante:'ritmo', titulo:'Ventas acumuladas', unidad:'€', abreviar:true,
  datos:{ valor:1360000, meta:2000000, esperado:1500000, etiqueta:'la meta anual', restante:'Quedan 5 meses' } }
```

## Estados frente al objetivo

`"en-objetivo"`, `"en-riesgo"` y `"fuera"`, siempre con icono, texto y color. El estado se calcula con el **cumplimiento** (valor / objetivo, en %) y los `umbrales`: por defecto `{ objetivo: 100, riesgo: 90 }`. En los indicadores donde menos es mejor (incidencias, plazos), `sentidoPositivo:'bajar'`.

## `tabla` · `scorecard` y `semaforo`

| `variante` | Pregunta |
| --- | --- |
| `scorecard` | ¿Cómo están todos los indicadores clave frente a su objetivo? (real, objetivo y estado) |
| `semaforo` | ¿En qué estado está cada indicador según sus umbrales? (un estado por fila, con su umbral) |

```js
{ tipo:'tabla', variante:'scorecard', titulo:'Scorecard del trimestre', periodo:'1.er trimestre 2026', umbrales:{ objetivo:100, riesgo:90 },
  datos:{ indicadores:[ {nombre:'Ventas', valor:1402, objetivo:1300, unidad:'pedidos'},
                        {nombre:'Incidencias', valor:21, objetivo:25, unidad:'incidencias', sentidoPositivo:'bajar'} ] } }
```

Hasta 12 indicadores, en orden fijo. `unidad` va en cada indicador o una común en la especificación.

## `barras-divergentes` · `desviacion-objetivo`

¿Cuánto se desvía cada indicador de su objetivo? Barras con signo coloreadas por estado, con leyenda y el valor rotulado.

```js
{ tipo:'barras-divergentes', variante:'desviacion-objetivo', titulo:'Desviación frente al objetivo', unidad:'%',
  datos:{ categorias:['Ventas','Altas','Cobros'], valores:[8,-12,3] } }
```

Los valores son la desviación frente al objetivo. A partir de 0, en objetivo; entre `limiteRiesgo` y 0, en riesgo; por debajo de `limiteRiesgo`, fuera. Con `"%"`, `limiteRiesgo` vale −10 por defecto; con otra unidad, es obligatorio.
