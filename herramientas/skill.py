"""Genera la skill de Claude «graficos-edelvives» para la versión de package.json y la empaqueta en un .zip.

Uso (desde la raíz del repositorio): python3 herramientas/skill.py
Escribe herramientas/skill/graficos-edelvives/ y herramientas/skill/graficos-edelvives-<versión>.zip (fuera de git):
  SKILL.md         herramientas/skill.md con la versión y, de DESIGN.md, la tabla de selección, los campos comunes y las reglas
  referencias/     copia de referencias/
  assets/          dist/edelvives-graficos.js y tokens.json (para el validador y para EG.pptx en Node)
  scripts/         validar.js (herramientas/skill-validar.js)
No publica nada: la skill se sube a mano después de publicar el paquete en npm.
"""
import json, os, re, shutil, zipfile

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VERSION = json.load(open(os.path.join(RAIZ, 'package.json')))['version']
CORTA = '.'.join(VERSION.split('.')[:2])
SALIDA = os.path.join(RAIZ, 'herramientas', 'skill')
CARPETA = os.path.join(SALIDA, 'graficos-edelvives')


def seccion(md, titulo):
  """Cuerpo de la sección «## n. <titulo>…» de DESIGN.md, sin el encabezado"""
  m = re.search(r'^## \d+\. ' + re.escape(titulo) + r'[^\n]*\n(.*?)(?=^## |\Z)', md, re.S | re.M)
  if not m: raise SystemExit('skill.py: no encuentro la sección «%s» en DESIGN.md' % titulo)
  return m.group(1).strip()


design = open(os.path.join(RAIZ, 'DESIGN.md'), encoding='utf-8').read()
if ('@%s/' % VERSION) not in design: raise SystemExit('skill.py: DESIGN.md no apunta a la versión %s' % VERSION)
eleccion = seccion(design, 'Elige el componente')
tabla = '\n'.join(l for l in eleccion.splitlines() if l.startswith('|'))
plantilla = open(os.path.join(RAIZ, 'herramientas', 'skill.md'), encoding='utf-8').read()
skill = (plantilla.replace('{{VERSION}}', VERSION).replace('{{CORTA}}', CORTA).replace('{{TABLA}}', tabla)
         .replace('{{CAMPOS}}', seccion(design, 'Campos comunes')).replace('{{REGLAS}}', seccion(design, 'Reglas')))
if '{{' in skill: raise SystemExit('skill.py: queda un marcador sin rellenar en SKILL.md')
desc = re.search(r'^description: "(.*)"$', skill, re.M).group(1)
if len(desc) > 1024: raise SystemExit('skill.py: la descripción tiene %d caracteres (máximo 1024)' % len(desc))

shutil.rmtree(CARPETA, ignore_errors=True)
for d in ('referencias', 'assets', 'scripts'): os.makedirs(os.path.join(CARPETA, d))
open(os.path.join(CARPETA, 'SKILL.md'), 'w', encoding='utf-8').write(skill)
for f in sorted(os.listdir(os.path.join(RAIZ, 'referencias'))):
  shutil.copy(os.path.join(RAIZ, 'referencias', f), os.path.join(CARPETA, 'referencias', f))
shutil.copy(os.path.join(RAIZ, 'dist', 'edelvives-graficos.js'), os.path.join(CARPETA, 'assets'))
shutil.copy(os.path.join(RAIZ, 'tokens.json'), os.path.join(CARPETA, 'assets'))
shutil.copy(os.path.join(RAIZ, 'herramientas', 'skill-validar.js'), os.path.join(CARPETA, 'scripts', 'validar.js'))

zip_ruta = os.path.join(SALIDA, 'graficos-edelvives-%s.zip' % VERSION)
if os.path.exists(zip_ruta): os.remove(zip_ruta)
with zipfile.ZipFile(zip_ruta, 'w', zipfile.ZIP_DEFLATED) as z:
  for raiz, _, archivos in os.walk(CARPETA):
    for f in sorted(archivos):
      ruta = os.path.join(raiz, f)
      z.write(ruta, os.path.relpath(ruta, SALIDA))
n = sum(len(a) for _, _, a in os.walk(CARPETA))
print('skill graficos-edelvives %s: %d archivos, descripción de %d caracteres → %s' % (VERSION, n, len(desc), os.path.relpath(zip_ruta, RAIZ)))
