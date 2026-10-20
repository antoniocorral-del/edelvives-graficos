global.window = {};
const EG = require('/home/claude/kit/dist/edelvives-graficos.js');
const fs = require('fs'); let mal = 0;
for (const f of fs.readdirSync('/home/claude/kit/ejemplos')) { const r = EG.validar(JSON.parse(fs.readFileSync('/home/claude/kit/ejemplos/' + f))); if (!r.ok || r.avisos.length) { mal++; console.log(f, r.errores, r.avisos); } }
console.log('validador del kit: ejemplos con errores o avisos =', mal, 'versión', EG.version);
