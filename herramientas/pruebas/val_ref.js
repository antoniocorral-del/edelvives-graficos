global.window = {};
const EG = require('/home/claude/kit/dist/edelvives-graficos.js');
const fs = require('fs');
for (const f of fs.readdirSync('/home/claude/kit/referencias')) {
  const md = fs.readFileSync('/home/claude/kit/referencias/' + f, 'utf8');
  const bloques = [...md.matchAll(/```js\n([\s\S]*?)```/g)].map(m => m[1]);
  let n = 0, mal = 0;
  for (const b of bloques) {
    const limpio = b.split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
    const specs = limpio.split(/\n(?=\{)/).map(x => x.trim()).filter(Boolean);
    for (const t of specs) {
      if (t.includes('/* …')) continue;
      let s; try { s = eval('(' + t + ')'); } catch (e) { console.log(f, 'NO SE PUEDE LEER:', t.slice(0, 60)); mal++; continue; }
      const r = EG.validar(s); n++;
      if (!r.ok || r.avisos.length) { mal++; console.log(f, s.tipo, s.variante || '', r.errores, r.avisos); }
    }
  }
  console.log(f.padEnd(16), 'especificaciones:', n, 'con problemas:', mal);
}
