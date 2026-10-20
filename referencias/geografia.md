# Geografía · referencia del kit v0.9

Para mostrar dónde ocurre algo y cómo varía entre territorios de España, por comunidades autónomas o por provincias. Los campos comunes están en `DESIGN.md`.

## Mapa y territorios

`mapa` es `"comunidades"` (17 comunidades más Ceuta y Melilla) o `"provincias"` (52). Si no lo pones, el kit elige comunidades cuando todos los nombres lo son y, si no, provincias. Escribe el nombre habitual o el código INE (`"28"`); el kit admite variantes como `"Comunidad Valenciana"`, `"C. Valenciana"`, `"Alacant/Alicante"`, `"Vizcaya"`, `"La Coruña"` o `"Baleares"`, y un nombre que no reconoce es un error que dice cuál falla. En el mapa y en la leyenda se usa el nombre que tú escribes.

Un **lugar** (origen, destino, parada o nodo) es el nombre de una zona del mapa, que se sitúa en su capital, o `{ nombre, lat, lon }` en grados. Los contornos son de la Base de Datos de Divisiones Administrativas del IGN (CC BY 4.0): la nota de cada mapa lo cita sola. Canarias va en un recuadro al suroeste, a la misma escala.

| Tipo · `variante` | Pregunta | Datos | Límites | `unidad` |
| --- | --- | --- | --- | --- |
| `mapa` · `coropletas` (por defecto) | ¿Cómo varía una tasa o un porcentaje entre territorios? | `territorios`, `valores` | 5 clases | sí (una tasa) |
| `mapa` · `con-ranking` (con `ranking`) | ¿Cómo se distribuye la métrica y cuál es su orden? | `territorios`, `valores` | ranking de 3 a 12 (8) | sí |
| `cartograma` · `fichas` | ¿Cómo se comparan los territorios sin que su tamaño distorsione? | `territorios`, `valores` | solo comunidades | sí |
| `mapa` · `burbujas` | ¿Cuánto pesa cada territorio? | `territorios`, `valores` | valores ≥ 0 | sí |
| `mapa` · `simbolos` | ¿Qué territorios concentran más volumen y cuál destaca? | `territorios`, `valores` | valores ≥ 0 | sí |
| `mapa` · `categorias` (con `categorias`) | ¿A qué zona pertenece cada territorio? | `territorios`, `categorias` | 6 categorías (mejor 4-5) | no |
| `mapa` · `puntos` (con `puntos`) | ¿Dónde se ubican los casos y dónde se concentran? | `puntos`, o `territorios` + `valores` + `porPunto` | 3.000 puntos | no |
| `mapa` · `rejilla` (con `celda`) | ¿Dónde hay más intensidad de un fenómeno? | `puntos` | 10 a 50.000 casos | no (sí con `valor`) |
| `mapa` · `hexagonos` | ¿Cuántos casos hay por unidad de superficie? | `puntos` | 10 a 50.000 casos | no (sí con `valor`) |
| `mapa` · `flujos` (con `origen`) | ¿Cuánto se mueve entre un origen y varios destinos? | `origen`, `destinos`, `valores` | 7 flujos | sí |
| `mapa` · `ruta` (con `paradas`) | ¿Qué recorrido sigue una secuencia de lugares? | `paradas` | 2-12 paradas | no |
| `mapa` · `conexiones` (con `enlaces`) | ¿Qué territorios están conectados entre sí? | `enlaces` (`{ origen, destino }`) | 40 conexiones, 24 lugares | no |

- `coropletas`, `con-ranking` y `cartograma`: 5 clases de color (Naranja 100 a 700) de igual amplitud con cortes redondos, o los tuyos con `umbrales` (4 números crecientes). Usa tasas o porcentajes, no totales (el kit avisa): para totales usa `burbujas` o `simbolos`. `null` es «Sin dato» y se dibuja con trama; las zonas que no pongas también (el kit avisa), salvo Ceuta y Melilla. `leyenda` titula la leyenda.
- `con-ranking`: el mapa y la lista de las `ranking` primeras zonas (8 por defecto) con los mismos colores.
- `cartograma`: una ficha igual por comunidad en su posición aproximada, con la abreviatura y el valor. Ceuta y Melilla solo salen si están en los datos.
- `burbujas` y `simbolos`: el área es proporcional al valor; la leyenda muestra tres tamaños de referencia (`leyenda` la titula; por defecto, la unidad). En `simbolos`, el mayor va en naranja y el resto en gris; `destacar` elige otro y `false` no destaca ninguno.
- `categorias`: `categorias` da la zona de cada territorio (`null` = sin asignar); `datos.grupos` fija el orden de la leyenda. Los colores son los de la paleta de series, en ese orden.
- `puntos`: `puntos` es una lista de `{ lat, lon }` (cada punto, un caso) o, con `territorios` y `valores` (recuentos), el kit pone un punto por cada `porPunto` casos dentro de cada zona. `nombreCasos` (plural) va en la leyenda y en el subtítulo; `nombreCaso` corrige el singular si hace falta («1 punto = 1 centro»).
- `rejilla` y `hexagonos`: la IA pasa los casos (`{ lat, lon }`, con `valor` si cada uno pesa distinto, y entonces con `unidad`) y el kit los cuenta en celdas de `celda` km de lado (25 por defecto); los hexágonos tienen la misma área que esas celdas. Cinco clases de igual amplitud de 0 al máximo, de «Muy baja» a «Muy alta»; el subtítulo dice el tamaño de celda.
- `flujos`: flechas curvas desde el `origen` con grosor proporcional al valor (6 px el mayor) y el valor junto a cada destino.
- `ruta`: línea continua y paradas numeradas, listadas en la leyenda. Cada parada necesita nombre.
- `conexiones`: arcos finos entre lugares; las conexiones de un lugar van en naranja (`destacar`; por defecto el más conectado, `false` ninguno).

```js
{ tipo:'mapa', titulo:'Cobertura de centros', unidad:'%', leyenda:'Cobertura',
  datos:{ territorios:['Andalucía','Aragón','Asturias','Illes Balears','Canarias','Cantabria','Castilla y León','Castilla-La Mancha','Cataluña',
                       'Comunitat Valenciana','Extremadura','Galicia','Madrid','Murcia','Navarra','País Vasco','La Rioja'],
          valores:[62,41,33,71,53,44,30,39,88,74,27,46,92,58,55,79,42] } }

{ tipo:'mapa', variante:'con-ranking', titulo:'Cobertura por comunidad', unidad:'%', ranking:5,
  datos:{ territorios:['Andalucía','Aragón','Asturias','Illes Balears','Canarias','Cantabria','Castilla y León','Castilla-La Mancha','Cataluña',
                       'Comunitat Valenciana','Extremadura','Galicia','Madrid','Murcia','Navarra','País Vasco','La Rioja'],
          valores:[62,41,33,71,53,44,30,39,88,74,27,46,92,58,55,79,42] } }

{ tipo:'cartograma', titulo:'Cobertura por comunidad', unidad:'%',
  datos:{ territorios:['Andalucía','Aragón','Asturias','Illes Balears','Canarias','Cantabria','Castilla y León','Castilla-La Mancha','Cataluña',
                       'Comunitat Valenciana','Extremadura','Galicia','Madrid','Murcia','Navarra','País Vasco','La Rioja'],
          valores:[62,41,33,71,53,44,30,39,88,74,27,46,92,58,55,79,42] } }

{ tipo:'mapa', variante:'burbujas', titulo:'Centros por comunidad', unidad:'centros',
  datos:{ territorios:['Madrid','Cataluña','Andalucía','Comunitat Valenciana'], valores:[92,88,60,74] } }

{ tipo:'mapa', variante:'simbolos', titulo:'Volumen de pedidos', unidad:'pedidos', destacar:'Cataluña',
  datos:{ territorios:['Madrid','Cataluña','Andalucía'], valores:[92,88,60] } }

{ tipo:'mapa', titulo:'Zonas comerciales', leyenda:'Zonas comerciales',
  datos:{ territorios:['Galicia','Asturias','Cataluña','Aragón','Andalucía','Murcia'], categorias:['Norte','Norte','Este','Este','Sur','Sur'] } }

{ tipo:'mapa', titulo:'Centros con licencia digital', nombreCasos:'centros',
  datos:{ puntos:[ {lat:40.42, lon:-3.70}, {lat:41.39, lon:2.17}, {lat:39.47, lon:-0.38} ] } }

{ tipo:'mapa', variante:'puntos', titulo:'Alumnos por provincia', nombreCasos:'alumnos', porPunto:500, mapa:'provincias',
  datos:{ territorios:['Madrid','Barcelona','Sevilla'], valores:[42000,38000,15500] } }

{ tipo:'mapa', variante:'hexagonos', titulo:'Densidad de sesiones', nombreCasos:'sesiones', celda:30,
  datos:{ puntos:[ {lat:40.42, lon:-3.70}, {lat:40.45, lon:-3.68}, {lat:40.40, lon:-3.75}, {lat:41.39, lon:2.17}, {lat:41.40, lon:2.15},
                   {lat:41.37, lon:2.19}, {lat:39.47, lon:-0.38}, {lat:37.39, lon:-5.98}, {lat:37.38, lon:-6.00}, {lat:43.26, lon:-2.93} ] } }

{ tipo:'mapa', titulo:'Envíos desde el almacén central', unidad:'miles de envíos', leyenda:'Envíos (miles)',
  datos:{ origen:'Madrid', destinos:['Barcelona','Sevilla','Valencia', { nombre:'Vigo', lat:42.24, lon:-8.72 }], valores:[42,31,24,9] } }

{ tipo:'mapa', titulo:'Ruta comercial de octubre', leyenda:'Ruta comercial',
  datos:{ paradas:['Madrid','Zaragoza','Barcelona','Valencia','Murcia','Sevilla'] } }

{ tipo:'mapa', titulo:'Conexiones entre delegaciones', destacar:'Madrid',
  datos:{ enlaces:[ {origen:'Madrid', destino:'Barcelona'}, {origen:'Madrid', destino:'Sevilla'}, {origen:'Barcelona', destino:'Valencia'} ] } }
```

En servidores sin acceso a jsDelivr, copia la carpeta `dist/mapas/` del paquete junto al script y llama antes a `EG.configurar({ mapas: 'https://…/mapas/' })`. Los contornos se cargan solo al dibujar un mapa (unos 25 KB por comunidades y 42 KB por provincias, la mitad comprimidos) y se guardan en caché.
