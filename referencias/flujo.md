# Flujo y relaciones · referencia del kit v0.8

Para mostrar cómo circula una cantidad entre etapas o entidades y cómo se conectan los elementos entre sí. Los campos comunes están en `DESIGN.md`.

## Datos: enlaces

Casi todos los tipos usan `datos.enlaces`, una lista de `{ origen, destino, valor }`: `{ origen:'Web', destino:'Pedido directo', valor:60 }`. Los nodos se deducen de los enlaces, en el orden en que aparecen. `datos.nodos` (opcional) fija ese orden y, si se da, cada enlace debe usar uno de sus nombres; cada nodo puede ser un nombre o `{ nombre, grupo, duracion }`. Un enlace no puede ir de un nodo a sí mismo ni repetirse (suma los valores en uno). `valor` es obligatorio en `sankey`, `cuerdas` y `flujo`; en `red`, opcional.

| Tipo · `variante` | Pregunta | Datos | Límites | `unidad` |
| --- | --- | --- | --- | --- |
| `sankey` · `sankey` (por defecto) | ¿Cómo se reparte un flujo entre origen, etapas intermedias y destino? | `enlaces` | 2-4 niveles, 8 nodos por nivel, 40 enlaces, sin ciclos | sí |
| `sankey` · `aluvial` (con `momentos`) | ¿Cómo cambian de categoría los elementos entre momentos? | `momentos`, `categorias`, `cambios` | 2-6 momentos, 2-3 categorías | sí |
| `sankey` · `recorrido` (con `etapas`) | ¿Por qué pasos avanzan o abandonan las personas? | `etapas`, `valores` | 3-7 etapas | sí |
| `cuerdas` | ¿Qué intercambio hay entre pares de grupos? | `enlaces` (sin sentido) | 3-8 grupos, 28 enlaces | sí |
| `flujo` · `flechas` | ¿Cuánto volumen circula entre entidades? | `enlaces` | 12 entidades, 5 niveles, 4 por nivel, sin ciclos | sí |
| `red` · `comunidades` (por defecto) | ¿Cómo se conectan los elementos y qué comunidades forman? | `enlaces` | 40 nodos, 120 enlaces | no |
| `red` · `bipartita` (con `columnas`) | ¿Con qué destinos se conecta cada origen? | `enlaces` (origen a la izquierda) | 12 nodos por columna | no |
| `red` · `radial` (con `centro`) | ¿Qué se relaciona con la entidad central y de qué modo? | `centro`, `enlaces` con `relacion` | 2-8 relaciones | no |
| `red` · `dependencias` (con `ruta` o `duracion`) | ¿Qué depende de qué y cuál es la ruta crítica? | `enlaces` (origen = lo que va antes) | 20 tareas, 6 niveles, 5 en paralelo, sin ciclos | no (la de la duración, si la hay) |

- `sankey`: un único camino en naranja. Por defecto, el que sale del mayor origen siguiendo el enlace mayor; `destacar` puede ser un nodo (el camino pasa por él), la lista de nodos del camino (`["Web", "Pedido directo", "Entregado"]`) o `false`. Cada nodo se rotula con su valor; si a un nodo le llega una cantidad distinta de la que sale, el kit avisa.
- `aluvial`: `cambios` lleva una matriz por cada paso entre momentos; la fila es la categoría de origen y la columna, la de destino (`cambios[0][1][0]` = los que pasan de la 2.ª categoría a la 1.ª). Lo que llega a una categoría debe salir de ella en el paso siguiente. `destacar` (una categoría, por defecto la primera) va en naranja.
- `recorrido`: `valores` son los que llegan a cada paso y no pueden crecer. Recuentos (el kit calcula el % sobre el primero) o % con `unidad:"%"`. Las salidas van hacia abajo con el nombre de `datos.salida` (por defecto «Abandono»); `nombreCasos` nombra a quién se mide en la nota.
- `cuerdas`: el valor es el intercambio entre los dos grupos (da igual cuál es el origen; no repitas el par al revés). `destacar`: el grupo cuyas cintas van en naranja (por defecto, el de mayor total).
- `flujo`: flechas con grosor proporcional al valor; la mayor en naranja (`destacar:{ origen, destino }` elige otra). Las entidades sin entradas van en oscuro.
- `red` · `comunidades`: tamaño = conexiones. Con `grupo` en todos los `nodos`, ese es el color y sale una leyenda; sin `grupo`, el kit calcula las comunidades por modularidad. Solo se rotula el nodo más conectado de cada comunidad.
- `red` · `bipartita`: `columnas` titula las dos columnas (por defecto «Origen» y «Destino»). `destacar`: un nodo de cualquiera de las dos (por defecto, el destino con más enlaces).
- `red` · `radial`: cada enlace une el `centro` con una entidad; `relacion` (opcional) se rotula sobre el enlace.
- `red` · `dependencias`: con `duracion` en todas las tareas (en `nodos`, en la `unidad`), la ruta crítica es la de mayor duración; sin ella, la de más tareas. `ruta` la fija a mano.

```js
{ tipo:'sankey', titulo:'Recorrido de los pedidos', unidad:'pedidos',
  datos:{ enlaces:[ {origen:'Web', destino:'Directo', valor:60}, {origen:'Web', destino:'Distribuidor', valor:40},
                    {origen:'Directo', destino:'Entregado', valor:50}, {origen:'Directo', destino:'Pendiente', valor:10}, {origen:'Distribuidor', destino:'Entregado', valor:40} ] } }

{ tipo:'sankey', titulo:'Cambio de formato de los centros', unidad:'centros',
  datos:{ momentos:[2025, 2026], categorias:['Digital','Papel'], cambios:[ [[50,4],[10,30]] ] } }

{ tipo:'sankey', titulo:'Recorrido de compra', unidad:'usuarios', nombreCasos:'usuarios',
  datos:{ etapas:['Inicio','Catálogo','Ficha','Compra'], valores:[8400,6048,4032,1764] } }

{ tipo:'cuerdas', titulo:'Intercambio de alumnos', unidad:'alumnos',
  datos:{ enlaces:[ {origen:'A', destino:'B', valor:12}, {origen:'A', destino:'C', valor:10}, {origen:'B', destino:'C', valor:11} ] } }

{ tipo:'flujo', titulo:'Distribución de libros', unidad:'unidades',
  datos:{ enlaces:[ {origen:'Editorial', destino:'Almacén', valor:12400}, {origen:'Almacén', destino:'Norte', valor:7200}, {origen:'Almacén', destino:'Sur', valor:5200} ] } }

{ tipo:'red', titulo:'Colaboración entre centros',
  datos:{ enlaces:[ {origen:'Santa Ana', destino:'El Pilar'}, {origen:'Santa Ana', destino:'Moncayo'}, {origen:'El Pilar', destino:'Moncayo'}, {origen:'Moncayo', destino:'San José'} ] } }

{ tipo:'red', titulo:'Materiales por etapa', columnas:['Etapa','Material'], destacar:'Digital',
  datos:{ enlaces:[ {origen:'Infantil', destino:'Cuaderno'}, {origen:'Primaria', destino:'Digital'}, {origen:'ESO', destino:'Digital'} ] } }

{ tipo:'red', titulo:'Relaciones del centro',
  datos:{ centro:'Centro', enlaces:[ {origen:'Docentes', destino:'Centro', relacion:'ejercen'}, {origen:'Alumnos', destino:'Centro', relacion:'cursan'} ] } }

{ tipo:'red', titulo:'Dependencias del proyecto', unidad:'días',
  datos:{ nodos:[ {nombre:'Guion', duracion:10}, {nombre:'Maqueta', duracion:15}, {nombre:'Ilustración', duracion:8}, {nombre:'Imprenta', duracion:6} ],
          enlaces:[ {origen:'Guion', destino:'Maqueta'}, {origen:'Guion', destino:'Ilustración'}, {origen:'Maqueta', destino:'Imprenta'}, {origen:'Ilustración', destino:'Imprenta'} ] } }
```
