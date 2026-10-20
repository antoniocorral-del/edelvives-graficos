/* Casos erróneos y límite de la familia Geografía. Uso: node val_geografia.js <kit.js> */
global.window = global; require(process.argv[2] || '/home/claude/kit/dist/edelvives-graficos.js');
const CC = ['Galicia', 'Asturias', 'Cantabria', 'País Vasco', 'Navarra', 'Castilla y León', 'La Rioja', 'Aragón', 'Cataluña', 'Extremadura', 'Madrid', 'Castilla-La Mancha', 'Comunitat Valenciana', 'Illes Balears', 'Canarias', 'Andalucía', 'Murcia'];
const V = CC.map((_, i) => 20 + i * 4);
const m = (variante, datos, extra) => Object.assign({ tipo: 'mapa', variante, titulo: 'T', unidad: '%', datos }, extra || {});
const pts = n => [...Array(n)].map((_, i) => ({ lat: 37 + (i % 7) * 0.8, lon: -6 + (i % 11) * 0.7 }));
const casos = [
  ['coropletas correcto', m('coropletas', { territorios: CC, valores: V })],
  ['coropletas variante por defecto', { tipo: 'mapa', titulo: 'T', unidad: '%', datos: { territorios: CC, valores: V } }],
  ['coropletas provincias por nombre', { tipo: 'mapa', titulo: 'T', unidad: '%', datos: { territorios: ['A Coruña', 'Alacant/Alicante', 'Vizcaya', 'Lérida'], valores: [1, 2, 3, 4] } }],
  ['coropletas código INE', m('coropletas', { territorios: ['13', 9, '01'], valores: [1, 2, 3] }, { mapa: 'comunidades' })],
  ['coropletas nombre desconocido', m('coropletas', { territorios: ['Narnia', 'Madrid'], valores: [1, 2] })],
  ['coropletas provincia en comunidades', m('coropletas', { territorios: ['Zaragoza', 'Madrid'], valores: [1, 2] }, { mapa: 'comunidades' })],
  ['coropletas repetida', m('coropletas', { territorios: ['Madrid', 'Comunidad de Madrid'], valores: [1, 2] })],
  ['coropletas valores de menos', m('coropletas', { territorios: CC, valores: [1, 2] })],
  ['coropletas un solo dato', m('coropletas', { territorios: ['Madrid', 'Murcia'], valores: [1, null] })],
  ['coropletas con totales (aviso)', m('coropletas', { territorios: CC, valores: V }, { unidad: '€' })],
  ['coropletas faltan (aviso)', m('coropletas', { territorios: CC.slice(2), valores: V.slice(2) })],
  ['coropletas umbrales mal', m('coropletas', { territorios: CC, valores: V }, { umbrales: [10, 5, 20, 30] })],
  ['coropletas mapa mal', m('coropletas', { territorios: CC, valores: V }, { mapa: 'municipios' })],
  ['coropletas sin unidad', { tipo: 'mapa', titulo: 'T', datos: { territorios: CC, valores: V } }],
  ['con-ranking ranking mal', m('con-ranking', { territorios: CC, valores: V }, { ranking: 20 })],
  ['cartograma correcto', { tipo: 'cartograma', titulo: 'T', unidad: '%', datos: { territorios: CC, valores: V } }],
  ['cartograma por provincias', { tipo: 'cartograma', titulo: 'T', unidad: '%', mapa: 'provincias', datos: { territorios: ['Madrid'], valores: [1] } }],
  ['categorias correcto', m('categorias', { territorios: ['Madrid', 'Murcia'], categorias: ['A', 'B'] }, { unidad: undefined })],
  ['categorias 7', m('categorias', { territorios: CC.slice(0, 7), categorias: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] })],
  ['categorias 6 (aviso)', m('categorias', { territorios: CC.slice(0, 6), categorias: ['a', 'b', 'c', 'd', 'e', 'f'] })],
  ['categorias longitud', m('categorias', { territorios: CC, categorias: ['a'] })],
  ['burbujas negativo', m('burbujas', { territorios: ['Madrid', 'Murcia'], valores: [3, -1] }, { unidad: 'centros' })],
  ['simbolos destacar mal', m('simbolos', { territorios: ['Madrid', 'Murcia'], valores: [3, 1] }, { unidad: 'x', destacar: 'Galicia' })],
  ['puntos con lat/lon', { tipo: 'mapa', titulo: 'T', datos: { puntos: pts(30) } }],
  ['puntos fuera de España', { tipo: 'mapa', titulo: 'T', datos: { puntos: [{ lat: -3.7, lon: 40.4 }] } }],
  ['puntos sin lat', { tipo: 'mapa', titulo: 'T', datos: { puntos: [{ lon: 2 }] } }],
  ['puntos densidad', m('puntos', { territorios: ['Madrid', 'Murcia'], valores: [30, 12] }, { porPunto: 2 })],
  ['puntos densidad demasiados', m('puntos', { territorios: ['Madrid'], valores: [90000] })],
  ['puntos densidad decimales', m('puntos', { territorios: ['Madrid'], valores: [2.5] })],
  ['rejilla correcto', { tipo: 'mapa', titulo: 'T', celda: 30, datos: { puntos: pts(80) } }],
  ['rejilla pocos', m('rejilla', { puntos: pts(5) })],
  ['rejilla celda mal', m('rejilla', { puntos: pts(40) }, { celda: 1 })],
  ['rejilla valor sin unidad', { tipo: 'mapa', variante: 'rejilla', titulo: 'T', datos: { puntos: pts(20).map(p => Object.assign(p, { valor: 2 })) } }],
  ['rejilla valor a medias', m('rejilla', { puntos: pts(20).map((p, i) => i ? p : Object.assign(p, { valor: 2 })) })],
  ['hexagonos misma celda', m('hexagonos', { puntos: [...Array(12)].map(() => ({ lat: 40.4, lon: -3.7 })) })],
  ['flujos correcto', m('flujos', { origen: 'Madrid', destinos: ['Barcelona', { nombre: 'Vigo', lat: 42.24, lon: -8.72 }], valores: [3, 2] }, { unidad: 'envíos' })],
  ['flujos 8', m('flujos', { origen: 'Madrid', destinos: ['Barcelona', 'Sevilla', 'Valencia', 'Bizkaia', 'Murcia', 'León', 'Lugo', 'Cádiz'], valores: [1, 1, 1, 1, 1, 1, 1, 1] }, { unidad: 'x' })],
  ['flujos destino = origen', m('flujos', { origen: 'Madrid', destinos: ['Madrid'], valores: [1] }, { unidad: 'x', mapa: 'provincias' })],
  ['flujos valores mal', m('flujos', { origen: 'Madrid', destinos: ['Barcelona'], valores: [0] }, { unidad: 'x' })],
  ['ruta correcta', { tipo: 'mapa', titulo: 'T', datos: { paradas: ['Madrid', 'Zaragoza', 'Barcelona'] } }],
  ['ruta una parada', { tipo: 'mapa', titulo: 'T', datos: { paradas: ['Madrid'] } }],
  ['ruta lugar sin nombre', { tipo: 'mapa', titulo: 'T', datos: { paradas: ['Madrid', { lat: 41, lon: 1 }] } }],
  ['conexiones correcto', { tipo: 'mapa', titulo: 'T', datos: { enlaces: [{ origen: 'Madrid', destino: 'Sevilla' }, { origen: 'Sevilla', destino: 'Málaga' }] } }],
  ['conexiones repetida', { tipo: 'mapa', titulo: 'T', datos: { enlaces: [{ origen: 'Madrid', destino: 'Sevilla' }, { origen: 'Sevilla', destino: 'Madrid' }] } }],
  ['conexiones a sí mismo', { tipo: 'mapa', titulo: 'T', datos: { enlaces: [{ origen: 'Madrid', destino: 'Madrid' }] } }],
  ['conexiones destacar mal', { tipo: 'mapa', titulo: 'T', destacar: 'Lugo', datos: { enlaces: [{ origen: 'Madrid', destino: 'Sevilla' }] } }],
];
for (const [n, s] of casos) {
  const r = EG.validar(s), g = r.spec && r.spec.datos && r.spec.datos._geo;
  try { JSON.stringify(r.spec); } catch (e) { console.log('   ¡no serializable!', e.message); }
  console.log((r.ok ? 'ok   ' : 'ERROR') + ' ' + n.padEnd(36) + (r.ok ? (r.spec.variante + ' · ' + (g ? g.mapa : '')) : '') + ' ' + r.errores.concat(r.avisos.map(a => 'AVISO ' + a)).join(' | ').slice(0, 240));
}
