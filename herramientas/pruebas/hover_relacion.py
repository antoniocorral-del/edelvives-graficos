import subprocess, time, os, shutil, json
from playwright.sync_api import sync_playwright
os.chdir('/home/claude/test'); shutil.copy('/home/claude/kit/dist/edelvives-graficos.js', 'kit.js')
NUEVOS = ['dispersion-simple', 'dispersion-tendencia', 'dispersion-burbujas', 'dispersion-burbujas-categoria', 'matriz-correlacion-color',
          'matriz-correlacion-valores', 'dispersion-hexagonos', 'dispersion-cuadrantes', 'radar-perfil', 'radar-dos-perfiles',
          'coordenadas-paralelas', 'dispersion-conectada']
json.dump([json.load(open('/home/claude/kit/ejemplos/%s.json' % n)) for n in NUEVOS], open('relacion.json', 'w'), ensure_ascii=False)
srv = subprocess.Popen(['python3', '-m', 'http.server', '8765'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(0.6)
# ('raton', índice, nombre, buscador, punto en coordenadas de datos) o ('tip', índice, nombre, serie, dato)
casos = [('tip', 0, 'scatter', 0, 3), ('tip', 1, 'tendencia', 0, 0), ('tip', 2, 'burbujas', 0, 0), ('tip', 3, 'burbujas-categoria', 1, 1),
  ('raton', 4, 'heatmap', '{seriesIndex:0}', ['Licencias', 'Alumnos']), ('raton', 5, 'matriz', '{seriesIndex:0}', ['Alumnos', 'Plazo']),
  ('raton', 5, 'matriz (diagonal)', '{seriesIndex:0}', ['Uso', 'Uso']), ('tip', 6, 'hexbin', 0, 0), ('tip', 7, 'cuadrantes', 1, 7),
  ('tip', 8, 'radar', 0, 0), ('tip', 9, 'spider', 0, 1), ('tip', 10, 'paralelas', 0, 2), ('tip', 11, 'conectada', 0, 2)]
try:
  with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1400, 'height': 2400})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8765/harness.html?ec=/node_modules/echarts/dist/echarts.min.js&specs=/relacion.json&ancho=400px&cols=3')
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
      print(f'{n:20s} → {t[:170]}')
    print('errores:', errs)
    b.close()
finally: srv.terminate()
