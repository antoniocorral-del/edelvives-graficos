/* Presentación de prueba con EG.pptx: una diapositiva por ejemplo con gráfico nativo o tabla, en los dos temas.
   Uso (en el banco, con pptxgenjs instalado): node pptx_prueba.js <kit.js> salida.pptx */
/* Sin global.window: PptxGenJS lo tomaría por un navegador */
const EG = require(process.argv[2] || '/home/claude/kit/dist/edelvives-graficos.js');
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const dir = '/home/claude/kit/ejemplos/';
const p = new PptxGenJS();
p.defineLayout({ name: 'EV1920', width: 13.3333, height: 7.5 }); p.layout = 'EV1920';
p.title = 'Prueba de EG.pptx'; p.author = 'Edelvives';
let tema0 = null, n = 0, nativos = 0;
for (const tema of ['negro', 'blanco']) {
  for (const f of fs.readdirSync(dir).sort()) {
    const spec = JSON.parse(fs.readFileSync(dir + f));
    const r = EG.pptx(spec, { tema });
    if (!r.ok || !r.nativo) continue;
    if (!tema0) { p.theme = r.tema; tema0 = r.tema; }
    const T = EG.tokens; /* (el modo de la página no cambia: los colores del tema vienen en r.opciones) */
    const s = p.addSlide();
    s.background = { color: tema === 'negro' ? '000000' : 'FFFFFF' };
    const tx = tema === 'negro' ? 'F7F4F2' : '1F1F1F', tx2 = tema === 'negro' ? 'A39B93' : '5C5C5C';
    /* Título y nota los pone la diapositiva (posiciones del sistema: título en y 184, nota en y 960) */
    s.addText(spec.titulo, { x: 136 / 144, y: 184 / 144, w: 1648 / 144, h: 80 / 144, fontFace: '+mj-lt', fontSize: 45, color: 'FF801F', margin: 0, valign: 'top' });
    s.addText(f.replace('.json', '') + ' · ' + tema + (spec.unidad ? ' · en ' + spec.unidad : ''), { x: 136 / 144, y: 270 / 144, w: 1648 / 144, h: 40 / 144, fontFace: '+mn-lt', fontSize: 12, color: tx2, margin: 0 });
    if (r.nota) s.addText(r.nota, { x: 136 / 144, y: 960 / 144, w: 1510 / 144, h: 32 / 144, fontFace: '+mn-lt', fontSize: 12, color: tx2, margin: 0 });
    if (r.tipo === 'tabla') s.addTable(r.filas, r.opciones); else s.addChart(r.tipo, r.datos, r.opciones);
    n++; if (r.tipo !== 'tabla') nativos++;
  }
}
p.writeFile({ fileName: process.argv[3] || 'prueba-pptx.pptx' }).then(f => console.log('diapositivas:', n, '· gráficos nativos:', nativos, '· tablas:', n - nativos, '→', f));
