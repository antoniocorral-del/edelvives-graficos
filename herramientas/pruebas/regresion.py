"""Regresión visual de los ejemplos: una captura por tarjeta y comparación píxel a píxel.

Uso (desde la carpeta del banco de pruebas, después de preparar.sh):
  python3 regresion.py capturar <kit.js> <carpeta> [anchos]    anchos por defecto: 400,330
  python3 regresion.py comparar <carpeta-referencia> <carpeta-nueva>

«capturar» dibuja todos los ejemplos de /home/claude/kit/ejemplos (en orden alfabético) en harness.html
y guarda <carpeta>/<ancho>/<ejemplo>.png y <carpeta>/resultados.json (errores, avisos y consola).
«comparar» lista las capturas que cambian, con el número de píxeles distintos y la caja que los contiene,
y deja la diferencia en <carpeta-nueva>/diferencias/.
Con ARNES=harness-frio.html se dibuja sin precargar la fuente (para probar la espera del propio kit).
Con MODO=presentacion|impresion (y TEMA=blanco|negro) se dibuja en ese modo; en impresión se añade una «fuente» de ejemplo.
"""
import sys, json, subprocess, time, os, shutil

BANCO = '/home/claude/test'
KIT = '/home/claude/kit'


def capturar(kit, carpeta, anchos):
  from playwright.sync_api import sync_playwright
  carpeta = os.path.abspath(carpeta)
  os.chdir(BANCO)
  shutil.copy(kit, 'kit.js')
  nombres = sorted(f[:-5] for f in os.listdir(KIT + '/ejemplos') if f.endswith('.json'))
  specs = [json.load(open(KIT + '/ejemplos/' + n + '.json')) for n in nombres]
  if os.environ.get('MODO') == 'impresion':  # en impresión la fuente es obligatoria; los ejemplos no la traen
    for x in specs: x.setdefault('fuente', 'Datos de ejemplo')
  json.dump(specs, open('ejemplos.json', 'w'), ensure_ascii=False)
  srv = subprocess.Popen(['python3', '-m', 'http.server', '8765'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(0.6)
  resultados = {}
  try:
    with sync_playwright() as p:
      b = p.chromium.launch()
      for ancho in anchos:
        os.makedirs('%s/%s' % (carpeta, ancho), exist_ok=True)
        pg = b.new_page(viewport={'width': 1400, 'height': 900}, device_scale_factor=1)
        logs = []
        pg.on('console', lambda m: logs.append(m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
        pg.on('pageerror', lambda e: logs.append('PAGEERROR: ' + str(e)))
        pg.goto('http://localhost:8765/' + os.environ.get('ARNES', 'harness.html') + '?ec=/node_modules/echarts/dist/echarts.min.js&specs=/ejemplos.json&ancho=%spx&cols=3' % ancho + ''.join('&%s=%s' % (k.lower(), os.environ[k]) for k in ('MODO', 'TEMA') if os.environ.get(k)))
        pg.wait_for_function('window.LISTO === true', timeout=60000)
        pg.wait_for_load_state('networkidle'); pg.evaluate('document.fonts.ready'); time.sleep(1.5)
        pg.add_style_tag(content='*{pointer-events:none!important}')  # sin hover al desplazar para capturar
        res = pg.evaluate('window.RESULT')
        for i, n in enumerate(nombres):
          pg.locator('#g%d' % i).screenshot(path='%s/%s/%s.png' % (carpeta, ancho, n), animations='disabled')
        resultados[ancho] = {'ejemplos': {n: {k: res[i][k] for k in ('ok', 'errores', 'avisos')} for i, n in enumerate(nombres)},
                             'echarts': res[-1].get('echarts'), 'consola': logs}
        pg.close()
      b.close()
  finally:
    srv.terminate()
  json.dump(resultados, open(carpeta + '/resultados.json', 'w'), ensure_ascii=False, indent=1)
  for ancho, r in resultados.items():
    mal = [n for n, x in r['ejemplos'].items() if not x['ok'] or x['avisos']]
    print('%s px: %d capturas, %d con errores o avisos %s, consola: %d' % (ancho, len(r['ejemplos']), len(mal), mal, len(r['consola'])))


def comparar(ref, nueva):
  from PIL import Image, ImageChops
  os.makedirs(nueva + '/diferencias', exist_ok=True)
  cambios = 0; total = 0
  for ancho in sorted(d for d in os.listdir(ref) if os.path.isdir(os.path.join(ref, d)) and d.isdigit()):
    for f in sorted(os.listdir(os.path.join(ref, ancho))):
      total += 1
      a = os.path.join(ref, ancho, f); b = os.path.join(nueva, ancho, f)
      if not os.path.exists(b): print('FALTA', ancho, f); cambios += 1; continue
      ia = Image.open(a).convert('RGB'); ib = Image.open(b).convert('RGB')
      if ia.size != ib.size: print('TAMAÑO', ancho, f, ia.size, '→', ib.size); cambios += 1; continue
      d = ImageChops.difference(ia, ib)
      caja = d.getbbox()
      if caja:
        n = sum(1 for px in d.getdata() if px != (0, 0, 0))
        print('CAMBIA', ancho, f, n, 'px en', caja); cambios += 1
        lienzo = Image.new('RGB', (ia.width * 3, ia.height), 'white')
        lienzo.paste(ia, (0, 0)); lienzo.paste(ib, (ia.width, 0)); lienzo.paste(d.point(lambda v: 255 if v else 0), (ia.width * 2, 0))
        lienzo.save(os.path.join(nueva, 'diferencias', '%s-%s' % (ancho, f)))
  print('capturas comparadas: %d, distintas: %d' % (total, cambios))


if __name__ == '__main__':
  if sys.argv[1] == 'capturar':
    capturar(sys.argv[2], sys.argv[3], (sys.argv[4] if len(sys.argv) > 4 else '400,330').split(','))
  elif sys.argv[1] == 'comparar':
    comparar(sys.argv[2], sys.argv[3])
