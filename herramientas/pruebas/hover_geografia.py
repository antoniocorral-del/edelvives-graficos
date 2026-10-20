import subprocess, time, os, shutil, json
from playwright.sync_api import sync_playwright
os.chdir('/home/claude/test'); shutil.copy('/home/claude/kit/dist/edelvives-graficos.js', 'kit.js')
NUEVOS = ['mapa-coropletas', 'mapa-puntos', 'mapa-burbujas', 'mapa-simbolos', 'mapa-rejilla', 'mapa-hexagonos', 'mapa-categorias', 'cartograma',
          'mapa-flujos', 'mapa-ruta', 'mapa-conexiones', 'mapa-con-ranking']
json.dump([json.load(open('/home/claude/kit/ejemplos/%s.json' % n)) for n in NUEVOS], open('geo_ej.json', 'w'), ensure_ascii=False)
srv = subprocess.Popen(['python3', '-m', 'http.server', '8765'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(0.6)
# (gráfico, nombre, serie, índice): la serie 0 son las zonas (en orden de código INE) y la 1, las marcas
casos = [(0, 'coropletas (Madrid)', 0, 12), (0, 'coropletas (Ceuta)', 0, 17), (2, 'burbujas', 1, 0), (3, 'símbolos', 1, 1), (4, 'rejilla', 1, 3),
         (5, 'hexágonos', 1, 3), (6, 'categorías', 0, 0), (7, 'cartograma', 0, 12), (8, 'flujos', 1, 0), (9, 'ruta', 1, 1), (10, 'conexiones (enlace)', 1, 0),
         (10, 'conexiones (nodo)', 1, 12), (11, 'ranking (zona)', 0, 8), (11, 'ranking (barra)', 1, 0)]
def tip(pg, i):
  return pg.evaluate(f"(() => {{ const d = [...document.querySelectorAll('#g{i} div')].find(x => x.style && x.style.zIndex === '9999999' && x.style.display !== 'none' && x.textContent); return d ? d.innerText.replace(/\\n/g,' | ') : ''; }})()")
try:
  with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1400, 'height': 2400})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8765/harness.html?ec=/node_modules/echarts/dist/echarts.min.js&specs=/geo_ej.json&ancho=400px&cols=3')
    pg.wait_for_function('window.LISTO === true', timeout=20000)
    for i, n, se, da in casos:
      pg.mouse.move(0, 0); time.sleep(0.15)
      pg.evaluate(f"(() => {{ const ch = echarts.getInstanceByDom(document.querySelector('#g{i} .eg-lienzo')); ch.dispatchAction({{ type: 'showTip', seriesIndex: {se}, dataIndex: {da} }}); }})()"); time.sleep(0.4)
      print(f'{n:22s} → {tip(pg, i)[:170]}')
    # Ratón real sobre Madrid en el coroplético: la <path> con el relleno de la clase más alta
    for i, n, fill in [(0, 'coropletas (ratón)', '#BD4200'), (2, 'burbujas (ratón)', '#F56A00')]:
      pg.mouse.move(0, 0); time.sleep(0.15)
      r = pg.evaluate(f"(() => {{ const e = [...document.querySelectorAll('#g{i} path, #g{i} circle')].filter(p => (p.getAttribute('fill')||'').toUpperCase() === '{fill}')[0]; const b = e.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; }})()")
      pg.mouse.move(r[0], r[1]); time.sleep(0.4)
      print(f'{n:22s} → {tip(pg, i)[:170]}')
    print('errores:', errs)
    b.close()
finally: srv.terminate()
