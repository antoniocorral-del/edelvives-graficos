# Patrones de KPI · referencia del kit v0.5

Para mostrar una cifra clave con lo que la acompaña. Los campos comunes están en `DESIGN.md`. Un KPI es siempre `tipo:'kpi'` con `valor`; no usa `datos`.

**Regla de composición:** el valor, como mucho **un bloque de comparación**, como mucho **un bloque visual** y, opcionalmente, `contexto`. Algunos bloques de comparación ya incluyen su gráfico y ocupan también el hueco visual (marcados con ◆).

| Pregunta | Bloque |
| --- | --- |
| ¿Ha subido o bajado respecto a una referencia? | `variacion: { anterior o porcentaje, referencia }` |
| ¿Hacia dónde apunta la métrica? ◆ | `tendencia: { sentido: 'sube'/'baja'/'estable', periodo }` |
| ¿Cuál es el objetivo y qué % llevamos? | `objetivo: { valor }` |
| ¿Estamos por encima o por debajo del objetivo? ◆ | `objetivo: { valor, forma:'barra' }` |
| ¿Se ha alcanzado o superado el objetivo? ◆ | `objetivo: { valor, forma:'logro' }` |
| ¿Cómo está frente al periodo previo? ◆ | `anterior: { valor, etiqueta }` |
| ¿Dónde esperamos cerrar el periodo? ◆ | `prevision: { valor, etiqueta, origen }` |
| ¿Está la métrica dentro de lo esperado? | `estado: { estado: 'en-objetivo'/'en-riesgo'/'fuera', umbral }` |
| ¿Qué posición ocupa entre sus pares? ◆ | `ranking: { posicion, total, grupo, etiqueta }` |
| ¿Cómo se comparan dos entidades en la misma métrica? ◆ | `nombre` (la propia) + `comparado: { nombre, valor }` |
| ¿Cómo estamos frente al sector o una referencia externa? ◆ | `benchmark: { nombre, valor, maximo, fuente }` |

| Pregunta | Bloque visual |
| --- | --- |
| ¿Cómo ha evolucionado hasta este valor? | `serie: { valores }` + `periodo` |
| ¿Cómo se ha comportado en los últimos periodos? | `barras: { valores, etiquetas, periodo }` (el último se destaca) |
| ¿De qué partes se compone el total? | `desglose: { categorias, valores }` (2-5 partes) |
| ¿Qué componentes forman un índice? | `componentes: { categorias, valores, maximo }` (explica la ponderación en `contexto`) |
| ¿Qué otras cifras acompañan al valor principal? | `secundarios: [ { etiqueta, valor, unidad } ]` (1-3) |
| ¿Cuánto del camino hemos recorrido? | `progreso: { meta, etiqueta }` |

`contexto`: 1 o 2 frases con alcance, exclusiones y fuente. `periodos` (selector de mes, trimestre o año) sustituye a `valor` y solo se combina con `contexto`.

```js
{ tipo:'kpi', titulo:'Pedidos', unidad:'pedidos', valor:1284 }
{ tipo:'kpi', titulo:'Pedidos', unidad:'pedidos', valor:1284, variacion:{ anterior:1184, referencia:'vs. febrero' } }
  // variacion admite modo:'valorado' + sentidoPositivo:'subir'|'bajar' para verde/rojo; por defecto, neutro.
{ tipo:'kpi', titulo:'Pedidos', unidad:'pedidos', valor:1284, variacion:{ porcentaje:8.4, referencia:'vs. febrero' },
  serie:{ valores:[880,940,1010,960,1120,1284] }, periodo:'Últimos 6 meses' }
{ tipo:'kpi', titulo:'Pedidos frente al objetivo', unidad:'pedidos', valor:1284, objetivo:{ valor:1200, forma:'barra' } }
{ tipo:'kpi', titulo:'Cumplimiento del plan', unidad:'%', valor:104, estado:{ estado:'en-objetivo', umbral:'100 % o más del objetivo' } }
{ tipo:'kpi', titulo:'Ventas acumuladas', unidad:'€', abreviar:true, valor:1360000, progreso:{ meta:2000000, etiqueta:'la meta anual' } }
{ tipo:'kpi', titulo:'Pedidos de marzo', unidad:'pedidos', nombre:'Centro A', valor:1284, comparado:{ nombre:'Centro B', valor:1020 } }
{ tipo:'kpi', titulo:'Satisfacción (NPS)', unidad:'puntos', valor:54, benchmark:{ nombre:'Sector', valor:41, maximo:100, fuente:'estudio sectorial 2026' } }
{ tipo:'kpi', titulo:'Pedidos por día (media)', unidad:'pedidos', valor:184,
  secundarios:[ {etiqueta:'Mínimo', valor:96}, {etiqueta:'Mediana', valor:176}, {etiqueta:'Máximo', valor:312} ] }
{ tipo:'kpi', titulo:'Pedidos', unidad:'pedidos',
  periodos:[ {etiqueta:'Mes', valor:1284, periodo:'Marzo 2026 (MTD)', detalle:'Del 1 al 29 de marzo'}, {etiqueta:'Año', valor:3612, periodo:'2026 (YTD)'} ] }
```

`prevision.origen` y `benchmark.fuente` se muestran en la nota. Los nombres antiguos (`kpi-simple`, `kpi-variacion`, `kpi-objetivo`, `kpi-sparkline`, `kpi-contexto`) siguen funcionando.

## `kpi-rejilla`

¿Cómo están varios KPI a la vez frente a sus objetivos? De 2 a 8 indicadores en una sola tarjeta, cada uno con su estado. Mantén un orden fijo de los indicadores.

```js
{ tipo:'kpi-rejilla', titulo:'Indicadores clave', periodo:'Marzo 2026',
  datos:{ indicadores:[ {nombre:'Ventas', valor:1402, unidad:'pedidos', estado:'en-objetivo'}, {nombre:'Cobros', valor:71, unidad:'%', estado:'fuera'} ] } }
```

`unidad` va en cada indicador o una común en la especificación.

## Dashboard de KPIs

No es un tipo: es la maquetación. Fila de 3-4 KPI arriba (`eg-rejilla-kpi`) y dos gráficos de apoyo debajo (`eg-rejilla`), con un solo mensaje por dashboard (ver `DESIGN.md`).
