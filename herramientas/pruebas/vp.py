"""Abre vp/index.html (la vista previa con el kit local) en los cuatro modos y cuenta tarjetas y errores.
Uso: python3 vp.py [modo ...]   (por defecto: web, presentacion-blanco, presentacion-negro e impresion)"""
import subprocess, time, sys
from playwright.sync_api import sync_playwright
modos = sys.argv[1:] or ['web', 'presentacion-blanco', 'presentacion-negro', 'impresion']
srv = subprocess.Popen(['python3','-m','http.server','8766'], cwd='/home/claude/test/vp', stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(0.6)
try:
  with sync_playwright() as p:
    b = p.chromium.launch()
    for m in modos:
      pg = b.new_page(viewport={'width':1280,'height':900})
      errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
      pg.goto('http://localhost:8766/index.html?modo=' + m); time.sleep(4)
      print(m.ljust(20), 'tarjetas:', pg.locator('.eg-tarjeta').count(), 'errores visibles:', pg.locator('.eg-error').count(), 'errores de página:', errs)
      pg.screenshot(path='/home/claude/test/vp-%s.png' % m, full_page=False)
      pg.close()
    b.close()
finally: srv.terminate()
