"""EG.svg de todos los ejemplos en un modo: guarda cada SVG en <carpeta>/<ejemplo>.svg, el resumen y una captura.
Uso (en el banco): python3 svgs.py <kit.js> <carpeta> <modo> [tema] [columnas] [titulo=1]"""
import sys, json, subprocess, time, os, shutil
from playwright.sync_api import sync_playwright
BANCO = '/home/claude/test'; KIT = '/home/claude/kit'
kit, carpeta, modo = sys.argv[1:4]
tema = sys.argv[4] if len(sys.argv) > 4 else ''
columnas = sys.argv[5] if len(sys.argv) > 5 else ''
titulo = sys.argv[6] if len(sys.argv) > 6 else ''
carpeta = os.path.abspath(carpeta); os.makedirs(carpeta, exist_ok=True)
os.chdir(BANCO); shutil.copy(kit, 'kit.js')
nombres = sorted(f[:-5] for f in os.listdir(KIT + '/ejemplos') if f.endswith('.json'))
if os.environ.get('SOLO'): nombres = [n for n in nombres if any(n.startswith(x) for x in os.environ['SOLO'].split(','))]
specs = [json.load(open(KIT + '/ejemplos/' + n + '.json')) for n in nombres]
if modo == 'impresion':
  for x in specs: x.setdefault('fuente', 'Datos de ejemplo')
json.dump(specs, open('svg-ejemplos.json', 'w'), ensure_ascii=False)
srv = subprocess.Popen(['python3', '-m', 'http.server', '8769'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(0.6)
try:
  with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1800, 'height': 1000})
    logs = []; pg.on('pageerror', lambda e: logs.append('PAGEERROR: ' + str(e)))
    pg.goto('http://localhost:8769/harness-svg.html?ec=/node_modules/echarts/dist/echarts.min.js&specs=/svg-ejemplos.json&modo=%s&tema=%s&columnas=%s&titulo=%s' % (modo, tema, columnas, titulo))
    pg.wait_for_function('window.LISTO === true', timeout=180000); time.sleep(1)
    res = pg.evaluate('window.SVGS')
    for r, n in zip(res, nombres):
      if r.get('ok'): open('%s/%s.svg' % (carpeta, n), 'w').write(r.pop('svg'))
      r['nombre'] = n
    json.dump(res, open(carpeta + '/resumen.json', 'w'), ensure_ascii=False, indent=1)
    pg.screenshot(path=carpeta + '/todos.png', full_page=True)
    b.close()
finally: srv.terminate()
mal = [(r['nombre'], r.get('error', '')[:120]) for r in res if not r['ok']]
print('%s %s: %d SVG, %d fallan' % (modo, tema, len(res) - len(mal), len(mal)))
for m in mal: print('  ', *m)
for r in res:
  if r['ok'] and r['avisos']: print('  aviso', r['nombre'], r['avisos'][:2])
for l in logs: print(l)
