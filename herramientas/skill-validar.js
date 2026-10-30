#!/usr/bin/env node
// Valida especificaciones con el validador del propio kit, en el modo del soporte.
// Uso: node validar.js especificaciones.json [--modo web|presentacion|impresion] [--tema blanco|negro]
// El JSON puede ser una especificación, una lista o un objeto { destino: especificación }.
const fs = require('fs'), path = require('path');
const EG = require(path.join(__dirname, '..', 'assets', 'edelvives-graficos.js'));
const args = process.argv.slice(2), opcion = n => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : undefined; };
const archivo = args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
if (!archivo) { console.error('Uso: node validar.js especificaciones.json [--modo web|presentacion|impresion] [--tema blanco|negro]'); process.exit(2); }
const modo = opcion('modo') || 'web';
EG.configurar({ modo, tema: modo === 'presentacion' ? (opcion('tema') || 'negro') : undefined });
const datos = JSON.parse(fs.readFileSync(archivo, 'utf8'));
const lista = Array.isArray(datos) ? datos.map((s, i) => ['#' + (i + 1), s])
  : (datos && datos.tipo ? [['spec', datos]] : Object.entries(datos));
let fallos = 0;
console.log('Modo ' + modo + (modo === 'presentacion' ? ' · tema ' + EG.tokens.tema : '') + ' · kit ' + EG.version);
for (const [id, s] of lista) {
  const r = EG.validar(s);
  if (!r.ok) fallos++;
  let nativo = '';
  if (r.ok && modo === 'presentacion') { const p = EG.pptx(s, { tema: EG.tokens.tema }); nativo = p.nativo ? ' · PowerPoint nativo (' + p.tipo + ')' : ' · sin gráfico nativo: EG.svg'; }
  console.log((r.ok ? 'OK    ' : 'ERROR ') + id + ' (' + (s && s.tipo) + (s && s.variante ? ' · ' + s.variante : '') + ')' + nativo);
  r.errores.forEach(e => console.log('   ✗ ' + e));
  r.avisos.forEach(a => console.log('   ! ' + a));
}
process.exit(fallos ? 1 : 0);
