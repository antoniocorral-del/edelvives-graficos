import subprocess, time, os, shutil, json
from playwright.sync_api import sync_playwright
os.chdir('/home/claude/test'); shutil.copy('/home/claude/kit/dist/edelvives-graficos.js', 'kit.js')
NUEVOS = ['cronologia-hitos', 'cronologia-carriles', 'cronologia-vertical', 'gantt', 'calendario-calor', 'calendario-mes', 'dos-periodos-superpuestos',
          'dos-periodos-interanual', 'matriz-cohortes', 'ciclo-vida']
json.dump([json.load(open('/home/claude/kit/ejemplos/%s.json' % n)) for n in NUEVOS], open('temporal.json', 'w'), ensure_ascii=False)
srv = subprocess.Popen(['python3', '-m', 'http.server', '8765'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(0.6)
# (índice, nombre, serie, dato)
casos = [(0, 'hitos (destacado)', 0, 2), (0, 'hitos (último)', 0, 5), (1, 'carriles (punto)', 0, 0), (1, 'carriles (tramo)', 0, 4), (3, 'gantt (tarea)', 0, 2),
         (3, 'gantt (sin avance)', 0, 4), (3, 'gantt (hito)', 0, 5), (4, 'calor (día)', 0, 10), (6, 'superpuestos', 0, 4), (7, 'interanual', 0, 2),
         (8, 'cohortes', 0, 3), (9, 'ciclo de vida', 0, 0)]
try:
  with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1400, 'height': 2400})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8765/harness.html?ec=/node_modules/echarts/dist/echarts.min.js&specs=/temporal.json&ancho=400px&cols=3')
    pg.wait_for_function('window.LISTO === true', timeout=20000)
    for i, n, se, da in casos:
      pg.mouse.move(0, 0); time.sleep(0.15)
      pg.evaluate(f"(() => {{ const ch = echarts.getInstanceByDom(document.querySelector('#g{i} .eg-lienzo')); ch.dispatchAction({{ type: 'showTip', seriesIndex: {se}, dataIndex: {da} }}); }})()"); time.sleep(0.4)
      t = pg.evaluate(f"(() => {{ const d = [...document.querySelectorAll('#g{i} div')].find(x => x.style && x.style.zIndex === '9999999' && x.style.display !== 'none' && x.textContent); return d ? d.innerText.replace(/\\n/g,' | ') : ''; }})()")
      print(f'{n:22s} → {t[:170]}')
    # Ratón real sobre una barra del Gantt y una celda del calendario de calor
    for i, n, dx, dy in [(3, 'gantt (ratón)', 0.45, 72), (4, 'calor (ratón)', 16 + 12.9 * 5 + 5, 20 + 12.9 * 2 + 5)]:
      pg.mouse.move(0, 0); time.sleep(0.15)
      r = pg.evaluate(f"(() => {{ const b = document.querySelector('#g{i} .eg-lienzo').getBoundingClientRect(); return [b.x, b.y, b.width]; }})()")
      pg.mouse.move(r[0] + (r[2] * dx if dx < 1 else dx), r[1] + dy); time.sleep(0.4)
      t = pg.evaluate(f"(() => {{ const d = [...document.querySelectorAll('#g{i} div')].find(x => x.style && x.style.zIndex === '9999999' && x.style.display !== 'none' && x.textContent); return d ? d.innerText.replace(/\\n/g,' | ') : ''; }})()")
      print(f'{n:22s} → {t[:170]}')
    print('títulos del calendario del mes:', pg.evaluate("[...document.querySelectorAll('#g5 td[title]')].filter(x => x.title.includes('\\n')).map(x => x.title.replace(/\\n/g, ' / '))"))
    print('hito en curso:', pg.evaluate("document.querySelector('#g2 [aria-current]').innerText.replace(/\\n/g, ' / ')"))
    print('errores:', errs)
    b.close()
finally: srv.terminate()
