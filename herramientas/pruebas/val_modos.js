/* Modos, paletas y reglas que dependen del modo (0.10.0). Uso: node val_modos.js <kit.js> */
global.window = global; const EG = require(process.argv[2] || '/home/claude/kit/dist/edelvives-graficos.js');
const ser = n => [...Array(n)].map((_, i) => ({ nombre: 'S' + (i + 1), valores: [3 + i, 4 + i] }));
const barras = (n, extra) => Object.assign({ tipo: 'barras', variante: n > 3 ? 'apiladas' : 'agrupadas', titulo: 'T', unidad: '€', datos: { categorias: ['A', 'B'], series: ser(n) } }, extra || {});
const lineas = (n, extra) => Object.assign({ tipo: 'lineas', variante: 'multiples', titulo: 'T', unidad: '€', datos: { periodos: ['Ene', 'Feb'], series: ser(n) } }, extra || {});
const donut = (n, extra) => Object.assign({ tipo: 'sectores', titulo: 'T', unidad: '€', datos: { categorias: [...Array(n)].map((_, i) => 'P' + (i + 1)), valores: [...Array(n)].map((_, i) => 20 - i) } }, extra || {});
const casos = {
  web: [
    ['8 partes en gama (se agrupan en 7)', donut(8, { paleta: 'gama', etiquetas: true })],
    ['gama: 3 barras sin etiquetas (verde)', barras(3, { paleta: 'gama' })],
    ['gama: 3 barras con etiquetas', barras(3, { paleta: 'gama', etiquetas: true })],
    ['gama: 4 líneas sin etiquetas (amarillo)', lineas(4, { paleta: 'gama' })],
    ['gama: 2 líneas (sin verde ni amarillo)', lineas(2, { paleta: 'gama' })],
    ['paleta desconocida', barras(2, { paleta: 'arcoiris' })],
    ['etiquetas no booleano', barras(2, { etiquetas: 'si' })],
    ['donut de 6 en web', donut(6)],
    ['fuente no obligatoria en web', barras(2)],
    ['medio impresion en página web', barras(2, { medio: 'impresion' })],
    ['mapa categorías: 6 con foco, 7 con gama (sin etiquetas: 5)', { tipo: 'mapa', variante: 'categorias', titulo: 'T', paleta: 'gama', datos: { territorios: ['Madrid', 'Galicia', 'Asturias', 'Murcia', 'Navarra', 'Aragón'], categorias: ['a', 'b', 'c', 'd', 'e', 'f'] } }]
  ],
  impresion: [
    ['sin fuente', barras(2)],
    ['donut de 6 fuera de web', donut(6, { fuente: 'INE' })],
    ['donut de 5 con foco (4 colores)', donut(5, { fuente: 'INE' })],
    ['donut de 5 con gama y etiquetas', donut(5, { fuente: 'INE', paleta: 'gama', etiquetas: true })],
    ['CMYK provisional (coropletas)', { tipo: 'mapa', titulo: 'T', unidad: '%', fuente: 'INE', datos: { territorios: ['Madrid', 'Galicia'], valores: [1, 2] } }],
    ['CMYK provisional (treemap jerárquico)', { tipo: 'treemap', variante: 'jerarquico', titulo: 'T', unidad: '€', fuente: 'INE', datos: { filas: [['A', 'a1', 3], ['A', 'a2', 2], ['B', 'b1', 4]] } }],
    ['tipo solo web (progresión)', { tipo: 'etapas', variante: 'progresion', titulo: 'T', fuente: 'x', datos: { etapas: ['A', 'B', 'C'], actual: 'B' } }],
    ['tipo solo web (tabla jerárquica)', { tipo: 'tabla', variante: 'jerarquica', titulo: 'T', unidad: '€', fuente: 'x', datos: { filas: [['A', 'a', 1], ['B', 'b', 2]] } }],
    ['foco: 5 series apiladas (4 colores)', barras(5, { fuente: 'INE' })]
  ],
  presentacion: [
    ['tema negro: gama sin etiquetas (contraste suficiente)', barras(3, { paleta: 'gama' })],
    ['donut de 6', donut(6)],
    ['foco: 5 partes', donut(5)]
  ]
};
for (const [modo, lista] of Object.entries(casos)) {
  EG.configurar({ modo, tema: modo === 'presentacion' ? 'negro' : undefined });
  console.log('== ' + modo + (modo === 'presentacion' ? ' (negro)' : ''));
  for (const [nombre, s] of lista) {
    const r = EG.validar(s);
    console.log((r.ok ? 'OK   ' : 'ERROR') + ' ' + nombre + (r.errores.length ? '\n      ' + r.errores.join('\n      ') : '') + (r.avisos.length ? '\n      aviso: ' + r.avisos.join('\n      aviso: ') : ''));
  }
}
/* KPI: «mejor» y su alias «sentidoPositivo» dan lo mismo; sin ninguno, «subir» */
const kpi = v => ({ tipo: 'kpi', titulo: 'Devoluciones', unidad: 'pedidos', valor: 120, variacion: Object.assign({ anterior: 100, referencia: 'vs. 2025' }, v) });
const m = v => JSON.stringify(EG.validar(kpi(v)).spec.variacion.mejor);
console.log('== kpi\nmejor bajar:', m({ mejor: 'bajar' }), '· sentidoPositivo bajar:', m({ sentidoPositivo: 'bajar' }), '· sin sentido:', m({}),
  '· «mejor» en el KPI:', JSON.stringify(EG.validar(Object.assign(kpi({}), { mejor: 'bajar' })).spec.variacion.mejor), '· no válido:', EG.validar(kpi({ mejor: 'menos' })).errores.length, 'error');
const sc = i => ({ tipo: 'tabla', variante: 'scorecard', titulo: 'T', unidad: '%', datos: { indicadores: [Object.assign({ nombre: 'Bajas', valor: 4, objetivo: 5 }, i)] } });
console.log('scorecard: sentidoPositivo bajar →', EG.validar(sc({ sentidoPositivo: 'bajar' })).spec.datos.indicadores[0].mejor, '· mejor bajar →', EG.validar(sc({ mejor: 'bajar' })).spec.datos.indicadores[0].mejor);
/* Tokens: ningún tono de solo pantalla en impresión, y naranja-300 sustituido fuera de web */
const pantalla = new Set(), imp = {};
EG.configurar({ modo: 'web' }); const web = EG.tokens.primitivos;
EG.configurar({ modo: 'impresion' }); const P = EG.tokens.primitivos, T = EG.tokens.semanticos;
['naranja300', 'neutro300', 'verdeDark', 'amarilloDark', 'rojoDark'].forEach(n => pantalla.add(web[n]));
const usados = [].concat(...Object.values(T)).filter(c => pantalla.has(c));
console.log('== tokens\nimpresión: naranja-300 →', P.naranja300, '· neutro-300 →', P.neutro300, '· roles con tonos de solo pantalla:', usados.length ? usados : 'ninguno');
EG.configurar({ modo: 'presentacion', tema: 'blanco' }); console.log('presentación blanco: series', EG.tokens.semanticos.series.join(' '), '· naranja-300 →', EG.tokens.primitivos.naranja300);
EG.configurar({ modo: 'web' });
