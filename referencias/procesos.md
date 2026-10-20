# Procesos y conversión · referencia del kit v0.7

Para seguir casos a lo largo de las etapas de un proceso: cuántos pasan de una a otra, en cuál está cada uno y cómo se vive el recorrido. Los campos comunes están en `DESIGN.md`. Las etapas van siempre en el orden del proceso, de la primera a la última.

## `embudo`

| `variante` | Pregunta | Datos |
| --- | --- | --- |
| `embudo` (por defecto) | ¿Cuántos pasan de una etapa a la siguiente? Trapecios con el valor de cada etapa | `etapas` (2-8) y `valores` |
| `conversion` | ¿Qué porcentaje convierte en cada etapa y en total? Barras con la tasa sobre la etapa anterior y la conversión global | `etapas` (2-8) y `valores` |
| `retencion` (por defecto con `periodos`) | ¿Qué proporción se conserva y cuánta se pierde con el tiempo? Columnas al 100 % y la caída entre hitos en puntos | `periodos` (2-12) y `valores` |

Cada etapa es una parte de la anterior: un valor no puede superar al anterior (el validador lo rechaza). `unidad` es lo que se cuenta (`"usuarios"`, `"centros"`). Si la última etapa no llega al 3 % de la primera, el embudo apenas se ve: usa `conversion` o empieza en una etapa posterior. En `retencion`, `periodos` son los hitos temporales y `valores`, los recuentos (el kit calcula el % sobre el primero) o el % retenido con `unidad: "%"`.

```js
{ tipo:'embudo', titulo:'Embudo de la tienda online', unidad:'usuarios', periodo:'Septiembre 2026',
  datos:{ etapas:['Visitas','Registros','Activos','Compras','Recompra'], valores:[48200,30850,19760,12050,5780] } }

{ tipo:'embudo', variante:'conversion', titulo:'Conversión de la campaña de adopción', unidad:'centros',
  datos:{ etapas:['Contactados','Demostración','Prueba','Propuesta','Adopción'], valores:[1240,790,505,310,148] } }

{ tipo:'embudo', titulo:'Retención de usuarios de la plataforma digital', unidad:'usuarios',
  datos:{ periodos:['Día 0','Día 1','Día 7','Día 30','Día 90'], valores:[8400,5210,3440,2350,1600] } }
```

## `etapas`

| `variante` | Pregunta | Datos |
| --- | --- | --- |
| `pipeline` (por defecto con `casos`) | ¿Cuántos casos hay en cada etapa y cuáles son? Una columna por etapa con el recuento y una tarjeta por caso | `etapas` (2-6) y `casos` (≤ 60) |
| `proceso` (por defecto con `pasos`) | ¿Cuáles son los pasos de un proceso y en cuál estamos? | `pasos` (2-8, hasta 2 decisiones) y `actual` |
| `progresion` | ¿En qué etapa está un elemento y cuánto le falta? | `etapas` (2-8) y `actual` |

No lleva `unidad`, salvo el pipeline con importes.

Pipeline: `casos: [{ nombre, etapa, valor }]`, con `etapa` igual a una de `etapas`. `valor` es opcional; si lo pones, ponlo a todos los casos y añade `unidad`: el importe va debajo del nombre. `nombreCasos` (en plural) acompaña al recuento del subtítulo. `destacar` es la etapa en naranja (por defecto, la última). Cada columna muestra hasta 6 tarjetas; con más, 5 y «+N más». Con 5 o 6 etapas, usa una tarjeta doble (`eg-doble`). Para contar cientos de casos sin listarlos, usa `embudo` o `barras`.

Proceso: cada paso es un texto o, para una decisión (rombo), `{ nombre:'¿Aprobado?', alternativa:'Corregir' }`: con «Sí» sigue el flujo y con «No» va a la alternativa, que se dibuja debajo. `si` y `no` cambian esos rótulos y `detalle` añade una nota al tooltip. Escribe las decisiones como preguntas cortas; la última no puede ser una decisión. `actual` es el paso (o la alternativa) en curso: los anteriores salen completados y los siguientes, pendientes. Sin `actual`, el proceso se dibuja sin estado. Si no cabe en una fila, sigue en la de abajo.

Progresión: el avance son las etapas completadas (en la etapa 3 de 5, el 40 %). `porcentaje` lo afina dentro de la etapa actual (en ese caso, de 40 a menos de 60). Si el elemento ya ha terminado, pon `terminado: true` en lugar de `actual`.

```js
{ tipo:'etapas', titulo:'Centros en proceso de adopción', nombreCasos:'centros',
  datos:{ etapas:['Lead','Contactado','Propuesta','Cerrado'],
          casos:[ { nombre:'Santa Ana', etapa:'Lead' }, { nombre:'El Pilar', etapa:'Contactado' }, { nombre:'San José', etapa:'Propuesta' }, { nombre:'Río Ebro', etapa:'Cerrado' } ] } }

{ tipo:'etapas', titulo:'Oportunidades por etapa', unidad:'€', nombreCasos:'oportunidades',
  datos:{ etapas:['Demo','Propuesta','Cerrado'], casos:[ { nombre:'La Salle', etapa:'Demo', valor:18000 }, { nombre:'Pirineos', etapa:'Cerrado', valor:31000 } ] } }

{ tipo:'etapas', titulo:'Edición de Lectópolis 3',
  datos:{ pasos:['Solicitud','Revisión',{ nombre:'¿Aprobado?', alternativa:'Corregir' },'Producción','Entrega'], actual:'Producción' } }

{ tipo:'etapas', variante:'progresion', titulo:'Avance del pedido 2026-1184',
  datos:{ etapas:['Alta','Revisión','Producción','Control','Entrega'], actual:'Producción' } }
```

## `recorrido` · `experiencia`

¿Cómo evoluciona la experiencia a lo largo del recorrido? Una curva sobre las etapas, con bandas alternas; la línea «Media» marca el centro de la escala. Datos: `etapas` (3-8), `valores` (la valoración de cada etapa), `minimo` y `maximo` (los extremos de la escala, obligatorios) y, si quieres, `contactos` (el punto de contacto de cada etapa, al pie). `niveles` cambia los rótulos del eje, de abajo arriba (por defecto `"Baja"`, `"Media"` y `"Alta"`). Con 7 u 8 etapas, usa una tarjeta doble (`eg-doble`) para que se lean los nombres.

```js
{ tipo:'recorrido', titulo:'Experiencia de compra de las familias', unidad:'puntos',
  datos:{ etapas:['Descubre','Considera','Compra','Usa','Recomienda'], contactos:['Web','Librería','Pago','Plataforma','Reseña'],
          valores:[3.2,2.6,2.0,3.8,4.4], minimo:1, maximo:5 } }
```
