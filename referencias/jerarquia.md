# Jerarquía · referencia del kit v0.9.2

Para mostrar estructuras en niveles: cuánto pesa cada parte dentro de su grupo, cómo se ramifica algo desde su origen y qué contiene cada categoría. Los campos comunes están en `DESIGN.md`.

## Datos: árbol o filas

Todos los tipos aceptan uno de estos dos formatos en `datos`:

- `filas` (lo más corto si partes de una tabla o un CSV): una fila por elemento final, con el nombre de cada nivel, del más general al más concreto, y el valor al final cuando el tipo lo necesita: `["Zona Norte", "Centro 1", 210]`. Una rama puede tener menos niveles que otra.
- `arbol`: el árbol anidado `{ nombre, valor, hijos }`. Puede ser un objeto (con el elemento de arriba) o una lista con los elementos del primer nivel. En los tipos sin valores, un elemento final puede ser solo su nombre: `hijos: ["Edición", "Diseño"]`.

Pon los valores solo en los elementos finales: el kit suma hacia arriba (si das el valor de un grupo, debe cuadrar con la suma). `datos.raiz` nombra el total o el origen (por defecto «Total»). `datos.niveles` nombra los niveles (`["Zona", "Centro"]`). Si un nombre se repite en ramas distintas, `destacar` lo identifica por su ruta: `"Área B / Equipo 3"`. Los elementos se ordenan de mayor a menor en cada grupo, con «Otros» al final (`orden:"natural"` mantiene el de los datos).

Si el desglose venía pensado como sankey (cada nodo con un solo origen), este es su sitio: el icicle muestra el mismo desglose nivel a nivel, de arriba abajo, y cada parte queda bajo su origen, sin cintas cruzadas.

| Tipo · `variante` | Pregunta | Niveles | Límites | `unidad` |
| --- | --- | --- | --- | --- |
| `treemap` · `jerarquico` | ¿Qué peso tiene cada elemento dentro de su grupo y del total? | 2 | 2-6 grupos, 7 elementos por grupo (más, a «Otros») | sí |
| `particion` · `sunburst` (por defecto) | ¿Cómo se reparte el total en niveles concéntricos? | 2-3 anillos | 2-6 grupos, 8 elementos por grupo, 40 finales | sí |
| `particion` · `icicle` | ¿Cómo se reparte el total nivel a nivel, de arriba abajo? (mejor con nombres largos) | 2-3 | igual que el sunburst | sí |
| `circulos-anidados` | ¿Cuánto pesa cada elemento y a qué grupo pertenece? | 2 | 2-6 grupos, 40 elementos, valores > 0 | sí |
| `arbol` · `ramas` (por defecto) | ¿Cómo se ramifica una estructura desde su origen? | 1-4 | 16 elementos finales | no |
| `arbol` · `organigrama` | ¿Quién depende de quién dentro de la organización? | 1-4 | 40 cajas | no |
| `arbol` · `dendrograma` | ¿Cómo se agrupan los elementos por similitud? | — | 3-30 elementos, 2-6 grupos | no |
| `anidados` · `contenedores` | ¿Qué elementos pertenecen a cada categoría y subcategoría? | categoría, subcategoría y elementos | 48 elementos | no |
| `tabla` · `jerarquica` | ¿Cuánto suma cada nivel y cuánto aporta cada parte? (lista indentada con barra) | 1-4 | 30 filas | sí |

Con valores, el grupo destacado va en naranja y el resto en neutros, y cada nivel es un tono más claro del anterior. `destacar` es el nombre de un grupo del primer nivel (por defecto, el mayor).

- `treemap` · `jerarquico`: cada grupo con su cabecera («Papel · 61 %») y, dentro, sus elementos con su % dentro del grupo. Con `filas` o `arbol`, la variante se elige sola.
- `sunburst`: el centro muestra el total; la leyenda, los elementos del segundo nivel con su % sobre el total. `icicle` dibuja el total arriba y una franja por nivel.
- `circulos-anidados`: área proporcional al valor, con el valor dentro si cabe.
- `ramas`: raíz a la izquierda, ramas en naranja y elementos finales en gris. Con `destacar` (cualquier elemento), solo su camino va en naranja.
- `organigrama`: `destacar` pinta una caja en naranja (un solo equipo). Si no cabe, el último nivel se apila bajo su responsable y, si aún no cabe, se desplaza en horizontal.
- `anidados`: con `arbol` como objeto, el elemento de arriba es el contenedor exterior; con una lista o con `filas` (sin `raiz`), cada elemento del primer nivel es una categoría. `destacar` es un elemento final.
- `tabla` · `jerarquica`: los totales llevan barra gris y se pliegan con el triángulo; los elementos finales, barra naranja. La columna se titula con la `unidad` (o con `columna`). Con `filas` y sin `columnas`, la variante se elige sola.

```js
{ tipo:'treemap', titulo:'Ventas por formato y etapa', unidad:'€', abreviar:true,
  datos:{ filas:[ ['Papel','Primaria',2140000], ['Papel','ESO',1660000], ['Digital','Primaria',1520000], ['Digital','ESO',1140000] ] } }

{ tipo:'particion', titulo:'Adopciones por etapa y formato', unidad:'centros',
  datos:{ arbol:{ nombre:'Total', hijos:[ { nombre:'Primaria', hijos:[ {nombre:'Papel', valor:434}, {nombre:'Digital', valor:335} ] },
                                         { nombre:'ESO', hijos:[ {nombre:'Papel', valor:273}, {nombre:'Digital', valor:198} ] } ] } } }

{ tipo:'circulos-anidados', titulo:'Títulos por etapa y área', unidad:'títulos',
  datos:{ filas:[ ['Primaria','Lengua',42], ['Primaria','Matemáticas',32], ['ESO','Lengua',26], ['ESO','Matemáticas',20] ] } }

{ tipo:'arbol', variante:'organigrama', titulo:'Equipo editorial', destacar:'Digital',
  datos:{ arbol:{ nombre:'Dirección', hijos:[ { nombre:'Infantil', hijos:['Edición','Diseño'] }, { nombre:'Primaria', hijos:['Digital'] } ] } } }

{ tipo:'anidados', titulo:'Recursos del proyecto Lectópolis', destacar:'Audiolibros',
  datos:{ arbol:{ nombre:'Lectópolis', hijos:[ { nombre:'Para el alumno', hijos:['Libro','Cuaderno'] }, { nombre:'Para el docente', hijos:['Guía','Audiolibros'] } ] } } }

{ tipo:'tabla', titulo:'Centros por zona', unidad:'centros',
  datos:{ raiz:'Total centros', filas:[ ['Zona Norte','Centro 1',210], ['Zona Norte','Centro 2',180], ['Zona Sur','Centro 3',250] ] } }
```

## `arbol` · `dendrograma`

Lo más sencillo es pasar los datos en bruto y dejar que el kit agrupe: `elementos` (los nombres) y `valores` (una fila de medidas por elemento; un número por elemento si solo hay una medida), con `variables` para nombrarlas. El kit tipifica cada variable, mide la distancia euclídea y une por enlace medio; la escala va de 0 a 100 (la última unión). Si ya tienes el árbol, pásalo en `arbol` con la `altura` de cada unión. `grupos` fija cuántos grupos salen del corte y `corte`, la altura; sin ninguno, el kit corta donde hay el mayor salto entre uniones. Cada grupo lleva un color y la línea del corte lo rotula. `nombreCasos` nombra los elementos en el subtítulo.

```js
{ tipo:'arbol', variante:'dendrograma', titulo:'Centros agrupados por perfil de uso', nombreCasos:'centros',
  datos:{ elementos:['Santa Ana','El Pilar','Pirineos','Río Ebro','Moncayo'], variables:['Alumnos','% digital','Sesiones por semana'],
          valores:[ [820,72,14], [760,68,12], [310,22,4], [280,25,5], [350,31,3] ] } }

{ tipo:'arbol', variante:'dendrograma', titulo:'Agrupación de títulos', grupos:2,
  datos:{ arbol:{ nombre:'Todos', altura:9, hijos:[ { nombre:'G1', altura:2, hijos:['A','B'] }, { nombre:'G2', altura:3, hijos:['C','D'] } ] } } }
```
