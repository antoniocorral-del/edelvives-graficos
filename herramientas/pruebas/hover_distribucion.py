import subprocess, time, os, shutil, json
from playwright.sync_api import sync_playwright
os.chdir('/home/claude/test'); shutil.copy('/home/claude/kit/dist/edelvives-graficos.js', 'kit.js')
NUEVOS = ['histograma', 'cajas-caja', 'cajas-violin', 'casos-apilados', 'casos-dispersos', 'casos-enjambre', 'distribucion-densidad',
          'distribucion-normal', 'distribucion-acumulada', 'percentiles', 'rangos-rango', 'rangos-min-max', 'rangos-intervalo']
json.dump([json.load(open('/home/claude/kit/ejemplos/%s.json' % n)) for n in NUEVOS], open('distribucion.json', 'w'), ensure_ascii=False)
srv = subprocess.Popen(['python3', '-m', 'http.server', '8765'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(0.6)
# ('raton', índice, nombre, buscador, punto en coordenadas de datos) o ('tip', índice, nombre, serie, dato)
casos = [('raton', 0, 'histograma', '{seriesIndex:0}', [55, 10]), ('raton', 1, 'caja', '{seriesIndex:0}', [1, 55]),
  ('raton', 1, 'caja (atípico)', '{seriesIndex:1}', [0, 94]), ('raton', 2, 'violín', '{seriesIndex:0}', [2, 55]),
  ('tip', 3, 'dot plot', 0, 10), ('tip', 4, 'strip (punto)', 0, 5), ('raton', 4, 'strip (media)', '{seriesIndex:1}', [1, 64]),
  ('tip', 5, 'enjambre', 0, 20), ('raton', 6, 'densidad', '{seriesIndex:0}', [60, 0.004]), ('raton', 7, 'normal', '{seriesIndex:1}', [64, 0.01]),
  ('raton', 8, 'acumulada', '{seriesIndex:0}', [5, 70]), ('raton', 9, 'percentiles', '{seriesIndex:0}', [30, 'Aragón']),
  ('raton', 10, 'range plot', '{seriesIndex:0}', [40, 2]), ('raton', 11, 'min-max', '{seriesIndex:0}', ['Abr', 284]),
  ('raton', 12, 'intervalo', '{seriesIndex:0}', ['Tienda online', 71])]
try:
  with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1400, 'height': 2400})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8765/harness.html?ec=/node_modules/echarts/dist/echarts.min.js&specs=/distribucion.json&ancho=400px&cols=3')
    pg.wait_for_function('window.LISTO === true', timeout=20000)
    for c in casos:
      modo, i, n = c[0], c[1], c[2]
      pg.mouse.move(0, 0); time.sleep(0.15)
      if modo == 'raton':
        js = f"(() => {{ const el = document.querySelector('#g{i} .eg-lienzo'); const ch = echarts.getInstanceByDom(el); const r = el.getBoundingClientRect(); const p = ch.convertToPixel({c[3]}, {c[4]!r}); return [r.x + p[0], r.y + p[1]]; }})()"
        xy = pg.evaluate(js); pg.mouse.move(xy[0] + 1, xy[1]); time.sleep(0.4)
      else:
        pg.evaluate(f"(() => {{ const ch = echarts.getInstanceByDom(document.querySelector('#g{i} .eg-lienzo')); ch.dispatchAction({{ type: 'showTip', seriesIndex: {c[3]}, dataIndex: {c[4]} }}); }})()"); time.sleep(0.4)
      t = pg.evaluate(f"(() => {{ const d = [...document.querySelectorAll('#g{i} div')].find(x => x.style && x.style.zIndex === '9999999' && x.style.display !== 'none' && x.textContent); return d ? d.innerText.replace(/\\n/g,' | ') : ''; }})()")
      print(f'{n:18s} → {t[:170]}')
    print('errores:', errs)
    b.close()
finally: srv.terminate()
