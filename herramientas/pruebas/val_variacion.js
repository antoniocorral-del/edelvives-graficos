global.window = {};
const EG = require('/home/claude/kit/dist/edelvives-graficos.js');
const M = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago'];
const casos = {
  'cascada no cuadra': { tipo:'cascada', titulo:'x', unidad:'€', datos:{ inicio:{etiqueta:'2025', valor:100}, categorias:['A','B'], valores:[10,-5], final:{etiqueta:'2026', valor:120} } },
  'cascada cuadra con redondeo': { tipo:'cascada', titulo:'x', unidad:'€', datos:{ inicio:100, categorias:['A','B'], valores:[10.2,-5.1], final:105 } },
  'cascada sin inicio': { tipo:'cascada', titulo:'x', unidad:'€', datos:{ categorias:['A'], valores:[10] } },
  'cascada vertical 9 pasos': { tipo:'cascada', titulo:'x', unidad:'€', datos:{ inicio:1, categorias:'ABCDEFGHI'.split(''), valores:[1,1,1,1,1,1,1,1,1] } },
  'desviacion-pct en €': { tipo:'barras-divergentes', variante:'desviacion-pct', titulo:'x', unidad:'€', referencia:'vs. plan', datos:{ periodos:M, valores:[1,2,3,4,5,6,7,8] } },
  'desviacion sin referencia': { tipo:'barras-divergentes', variante:'desviacion', titulo:'x', unidad:'€', datos:{ categorias:['A','B'], valores:[1,-2] } },
  'desviacion lados en columnas': { tipo:'barras-divergentes', variante:'desviacion', titulo:'x', unidad:'€', referencia:'vs. plan', lados:['Bajo','Sobre'], datos:{ periodos:['T1','T2'], valores:[1,-2] } },
  'desviacion lados mal': { tipo:'barras-divergentes', variante:'desviacion', titulo:'x', unidad:'€', referencia:'vs. plan', lados:'Bajo', datos:{ categorias:['A','B'], valores:[1,-2] } },
  'contribucion no cuadra': { tipo:'barras-divergentes', variante:'contribucion', titulo:'x', unidad:'p. p.', referencia:'al cambio', datos:{ categorias:['A','B'], valores:[3.2,2.4], total:9.4 } },
  'contribucion sin referencia': { tipo:'barras-divergentes', variante:'contribucion', titulo:'x', unidad:'p. p.', datos:{ categorias:['A','B'], valores:[3.2,2.4] } },
  'vs-prevision real completo': { tipo:'barras', variante:'vs-prevision', titulo:'x', unidad:'€', datos:{ categorias:['A','B'], valores:[1,2], prevision:{ valores:[], origen:'plan' } } },
  'vs-prevision sin origen': { tipo:'barras', variante:'vs-prevision', titulo:'x', unidad:'€', datos:{ categorias:['A','B','C'], valores:[1,2], prevision:{ valores:[3] } } },
  'vs-prevision longitud': { tipo:'barras', variante:'vs-prevision', titulo:'x', unidad:'€', datos:{ periodos:['A','B','C'], valores:[1], prevision:{ valores:[3], origen:'plan' } } },
  'barras con prevision sin variante': { tipo:'barras', titulo:'x', unidad:'€', datos:{ periodos:['A','B','C'], valores:[1,2], prevision:{ valores:[3], origen:'plan' } } },
  'vs-anterior anterior primero': { tipo:'barras', variante:'vs-anterior', titulo:'x', unidad:'€', datos:{ periodos:['A','B'], series:[{nombre:'2025', rol:'anterior', valores:[1,2]},{nombre:'2026', valores:[2,3]}] } },
  'vs-anterior una serie': { tipo:'barras', variante:'vs-anterior', titulo:'x', unidad:'€', datos:{ categorias:['A','B'], valores:[1,2] } },
  'cumplimiento objetivo 0': { tipo:'barras', variante:'con-referencia', cumplimiento:true, titulo:'x', unidad:'€', datos:{ categorias:['A','B'], valores:[1,2], objetivos:[0,2] } },
  'cumplimiento en verticales': { tipo:'barras', variante:'verticales', cumplimiento:true, titulo:'x', unidad:'€', datos:{ categorias:['A','B'], valores:[1,2] } },
  'antes-despues negativo': { tipo:'dos-momentos', variante:'antes-despues', titulo:'x', unidad:'€', datos:{ categorias:['A'], series:[{nombre:'Antes', valores:[-1]},{nombre:'Después', valores:[2]}] } },
  'antes-despues 7 categorias': { tipo:'dos-momentos', variante:'antes-despues', titulo:'x', unidad:'€', datos:{ categorias:'ABCDEFG'.split(''), series:[{nombre:'Antes', valores:[1,1,1,1,1,1,1]},{nombre:'Después', valores:[2,2,2,2,2,2,2]}] } },
  'descomposicion sin ciclo': { tipo:'descomposicion', titulo:'x', unidad:'€', datos:{ periodos:Array.from({length:24},(x,i)=>'P'+i), valores:Array.from({length:24},(x,i)=>i) } },
  'descomposicion corta': { tipo:'descomposicion', titulo:'x', unidad:'€', datos:{ periodos:Array.from({length:20},(x,i)=>'P'+i), valores:Array.from({length:20},(x,i)=>i), ciclo:12 } },
  'descomposicion solo tendencia': { tipo:'descomposicion', titulo:'x', unidad:'€', datos:{ periodos:Array.from({length:12},(x,i)=>'P'+i), valores:Array(12).fill(1), tendencia:Array(12).fill(1) } },
  'descomposicion precalculada': { tipo:'descomposicion', titulo:'x', unidad:'€', mostrarResiduo:true, datos:{ periodos:Array.from({length:12},(x,i)=>'P'+i), valores:Array(12).fill(3), tendencia:Array(12).fill(2), estacionalidad:Array(12).fill(1) } },
  'variante prevista antigua': { tipo:'barras-divergentes', variante:'desviacion-objetivo', titulo:'x', unidad:'%', datos:{ categorias:['A'], valores:[-3] } },
};
for (const [n, s] of Object.entries(casos)) {
  const r = EG.validar(s);
  const extra = n === 'vs-anterior anterior primero' ? ' → orden: ' + r.spec.datos.series.map(x => x.nombre + (x.rol ? '/' + x.rol : '')).join(', ') : (n === 'barras con prevision sin variante' ? ' → variante: ' + r.spec.variante : '');
  console.log((r.ok ? 'OK ' : 'ERR') + ' ' + n + extra + (r.errores.length ? '\n     ' + r.errores.join('\n     ') : '') + (r.avisos.length ? '\n     aviso: ' + r.avisos.join('\n     aviso: ') : ''));
}
