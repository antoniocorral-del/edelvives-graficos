import subprocess, time
from playwright.sync_api import sync_playwright
srv = subprocess.Popen(['python3','-m','http.server','8766'], cwd='/home/claude/test/vp', stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(0.6)
try:
  with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width':1280,'height':900})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.type+': '+m.text) if m.type in ('error','warning') else None)
    pg.goto('http://localhost:8766/index.html'); time.sleep(3)
    print('tarjetas:', pg.locator('.eg-tarjeta').count(), 'errores visibles:', pg.locator('.eg-error').count(), 'consola:', errs)
    pg.screenshot(path='/home/claude/test/vp.png', full_page=True)
    b.close()
finally: srv.terminate()
