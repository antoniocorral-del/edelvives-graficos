import subprocess, time, os, shutil, json
from playwright.sync_api import sync_playwright
os.chdir('/home/claude/test'); shutil.copy('/home/claude/kit/dist/edelvives-graficos.js', 'kit.js')
NUEVOS = ['sankey', 'sankey-aluvial', 'sankey-recorrido', 'cuerdas', 'flujo', 'red-comunidades', 'red-bipartita', 'red-radial', 'red-dependencias']
json.dump([json.load(open('/home/claude/kit/ejemplos/%s.json' % n)) for n in NUEVOS], open('flujo.json', 'w'), ensure_ascii=False)
srv = subprocess.Popen(['python3', '-m', 'http.server', '8765'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(0.6)
# (gráfico, nombre, serie, índice, tipo de dato)
casos = [(0, 'sankey (nodo)', 0, 1, 'node'), (1, 'aluvial (nodo)', 0, 4, 'node'), 
         (2, 'recorrido (paso)', 0, 3, None), (2, 'recorrido (sigue)', 0, 1, None), (2, 'recorrido (sale)', 0, 2, None),
         (3, 'cuerdas (cinta)', 0, 9, None), (3, 'cuerdas (grupo)', 0, 12, None), (4, 'flujo (enlace)', 0, 0, None), (4, 'flujo (nodo)', 0, 4, None),
         (5, 'red (nodo)', 0, 0, None), (6, 'bipartita', 0, 4, None), (7, 'radial', 0, 1, None), (8, 'dependencias', 0, 4, None)]
def tip(pg, i):
  return pg.evaluate(f"(() => {{ const d = [...document.querySelectorAll('#g{i} div')].find(x => x.style && x.style.zIndex === '9999999' && x.style.display !== 'none' && x.textContent); return d ? d.innerText.replace(/\\n/g,' | ') : ''; }})()")
try:
  with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1400, 'height': 2400})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8765/harness.html?ec=/node_modules/echarts/dist/echarts.min.js&specs=/flujo.json&ancho=400px&cols=3')
    pg.wait_for_function('window.LISTO === true', timeout=20000)
    for i, n, se, da, dt in casos:
      pg.mouse.move(0, 0); time.sleep(0.15)
      extra = f", dataType: '{dt}'" if dt else ''
      pg.evaluate(f"(() => {{ const ch = echarts.getInstanceByDom(document.querySelector('#g{i} .eg-lienzo')); ch.dispatchAction({{ type: 'showTip', seriesIndex: {se}, dataIndex: {da}{extra} }}); }})()"); time.sleep(0.4)
      print(f'{n:20s} → {tip(pg, i)[:170]}')
    # Ratón real: centro del lienzo del sankey y de las cuerdas
    # Ratón sobre una cinta: el centro de la primera <path> con el relleno indicado
    for i, n, fill in [(0, 'sankey enlace (ratón)', '#FFAF73'), (1, 'aluvial cinta (ratón)', '#A39B93')]:
      pg.mouse.move(0, 0); time.sleep(0.15)
      r = pg.evaluate(f"(() => {{ const e = [...document.querySelectorAll('#g{i} path')].find(p => (p.getAttribute('fill')||'').toUpperCase() === '{fill}'); const b = e.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; }})()")
      pg.mouse.move(r[0], r[1]); time.sleep(0.4)
      print(f'{n:20s} → {tip(pg, i)[:170]}')
    for i, n, dx, dy in [(0, 'sankey (ratón)', 0.5, 0.3), (3, 'cuerdas (ratón)', 0.5, 0.5)]:
      pg.mouse.move(0, 0); time.sleep(0.15)
      r = pg.evaluate(f"(() => {{ const b = document.querySelector('#g{i} .eg-lienzo').getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; }})()")
      pg.mouse.move(r[0] + r[2] * dx, r[1] + r[3] * dy); time.sleep(0.4)
      print(f'{n:20s} → {tip(pg, i)[:170]}')
    print('errores:', errs)
    b.close()
finally: srv.terminate()
