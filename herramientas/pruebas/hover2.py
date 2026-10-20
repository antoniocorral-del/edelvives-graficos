import subprocess, time, os, shutil
from playwright.sync_api import sync_playwright
os.chdir('/home/claude/test'); shutil.copy('/home/claude/kit/dist/edelvives-graficos.js', 'kit.js')
import json
COMPARACION = ['barras-verticales', 'barras-horizontales', 'barras-agrupadas', 'barras-apiladas', 'barras-apiladas-100', 'barras-con-referencia',
               'barras-divergentes', 'barras-piramide', 'puntos', 'piruleta', 'pesas']
json.dump([json.load(open('/home/claude/kit/ejemplos/%s.json' % n)) for n in COMPARACION], open('comparacion.json', 'w'), ensure_ascii=False)
srv = subprocess.Popen(['python3','-m','http.server','8765'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(0.6)
try:
  with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width':1400,'height':2600})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8765/harness.html?ec=/node_modules/echarts/dist/echarts.min.js&specs=/comparacion.json')
    pg.wait_for_function('window.LISTO === true', timeout=20000)
    # (índice, serie, punto en coordenadas de datos)
    casos = {6:('divergentes',0,'grid',[3,2]), 7:('piramide',1,'grid',[1,1]), 8:('puntos',0,'s',[82,'Atención comercial']), 9:('piruleta',1,'s',['Cuentos',24]), 10:('pesas',2,'s',[12.0,'Andalucía'])}
    for i,(n,serie,_,dato) in casos.items():
      xy = pg.evaluate(f"(() => {{ const el = document.querySelector('#g{i} .eg-lienzo'); const ch = echarts.getInstanceByDom(el); const r = el.getBoundingClientRect(); const p = ch.convertToPixel({{seriesIndex:{serie}}}, {dato!r}); return [r.x + p[0], r.y + p[1]]; }})()")
      pg.mouse.move(xy[0]+1, xy[1]); time.sleep(0.35)
      t = pg.evaluate(f"(() => {{ const d = [...document.querySelectorAll('#g{i} div')].find(x => x.style && x.style.zIndex === '9999999' && x.style.display !== 'none' && x.textContent); return d ? d.innerText.replace(/\\n/g,' | ') : ''; }})()")
      print(n, xy, '→', t[:120])
    print('errores:', errs)
    b.close()
finally: srv.terminate()
