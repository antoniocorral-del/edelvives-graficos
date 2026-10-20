/* Casos erróneos y límite de la familia Jerarquía. Uso: node val_jerarquia.js <kit.js> */
global.window = global; require(process.argv[2] || '/home/claude/kit/dist/edelvives-graficos.js');
const f = (filas) => ({ filas });
const casos = [
  ['treemap con filas → jerárquico', { tipo: 'treemap', titulo: 'T', unidad: '€', datos: f([['A', 'a1', 3], ['A', 'a2', 2], ['B', 'b1', 4]]) }],
  ['treemap un grupo', { tipo: 'treemap', titulo: 'T', unidad: '€', datos: f([['A', 'a1', 3], ['A', 'a2', 2]]) }],
  ['treemap 3 niveles', { tipo: 'treemap', titulo: 'T', unidad: '€', datos: f([['A', 'x', 'a1', 3], ['B', 'y', 'b1', 4]]) }],
  ['treemap 9 hijos → Otros', { tipo: 'treemap', titulo: 'T', unidad: '€', datos: f([...Array(9)].map((_, i) => ['A', 'a' + i, 9 - i]).concat([['B', 'b', 5]])) }],
  ['sin unidad', { tipo: 'particion', titulo: 'T', datos: f([['A', 'a', 1], ['B', 'b', 2]]) }],
  ['fila sin valor', { tipo: 'particion', titulo: 'T', unidad: 'x', datos: f([['A', 'a'], ['B', 'b', 2]]) }],
  ['fila repetida', { tipo: 'particion', titulo: 'T', unidad: 'x', datos: f([['A', 'a', 1], ['A', 'a', 2], ['B', 'b', 2]]) }],
  ['hoja y grupo a la vez', { tipo: 'particion', titulo: 'T', unidad: 'x', datos: f([['A', 5], ['A', 'a', 2], ['B', 'b', 2]]) }],
  ['negativo', { tipo: 'particion', titulo: 'T', unidad: 'x', datos: f([['A', 'a', -1], ['B', 'b', 2]]) }],
  ['valor de grupo que no cuadra', { tipo: 'particion', titulo: 'T', unidad: 'x', datos: { arbol: [{ nombre: 'A', valor: 10, hijos: [{ nombre: 'a', valor: 3 }] }, { nombre: 'B', hijos: [{ nombre: 'b', valor: 1 }] }] } }],
  ['valor de grupo que cuadra', { tipo: 'particion', titulo: 'T', unidad: 'x', datos: { arbol: [{ nombre: 'A', valor: 3, hijos: [{ nombre: 'a', valor: 3 }] }, { nombre: 'B', hijos: [{ nombre: 'b', valor: 1 }] }] } }],
  ['hoja en texto con valor', { tipo: 'particion', titulo: 'T', unidad: 'x', datos: { arbol: [{ nombre: 'A', hijos: ['a'] }, { nombre: 'B', hijos: [{ nombre: 'b', valor: 1 }] }] } }],
  ['arbol y filas a la vez', { tipo: 'particion', titulo: 'T', unidad: 'x', datos: { arbol: [], filas: [] } }],
  ['sin datos', { tipo: 'particion', titulo: 'T', unidad: 'x', datos: {} }],
  ['sunburst 4 niveles', { tipo: 'particion', titulo: 'T', unidad: 'x', datos: f([['A', 'b', 'c', 'd', 1], ['B', 'b', 'c', 'd', 1]]) }],
  ['destacar grupo inexistente', { tipo: 'particion', titulo: 'T', unidad: 'x', destacar: 'Z', datos: f([['A', 'a', 1], ['B', 'b', 2]]) }],
  ['hermanos repetidos', { tipo: 'circulos-anidados', titulo: 'T', unidad: 'x', datos: { arbol: [{ nombre: 'A', hijos: [{ nombre: 'a', valor: 1 }, { nombre: 'a', valor: 2 }] }, { nombre: 'B', hijos: [{ nombre: 'b', valor: 1 }] }] } }],
  ['círculo con cero', { tipo: 'circulos-anidados', titulo: 'T', unidad: 'x', datos: f([['A', 'a', 0], ['B', 'b', 2]]) }],
  ['ramas sin unidad', { tipo: 'arbol', titulo: 'T', datos: { arbol: { nombre: 'R', hijos: ['a', 'b'] } } }],
  ['ramas 17 hojas', { tipo: 'arbol', titulo: 'T', datos: { arbol: { nombre: 'R', hijos: [...Array(17)].map((_, i) => 'h' + i) } } }],
  ['destacar repetido', { tipo: 'arbol', variante: 'organigrama', titulo: 'T', destacar: 'Edición', datos: { arbol: { nombre: 'D', hijos: [{ nombre: 'A', hijos: ['Edición'] }, { nombre: 'B', hijos: ['Edición'] }] } } }],
  ['destacar por ruta', { tipo: 'arbol', variante: 'organigrama', titulo: 'T', destacar: 'B / Edición', datos: { arbol: { nombre: 'D', hijos: [{ nombre: 'A', hijos: ['Edición'] }, { nombre: 'B', hijos: ['Edición'] }] } } }],
  ['organigrama sin raíz única', { tipo: 'arbol', variante: 'organigrama', titulo: 'T', datos: f([['A', 'a'], ['B', 'b']]) }],
  ['dendrograma por defecto', { tipo: 'arbol', titulo: 'T', datos: { elementos: ['a', 'b', 'c', 'd'], valores: [1, 2, 10, 11] } }],
  ['dendrograma 2 elementos', { tipo: 'arbol', titulo: 'T', datos: { elementos: ['a', 'b'], valores: [1, 2] } }],
  ['dendrograma filas desiguales', { tipo: 'arbol', titulo: 'T', datos: { elementos: ['a', 'b', 'c'], valores: [[1, 2], [3], [4, 5]] } }],
  ['dendrograma constantes', { tipo: 'arbol', titulo: 'T', datos: { elementos: ['a', 'b', 'c'], valores: [5, 5, 5] } }],
  ['dendrograma grupos 3', { tipo: 'arbol', titulo: 'T', grupos: 3, datos: { elementos: ['a', 'b', 'c', 'd', 'e'], valores: [1, 2, 10, 11, 30] } }],
  ['dendrograma grupos 9', { tipo: 'arbol', titulo: 'T', grupos: 9, datos: { elementos: ['a', 'b', 'c', 'd'], valores: [1, 2, 10, 11] } }],
  ['dendrograma corte', { tipo: 'arbol', titulo: 'T', corte: 5, datos: { elementos: ['a', 'b', 'c', 'd'], valores: [1, 2, 10, 11] } }],
  ['dendrograma con alturas', { tipo: 'arbol', variante: 'dendrograma', titulo: 'T', datos: { arbol: { nombre: 'R', altura: 9, hijos: [{ nombre: 'X', altura: 2, hijos: ['a', 'b'] }, { nombre: 'Y', altura: 3, hijos: ['c', 'd'] }] } } }],
  ['dendrograma sin altura', { tipo: 'arbol', variante: 'dendrograma', titulo: 'T', datos: { arbol: { nombre: 'R', altura: 9, hijos: [{ nombre: 'X', hijos: ['a', 'b'] }, 'c'] } } }],
  ['dendrograma altura invertida', { tipo: 'arbol', variante: 'dendrograma', titulo: 'T', datos: { arbol: { nombre: 'R', altura: 2, hijos: [{ nombre: 'X', altura: 5, hijos: ['a', 'b'] }, 'c'] } } }],
  ['anidados sin raíz', { tipo: 'anidados', titulo: 'T', datos: f([['Cat 1', 'Sub', 'e1'], ['Cat 1', 'e2'], ['Cat 2', 'e3']]) }],
  ['anidados demasiado hondo', { tipo: 'anidados', titulo: 'T', datos: { arbol: { nombre: 'R', hijos: [{ nombre: 'a', hijos: [{ nombre: 'b', hijos: [{ nombre: 'c', hijos: ['d'] }] }] }] } } }],
  ['anidados destacar grupo', { tipo: 'anidados', titulo: 'T', destacar: 'Sub', datos: f([['Cat 1', 'Sub', 'e1'], ['Cat 2', 'e3']]) }],
  ['anidados categoría vacía', { tipo: 'anidados', titulo: 'T', datos: f([['Cat 1'], ['Cat 2', 'e3']]) }],
  ['tabla filas → jerárquica', { tipo: 'tabla', titulo: 'T', unidad: 'centros', datos: f([['N', 'c1', 2], ['S', 'c2', 3]]) }],
  ['tabla 31 filas', { tipo: 'tabla', titulo: 'T', unidad: 'centros', datos: f([...Array(30)].map((_, i) => ['G' + (i % 2), 'c' + i, 1])) }],
  ['tabla con %', { tipo: 'tabla', variante: 'jerarquica', titulo: 'T', unidad: '%', datos: f([['N', 'c1', 2]]) }],
  ['tabla comparativa intacta', { tipo: 'tabla', titulo: 'T', unidad: '€', datos: { columnas: [{ titulo: 'A' }, { titulo: 'B' }], filas: [['x', 1]] } }],
];
for (const [n, s] of casos) {
  const r = EG.validar(s), sp = r.spec || {};
  let extra = sp.variante ? ' [' + sp.variante + ']' : '';
  if (sp.datos && sp.datos._grupos && sp.tipo === 'arbol') extra += ' grupos=' + sp.datos._grupos + ' corte=' + (+sp.datos._corte).toFixed(2);
  if (r.ok) { try { JSON.stringify(sp); } catch (e) { extra += ' NO SERIALIZA'; } }
  console.log((r.ok ? 'ok ' : 'ERR') + ' ' + n + extra + (r.errores.length ? ' → ' + r.errores.join(' | ') : '') + (r.avisos.length ? ' (aviso: ' + r.avisos.join(' | ') + ')' : ''));
}
