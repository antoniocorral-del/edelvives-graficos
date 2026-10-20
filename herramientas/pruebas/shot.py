import sys, json, subprocess, time, os
from playwright.sync_api import sync_playwright
kit, ec, specs, out = sys.argv[1:5]
os.chdir('/home/claude/test')
import shutil; shutil.copy(kit, 'kit.js')
srv = subprocess.Popen(['python3','-m','http.server','8765'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(0.6)
try:
  with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width':1400,'height':900}, device_scale_factor=1)
    logs = []
    pg.on('console', lambda m: logs.append(m.type + ': ' + m.text) if m.type in ('error','warning') else None)
    pg.on('pageerror', lambda e: logs.append('PAGEERROR: ' + str(e)))
    pg.goto(f'http://localhost:8765/harness.html?ec={ec}&specs={specs}' + (sys.argv[5] if len(sys.argv) > 5 else ''))
    pg.wait_for_function('window.LISTO === true', timeout=20000)
    print(json.dumps(pg.evaluate('window.RESULT'), ensure_ascii=False))
    for l in logs: print(l)
    pg.screenshot(path=out, full_page=True)
    b.close()
finally:
  srv.terminate()
