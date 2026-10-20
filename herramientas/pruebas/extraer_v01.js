// Extrae las 10 especificaciones de la 0.1 de demo-dashboard-comercial.html a /home/claude/test/v01.json (para la regresión).
// Ejecuta el script de la demo con un EG simulado que solo recoge lo que se le pasa a render. Uso: node herramientas/pruebas/extraer_v01.js
const fs = require('fs');
const h = fs.readFileSync('/home/claude/kit/demo-dashboard-comercial.html', 'utf8');
const bloque = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(b => b.includes('especLineas'));
const specs = [];
const nodo = new Proxy({}, { get: (t, k) => k === 'style' ? {} : (typeof k === 'string' && /^(add|remove|set|append|insert|query)/.test(k) ? () => nodo : (t[k] !== undefined ? t[k] : '')), set: (t, k, v) => { t[k] = v; return true; } });
const document = { getElementById: () => nodo, querySelector: () => nodo, querySelectorAll: () => [], createElement: () => nodo, addEventListener: () => {} };
const window = { addEventListener: () => {} };
const EG = { render: (d, s) => { if (d !== '#destino') specs.push(JSON.parse(JSON.stringify(s))); return Promise.resolve({ ok: true, errores: [], avisos: [] }); },
  configurar: () => {}, validar: () => ({ ok: true, errores: [], avisos: ['x'] }) };
const EdelvivesGraficos = EG;
try { eval(bloque); } catch (e) { /* el resto del script de la demo toca el DOM; las especificaciones ya están recogidas */ }
fs.writeFileSync('/home/claude/test/v01.json', JSON.stringify(specs));
console.log(specs.length, 'especificaciones:', specs.map(s => s.tipo).join(' '));
