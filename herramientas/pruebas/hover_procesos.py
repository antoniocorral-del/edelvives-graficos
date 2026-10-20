import subprocess, time, os, shutil, json
from playwright.sync_api import sync_playwright
os.chdir('/home/claude/test'); shutil.copy('/home/claude/kit/dist/edelvives-graficos.js', 'kit.js')
NUEVOS = ['embudo', 'embudo-conversion', 'etapas-pipeline', 'etapas-proceso', 'etapas-progresion', 'embudo-retencion', 'recorrido']
json.dump([json.load(open('/home/claude/kit/ejemplos/%s.json' % n)) for n in NUEVOS], open('procesos.json', 'w'), ensure_ascii=False)
srv = subprocess.Popen(['python3', '-m', 'http.server', '8765'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(0.6)
# ('tip', índice, nombre, serie, dato) o ('raton', índice, nombre, selector CSS dentro de la tarjeta)
casos = [('tip', 0, 'funnel (1.ª)', 0, 0), ('tip', 0, 'funnel (3.ª)', 0, 2), ('tip', 1, 'conversion', 0, 4), ('tip', 3, 'proceso (rombo)', 0, 2),
         ('tip', 3, 'proceso (alternativa)', 0, 5), ('tip', 3, 'proceso (actual)', 0, 3), ('tip', 5, 'retencion', 0, 2), ('tip', 6, 'recorrido', 0, 2)]
try:
  with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1400, 'height': 2000})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8765/harness.html?ec=/node_modules/echarts/dist/echarts.min.js&specs=/procesos.json&ancho=400px&cols=3')
    pg.wait_for_function('window.LISTO === true', timeout=20000)
    for c in casos:
      modo, i, n = c[0], c[1], c[2]
      pg.mouse.move(0, 0); time.sleep(0.15)
      pg.evaluate(f"(() => {{ const ch = echarts.getInstanceByDom(document.querySelector('#g{i} .eg-lienzo')); ch.dispatchAction({{ type: 'showTip', seriesIndex: {c[3]}, dataIndex: {c[4]} }}); }})()"); time.sleep(0.4)
      t = pg.evaluate(f"(() => {{ const d = [...document.querySelectorAll('#g{i} div')].find(x => x.style && x.style.zIndex === '9999999' && x.style.display !== 'none' && x.textContent); return d ? d.innerText.replace(/\\n/g,' | ') : ''; }})()")
      print(f'{n:24s} → {t[:170]}')
    # Ratón real sobre un trapecio del embudo y sobre una caja del proceso
    for i, nombre, sel in [(0, 'funnel (ratón)', 'path'), (3, 'proceso (ratón)', 'path')]:
      pg.mouse.move(0, 0); time.sleep(0.15)
      r = pg.evaluate(f"(() => {{ const el = document.querySelector('#g{i} .eg-lienzo'); const b = el.getBoundingClientRect(); return [b.x, b.y, b.width]; }})()")
      pg.mouse.move(r[0] + (r[2] / 2 if i == 0 else 30), r[1] + (20 if i == 0 else 25)); time.sleep(0.4)
      t = pg.evaluate(f"(() => {{ const d = [...document.querySelectorAll('#g{i} div')].find(x => x.style && x.style.zIndex === '9999999' && x.style.display !== 'none' && x.textContent); return d ? d.innerText.replace(/\\n/g,' | ') : ''; }})()")
      print(f'{nombre:24s} → {t[:170]}')
    print('títulos del pipeline:', pg.evaluate("[...document.querySelectorAll('#g2 li')].slice(0, 2).map(x => x.title)"))
    print('errores:', errs)
    b.close()
finally: srv.terminate()
