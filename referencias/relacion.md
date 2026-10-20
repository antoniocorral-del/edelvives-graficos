# Relación y correlación · referencia del kit v0.6

Para mostrar cómo se relacionan dos o más variables numéricas. Los campos comunes están en `DESIGN.md`. Pasa los valores en bruto, un número por caso: el kit calcula la tendencia, los coeficientes de correlación, los hexágonos y las escalas. `nombreCasos` dice qué es cada caso, en plural (`"centros"`, `"títulos"`; por defecto `"casos"`), y el subtítulo muestra cuántos hay.

## `dispersion`

Un punto por caso, con una variable en cada eje. `ejes` es obligatorio: el nombre de cada variable, `{ x: "Inversión", y: "Ventas" }`. La unidad va en el título de cada eje, entre paréntesis. Si las dos variables comparten unidad, basta con `unidad`; si no, ponla en cada eje: `{ x: { nombre, unidad }, y: { nombre, unidad } }` (entonces `unidad` puede faltar).

Datos: `x` e `y` (un número por caso, en el mismo orden) y, si quieres nombrar los casos, `nombres`. Para distinguir grupos con color (hasta 3), `series: [{ nombre, x, y, nombres }]`. `destacar` (un nombre) pinta ese caso en naranja y el resto en gris; `rotular` (hasta 8 nombres) escribe el nombre junto a los casos clave.

| `variante` | Pregunta | Casos |
| --- | --- | --- |
| `simple` (por defecto) | ¿Existe relación entre dos variables numéricas? | 3-500 (con más, el kit pasa a `hexagonos`) |
| `tendencia` | ¿Qué fuerza y dirección tiene la relación? Añade la recta de mínimos cuadrados y su R² | 5-500, sin grupos |
| `burbujas` (por defecto con `tamanos`) | ¿Cómo se relacionan dos variables y qué peso tiene cada caso? | 2-25 |
| `burbujas-categoria` (por defecto con `series` y `tamanos`) | ¿Cómo se relacionan por categoría y por tamaño? | 2-3 grupos, 3-40 burbujas |
| `cuadrantes` (por defecto con `cuadrantes` o `cortes`) | ¿Qué casos son prioritarios según dos criterios? | 3-30, con `nombres` |
| `conectada` (por defecto con `periodos`) | ¿Cómo evoluciona la relación entre dos variables en el tiempo? | 3-24 |
| `hexagonos` | ¿Dónde se concentran los casos cuando hay demasiados puntos? | 50-50.000 |

Burbujas: `ejes.tamano` dice qué mide el área (con la unidad común, salvo que lleve la suya) y `datos.tamanos` da su valor (≥ 0). El kit rotula el valor dentro de las burbujas en las que cabe.

Cuadrantes: `cortes: { x, y }` separa los cuadrantes (sin `cortes`, la media de cada variable); `cuadrantes` son sus 4 nombres en orden de lectura (superior izquierdo, superior derecho, inferior izquierdo e inferior derecho); `destacarCuadrante` marca el clave y `destacar`, el caso propio. Se rotulan todos los casos y los ejes no llevan escala: el valor exacto sale al pasar el ratón.

Conectada: `datos.periodos`, uno por punto y en orden cronológico; los puntos se unen en ese orden. El kit rotula el inicio, el final y algún periodo intermedio si cabe.

```js
{ tipo:'dispersion', titulo:'Formación y satisfacción del profesorado', nombreCasos:'centros',
  ejes:{ x:{ nombre:'Horas de formación', unidad:'horas' }, y:{ nombre:'Satisfacción', unidad:'puntos' } },
  datos:{ x:[11,32,33,52,10,17,38], y:[45,75,64,90,58,46,69] } }

{ tipo:'dispersion', variante:'tendencia', titulo:'Inversión en promoción y ventas por delegación', unidad:'€', abreviar:true,
  nombreCasos:'delegaciones', ejes:{ x:'Inversión en promoción', y:'Ventas' },
  datos:{ x:[25000,41000,58000,66000,87000,109000], y:[380000,410000,520000,610000,700000,790000] } }

{ tipo:'dispersion', variante:'burbujas', titulo:'Precio, valoración y ventas de los títulos', unidad:'€', nombreCasos:'títulos',
  ejes:{ x:'Precio', y:{ nombre:'Valoración', unidad:'puntos' }, tamano:{ nombre:'Ejemplares vendidos', unidad:'miles' } },
  datos:{ nombres:['Lectópolis 3','Atlas 4','Explora 2'], x:[24,29,19], y:[84,66,78], tamanos:[14,12,9] } }

{ tipo:'dispersion', variante:'cuadrantes', titulo:'Iniciativas por esfuerzo e impacto', unidad:'puntos',
  ejes:{ x:'Esfuerzo', y:'Impacto' }, cortes:{ x:50, y:50 },
  cuadrantes:['Prioridad','Planificar','Rápidas','Descartar'], destacarCuadrante:'Prioridad', destacar:'App de familias',
  datos:{ nombres:['App de familias','Nueva web','Boletín'], x:[30,81,18], y:[74,58,34] } }

{ tipo:'dispersion', variante:'conectada', titulo:'Ventas y cuota de mercado',
  ejes:{ x:{ nombre:'Ventas', unidad:'M€' }, y:{ nombre:'Cuota de mercado', unidad:'%' } },
  datos:{ periodos:['2023','2024','2025'], x:[14.2,14.6,15.3], y:[20.1,21.3,22.5] } }

{ tipo:'dispersion', variante:'hexagonos', titulo:'Peso y tiempo de preparación de los pedidos', nombreCasos:'pedidos',
  ejes:{ x:{ nombre:'Peso', unidad:'kg' }, y:{ nombre:'Tiempo de preparación', unidad:'min' } },
  datos:{ x:[ /* … un valor por pedido */ ], y:[ /* … */ ] } }
```

## `matriz`

| `variante` | Pregunta | Variables |
| --- | --- | --- |
| `correlacion-color` (por defecto) | ¿Qué variables se mueven juntas y cuáles en sentido contrario? Matriz completa en color, con leyenda | 3-10 |
| `correlacion-valores` | ¿Cuál es el coeficiente exacto entre cada par de variables? Triángulo inferior con el coeficiente en cada celda | 3-8 |

Datos: los valores en bruto en `series: [{ nombre, valores }]`, una serie por variable con el mismo número de casos (≥ 5) en el mismo orden, y el kit calcula el coeficiente de correlación de Pearson. Si ya tienes los coeficientes, pasa `variables` y `coeficientes`: la matriz completa o solo el triángulo inferior (la fila 1 con un valor, la 2 con dos…, terminando en el 1 de la diagonal). No lleva `unidad`. Cinco clases de color: de ≥ 0,6 (naranja oscuro) a ≤ −0,6 (gris oscuro), con −0,2 a 0,2 casi blanco. La variante `cohortes` (la evolución de cada cohorte en el tiempo) está en `temporal.md`.

```js
{ tipo:'matriz', titulo:'Qué indicadores de los centros se mueven juntos', nombreCasos:'centros',
  datos:{ series:[ { nombre:'Alumnos', valores:[420,880,310,1150,640] }, { nombre:'Licencias', valores:[300,700,240,880,520] },
                   { nombre:'Satisfacción', valores:[71,84,66,79,90] } ] } }

{ tipo:'matriz', variante:'correlacion-valores', titulo:'Correlación entre los indicadores',
  datos:{ variables:['Alumnos','Licencias','Uso'], coeficientes:[[1],[0.82,1],[0.45,0.55,1]] } }
```

## `radar`

| `variante` | Pregunta | Datos |
| --- | --- | --- |
| `perfil` (por defecto) | ¿Cuál es el perfil de un elemento en varias dimensiones? | `valores` |
| `dos-perfiles` (por defecto con 2 series) | ¿Cómo se comparan dos perfiles en varias dimensiones? | `series` (2): la principal y la comparada, que va discontinua |

Datos: `dimensiones` (3-8), todas en la misma escala, que parte de cero en el centro; `valores` o `series`; y `maximo`, el valor del borde exterior (por defecto 100 con `"%"` o un número redondo por encima del más alto). Con escalas fijas (de 1 a 5, de 0 a 100) indica siempre `maximo`. Si las dimensiones tienen unidades distintas, no uses el radar: usa barras o una tabla.

```js
{ tipo:'radar', titulo:'Perfil del centro en la evaluación de calidad', unidad:'puntos',
  datos:{ dimensiones:['Resultados','Clima','Familias','Recursos','Innovación','Convivencia'], valores:[82,64,91,58,73,69], maximo:100 } }

{ tipo:'radar', titulo:'Competencias: el centro frente a la red', unidad:'puntos',
  datos:{ dimensiones:['Lectura','Matemáticas','Ciencias','Inglés'], maximo:100,
          series:[ { nombre:'Nuestro centro', valores:[78,66,72,85] }, { nombre:'Media de la red', valores:[70,71,68,72] } ] } }
```

## `coordenadas-paralelas` · `paralelas`

¿Cómo se comporta cada caso en varias variables a la vez? Un eje vertical por variable, todos con la misma escala y la misma unidad. Datos: `variables` (3-8) y `series` (2-30 casos `{ nombre, valores }`, un valor por variable). `destacar` es el caso en naranja (por defecto, el primero); el resto va en gris.

```js
{ tipo:'coordenadas-paralelas', titulo:'Resultados de los centros en cinco áreas', unidad:'puntos', nombreCasos:'centros', destacar:'Nuestro centro',
  datos:{ variables:['Lectura','Matemáticas','Ciencias','Inglés','Digital'],
          series:[ { nombre:'Nuestro centro', valores:[56,84,70,41,60] }, { nombre:'Centro B', valores:[34,59,46,61,79] } ] } }
```
