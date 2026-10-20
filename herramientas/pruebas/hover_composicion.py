import subprocess, time, os, shutil
from playwright.sync_api import sync_playwright
os.chdir('/home/claude/test'); shutil.copy('/home/claude/kit/dist/edelvives-graficos.js', 'kit.js')
import json
# comp.json: los ejemplos de Composición, con el marimekko al final (índice 8)
COMP = ['sectores-pie', 'sectores-donut', 'sectores-semidonut', 'treemap', 'proporcion-waffle', 'proporcion-barra', 'proporcion-cuota', 'proporcion-participacion', 'marimekko']
json.dump([json.load(open('/home/claude/kit/ejemplos/%s.json' % n)) for n in COMP], open('comp.json', 'w'), ensure_ascii=False)
srv = subprocess.Popen(['python3','-m','http.server','8765'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(0.6)
try:
 with sync_playwright() as p:
   b = p.chromium.launch(); pg = b.new_page(viewport={'width':1400,'height':2600})
   errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
   pg.goto('http://localhost:8765/harness.html?ec=/node_modules/echarts/dist/echarts.min.js&specs=/comp.json&ancho=400px&cols=3')
   pg.wait_for_function('window.LISTO === true', timeout=20000)
   # (índice, fracción x, fracción y dentro del lienzo)
   for i,fx,fy in [(0,0.85,0.4),(1,0.8,0.4),(2,0.15,0.7),(3,0.2,0.3),(3,0.9,0.85),(8,0.3,0.8),(8,0.97,0.3)]:
     r = pg.evaluate(f"(() => {{ const r=document.querySelector('#g{i} .eg-lienzo').getBoundingClientRect(); return [r.x,r.y,r.width,r.height]; }})()")
     pg.mouse.move(r[0]+r[2]*fx, r[1]+r[3]*fy); time.sleep(0.4)
     t = pg.evaluate(f"(() => {{ const d = [...document.querySelectorAll('#g{i} div')].find(x => x.style && x.style.zIndex === '9999999' && x.style.display !== 'none' && x.textContent); return d ? d.innerText.replace(/\\n/g,' | ') : ''; }})()")
     print(i, '→', t[:140])
   print('errores:', errs)
   b.close()
finally: srv.terminate()
