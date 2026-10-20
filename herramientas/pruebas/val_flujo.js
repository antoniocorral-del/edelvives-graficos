/* Casos erróneos y límite de la familia Flujo y relaciones. Uso: node val_flujo.js <kit.js> */
global.window = global; require(process.argv[2] || '/home/claude/kit/dist/edelvives-graficos.js');
const E = (...l) => l.map(([o, d, v]) => (v == null ? { origen: o, destino: d } : { origen: o, destino: d, valor: v }));
const sk = (enlaces, extra) => Object.assign({ tipo: 'sankey', titulo: 'T', unidad: 'x', datos: { enlaces } }, extra || {});
const casos = [
  ['sankey correcto', sk(E(['A', 'P', 5], ['B', 'P', 3], ['P', 'X', 8]))],
  ['sankey sin unidad', { tipo: 'sankey', titulo: 'T', datos: { enlaces: E(['A', 'B', 1]) } }],
  ['sankey sin enlaces', sk([])],
  ['sankey valor 0', sk(E(['A', 'B', 0]))],
  ['sankey sin valor', sk(E(['A', 'B']))],
  ['sankey a sí mismo', sk(E(['A', 'A', 2]))],
  ['sankey repetido', sk(E(['A', 'B', 2], ['A', 'B', 3]))],
  ['sankey ciclo', sk(E(['A', 'B', 2], ['B', 'C', 2], ['C', 'A', 1]))],
  ['sankey 5 niveles', sk(E(['A', 'B', 1], ['B', 'C', 1], ['C', 'D', 1], ['D', 'E', 1]))],
  ['sankey 9 en un nivel', sk([...Array(9)].map((_, i) => ({ origen: 'O' + i, destino: 'X', valor: 1 })))],
  ['sankey no cuadra (aviso)', sk(E(['A', 'P', 5], ['P', 'X', 8]))],
  ['sankey nodo fuera de nodos', sk(E(['A', 'B', 1]), { datos: { nodos: ['A'], enlaces: E(['A', 'B', 1]) } })],
  ['sankey nodo sin enlaces', sk(null, { datos: { nodos: ['A', 'B', 'C'], enlaces: E(['A', 'B', 1]) } })],
  ['sankey destacar nodo', sk(E(['A', 'P', 5], ['B', 'P', 3], ['P', 'X', 8]), { destacar: 'B' })],
  ['sankey destacar camino roto', sk(E(['A', 'P', 5], ['B', 'P', 3], ['P', 'X', 8]), { destacar: ['A', 'X'] })],
  ['sankey destacar inexistente', sk(E(['A', 'P', 5]), { destacar: 'Z' })],
  ['sankey destacar false', sk(E(['A', 'P', 5]), { destacar: false })],
  ['aluvial correcto', { tipo: 'sankey', titulo: 'T', unidad: 'x', datos: { momentos: [1, 2], categorias: ['A', 'B'], cambios: [[[3, 1], [0, 2]]] } }],
  ['aluvial 4 categorías', { tipo: 'sankey', titulo: 'T', unidad: 'x', datos: { momentos: [1, 2], categorias: ['A', 'B', 'C', 'D'], cambios: [[[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]] } }],
  ['aluvial matrices de menos', { tipo: 'sankey', titulo: 'T', unidad: 'x', datos: { momentos: [1, 2, 3], categorias: ['A', 'B'], cambios: [[[3, 1], [0, 2]]] } }],
  ['aluvial matriz mal', { tipo: 'sankey', titulo: 'T', unidad: 'x', datos: { momentos: [1, 2], categorias: ['A', 'B'], cambios: [[[3, 1], [0]]] } }],
  ['aluvial no cuadra', { tipo: 'sankey', titulo: 'T', unidad: 'x', datos: { momentos: [1, 2, 3], categorias: ['A', 'B'], cambios: [[[3, 1], [0, 2]], [[1, 1], [1, 1]]] } }],
  ['aluvial destacar mal', { tipo: 'sankey', titulo: 'T', unidad: 'x', destacar: 'Z', datos: { momentos: [1, 2], categorias: ['A', 'B'], cambios: [[[3, 1], [0, 2]]] } }],
  ['recorrido correcto', { tipo: 'sankey', titulo: 'T', unidad: '%', datos: { etapas: ['a', 'b', 'c'], valores: [100, 60, 20] } }],
  ['recorrido sube', { tipo: 'sankey', titulo: 'T', unidad: 'x', datos: { etapas: ['a', 'b', 'c'], valores: [100, 60, 80] } }],
  ['recorrido 2 etapas', { tipo: 'sankey', titulo: 'T', unidad: 'x', datos: { etapas: ['a', 'b'], valores: [100, 60] } }],
  ['recorrido % > 100', { tipo: 'sankey', titulo: 'T', unidad: '%', datos: { etapas: ['a', 'b', 'c'], valores: [120, 60, 20] } }],
  ['recorrido valores de menos', { tipo: 'sankey', titulo: 'T', unidad: 'x', datos: { etapas: ['a', 'b', 'c'], valores: [100, 60] } }],
  ['cuerdas correcto', { tipo: 'cuerdas', titulo: 'T', unidad: 'x', datos: { enlaces: E(['A', 'B', 1], ['B', 'C', 2], ['C', 'A', 3]) } }],
  ['cuerdas 2 grupos', { tipo: 'cuerdas', titulo: 'T', unidad: 'x', datos: { enlaces: E(['A', 'B', 1]) } }],
  ['cuerdas par al revés', { tipo: 'cuerdas', titulo: 'T', unidad: 'x', datos: { enlaces: E(['A', 'B', 1], ['B', 'A', 2], ['B', 'C', 2]) } }],
  ['cuerdas 9 grupos', { tipo: 'cuerdas', titulo: 'T', unidad: 'x', datos: { enlaces: [...Array(9)].map((_, i) => ({ origen: 'G' + i, destino: 'G' + ((i + 1) % 9), valor: 1 })) } }],
  ['cuerdas destacar', { tipo: 'cuerdas', titulo: 'T', unidad: 'x', destacar: 'B', datos: { enlaces: E(['A', 'B', 1], ['B', 'C', 2], ['C', 'A', 3]) } }],
  ['flujo correcto', { tipo: 'flujo', titulo: 'T', unidad: 'x', datos: { enlaces: E(['A', 'B', 5], ['B', 'C', 3]) } }],
  ['flujo ciclo', { tipo: 'flujo', titulo: 'T', unidad: 'x', datos: { enlaces: E(['A', 'B', 5], ['B', 'A', 3]) } }],
  ['flujo 5 en un nivel', { tipo: 'flujo', titulo: 'T', unidad: 'x', datos: { enlaces: [...Array(5)].map((_, i) => ({ origen: 'A', destino: 'D' + i, valor: 1 })) } }],
  ['flujo destacar', { tipo: 'flujo', titulo: 'T', unidad: 'x', destacar: { origen: 'B', destino: 'C' }, datos: { enlaces: E(['A', 'B', 5], ['B', 'C', 3]) } }],
  ['flujo destacar mal', { tipo: 'flujo', titulo: 'T', unidad: 'x', destacar: 'B', datos: { enlaces: E(['A', 'B', 5], ['B', 'C', 3]) } }],
  ['red por defecto', { tipo: 'red', titulo: 'T', datos: { enlaces: E(['A', 'B'], ['B', 'C'], ['C', 'A'], ['C', 'D']) } }],
  ['red grupos a medias', { tipo: 'red', titulo: 'T', datos: { nodos: [{ nombre: 'A', grupo: 'g' }, 'B'], enlaces: E(['A', 'B']) } }],
  ['red grupos dados', { tipo: 'red', titulo: 'T', datos: { nodos: [{ nombre: 'A', grupo: 'g1' }, { nombre: 'B', grupo: 'g2' }], enlaces: E(['A', 'B']) } }],
  ['red 41 nodos', { tipo: 'red', titulo: 'T', datos: { enlaces: [...Array(41)].map((_, i) => ({ origen: 'C', destino: 'N' + i })) } }],
  ['red relacion fuera de radial', { tipo: 'red', titulo: 'T', datos: { enlaces: [{ origen: 'A', destino: 'B', relacion: 'usa' }] } }],
  ['bipartita por columnas', { tipo: 'red', titulo: 'T', columnas: ['De', 'A'], datos: { enlaces: E(['a', 'X'], ['b', 'X'], ['b', 'Y']) } }],
  ['bipartita nodo en ambas', { tipo: 'red', variante: 'bipartita', titulo: 'T', datos: { enlaces: E(['a', 'X'], ['X', 'Y']) } }],
  ['bipartita columnas mal', { tipo: 'red', variante: 'bipartita', titulo: 'T', columnas: ['De'], datos: { enlaces: E(['a', 'X']) } }],
  ['radial por centro', { tipo: 'red', titulo: 'T', datos: { centro: 'C', enlaces: [{ origen: 'A', destino: 'C', relacion: 'usa' }, { origen: 'C', destino: 'B' }] } }],
  ['radial sin centro', { tipo: 'red', variante: 'radial', titulo: 'T', datos: { enlaces: E(['A', 'C']) } }],
  ['radial enlace suelto', { tipo: 'red', titulo: 'T', datos: { centro: 'C', enlaces: E(['A', 'C'], ['A', 'B']) } }],
  ['radial 9 relaciones', { tipo: 'red', titulo: 'T', datos: { centro: 'C', enlaces: [...Array(9)].map((_, i) => ({ origen: 'C', destino: 'S' + i })) } }],
  ['dependencias por ruta', { tipo: 'red', titulo: 'T', ruta: ['A', 'B', 'D'], datos: { enlaces: E(['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D']) } }],
  ['dependencias por duración', { tipo: 'red', titulo: 'T', unidad: 'días', datos: { nodos: [{ nombre: 'A', duracion: 2 }, { nombre: 'B', duracion: 1 }, { nombre: 'C', duracion: 5 }, { nombre: 'D', duracion: 1 }], enlaces: E(['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D']) } }],
  ['dependencias duración a medias', { tipo: 'red', variante: 'dependencias', titulo: 'T', datos: { nodos: [{ nombre: 'A', duracion: 2 }, 'B'], enlaces: E(['A', 'B']) } }],
  ['dependencias ciclo', { tipo: 'red', variante: 'dependencias', titulo: 'T', datos: { enlaces: E(['A', 'B'], ['B', 'A']) } }],
  ['dependencias ruta rota', { tipo: 'red', variante: 'dependencias', titulo: 'T', ruta: ['A', 'D'], datos: { enlaces: E(['A', 'B'], ['B', 'D']) } }],
  ['dependencias con destacar', { tipo: 'red', variante: 'dependencias', titulo: 'T', destacar: 'A', datos: { enlaces: E(['A', 'B'], ['B', 'D']) } }],
];
for (const [n, s] of casos) {
  const r = EG.validar(s), d = r.spec && r.spec.datos && r.spec.datos._g;
  let extra = '';
  if (r.ok && d) extra = ' [' + r.spec.variante + (d.camino ? ' · camino ' + d.camino.nodos.map(k => d.nodos[k].nombre).join('>') : '') + (d.comunidades ? ' · ' + d.comunidades.length + ' com.' : '') + (d.foco != null ? ' · foco ' + d.nodos[d.foco].nombre : '') + ']';
  else if (r.ok) extra = ' [' + r.spec.variante + ']';
  console.log((r.ok ? 'OK ' : 'ERR') + ' ' + n.padEnd(32) + extra + ' ' + r.errores.concat(r.avisos.map(a => 'AVISO ' + a)).join(' | '));
  try { JSON.stringify(r.spec); } catch (e) { console.log('   ¡no serializable!', e.message); }
}
