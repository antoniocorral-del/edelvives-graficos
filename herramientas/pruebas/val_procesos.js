global.window = {};
const EG = require('/home/claude/kit/dist/edelvives-graficos.js');
const E5 = ['Visitas', 'Registros', 'Activos', 'Compras', 'Recompra'];
const emb = (extra, datos) => Object.assign({ tipo: 'embudo', titulo: 'x', unidad: 'usuarios' }, extra, { datos });
const eta = (extra, datos) => Object.assign({ tipo: 'etapas', titulo: 'x' }, extra, { datos });
const rec = (extra, datos) => Object.assign({ tipo: 'recorrido', titulo: 'x', unidad: 'puntos' }, extra, { datos });
const casos = {
  'embudo sin unidad': { tipo: 'embudo', titulo: 'x', datos: { etapas: E5, valores: [5, 4, 3, 2, 1] } },
  'embudo con categorias': emb({}, { categorias: E5, valores: [5, 4, 3, 2, 1] }),
  'embudo 1 etapa': emb({}, { etapas: ['A'], valores: [5] }),
  'embudo 9 etapas': emb({}, { etapas: 'ABCDEFGHI'.split(''), valores: [9, 8, 7, 6, 5, 4, 3, 2, 1] }),
  'embudo etapas repetidas': emb({}, { etapas: ['A', 'B', 'A'], valores: [3, 2, 1] }),
  'embudo valores de otra longitud': emb({}, { etapas: E5, valores: [5, 4, 3] }),
  'embudo valor negativo': emb({}, { etapas: ['A', 'B'], valores: [5, -1] }),
  'embudo empieza en 0': emb({}, { etapas: ['A', 'B'], valores: [0, 0] }),
  'embudo crece': emb({}, { etapas: E5, valores: [1000, 640, 700, 250, 120] }),
  'embudo con periodos': emb({ variante: 'embudo' }, { periodos: ['D0', 'D1'], valores: [5, 4] }),
  'embudo última < 3 %': emb({}, { etapas: ['A', 'B'], valores: [1000, 20] }),
  'conversion última < 3 % (sin aviso)': emb({ variante: 'conversion' }, { etapas: ['A', 'B'], valores: [1000, 20] }),
  'retencion por defecto con periodos': emb({}, { periodos: ['D0', 'D1', 'D7'], valores: [100, 60, 40] }),
  'retencion con etapas': emb({ variante: 'retencion' }, { etapas: ['A', 'B'], valores: [5, 4] }),
  'retencion 13 hitos': emb({ variante: 'retencion' }, { periodos: 'ABCDEFGHIJKLM'.split(''), valores: [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1] }),
  'retencion % > 100': emb({ unidad: '%' }, { periodos: ['D0', 'D1'], valores: [840, 500] }),
  'retencion crece': emb({}, { periodos: ['D0', 'D1', 'D7'], valores: [100, 60, 65] }),
  'embudo destacar (aviso)': emb({ destacar: 'A' }, { etapas: ['A', 'B'], valores: [5, 4] }),
  'pipeline sin casos': eta({ variante: 'pipeline' }, { etapas: ['A', 'B'] }),
  'pipeline por defecto con casos': eta({}, { etapas: ['A', 'B'], casos: [{ nombre: 'x', etapa: 'A' }] }),
  'pipeline 7 etapas': eta({}, { etapas: 'ABCDEFG'.split(''), casos: [{ nombre: 'x', etapa: 'A' }] }),
  'pipeline etapa inexistente': eta({}, { etapas: ['A', 'B'], casos: [{ nombre: 'x', etapa: 'C' }] }),
  'pipeline caso sin etapa': eta({}, { etapas: ['A', 'B'], casos: [{ nombre: 'x' }] }),
  'pipeline caso texto': eta({}, { etapas: ['A', 'B'], casos: ['x'] }),
  'pipeline 61 casos': eta({}, { etapas: ['A', 'B'], casos: Array.from({ length: 61 }, (x, i) => ({ nombre: 'c' + i, etapa: 'A' })) }),
  'pipeline valores a medias': eta({ unidad: '€' }, { etapas: ['A', 'B'], casos: [{ nombre: 'x', etapa: 'A', valor: 3 }, { nombre: 'y', etapa: 'B' }] }),
  'pipeline valores sin unidad': eta({}, { etapas: ['A', 'B'], casos: [{ nombre: 'x', etapa: 'A', valor: 3 }] }),
  'pipeline valor formateado': eta({ unidad: '€' }, { etapas: ['A', 'B'], casos: [{ nombre: 'x', etapa: 'A', valor: '3 €' }] }),
  'pipeline destacar inexistente': eta({ destacar: 'Z' }, { etapas: ['A', 'B'], casos: [{ nombre: 'x', etapa: 'A' }] }),
  'pipeline nombreCasos no texto': eta({ nombreCasos: 3 }, { etapas: ['A', 'B'], casos: [{ nombre: 'x', etapa: 'A' }] }),
  'proceso por defecto con pasos': eta({}, { pasos: ['A', 'B'], actual: 'A' }),
  'proceso con etapas': eta({ variante: 'proceso' }, { etapas: ['A', 'B'] }),
  'proceso 9 pasos': eta({}, { pasos: 'ABCDEFGHI'.split('') }),
  'proceso paso sin nombre': eta({}, { pasos: ['A', { alternativa: 'B' }, 'C'] }),
  'proceso si sin decision': eta({}, { pasos: ['A', { nombre: 'B', si: 'Vale' }, 'C'] }),
  'proceso decision al final': eta({}, { pasos: ['A', { nombre: '¿B?', alternativa: 'C' }] }),
  '3 decisiones': eta({}, { pasos: ['A', { nombre: '¿1?', alternativa: 'x' }, { nombre: '¿2?', alternativa: 'y' }, { nombre: '¿3?', alternativa: 'z' }, 'B'] }),
  'proceso alternativa repetida': eta({}, { pasos: ['A', { nombre: '¿1?', alternativa: 'A' }, 'B'] }),
  'proceso actual inexistente': eta({}, { pasos: ['A', 'B'], actual: 'Z' }),
  'proceso con destacar (aviso)': eta({ destacar: 'A' }, { pasos: ['A', 'B'] }),
  'progresion sin actual': eta({}, { etapas: ['A', 'B', 'C'] }),
  'progresion actual inexistente': eta({}, { etapas: ['A', 'B', 'C'], actual: 'Z' }),
  'progresion 9 etapas': eta({}, { etapas: 'ABCDEFGHI'.split(''), actual: 'A' }),
  'progresion porcentaje fuera de la etapa': eta({}, { etapas: ['A', 'B', 'C', 'D', 'E'], actual: 'C', porcentaje: 70 }),
  'progresion porcentaje justo al inicio': eta({}, { etapas: ['A', 'B', 'C', 'D', 'E'], actual: 'C', porcentaje: 40 }),
  'progresion terminado con actual (aviso)': eta({}, { etapas: ['A', 'B'], actual: 'B', terminado: true }),
  'progresion terminado no booleano': eta({}, { etapas: ['A', 'B'], terminado: 'sí' }),
  'recorrido sin escala': rec({}, { etapas: ['A', 'B', 'C'], valores: [1, 2, 3] }),
  'recorrido escala invertida': rec({}, { etapas: ['A', 'B', 'C'], valores: [1, 2, 3], minimo: 5, maximo: 1 }),
  'recorrido fuera de escala': rec({}, { etapas: ['A', 'B', 'C'], valores: [1, 6, 3], minimo: 1, maximo: 5 }),
  'recorrido 2 etapas': rec({}, { etapas: ['A', 'B'], valores: [1, 2], minimo: 1, maximo: 5 }),
  'recorrido contactos de otra longitud': rec({}, { etapas: ['A', 'B', 'C'], valores: [1, 2, 3], contactos: ['x'], minimo: 1, maximo: 5 }),
  'recorrido niveles mal': rec({ niveles: ['Mal', 'Bien'] }, { etapas: ['A', 'B', 'C'], valores: [1, 2, 3], minimo: 1, maximo: 5 }),
  'recorrido sin unidad': { tipo: 'recorrido', titulo: 'x', datos: { etapas: ['A', 'B', 'C'], valores: [1, 2, 3], minimo: 1, maximo: 5 } },
  'niveles en embudo (aviso)': emb({ niveles: ['a', 'b', 'c'] }, { etapas: ['A', 'B'], valores: [5, 4] }),
  'variante prevista inexistente': emb({ variante: 'sankey' }, { etapas: ['A', 'B'], valores: [5, 4] })
};
for (const [n, s] of Object.entries(casos)) {
  const r = EG.validar(s);
  console.log((r.ok ? 'OK ' : 'ERR') + ' ' + n.padEnd(42) + ' ' + (r.spec && r.spec.variante ? '[' + r.spec.variante + '] ' : '') + r.errores.concat(r.avisos.map(a => 'AVISO ' + a)).join(' || '));
}
