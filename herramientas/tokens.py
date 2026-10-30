"""Traductor de tokens: del sistema de diseño de Edelvives al kit de gráficos.

Lee sistema/tokens-sistema-diseno.json (fuente de verdad) y herramientas/tokens-graficos.json (lo propio de los
gráficos, que solo nombra tokens del sistema) y escribe:
  - tokens.json (W3C DTCG, con el CMYK en $extensions.com.edelvives),
  - el bloque entre /* <tokens:generado> */ y /* </tokens:generado> */ de dist/edelvives-graficos.js.

Uso (desde la raíz del repositorio):
  python3 herramientas/tokens.py               escribe los dos archivos
  python3 herramientas/tokens.py --comprobar   falla si no coinciden con lo que se genera
  python3 herramientas/tokens.py --recalcular  vuelve a calcular los CMYK provisionales (Pillow y el perfil CoatedFOGRA39)

Los CMYK provisionales (tonos sin CMYK en el sistema) se guardan en herramientas/cmyk-provisional.json, para que
la generación no dependa del perfil de color.
"""
import json, os, re, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SISTEMA = os.path.join(RAIZ, 'sistema', 'tokens-sistema-diseno.json')
GRAFICOS = os.path.join(RAIZ, 'herramientas', 'tokens-graficos.json')
PROVISIONAL = os.path.join(RAIZ, 'herramientas', 'cmyk-provisional.json')
TOKENS = os.path.join(RAIZ, 'tokens.json')
SCRIPT = os.path.join(RAIZ, 'dist', 'edelvives-graficos.js')
PERFIL = '/Library/Application Support/Adobe/Color/Profiles/Recommended/CoatedFOGRA39.icc'

# Tonos sin CMYK en el sistema que el kit necesita en impresión: CMYK calculado y marcado como provisional
PROVISIONALES = ['naranja-700', 'neutro-400', 'neutro-600', 'neutro-700']
# Solo pantalla: nunca entran en impresión (naranja-300 por decisión del encargo; neutro-300 tiene su versión -doc;
# los colores de estado de interfaz y el anillo de foco son de interfaz)
SOLO_PANTALLA = re.compile(r'^(naranja-300|neutro-300|azul-focus|(verde|amarillo|rojo)-(light|base|dark))$')
INICIO, FIN = '  /* <tokens:generado> */\n', '  /* </tokens:generado> */\n'


class ErrorTokens(Exception):
  pass


def camel(nombre):
  """naranja-500 → naranja500; neutro-300-doc → neutro300Doc; verde-dark → verdeDark; pres-texto-2 → texto2"""
  partes = nombre.split('-')
  out = partes[0]
  for p in partes[1:]:
    out += p if p.isdigit() else p[0].upper() + p[1:]
  return out


def leer_sistema():
  s = json.load(open(SISTEMA, encoding='utf-8'))
  prim, pres = {}, {'blanco': {}, 'negro': {}}
  refs = {}
  for t in s['color']['tokens']:
    n, v, uso = t['name'], t['value'], t.get('usage', '')
    if n.startswith('pres-'):
      refs[n] = v
      continue
    m = re.search(r'CMYK (\d+)/(\d+)/(\d+)/(\d+)', uso)
    prim[n] = {'hex': v.upper(), 'cmyk': [int(x) for x in m.groups()] if m else None, 'uso': uso}
  # Colores de presentación por tema; las referencias {x} apuntan a primitivos o a otros pres-*
  def resolver(v, tema):
    if isinstance(v, dict): return v[tema].upper()
    m = re.fullmatch(r'\{([a-z0-9-]+)\}', v)
    if not m: return v.upper()
    r = m.group(1)
    if r in prim: return prim[r]['hex']
    if r in refs: return resolver(refs[r], tema)
    raise ErrorTokens('referencia desconocida en el sistema: ' + v)
  for n, v in refs.items():
    for tema in pres:
      pres[tema][camel(n[5:])] = resolver(v, tema)
  estilos = {e['name']: e for g in s['type']['groups'] for e in g['styles']}
  familias = s['type']['families']
  nombres = {}
  for f in s['type']['fonts']:
    nombres.setdefault(f['family'].split()[0].lower(), f['family'])
  return s, prim, pres, estilos, familias, nombres


def cmyk_provisionales(prim, recalcular):
  if recalcular:
    from PIL import Image, ImageCms
    srgb = ImageCms.createProfile('sRGB')
    fogra = ImageCms.getOpenProfile(PERFIL)
    t = ImageCms.buildTransform(srgb, fogra, 'RGB', 'CMYK', renderingIntent=ImageCms.Intent.RELATIVE_COLORIMETRIC,
                                flags=ImageCms.Flags.BLACKPOINTCOMPENSATION)
    valores = {}
    for n in PROVISIONALES:
      c = ImageCms.applyTransform(Image.new('RGB', (1, 1), prim[n]['hex']), t).getpixel((0, 0))
      valores[n] = {'hex': prim[n]['hex'], 'cmyk': [round(x * 100 / 255) for x in c]}
    datos = {'$description': 'CMYK provisionales: tonos que el kit usa en impresión y el sistema de diseño no define en CMYK. '
                             'Calculados por herramientas/tokens.py --recalcular; se sustituyen en cuanto el sistema les dé valor.',
             'metodo': 'sRGB → CoatedFOGRA39 (ICC), intento colorimétrico relativo con compensación de punto negro, redondeo al entero',
             'perfil': os.path.basename(PERFIL), 'valores': valores}
    json.dump(datos, open(PROVISIONAL, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    open(PROVISIONAL, 'a').write('\n')
  datos = json.load(open(PROVISIONAL, encoding='utf-8'))
  for n in PROVISIONALES:
    v = datos['valores'].get(n)
    if not v: raise ErrorTokens('falta el CMYK provisional de ' + n + ' (python3 herramientas/tokens.py --recalcular)')
    if v['hex'] != prim[n]['hex']:
      raise ErrorTokens('el hexadecimal de %s cambió en el sistema (%s → %s): recalcula con --recalcular' % (n, v['hex'], prim[n]['hex']))
  return {n: datos['valores'][n]['cmyk'] for n in PROVISIONALES}


def primitivos(prim, prov):
  out = {}
  for n, p in prim.items():
    solo = bool(SOLO_PANTALLA.match(n))
    if n in PROVISIONALES:
      if p['cmyk']: raise ErrorTokens(n + ' ya tiene CMYK en el sistema: quítalo de PROVISIONALES')
      cmyk, provisional = prov[n], True
    else:
      cmyk, provisional = p['cmyk'], False
    if not solo and cmyk is None:
      raise ErrorTokens(n + ' no tiene CMYK en el sistema ni es provisional ni de solo pantalla')
    out[n] = {'hex': p['hex'], 'cmyk': None if solo else cmyk, 'provisional': provisional, 'soloPantalla': solo, 'uso': p['uso']}
  return out


def estilo_texto(estilos, nombre, modo):
  e = estilos[nombre]
  tam, alto = float(e['fontSize'].rstrip('px')), float(e['lineHeight'].rstrip('px'))
  if modo == 'impresion': tam, alto = tam * 0.75, alto * 0.75  # el sistema da los documentos en px a 96 ppp; el kit mide en pt
  limpio = lambda x: int(round(x)) if abs(x - round(x)) < 0.02 else round(x, 2)
  return {'familia': e['family'], 'tam': limpio(tam), 'alto': limpio(alto), 'peso': int(e['fontWeight']), 'estilo': nombre}


def comprobar_refs(o, prim, ruta=''):
  if isinstance(o, dict):
    for k, v in o.items(): comprobar_refs(v, prim, ruta + '.' + k)
  elif isinstance(o, list):
    for v in o: comprobar_refs(v, prim, ruta)
  elif isinstance(o, str):
    for r in re.findall(r'\{([a-z0-9-]+)\}', o):
      if r not in prim: raise ErrorTokens('tokens-graficos.json%s nombra {%s}, que no está en el sistema' % (ruta, r))


def construir():
  s, prim0, pres, estilos, familias_sis, nombres_fam = leer_sistema()
  g = json.load(open(GRAFICOS, encoding='utf-8'))
  comprobar_refs({k: v for k, v in g.items() if k not in ('texto', 'familias', 'modos', 'semanticos')}, prim0)
  comprobar_refs(g['semanticos']['impresion'], prim0, '.semanticos.impresion')
  comprobar_refs(g['semanticos']['presentacion'], dict(prim0, **{'pres-' + re.sub('([A-Z0-9])', lambda m: '-' + m.group(1).lower(), k): 1 for k in pres['blanco']}), '.semanticos.presentacion')
  recalcular = '--recalcular' in sys.argv
  prim = primitivos(prim0, cmyk_provisionales(prim0, recalcular))

  # Familias: el nombre del sistema delante de las de reserva del kit
  reserva = g['familias']['reserva']
  familias = {'titillium': "'%s', %s" % (nombres_fam['titillium'], reserva),
              'barlow': "%s, '%s', %s" % (nombres_fam['barlow'], nombres_fam['titillium'], reserva)}
  # Roles tipográficos por modo y k
  texto = {'web': g['texto']['web']}
  for modo in ('presentacion', 'impresion'):
    texto[modo] = {r: estilo_texto(estilos, n, modo) for r, n in g['texto'][modo].items()}
  modos = {}
  for modo in ('web', 'presentacion', 'impresion'):
    m = dict(g['modos'][modo])
    for clave in ('sustituir', 'sustituirProvisional'):
      if clave not in m: continue
      for de, a in m[clave].items():
        if de not in prim or a not in prim: raise ErrorTokens('modos.%s.%s: %s → %s no son tokens del sistema' % (modo, clave, de, a))
        if modo == 'impresion' and (prim[a]['cmyk'] is None or prim[a]['provisional']):
          raise ErrorTokens('modos.impresion.%s: %s no tiene CMYK del sistema' % (clave, a))
      m[clave] = {camel(de): camel(a) for de, a in m[clave].items()}
    m['k'] = [texto[modo]['eje']['tam'], texto['web']['eje']['tam']]  # k = eje del modo ÷ eje de web
    m['texto'] = texto[modo]
    modos[modo] = m

  # Roles de color del script (T) desde «grafico»: series-1, series-2… forman la lista «series»
  def nombre_ref(v):
    m = re.fullmatch(r'\{([a-z0-9-]+)\}', v)
    if not m: raise ErrorTokens('se esperaba una referencia: ' + v)
    return camel(m.group(1))
  sem = {}
  for k, v in g['grafico'].items():
    if k.startswith('$'): continue
    m = re.fullmatch(r'(.+)-(\d+)', k)
    if m:
      sem.setdefault(camel(m.group(1)), []).append((int(m.group(2)), nombre_ref(v['$value'])))
    else:
      sem[camel(k)] = nombre_ref(v['$value'])
  sem = {k: [x for _, x in sorted(v)] if isinstance(v, list) else v for k, v in sem.items()}
  # Estados (chips y barras): estados.<clave>.{fondo, texto, barra}
  sem['estados'] = {k: {p: nombre_ref(x['$value']) for p, x in v.items() if not p.startswith('$')} for k, v in g['estados'].items() if not k.startswith('$')}
  modos['web']['semanticos'] = sem
  # Fuera de web, solo los roles que cambian; {pres-x} pasa a 'pres.x' (el color del tema)
  def nombre_modo(v):
    if isinstance(v, list): return [nombre_modo(x) for x in v]
    if isinstance(v, dict): return {k: nombre_modo(x) for k, x in v.items()}
    m = re.fullmatch(r'\{pres-([a-z0-9-]+)\}', v)
    return 'pres.' + camel(m.group(1)) if m else nombre_ref(v)
  for modo in ('presentacion', 'impresion'):
    modos[modo]['semanticos'] = {camel(k): nombre_modo(v) for k, v in g['semanticos'][modo].items() if not k.startswith('$')}
    if modo == 'impresion':
      for k, v in modos[modo]['semanticos'].items():
        for n in (v if isinstance(v, list) else ([y for x in v.values() for y in (x.values() if isinstance(x, dict) else [x])] if isinstance(v, dict) else [v])):
          q = [x for x in prim if camel(x) == n][0]
          if prim[q]['cmyk'] is None or prim[q]['provisional']: raise ErrorTokens('semanticos.impresion.%s usa %s, sin CMYK del sistema' % (k, q))
  return s, g, prim, pres, familias, modos


def js(v, sangria=4):
  """JSON en estilo del script: comillas simples, claves sin comillas, objetos de primer nivel en una línea"""
  if isinstance(v, dict):
    return '{ ' + ', '.join(('%s: %s' % (k if re.fullmatch(r'[A-Za-z_]\w*', k) else "'%s'" % k, js(x))) for k, x in v.items()) + ' }'
  if isinstance(v, list): return '[' + ', '.join(js(x) for x in v) + ']'
  if isinstance(v, str): return "'" + v.replace('\\', '\\\\').replace("'", "\\'") + "'" if "'" not in v else '"' + v + '"'
  if isinstance(v, bool): return 'true' if v else 'false'
  if v is None: return 'null'
  return repr(v)


def bloque(s, prim, pres, familias, modos):
  L = []
  L.append(INICIO.rstrip('\n'))
  L.append('  /* Generado por herramientas/tokens.py desde el sistema de diseño de Edelvives (%s, versión %s).' % (s['meta']['source'].split(' (')[0].rstrip('.'), s['version']))
  L.append('     No editar a mano entre los marcadores: python3 herramientas/tokens.py */')
  L.append('  var PRIMITIVOS = {')
  claves = list(prim)
  filas = [claves[i:i + 4] for i in range(0, len(claves), 4)]
  L.append(',\n'.join('    ' + ', '.join('%s: %s' % (camel(n), js(prim[n]['hex'])) for n in f) for f in filas))
  L.append('  };')
  L.append('  /* CMYK FOGRA39 de los tonos de impresión (los provisionales, calculados; ver PROVISIONALES) */')
  imp = [n for n in claves if prim[n]['cmyk'] is not None]
  filas = [imp[i:i + 4] for i in range(0, len(imp), 4)]
  L.append('  var CMYK = {')
  L.append(',\n'.join('    ' + ', '.join('%s: %s' % (camel(n), js(prim[n]['cmyk'])) for n in f) for f in filas))
  L.append('  };')
  L.append('  var PROVISIONALES = %s;' % js([camel(n) for n in claves if prim[n]['provisional']]))
  L.append('  var SOLO_PANTALLA = %s;' % js([camel(n) for n in claves if prim[n]['soloPantalla']]))
  L.append('  /* Colores de presentación por tema (pres-*) */')
  L.append('  var PRES = {')
  L.append(',\n'.join('    %s: %s' % (t, js(v)) for t, v in pres.items()))
  L.append('  };')
  L.append('  var FAMILIAS = {')
  L.append(',\n'.join('    %s: %s' % (k, js(v)) for k, v in familias.items()))
  L.append('  };')
  L.append('  /* Por modo: k (unidades de salida por px lógico, como fracción), unidad, sustituciones de tonos, roles tipográficos en')
  L.append('     unidades de salida y roles de color con el nombre del primitivo (fuera de web, solo los que cambian; \'pres.x\': color del tema) */')
  L.append('  var MODOS = {')
  bloques = []
  for modo, m in modos.items():
    b = ['    %s: {' % modo]
    b.append('      k: %s / %s, unidad: %s%s,' % (m['k'][0], m['k'][1], js(m['unidad']), (', temas: ' + js(m['temas'])) if 'temas' in m else ''))
    extra = [x for x in m if x not in ('k', 'unidad', 'temas', 'texto', 'semanticos') and not x.startswith('$')]
    for x in extra: b.append('      %s: %s,' % (x, js(m[x])))
    b.append('      texto: {')
    b.append(',\n'.join('        %s: %s' % (r, js(v)) for r, v in m['texto'].items()))
    b.append('      }' + (',' if 'semanticos' in m else ''))
    if 'semanticos' in m:
      b.append('      semanticos: {')
      b.append(',\n'.join('        %s: %s' % (k, js(v)) for k, v in m['semanticos'].items()))
      b.append('      }')
    b.append('    }')
    bloques.append('\n'.join(b))
  L.append(',\n'.join(bloques))
  L.append('  };')
  L.append(FIN.rstrip('\n'))
  return '\n'.join(L) + '\n'


def tokens_json(s, g, prim, pres, familias, modos):
  def color(n):
    p = prim[n]
    ext = {}
    if p['cmyk'] is not None: ext['cmyk'] = p['cmyk']
    if p['provisional']: ext['provisional'] = True
    if p['soloPantalla']: ext['soloPantalla'] = True
    return {'$type': 'color', '$value': p['hex'], '$description': p['uso'], '$extensions': {'com.edelvives': ext}}
  def refs(o):
    if isinstance(o, dict): return {k: refs(v) for k, v in o.items()}
    if isinstance(o, list): return [refs(x) for x in o]
    if isinstance(o, str): return re.sub(r'\{([a-z0-9-]+)\}', r'{primitivos.\1}', o)
    return o
  out = {
    '$description': 'Tokens del kit de gráficos Edelvives, generados por herramientas/tokens.py desde el sistema de diseño (%s, versión %s) '
                    'y herramientas/tokens-graficos.json. No editar a mano. CMYK FOGRA39 en $extensions.com.edelvives.cmyk; '
                    '«provisional»: calculado con el perfil (el sistema no lo define); «soloPantalla»: nunca en impresión.'
                    % (s['meta']['source'].split(' (')[0].rstrip('.'), s['version']),
    'primitivos': {n: color(n) for n in prim},
    'presentacion': {t: {k: {'$type': 'color', '$value': v} for k, v in c.items()} for t, c in pres.items()},
    'grafico': refs(g['grafico']), 'estados': refs(g['estados']), 'mapa': refs(g['mapa']), 'contraste': refs(g['contraste']),
    'tipografia': {
      'familias': {k: {'$type': 'fontFamily', '$value': v} for k, v in familias.items()},
      'roles': {modo: {r: {'$type': 'typography', '$value': {'fontFamily': '{tipografia.familias.%s}' % x['familia'], 'fontWeight': x['peso'],
                                                              'fontSize': '%s%s' % (x['tam'], m['unidad']), 'lineHeight': '%s%s' % (x['alto'], m['unidad'])},
                               **({'$description': 'Estilo del sistema: ' + x['estilo']} if 'estilo' in x else {})}
                           for r, x in m['texto'].items()} for modo, m in modos.items()}},
    'modos': {modo: {k: v for k, v in m.items() if k not in ('texto', 'semanticos')} for modo, m in modos.items()},
    'semanticos': refs(g['semanticos']),
  }
  return json.dumps(out, ensure_ascii=False, indent=2) + '\n'


def main():
  try:
    s, g, prim, pres, familias, modos = construir()
  except ErrorTokens as e:
    sys.exit('tokens.py: ' + str(e))
  nuevo_json = tokens_json(s, g, prim, pres, familias, modos)
  script = open(SCRIPT, encoding='utf-8').read()
  if script.count(INICIO) != 1 or script.count(FIN) != 1: sys.exit('tokens.py: no encuentro los marcadores en ' + SCRIPT)
  a, b = script.index(INICIO), script.index(FIN) + len(FIN)
  nuevo_script = script[:a] + bloque(s, prim, pres, familias, modos) + script[b:]
  if '--comprobar' in sys.argv:
    mal = []
    if open(TOKENS, encoding='utf-8').read() != nuevo_json: mal.append('tokens.json')
    if script != nuevo_script: mal.append('el bloque de tokens de dist/edelvives-graficos.js')
    if mal: sys.exit('tokens.py --comprobar: no coinciden con el sistema: ' + ' y '.join(mal) + ' (python3 herramientas/tokens.py)')
    print('tokens.py --comprobar: tokens.json y el script coinciden con el sistema (%d primitivos, %d con CMYK, %d provisionales)'
          % (len(prim), sum(1 for p in prim.values() if p['cmyk'] is not None), sum(1 for p in prim.values() if p['provisional'])))
    return
  open(TOKENS, 'w', encoding='utf-8').write(nuevo_json)
  open(SCRIPT, 'w', encoding='utf-8').write(nuevo_script)
  print('tokens.py: escritos tokens.json y el bloque del script (%d primitivos)' % len(prim))


if __name__ == '__main__':
  main()
