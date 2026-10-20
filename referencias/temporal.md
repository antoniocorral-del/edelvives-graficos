# Temporal especializado · referencia del kit v0.7

Para situar en el tiempo hitos, tareas y días, y para comparar un periodo con otro equivalente. Los campos comunes están en `DESIGN.md`.

Las fechas van en formato ISO y sin formatear: `"2026-04-20"` (un día) o `"2026-04"` (un mes entero). El kit escribe «20 abr» o «Abr 2026». `hoy` es una fecha o `true` (el día en que se abre la página) y dibuja la línea «Hoy». `cronologia`, `gantt`, `calendario` · `mes` y `ciclo-vida` no llevan `unidad`.

## `cronologia`

| `variante` | Pregunta | Datos |
| --- | --- | --- |
| `hitos` (por defecto) | ¿Cuándo ocurrieron o están previstos los hitos? Un eje continuo con los hitos alternados arriba y abajo | `eventos` (2-10) `{ nombre, fecha }` y, si quieres, `hoy` |
| `carriles` (por defecto si algún evento lleva `carril`) | ¿Cómo se solapan eventos de distinto tipo? Un carril por tipo | `eventos` (hasta 30) con su `carril` (2-6 carriles) |
| `vertical` (por defecto con `actual` o `terminado`) | ¿Qué hitos se han cumplido y cuáles faltan? Una lista con fecha, estado y descripción | `eventos` (2-8) en orden cronológico y `actual` |

`destacar` (el nombre de un evento) lo pinta en naranja. En `hitos`, sin `destacar` y con `hoy`, se destaca el próximo hito. Los rótulos que no caben se omiten y quedan en el tooltip; con más de 6 hitos o muchos eventos por carril, usa una tarjeta doble (`eg-doble`).

Carriles: un evento puntual lleva `fecha`; uno que dura, `inicio` y `fin`. Los carriles van en el orden en que aparecen, o en el de `datos.carriles` si lo indicas.

Vertical: `actual` es el hito en curso; los anteriores salen «Hecho» y los siguientes, «Pendiente». Si ya está todo cumplido, pon `terminado: true`; sin ninguno de los dos, todos salen pendientes. `descripcion` añade una línea bajo el nombre, y la fecha también puede ser un texto («Curso 2026/27»).

```js
{ tipo:'cronologia', titulo:'Hitos del año comercial', periodo:'2026',
  datos:{ eventos:[ { nombre:'Lanzamiento', fecha:'2026-01-12' }, { nombre:'Feria', fecha:'2026-04-20' }, { nombre:'Curso 26/27', fecha:'2026-09-01' } ], hoy:'2026-04-08' } }

{ tipo:'cronologia', titulo:'Lanzamientos, campañas e incidencias', destacar:'Campaña otoño',
  datos:{ eventos:[ { nombre:'Título A', carril:'Lanzamientos', fecha:'2026-02-03' }, { nombre:'Campaña otoño', carril:'Campañas', inicio:'2026-06-15', fin:'2026-08-28' },
                    { nombre:'Caída web', carril:'Incidencias', fecha:'2026-04-09' } ] } }

{ tipo:'cronologia', titulo:'Hitos del proyecto de aula digital',
  datos:{ eventos:[ { nombre:'Definición', fecha:'2026-01', descripcion:'Alcance y equipo' }, { nombre:'Piloto en aula', fecha:'2026-06', descripcion:'En 12 centros' },
                    { nombre:'Lanzamiento', fecha:'2026-09' } ], actual:'Piloto en aula' } }
```

## `gantt`

¿Cómo se planifican y avanzan las tareas en el tiempo? Datos: `tareas` (1-15) `{ nombre, inicio, fin, avance }`, con `avance` el % realizado (de 0 a 100, opcional); `hitos` (hasta 5) `{ nombre, fecha }`, que van en filas al final, como rombos; y, si quieres, `hoy`. `fin` incluye ese día. Lo previsto va en gris y lo realizado en naranja; la rejilla marca los meses (o las semanas o los días en planes cortos).

```js
{ tipo:'gantt', titulo:'Producción de Lectópolis 3', periodo:'Primer semestre de 2026',
  datos:{ tareas:[ { nombre:'Diseño', inicio:'2026-01-01', fin:'2026-02-18', avance:100 }, { nombre:'Revisión', inicio:'2026-03-19', fin:'2026-04-24', avance:60 },
                   { nombre:'Distribución', inicio:'2026-05-18', fin:'2026-06-30' } ],
          hitos:[ { nombre:'Entrega', fecha:'2026-06-25' } ], hoy:'2026-04-12' } }
```

## `calendario`

| `variante` | Pregunta | Datos |
| --- | --- | --- |
| `calor` (por defecto) | ¿Qué días concentran más actividad y qué patrón semanal hay? Semanas en columnas y días en filas | `inicio` y `valores` (un valor por día consecutivo, de 7 a 371) |
| `mes` (por defecto con `mes`) | ¿Qué ocurre cada día del mes? | `mes` (`"AAAA-MM"`), `eventos` `{ fecha, nombre }`, `festivos` y `hoy` |

Calor: lleva `unidad`. `null` es un día sin dato. Si tus datos traen la fecha de cada valor, pasa `fechas` y `valores` en lugar de `inicio` (los días que falten cuentan como 0). Cinco clases de color: el cero en gris y cuatro tramos iguales hasta el máximo. Al pie va el total del periodo; con `resumen:'media'` (y siempre con la unidad `"%"`), la media diaria. Con más de 26 semanas, usa una tarjeta doble.

Mes: `festivos` son fechas o `{ fecha, nombre }`. Fines de semana, festivos, eventos y hoy se distinguen por su forma, no solo por el color; los nombres salen al pasar el ratón.

```js
{ tipo:'calendario', titulo:'Pedidos diarios de la tienda online', unidad:'pedidos', periodo:'Enero a marzo de 2026',
  datos:{ inicio:'2026-01-05', valores:[ 12, 9, 15, 11, 8, 2, 0, 14, 10, 13, 9, 11, 1, 0 /* … un valor por día */ ] } }

{ tipo:'calendario', titulo:'Actividades del centro',
  datos:{ mes:'2026-04', hoy:'2026-04-16', eventos:[ { fecha:'2026-04-08', nombre:'Claustro' }, { fecha:'2026-04-29', nombre:'Reunión con las familias' } ],
          festivos:[ { fecha:'2026-04-03', nombre:'Viernes Santo' }, '2026-04-06' ] } }
```

## `dos-periodos`

| `variante` | Pregunta | Datos |
| --- | --- | --- |
| `superpuestos` (por defecto) | ¿Cómo se compara un periodo con otro de igual duración? Las dos líneas alineadas por posición y, a la derecha, el total de cada uno y la variación | `periodos` (3-31) y 2 `series` |
| `interanual` | ¿Cuánto ha cambiado cada periodo respecto al mismo del año anterior? Columnas de los dos años con la variación debajo | `periodos` (2-12) y 2 `series` |

`periodos` son las posiciones que se comparan (`"L"`…`"D"`, los días del mes, `"T1"`…`"T4"`). `series`: primero el periodo actual y después el anterior (o el que lleve `rol:'anterior'`), que va en gris. Si el actual no ha terminado, pásale menos valores: se compara con las mismas posiciones del anterior. La variación va en % (en puntos si la unidad es `"%"`). En `superpuestos`, `resumen:'media'` compara medias en lugar de totales (para precios, valoraciones o porcentajes, que no se suman). Con más de 6 periodos en `interanual`, usa una tarjeta doble.

Para una serie larga frente al año anterior sin totales, usa `lineas` · `vs-anterior`.

```js
{ tipo:'dos-periodos', titulo:'Pedidos de esta semana frente a la anterior', unidad:'pedidos',
  datos:{ periodos:['L','M','X','J','V','S','D'], series:[ { nombre:'Semana actual', valores:[860,980,930,1170,1290,700,550] },
                                                          { nombre:'Semana anterior', valores:[820,920,860,1030,1150,650,550] } ] } }

{ tipo:'dos-periodos', variante:'interanual', titulo:'Pedidos por trimestre frente al año anterior', unidad:'pedidos',
  datos:{ periodos:['T1','T2','T3','T4'], series:[ { nombre:'2026', valores:[458,510,378,556] }, { nombre:'2025', valores:[420,455,390,510] } ] } }
```

## `ciclo-vida` · `fases`

¿En qué fase de su ciclo de vida está un producto o servicio? Una curva orientativa, sin escala, con la fase actual resaltada y el elemento marcado sobre ella. Datos: `actual` (la fase, obligatoria), `elemento` (lo que se sitúa, por ejemplo un título), `fases` (de 3 a 6; por defecto Introducción, Crecimiento, Madurez y Declive), `posicion` (de 0 a 100 dentro de la fase actual; por defecto 50) y `medida` (el nombre del eje vertical; por defecto «Ventas»). Para dibujar las ventas reales, usa `lineas`.

```js
{ tipo:'ciclo-vida', titulo:'Ciclo de vida de Lectópolis', datos:{ actual:'Madurez', elemento:'Lectópolis 3', posicion:35 } }
```

## `matriz` · `cohortes`

¿Cómo evoluciona cada cohorte con el paso del tiempo? Una fila por cohorte, una columna por periodo desde su inicio y el % en cada celda. Datos: `cohortes` (2-12, por ejemplo el mes de alta), `periodos` (2-12, el tiempo desde el inicio: `"M0"`, `"M1"`…) y `valores`, una fila por cohorte desde su primer periodo (las cohortes recientes tienen menos valores). Con la unidad `"%"`, los valores son porcentajes de 0 a 100; con otra unidad (`"usuarios"`, `"centros"`), son recuentos y el kit calcula el % sobre el primer periodo de cada cohorte. Cinco clases de color de igual amplitud; `umbrales` (4 números crecientes, en %) las fija a mano.

```js
{ tipo:'matriz', variante:'cohortes', titulo:'Retención de usuarios por mes de alta', unidad:'%',
  datos:{ cohortes:['Ene','Feb','Mar','Abr'], periodos:['M0','M1','M2','M3'], valores:[ [100,72,58,49], [100,76,62], [100,69], [100] ] } }
```
