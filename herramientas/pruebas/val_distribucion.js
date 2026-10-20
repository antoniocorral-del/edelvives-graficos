global.window = {};
const EG = require('/home/claude/kit/dist/edelvives-graficos.js');
const sec = (n, a = 0, p = 1) => Array.from({ length: n }, (x, i) => a + i * p);
const v20 = [3, 5, 8, 9, 12, 12, 14, 15, 17, 18, 20, 21, 23, 24, 26, 29, 31, 35, 40, 52];
const casos = {
  'histograma 9 valores': { tipo: 'histograma', titulo: 'x', unidad: 'puntos', datos: { valores: sec(9) } },
  'histograma todos iguales': { tipo: 'histograma', titulo: 'x', unidad: 'puntos', datos: { valores: Array(12).fill(5) } },
  'histograma formateados': { tipo: 'histograma', titulo: 'x', unidad: '€', datos: { valores: ['1.200 €', 3, 4, 5, 6, 7, 8, 9, 10, 11] } },
  'histograma intervalo pequeño': { tipo: 'histograma', titulo: 'x', unidad: 'puntos', intervalo: 1, datos: { valores: sec(20, 0, 5) } },
  'histograma inicio mayor que el mínimo': { tipo: 'histograma', titulo: 'x', unidad: 'puntos', inicio: 10, datos: { valores: v20 } },
  'histograma bruto y agrupado': { tipo: 'histograma', titulo: 'x', unidad: 'puntos', datos: { valores: v20, limites: [0, 10, 20, 30], casos: [1, 2, 3] } },
  'histograma agrupado desordenado': { tipo: 'histograma', titulo: 'x', unidad: 'puntos', datos: { limites: [0, 20, 10, 30], casos: [1, 2, 3] } },
  'histograma agrupado longitud': { tipo: 'histograma', titulo: 'x', unidad: 'puntos', datos: { limites: [0, 10, 20, 30], casos: [1, 2] } },
  'histograma agrupado (mediana estimada)': { tipo: 'histograma', titulo: 'x', unidad: 'puntos', datos: { limites: [0, 10, 20, 30, 40], casos: [2, 8, 6, 4] } },
  'histograma marca no válida': { tipo: 'histograma', titulo: 'x', unidad: 'puntos', marca: 'moda', datos: { valores: v20 } },
  'cajas 9 grupos': { tipo: 'cajas', titulo: 'x', unidad: 'puntos', datos: { series: sec(9).map(i => ({ nombre: 'G' + i, valores: v20 })) } },
  'cajas grupo con 4 valores': { tipo: 'cajas', titulo: 'x', unidad: 'puntos', datos: { series: [{ nombre: 'A', valores: v20 }, { nombre: 'B', valores: [1, 2, 3, 4] }] } },
  'cajas grupo sin nombre': { tipo: 'cajas', titulo: 'x', unidad: 'puntos', datos: { series: [{ nombre: 'A', valores: v20 }, { valores: v20 }] } },
  'cajas un solo grupo con valores': { tipo: 'cajas', titulo: 'x', unidad: 'puntos', datos: { valores: v20 } },
  'cajas resumen desordenado': { tipo: 'cajas', titulo: 'x', unidad: 'puntos', datos: { series: [{ nombre: 'A', resumen: { minimo: 10, q1: 30, mediana: 25, q3: 40, maximo: 60 } }] } },
  'cajas resumen atípico dentro': { tipo: 'cajas', titulo: 'x', unidad: 'puntos', datos: { series: [{ nombre: 'A', resumen: { minimo: 10, q1: 20, mediana: 25, q3: 40, maximo: 60, atipicos: [50] } }] } },
  'cajas resumen correcto': { tipo: 'cajas', titulo: 'x', unidad: 'puntos', datos: { series: [{ nombre: 'A', resumen: { minimo: 10, q1: 20, mediana: 25, q3: 40, maximo: 60, atipicos: [95] } }] } },
  'violin con resumen': { tipo: 'cajas', variante: 'violin', titulo: 'x', unidad: 'puntos', datos: { series: [{ nombre: 'A', resumen: { minimo: 10, q1: 20, mediana: 25, q3: 40, maximo: 60 } }] } },
  'violin 7 grupos': { tipo: 'cajas', variante: 'violin', titulo: 'x', unidad: 'puntos', datos: { series: sec(7).map(i => ({ nombre: 'G' + i, valores: v20 })) } },
  'cajas con marca': { tipo: 'cajas', titulo: 'x', unidad: 'puntos', marca: 'media', datos: { valores: v20 } },
  'apilados 101 casos': { tipo: 'casos', variante: 'apilados', titulo: 'x', unidad: 'h', datos: { valores: sec(101) } },
  'apilados con series': { tipo: 'casos', variante: 'apilados', titulo: 'x', unidad: 'h', datos: { series: [{ nombre: 'A', valores: v20 }] } },
  'apilados columna de 31': { tipo: 'casos', variante: 'apilados', titulo: 'x', unidad: 'h', datos: { valores: Array(31).fill(10).concat([1, 30]) } },
  'casos con series sin variante': { tipo: 'casos', titulo: 'x', unidad: 'h', datos: { series: [{ nombre: 'A', valores: v20 }, { nombre: 'B', valores: v20 }] } },
  'dispersos con resumen': { tipo: 'casos', variante: 'dispersos', titulo: 'x', unidad: 'h', datos: { series: [{ nombre: 'A', resumen: { minimo: 1, q1: 2, mediana: 3, q3: 4, maximo: 5 } }] } },
  'enjambre 5 grupos': { tipo: 'casos', variante: 'enjambre', titulo: 'x', unidad: 'h', datos: { series: sec(5).map(i => ({ nombre: 'G' + i, valores: v20 })) } },
  'densidad 19 valores': { tipo: 'distribucion', variante: 'densidad', titulo: 'x', unidad: '€', datos: { valores: v20.slice(1) } },
  'normal sin desviacion': { tipo: 'distribucion', variante: 'normal', titulo: 'x', unidad: 'puntos', datos: { media: 50 } },
  'normal desviacion 0': { tipo: 'distribucion', titulo: 'x', unidad: 'puntos', datos: { media: 50, desviacion: 0 } },
  'normal con media y valores': { tipo: 'distribucion', variante: 'normal', titulo: 'x', unidad: 'puntos', datos: { media: 50, desviacion: 10, valores: v20 } },
  'densidad con media': { tipo: 'distribucion', variante: 'densidad', titulo: 'x', unidad: '€', datos: { valores: v20, media: 3 } },
  'acumulada percentil 50': { tipo: 'distribucion', variante: 'acumulada', titulo: 'x', unidad: 'días', percentil: 50, datos: { valores: v20 } },
  'acumulada percentil en densidad': { tipo: 'distribucion', variante: 'densidad', titulo: 'x', unidad: 'días', percentil: 75, datos: { valores: v20 } },
  'acumulada marca': { tipo: 'distribucion', variante: 'acumulada', titulo: 'x', unidad: 'días', marca: 'moda', datos: { valores: v20 } },
  'percentiles fuera de 0-100': { tipo: 'percentiles', titulo: 'x', unidad: '€', datos: { categorias: ['A', 'B'], valores: [1200, 900] } },
  'percentiles destacar mal': { tipo: 'percentiles', titulo: 'x', unidad: 'percentil', destacar: 'C', datos: { categorias: ['A', 'B'], valores: [72, 35] } },
  'percentiles con grupo': { tipo: 'percentiles', titulo: 'x', unidad: '€', datos: { categorias: ['A', 'B'], valores: [24, 9], grupo: v20 } },
  'percentiles 9 elementos': { tipo: 'percentiles', titulo: 'x', unidad: 'percentil', datos: { categorias: 'ABCDEFGHI'.split(''), valores: sec(9, 10, 10) } },
  'rango min mayor que max': { tipo: 'rangos', titulo: 'x', unidad: '€', datos: { categorias: ['A', 'B'], minimos: [10, 50], maximos: [20, 40] } },
  'rango valor fuera': { tipo: 'rangos', titulo: 'x', unidad: '€', datos: { categorias: ['A'], minimos: [10], maximos: [20], valores: [25] } },
  'rango sin maximos': { tipo: 'rangos', titulo: 'x', unidad: '€', datos: { categorias: ['A'], minimos: [10] } },
  'min-max 13 periodos': { tipo: 'rangos', variante: 'min-max', titulo: 'x', unidad: '€', datos: { periodos: sec(13).map(String), minimos: sec(13), maximos: sec(13, 5) } },
  'rangos con periodos sin variante': { tipo: 'rangos', titulo: 'x', unidad: '€', datos: { periodos: ['Ene', 'Feb'], minimos: [1, 2], maximos: [3, 4] } },
  'intervalo sin confianza': { tipo: 'rangos', variante: 'intervalo', titulo: 'x', unidad: 'puntos', datos: { categorias: ['A'], minimos: [10], maximos: [20], valores: [15] } },
  'intervalo sin valores': { tipo: 'rangos', variante: 'intervalo', titulo: 'x', unidad: 'puntos', confianza: 95, datos: { categorias: ['A'], minimos: [10], maximos: [20] } },
  'intervalo referencia mal': { tipo: 'rangos', variante: 'intervalo', titulo: 'x', unidad: 'puntos', confianza: 95, datos: { categorias: ['A'], minimos: [10], maximos: [20], valores: [15], referencia: 59 } },
  'rango con confianza': { tipo: 'rangos', variante: 'rango', titulo: 'x', unidad: 'puntos', confianza: 95, datos: { categorias: ['A'], minimos: [10], maximos: [20] } },
  'nombreCasos en rangos': { tipo: 'rangos', titulo: 'x', unidad: 'puntos', nombreCasos: 'centros', datos: { categorias: ['A'], minimos: [10], maximos: [20] } },
  'variante inexistente': { tipo: 'casos', variante: 'violin', titulo: 'x', unidad: 'h', datos: { valores: v20 } },
  'sin unidad': { tipo: 'histograma', titulo: 'x', datos: { valores: v20 } },
};
const extra = {
  'histograma agrupado (mediana estimada)': r => ' → marca: ' + JSON.stringify(r.spec.datos._hist.marca),
  'cajas un solo grupo con valores': r => ' → grupos: ' + r.spec.datos._grupos.length + ', mediana ' + r.spec.datos._grupos[0].mediana,
  'casos con series sin variante': r => ' → variante: ' + r.spec.variante,
  'rangos con periodos sin variante': r => ' → variante: ' + r.spec.variante,
  'normal desviacion 0': r => ' → variante: ' + r.spec.variante,
  'percentiles con grupo': r => ' → percentiles: ' + r.spec.datos._pct.join(', ') + ', destacar ' + r.spec.destacar,
};
for (const [n, s] of Object.entries(casos)) {
  const r = EG.validar(s);
  console.log((r.ok ? 'OK ' : 'ERR') + ' ' + n + (extra[n] && r.ok ? extra[n](r) : (extra[n] && n === 'normal desviacion 0' ? extra[n](r) : '')) +
    (r.errores.length ? '\n     ' + r.errores.join('\n     ') : '') + (r.avisos.length ? '\n     aviso: ' + r.avisos.join('\n     aviso: ') : ''));
}
