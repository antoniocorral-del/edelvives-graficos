#!/usr/bin/env python3
"""Prepara los contornos de los mapas del kit (dist/mapas/*.json, TopoJSON) desde la BDDAE del IGN/CNIG.

Genera espana-<mapa>.js (el que carga el kit) y espana-<mapa>.json (el mismo TopoJSON).

Uso (desde la raíz del repositorio, con mapshaper instalado: npm i -g mapshaper):
  python3 herramientas/mapas.py <carpeta con SHP_ETRS89 y SHP_WGS84>

Fuente: Base de Datos de Divisiones Administrativas de España (IGN/CNIG), recintos provinciales de la Península y Baleares
(ETRS89) y de Canarias (REGCAN95, compatible WGS84). Licencia CC-BY 4.0 (Orden FOM/2807/2015). Atribución de obra derivada que pide el CNIG para este producto:
«Obra derivada de BDLJE CC-BY 4.0 ign.es», con «ign.es» enlazado a https://www.ign.es/. Fichero usado: LINEAS_LIMITE.ZIP del 28/07/2026.

Qué hace:
- Proyección equirrectangular con paralelo estándar 40° N y meridiano −3,7°, en km (la repite el kit para situar lat/lon:
  x = R·cos 40°·(lon − lon0), y = R·lat, con R = 6378,137 km y ángulos en radianes).
- Canarias se traslada a un recuadro al suroeste de la Península, a la misma escala; el recuadro va en «edelvives.recuadro».
- Ceuta y Melilla se agrandan 3 veces alrededor de su centro para que se vean.
- Se quitan los «Territorios no asociados a ninguna provincia» y los islotes de menos de 4 km².
- Simplificación para dashboard (Visvalingam, intervalo de 1,2 km) y cuantización de TopoJSON.
- Comunidades por unión de provincias (bordes idénticos a los provinciales).
- Cada zona lleva «id» (código INE: provincias 01-52, comunidades 01-19) y un punto para rótulos y marcas (polo de
  inaccesibilidad), «px» y «py».
"""
import json, math, os, subprocess, sys, tempfile

R = 6378.137
# Atribución exigida por la licencia del IGN (fórmula de obra derivada del Centro de Descargas del CNIG).
# Si se descarga otro fichero, cambia la fecha de FUENTE.
ATRIBUCION = 'Obra derivada de BDLJE CC-BY 4.0 ign.es'
FUENTE = 'Obra derivada de BDLJE CC-BY 4.0 ign.es (https://www.ign.es/). Recintos provinciales de los Límites municipales, provinciales y autonómicos del IGN (LINEAS_LIMITE.ZIP, Centro de Descargas del CNIG, fichero del 28/07/2026), proyectados, simplificados y unidos en comunidades, con Canarias trasladada a un recuadro y Ceuta y Melilla agrandadas (herramientas/mapas.py del kit Edelvives Gráficos).'
LAT_TS, LON0 = 40.0, -3.7
PROJ = '+proj=eqc +lat_ts=40 +lon_0=-3.7 +x_0=0 +y_0=0 +R=6378137 +units=km +no_defs'

def x_de(lon): return R * math.cos(math.radians(LAT_TS)) * math.radians(lon - LON0)
def y_de(lat): return R * math.radians(lat)

def ms(*args):
    r = subprocess.run(['mapshaper'] + list(args), capture_output=True, text=True)
    if r.returncode != 0: sys.exit(r.stderr)
    return r.stderr

def main(origen, destino):
    pen = os.path.join(origen, 'SHP_ETRS89/recintos_provinciales_inspire_peninbal_etrs89/recintos_provinciales_inspire_peninbal_etrs89.shp')
    can = os.path.join(origen, 'SHP_WGS84/recintos_provinciales_inspire_canarias_wgs84/recintos_provinciales_inspire_canarias_wgs84.shp')
    tmp = tempfile.mkdtemp()
    campos = "id=NATCODE.slice(4,6), ca=NATCODE.slice(2,4)"
    # Canarias: caja de la misma escala con 14 km de margen, borde derecho en −5,7° y superior en 35,6°
    ms(can, '-proj', PROJ, '-info', 'save-to=' + tmp + '/i.json')
    b = json.load(open(tmp + '/i.json'))[0]['bbox']; m = 14
    dx = x_de(-5.7) - m - b[2]; dy = y_de(35.6) - m - b[3]
    recuadro = [b[0] + dx - m, b[1] + dy - m, b[2] + dx + m, b[3] + dy + m]
    ms(can, '-proj', PROJ, '-each', campos, '-affine', 'shift=%f,%f' % (dx * 1000, dy * 1000), '-o', tmp + '/can.shp')
    # Ceuta y Melilla: el ancla por defecto es el centro del conjunto seleccionado; se escalan por separado
    ms(pen, '-filter', 'NATCODE.slice(2,4) != "20"', '-proj', PROJ, '-each', campos,
       '-affine', 'where=id=="51"', 'scale=3', '-affine', 'where=id=="52"', 'scale=3', '-o', tmp + '/pen.shp', 'force')
    comun = ['-merge-layers', 'force', '-filter-islands', 'min-area=4km2', 'remove-empty',
             '-simplify', 'interval=1200', 'keep-shapes', '-clean']
    ms('-i', tmp + '/pen.shp', tmp + '/can.shp', 'combine-files', *comun, '-filter-fields', 'id,ca',
       '-rename-layers', 'provincias', '-o', tmp + '/prov.json', 'format=geojson')
    ms(tmp + '/prov.json', '-dissolve', 'ca', '-rename-fields', 'id=ca', '-rename-layers', 'comunidades', '-o', tmp + '/ccaa.json', 'format=geojson')
    os.makedirs(destino, exist_ok=True)
    for capa, f in (('provincias', 'prov'), ('comunidades', 'ccaa')):
        sal = os.path.join(destino, 'espana-' + capa + '.json')
        ms(tmp + '/' + f + '.json', '-rename-layers', capa, '-each', 'px=Math.round(this.innerX*10)/10, py=Math.round(this.innerY*10)/10',
           '-filter-fields', 'id,px,py', '-o', sal, 'format=topojson', 'quantization=20000')
        t = json.load(open(sal))
        t['edelvives'] = {
            'mapa': capa, 'unidades': 'km', 'proyeccion': {'tipo': 'equirrectangular', 'lat_ts': LAT_TS, 'lon0': LON0, 'R': R},
            'canarias': {'desplazamiento': [round(dx, 3), round(dy, 3)], 'latMax': 30.5},
            'recuadro': [round(v, 1) for v in recuadro],
            'fuente': FUENTE, 'atribucion': ATRIBUCION, 'enlace': 'https://www.ign.es/', 'licencia': 'CC-BY 4.0'
        }
        txt = json.dumps(t, separators=(',', ':'), ensure_ascii=False)
        open(sal, 'w').write(txt)
        # La misma cartografía como script: es lo que carga el kit (funciona donde solo se permiten scripts de jsDelivr,
        # como los artefactos publicados de Claude, y al abrir el HTML con doble clic); el .json queda para quien lo prefiera.
        js = sal[:-5] + '.js'
        open(js, 'w').write('/* Contornos de España por %s · %s (https://www.ign.es/) · kit Edelvives Gráficos */\n'
                            '(window.EdelvivesGraficosMapas = window.EdelvivesGraficosMapas || {})[%s] = %s;\n' % (capa, ATRIBUCION, json.dumps(capa), txt))
        print(sal, os.path.getsize(sal), 'bytes,', len(t['objects'][capa]['geometries']), 'zonas; también', os.path.basename(js))

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '.', sys.argv[2] if len(sys.argv) > 2 else 'dist/mapas')
