import subprocess, time, os, shutil
from playwright.sync_api import sync_playwright
os.chdir('/home/claude/test'); shutil.copy('/home/claude/kit/dist/edelvives-graficos.js', 'kit.js')
import json
NUEVOS = ['cascada-vertical','cascada-horizontal','barras-desviacion','barras-desviacion-periodos','barras-desviacion-pct','antes-despues',
          'barras-cumplimiento','barras-vs-anterior','barras-vs-prevision','barras-contribucion','descomposicion']
json.dump([json.load(open('/home/claude/kit/ejemplos/%s.json' % n)) for n in NUEVOS], open('variacion.json', 'w'), ensure_ascii=False)
srv = subprocess.Popen(['python3','-m','http.server','8765'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(0.6)
# (índice, nombre, buscador de ECharts, punto en coordenadas de datos)
casos = [(0,'cascada vertical',"{seriesIndex:0}",[1,740]), (1,'cascada horizontal',"{seriesIndex:0}",[3800000,1]),
  (2,'desviación filas',"{seriesIndex:0}",[114000,2]), (3,'desviación columnas',"{seriesIndex:0}",['Mar',75]),
  (4,'desviación %',"{seriesIndex:1}",['Jun',8.0]), (5,'antes y después',"{seriesIndex:1}",['Infantil',30]),
  (6,'cumplimiento',"{seriesIndex:0}",[900000,'Saber Hacer']), (7,'vs. anterior',"{seriesIndex:0}",['Abr',2000]),
  (8,'vs. previsión (real)',"{seriesIndex:0}",['Mar',200000]), (8,'vs. previsión (prev.)',"{seriesIndex:0}",['Jul',300000]),
  (9,'contribución',"{seriesIndex:0}",[1.6,0]), (9,'contribución total',"{seriesIndex:0}",[4.7,5]),
  (10,'descomposición',"{xAxisIndex:0,yAxisIndex:0}",[10,0])]
try:
  with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width':1400,'height':2600})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8765/harness.html?ec=/node_modules/echarts/dist/echarts.min.js&specs=/variacion.json')
    pg.wait_for_function('window.LISTO === true', timeout=20000)
    for i, n, finder, dato in casos:
      js = f"(() => {{ const el = document.querySelector('#g{i} .eg-lienzo'); const ch = echarts.getInstanceByDom(el); const r = el.getBoundingClientRect(); let p = ch.convertToPixel({finder}, {dato!r}); if ({i} === 10) p = [ch.convertToPixel({{xAxisIndex:0}}, 10), 30]; return [r.x + p[0], r.y + p[1]]; }})()"
      xy = pg.evaluate(js)
      pg.mouse.move(0, 0); time.sleep(0.15); pg.mouse.move(xy[0]+1, xy[1]); time.sleep(0.4)
      t = pg.evaluate(f"(() => {{ const d = [...document.querySelectorAll('#g{i} div')].find(x => x.style && x.style.zIndex === '9999999' && x.style.display !== 'none' && x.textContent); return d ? d.innerText.replace(/\\n/g,' | ') : ''; }})()")
      print(f'{n:24s} → {t[:150]}')
    print('errores:', errs)
    b.close()
finally: srv.terminate()
