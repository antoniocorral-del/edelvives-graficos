import subprocess, time, os, shutil, json
from playwright.sync_api import sync_playwright
os.chdir('/home/claude/test'); shutil.copy('/home/claude/kit/dist/edelvives-graficos.js', 'kit.js')
NUEVOS = ['treemap-jerarquico', 'particion-sunburst', 'particion-icicle', 'circulos-anidados', 'arbol-ramas', 'arbol-dendrograma', 'arbol-organigrama', 'tabla-jerarquica', 'anidados']
json.dump([json.load(open('/home/claude/kit/ejemplos/%s.json' % n)) for n in NUEVOS], open('jerarquia.json', 'w'), ensure_ascii=False)
srv = subprocess.Popen(['python3', '-m', 'http.server', '8765'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(0.6)
casos = [(0, 'treemap (hoja)', 0, 1), (1, 'sunburst (grupo)', 0, 0), (1, 'sunburst (hoja)', 0, 1), (2, 'icicle (raíz)', 0, 0), (2, 'icicle (hoja)', 0, 2),
         (3, 'círculos (grupo)', 0, 0), (3, 'círculos (elemento)', 0, 3), (4, 'ramas (rama)', 0, 1), (5, 'dendrograma (hoja)', 0, 5), (6, 'organigrama', 0, 5)]
def tip(pg, i):
  return pg.evaluate(f"(() => {{ const d = [...document.querySelectorAll('#g{i} div')].find(x => x.style && x.style.zIndex === '9999999' && x.style.display !== 'none' && x.textContent); return d ? d.innerText.replace(/\\n/g,' | ') : ''; }})()")
try:
  with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1400, 'height': 2400})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8765/harness.html?ec=/node_modules/echarts/dist/echarts.min.js&specs=/jerarquia.json&ancho=400px&cols=3')
    pg.wait_for_function('window.LISTO === true', timeout=20000)
    for i, n, se, da in casos:
      pg.mouse.move(0, 0); time.sleep(0.15)
      pg.evaluate(f"(() => {{ const ch = echarts.getInstanceByDom(document.querySelector('#g{i} .eg-lienzo')); ch.dispatchAction({{ type: 'showTip', seriesIndex: {se}, dataIndex: {da} }}); }})()"); time.sleep(0.4)
      print(f'{n:22s} → {tip(pg, i)[:170]}')
    # Ratón real: centro del treemap y del primer círculo
    for i, n, dx, dy in [(0, 'treemap (ratón)', 0.2, 60), (3, 'círculos (ratón)', 0.3, 0.5)]:
      pg.mouse.move(0, 0); time.sleep(0.15)
      r = pg.evaluate(f"(() => {{ const b = document.querySelector('#g{i} .eg-lienzo').getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; }})()")
      pg.mouse.move(r[0] + r[2] * dx, r[1] + (r[3] * dy if dy < 1 else dy)); time.sleep(0.4)
      print(f'{n:22s} → {tip(pg, i)[:170]}')
    # Plegar «Zona Norte» en la tabla jerárquica
    pg.click('#g7 tr[data-i="1"] .eg-tj-boton'); time.sleep(0.2)
    print('tabla plegada:', pg.evaluate("[...document.querySelectorAll('#g7 tbody tr')].filter(r => !r.hidden).map(r => r.cells[0].innerText).join(', ')"),
          '· aria:', pg.evaluate("document.querySelector('#g7 tr[data-i=\"1\"] .eg-tj-boton').getAttribute('aria-expanded')"))
    pg.click('#g7 tr[data-i="0"] .eg-tj-boton'); time.sleep(0.2); pg.click('#g7 tr[data-i="0"] .eg-tj-boton'); time.sleep(0.2)
    print('tras plegar y desplegar el total:', pg.evaluate("[...document.querySelectorAll('#g7 tbody tr')].filter(r => !r.hidden).length"), 'filas visibles')
    print('errores:', errs)
    b.close()
finally: srv.terminate()
