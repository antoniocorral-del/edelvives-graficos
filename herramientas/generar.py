"""Genera esquema.json y vista-previa.html a partir de las definiciones de abajo y de la carpeta ejemplos/.
Uso: python3 herramientas/generar.py (desde la raíz del repositorio). No forma parte del paquete npm."""
import json, html, os

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VERSION = json.load(open(os.path.join(RAIZ, 'package.json')))['version']
corto = '.'.join(VERSION.split('.')[:2])

# ---------------------------------------------------------------- esquema
TXT = {"type": "string", "minLength": 1}
NUM = {"type": "number"}
POS = {"type": "number", "minimum": 0}
LNUM = {"type": "array", "items": NUM, "minItems": 1}
LTXT = lambda mx: {"type": "array", "items": TXT, "minItems": 1, "maxItems": mx}
COMUNES = {"titulo": TXT, "unidad": TXT, "periodo": TXT, "subtitulo": TXT, "nota": TXT,
           "decimales": {"type": "integer", "minimum": 0, "maximum": 3}, "abreviar": {"type": "boolean"}, "medio": {"enum": ["web"]}}
SERIE = {"type": "object", "required": ["nombre", "valores"], "additionalProperties": False,
         "properties": {"nombre": TXT, "valores": LNUM, "rol": {"enum": ["actual", "anterior", "prevision"]}}}
def series(mn, mx): return {"type": "array", "items": SERIE, "minItems": mn, "maxItems": mx}
def datos(props, req=None): return {"type": "object", "properties": props, "additionalProperties": False, **({"required": req} if req else {})}
ORDEN = {"enum": ["valor", "natural"]}
ESTADOS = ["entregado", "en-proceso", "incidencia", "pendiente", "en-objetivo", "en-riesgo", "fuera"]
UMBRALES = {"type": "object", "additionalProperties": False, "properties": {"objetivo": NUM, "riesgo": NUM}}
def INDICADORES(mx, conEstado):
    props = {"nombre": TXT, "valor": NUM, "unidad": TXT}
    if conEstado: props.update({"estado": {"enum": ["en-objetivo", "en-riesgo", "fuera"]}, "texto": TXT})
    else: props.update({"objetivo": NUM, "sentidoPositivo": {"enum": ["subir", "bajar"]}})
    return {"type": "array", "minItems": 1, "maxItems": mx, "items": {"type": "object", "additionalProperties": False,
            "required": ["nombre", "valor"] + (["estado"] if conEstado else ["objetivo"]), "properties": props}}
def CATEGORIAS_O_PERIODOS(d): d["anyOf"] = [{"required": ["categorias"]}, {"required": ["periodos"]}]; return d
EXTREMO = {"oneOf": [NUM, {"type": "object", "additionalProperties": False, "properties": {"etiqueta": TXT, "valor": NUM}}]}
def OBJ(props, req): return {"type": "object", "additionalProperties": False, "required": req, "properties": props}
SIN_UNIDAD = ["tabla", "kpi-rejilla", "matriz", "dispersion", "etapas", "cronologia", "gantt", "calendario", "ciclo-vida", "arbol", "anidados", "red", "mapa"]
# dispersion: la unidad común o la de cada eje; etapas: solo el pipeline con valores; matriz: solo la exigen las cohortes; calendario: solo el de calor
# (lo comprueba EG.validar)
# Distribución
CRUDOS = lambda mn: {"type": "array", "items": NUM, "minItems": mn}
CASOS = TXT  # nombreCasos: qué es cada caso, en plural
def MARCA(*v): return {"enum": list(v)}
RESUMEN = OBJ({"minimo": NUM, "q1": NUM, "mediana": NUM, "q3": NUM, "maximo": NUM, "atipicos": {"type": "array", "items": NUM}}, ["minimo", "q1", "mediana", "q3", "maximo"])
def GRUPOS(mx, resumen):
    props = {"nombre": TXT, "valores": CRUDOS(3)}
    if resumen: props["resumen"] = RESUMEN
    item = {"type": "object", "additionalProperties": False, "required": ["nombre"], "properties": props}
    item["oneOf" if resumen else "allOf"] = [{"required": ["valores"]}, {"required": ["resumen"]}] if resumen else [{"required": ["valores"]}]
    return {"type": "array", "minItems": 1, "maxItems": mx, "items": item}

# Relación y correlación
EJE = {"oneOf": [TXT, OBJ({"nombre": TXT, "unidad": TXT}, ["nombre"])]}
NOMBRES = {"type": "array", "items": {"oneOf": [TXT, NUM]}, "minItems": 1}
LISTA = lambda mn, mx, item: {"type": "array", "items": item, "minItems": mn, "maxItems": mx}
GRUPO_DISPERSION = OBJ({"nombre": TXT, "x": LNUM, "y": LNUM, "tamanos": {"type": "array", "items": POS, "minItems": 1}, "nombres": NOMBRES}, ["nombre", "x", "y"])

# Procesos y conversión
NOMBRES_EMBUDO = lambda mx: {"type": "array", "items": {"oneOf": [TXT, NUM]}, "minItems": 2, "maxItems": mx}
CASO_PIPELINE = OBJ({"nombre": {"oneOf": [TXT, NUM]}, "etapa": TXT, "valor": POS}, ["nombre", "etapa"])
PASO = {"oneOf": [TXT, OBJ({"nombre": TXT, "alternativa": TXT, "si": TXT, "no": TXT, "detalle": TXT}, ["nombre"])]}

# Temporal especializado
FECHA = {"type": "string", "pattern": "^\\d{4}-\\d{2}(-\\d{2})?$", "description": "Un día \"AAAA-MM-DD\" o un mes \"AAAA-MM\"."}
DIA = {"type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$"}
HOY = {"oneOf": [DIA, {"const": True}], "description": "Una fecha o true (el día de hoy)."}
EVENTO = OBJ({"nombre": TXT, "fecha": TXT, "inicio": FECHA, "fin": FECHA, "carril": TXT, "descripcion": TXT}, ["nombre"])
RESUMEN_T = {"enum": ["total", "media"]}

# Jerarquía: árbol anidado (recursivo, en $defs) o filas planas con un nombre por nivel y, si hace falta, el valor al final
NODO = {"$ref": "#/$defs/nodoJerarquia"}
DEF_NODO = {"oneOf": [TXT, OBJ({"nombre": {"oneOf": [TXT, NUM]}, "valor": POS, "altura": POS, "hijos": {"type": "array", "items": NODO}}, ["nombre"])],
            "description": "Un elemento { nombre, valor, hijos } (valor solo en los elementos finales; altura, en las uniones del dendrograma) o, sin valores, solo su nombre."}
FILA_J = {"type": "array", "minItems": 1, "items": {"oneOf": [TXT, NUM, {"type": "null"}]}, "description": "Los nombres de cada nivel, del más general al más concreto, y el valor al final si el tipo lo necesita."}
PROPS_J = {"arbol": {"oneOf": [NODO, {"type": "array", "items": NODO, "minItems": 1}]}, "filas": {"type": "array", "items": FILA_J, "minItems": 1, "maxItems": 300},
           "raiz": TXT, "niveles": LTXT(5)}
def DATOS_J(extra=None, otras=None):
    props = dict(PROPS_J); props.update(extra or {})
    d = datos(props); d["anyOf"] = [{"required": ["arbol"]}, {"required": ["filas"]}] + (otras or []); return d

# Flujo y relaciones: enlaces { origen, destino, valor } y, opcional, la lista de nodos (orden, grupo o duración)
ID = {"oneOf": [TXT, NUM]}
ENLACE = OBJ({"origen": ID, "destino": ID, "valor": POS, "relacion": TXT}, ["origen", "destino"])
NODO_F = {"oneOf": [ID, OBJ({"nombre": ID, "grupo": ID, "duracion": POS}, ["nombre"])]}
def ENLACES(mx): return LISTA(1, mx, ENLACE)
MATRIZ = {"type": "array", "minItems": 2, "maxItems": 3, "items": {"type": "array", "minItems": 2, "maxItems": 3, "items": POS}}

# Geografía: territorios por nombre o código INE; lugares por nombre de zona (su capital) o con lat y lon
VALOR_O_NULO = {"type": "array", "minItems": 1, "maxItems": 52, "items": {"oneOf": [NUM, {"type": "null"}]}}
COORD = OBJ({"nombre": TXT, "lat": {"type": "number", "minimum": 26, "maximum": 45}, "lon": {"type": "number", "minimum": -19.5, "maximum": 5.5}, "valor": POS}, ["lat", "lon"])
LUGAR = {"oneOf": [ID, COORD], "description": "El nombre o código INE de una zona del mapa (se sitúa en su capital) o { nombre, lat, lon }."}
ZONAS = LISTA(1, 52, ID)
PROPS_MAPA = {"mapa": {"enum": ["comunidades", "provincias"]}, "leyenda": TXT,
              "umbrales": {"type": "array", "items": NUM, "minItems": 4, "maxItems": 4}}

NUEVOS = {
  "mapa": (dict(PROPS_MAPA, **{"variante": {"enum": ["coropletas", "puntos", "burbujas", "simbolos", "rejilla", "hexagonos", "categorias", "flujos", "ruta", "conexiones", "con-ranking"]},
     "ranking": {"type": "integer", "minimum": 3, "maximum": 12}, "destacar": {"oneOf": [ID, {"const": False}]}, "porPunto": {"type": "number", "exclusiveMinimum": 0},
     "nombreCasos": CASOS, "nombreCaso": TXT, "celda": {"type": "number", "minimum": 5, "maximum": 200},
     "datos": dict(datos({"territorios": ZONAS, "valores": VALOR_O_NULO, "categorias": {"type": "array", "minItems": 1, "maxItems": 52, "items": {"oneOf": [TXT, {"type": "null"}]}},
                          "grupos": LTXT(6), "puntos": LISTA(1, 50000, COORD), "origen": LUGAR, "destinos": LISTA(1, 7, LUGAR), "paradas": LISTA(2, 12, LUGAR),
                          "enlaces": LISTA(1, 40, OBJ({"origen": LUGAR, "destino": LUGAR}, ["origen", "destino"]))}),
                   anyOf=[{"required": ["territorios"]}, {"required": ["puntos"]}, {"required": ["origen", "destinos", "valores"]}, {"required": ["paradas"]}, {"required": ["enlaces"]}])}), ["datos"]),
  "cartograma": (dict(PROPS_MAPA, **{"mapa": {"const": "comunidades"}, "variante": {"enum": ["fichas"]},
     "datos": datos({"territorios": LISTA(1, 19, ID), "valores": VALOR_O_NULO}, ["territorios", "valores"])}), ["datos"]),
  "sankey": ({"variante": {"enum": ["sankey", "aluvial", "recorrido"]}, "nombreCasos": CASOS,
     "destacar": {"oneOf": [ID, {"const": False}, {"type": "array", "items": ID, "minItems": 2}]},
     "datos": dict(datos({"enlaces": ENLACES(40), "nodos": LISTA(1, 24, NODO_F), "momentos": LISTA(2, 6, ID), "categorias": LISTA(2, 3, TXT),
                          "cambios": LISTA(1, 5, MATRIZ), "etapas": LISTA(3, 7, ID), "valores": {"type": "array", "items": POS, "minItems": 3, "maxItems": 7}, "salida": TXT}),
                   anyOf=[{"required": ["enlaces"]}, {"required": ["momentos", "categorias", "cambios"]}, {"required": ["etapas", "valores"]}])}, ["datos"]),
  "cuerdas": ({"variante": {"enum": ["cuerdas"]}, "destacar": ID, "datos": datos({"enlaces": ENLACES(28), "nodos": LISTA(1, 8, NODO_F)}, ["enlaces"])}, ["datos"]),
  "flujo": ({"variante": {"enum": ["flechas"]}, "destacar": OBJ({"origen": ID, "destino": ID}, ["origen", "destino"]),
     "datos": datos({"enlaces": ENLACES(16), "nodos": LISTA(1, 12, NODO_F)}, ["enlaces"])}, ["datos"]),
  "red": ({"variante": {"enum": ["comunidades", "bipartita", "radial", "dependencias"]}, "destacar": ID, "nombreCasos": CASOS,
     "columnas": LISTA(2, 2, TXT), "ruta": {"type": "array", "items": ID, "minItems": 2},
     "datos": datos({"enlaces": ENLACES(120), "nodos": LISTA(1, 40, NODO_F), "centro": ID}, ["enlaces"])}, ["datos"]),
  "barras": ({"variante": {"enum": ["verticales", "horizontales", "agrupadas", "apiladas", "apiladas-100", "con-referencia", "vs-anterior", "vs-prevision"]}, "orden": ORDEN,
              "nombreObjetivo": TXT, "cumplimiento": {"type": "boolean"},
              "datos": CATEGORIAS_O_PERIODOS(datos({"categorias": LTXT(12), "periodos": LTXT(12), "valores": LNUM, "series": series(1, 5), "objetivos": {"oneOf": [NUM, LNUM]},
                 "prevision": {"type": "object", "additionalProperties": False, "required": ["valores", "origen"], "properties": {"valores": LNUM, "origen": TXT, "minimo": LNUM, "maximo": LNUM}}}))}, ["datos"]),
  "barras-divergentes": ({"variante": {"enum": ["centro", "piramide", "desviacion", "desviacion-pct", "contribucion", "desviacion-objetivo"]}, "orden": ORDEN, "referencia": TXT, "limiteRiesgo": NUM,
              "lados": {"type": "array", "items": TXT, "minItems": 2, "maxItems": 2}, "nombreTotal": TXT,
              "datos": CATEGORIAS_O_PERIODOS(datos({"categorias": LTXT(12), "periodos": LTXT(12), "valores": LNUM, "series": series(2, 2), "total": NUM}))}, ["datos"]),
  "puntos": ({"variante": {"enum": ["puntos", "piruleta"]}, "orden": ORDEN, "destacar": TXT, "ejeDesdeCero": {"type": "boolean"},
              "datos": datos({"categorias": LTXT(15), "valores": LNUM}, ["categorias", "valores"])}, ["datos"]),
  "dos-momentos": ({"variante": {"enum": ["pesas", "pendiente", "antes-despues"]}, "destacar": TXT, "ejeDesdeCero": {"type": "boolean"},
              "datos": datos({"categorias": LTXT(10), "series": series(2, 2)}, ["categorias", "series"])}, ["datos"]),
  "bullet": ({"variante": {"enum": ["horizontal"]}, "nombreObjetivo": TXT,
              "datos": datos({"metricas": {"type": "array", "minItems": 1, "maxItems": 5, "items": {"type": "object", "additionalProperties": False,
                 "required": ["nombre", "valor", "objetivo", "rangos"],
                 "properties": {"nombre": TXT, "valor": NUM, "objetivo": NUM, "rangos": {"type": "array", "items": NUM, "minItems": 3, "maxItems": 3}}}}}, ["metricas"])}, ["datos"]),
  "ranking": ({"variante": {"enum": ["lista", "evolucion"]}, "destacar": TXT, "limite": {"type": "integer", "minimum": 3, "maximum": 15},
              "datos": datos({"categorias": LTXT(30), "valores": LNUM, "periodos": LTXT(8),
                 "series": {"type": "array", "minItems": 2, "maxItems": 5, "items": {"type": "object", "additionalProperties": False, "required": ["nombre"],
                    "properties": {"nombre": TXT, "valores": LNUM, "posiciones": {"type": "array", "items": {"type": "integer", "minimum": 1}, "minItems": 1}}}}})}, ["datos"]),
  "tabla": ({"variante": {"enum": ["comparativa", "con-barras", "con-estados", "scorecard", "semaforo", "jerarquica"]}, "umbrales": UMBRALES, "orden": ORDEN, "columna": TXT,
              "datos": datos({"columnas": {"type": "array", "minItems": 2, "maxItems": 8, "items": {"type": "object", "additionalProperties": False, "required": ["titulo"],
                    "properties": {"titulo": TXT, "tipo": {"enum": ["texto", "numero", "porcentaje", "variacion", "barra", "sparkline", "estado", "fecha"]},
                                   "unidad": TXT, "decimales": {"type": "integer", "minimum": 0, "maximum": 3}, "abreviar": {"type": "boolean"}}}},
                 "arbol": PROPS_J["arbol"], "raiz": TXT, "niveles": LTXT(5),
                 "filas": {"type": "array", "minItems": 1, "maxItems": 300, "items": {"type": "array", "items": {
                    "oneOf": [{"type": "string"}, NUM, {"type": "null"}, {"type": "array", "items": NUM, "minItems": 3}, {"type": "object", "required": ["estado"], "additionalProperties": False,
                              "properties": {"estado": {"enum": ESTADOS}, "texto": TXT}}]}}},
                 "indicadores": INDICADORES(12, False)})}, ["datos"]),
  "lineas": ({"variante": {"enum": ["simple", "multiples", "escalonada", "tendencia", "acumulada", "media-movil", "referencia", "objetivo", "prevision", "vs-prevision", "vs-anterior"]},
              "ejeDesdeCero": {"type": "boolean"}, "ventana": {"type": "integer", "minimum": 2, "maximum": 12},
              "datos": datos({"periodos": LTXT(60), "series": series(1, 4), "objetivo": {"oneOf": [NUM, LNUM]},
                 "referencia": {"type": "object", "additionalProperties": False, "required": ["nombre", "valor"], "properties": {"nombre": TXT, "valor": {"oneOf": [NUM, LNUM]}}},
                 "prevision": {"type": "object", "additionalProperties": False, "required": ["valores", "origen"], "properties": {"valores": LNUM, "minimo": LNUM, "maximo": LNUM, "origen": TXT}}},
                 ["periodos", "series"])}, ["datos"]),
  "areas": ({"variante": {"enum": ["simple", "superpuestas", "apiladas", "apiladas-100"]},
              "datos": datos({"periodos": LTXT(60), "series": series(1, 5)}, ["periodos", "series"])}, ["datos"]),
  "sparkline": ({"variante": {"enum": ["linea"]},
              "datos": datos({"series": {"type": "array", "minItems": 1, "maxItems": 8, "items": {"type": "object", "additionalProperties": False, "required": ["nombre", "valores"],
                 "properties": {"nombre": TXT, "valores": {"type": "array", "items": NUM, "minItems": 3}, "unidad": TXT, "valor": NUM}}}}, ["series"])}, ["datos"]),
  "kpi": ({"nombre": TXT, "valor": NUM,
     "variacion": OBJ({"anterior": NUM, "porcentaje": NUM, "referencia": TXT, "modo": {"enum": ["neutro", "valorado"]}, "sentidoPositivo": {"enum": ["subir", "bajar"]}}, ["referencia"]),
     "tendencia": OBJ({"sentido": {"enum": ["sube", "baja", "estable"]}, "texto": TXT, "periodo": TXT}, ["sentido", "periodo"]),
     "objetivo": OBJ({"valor": NUM, "forma": {"enum": ["texto", "barra", "logro"]}}, ["valor"]),
     "anterior": OBJ({"valor": NUM, "etiqueta": TXT, "nota": TXT}, ["valor", "etiqueta"]),
     "prevision": OBJ({"valor": NUM, "etiqueta": TXT, "origen": TXT}, ["valor", "origen"]),
     "estado": OBJ({"estado": {"enum": ["en-objetivo", "en-riesgo", "fuera"]}, "umbral": TXT, "texto": TXT}, ["estado", "umbral"]),
     "ranking": OBJ({"posicion": {"type": "integer", "minimum": 1}, "total": {"type": "integer", "minimum": 1}, "grupo": TXT, "etiqueta": TXT}, ["posicion", "total", "grupo"]),
     "comparado": OBJ({"nombre": TXT, "valor": NUM}, ["nombre", "valor"]),
     "benchmark": OBJ({"nombre": TXT, "valor": NUM, "maximo": NUM, "fuente": TXT}, ["nombre", "valor"]),
     "serie": OBJ({"valores": {"type": "array", "items": NUM, "minItems": 3}, "periodo": TXT}, ["valores"]),
     "barras": OBJ({"valores": {"type": "array", "items": NUM, "minItems": 2, "maxItems": 12}, "etiquetas": {"type": "array", "items": TXT}, "periodo": TXT}, ["valores", "periodo"]),
     "desglose": OBJ({"categorias": LTXT(5), "valores": LNUM}, ["categorias", "valores"]),
     "componentes": OBJ({"categorias": LTXT(5), "valores": LNUM, "maximo": NUM}, ["categorias", "valores"]),
     "secundarios": {"type": "array", "minItems": 1, "maxItems": 3, "items": OBJ({"etiqueta": TXT, "valor": NUM, "unidad": TXT}, ["etiqueta", "valor"])},
     "progreso": OBJ({"meta": NUM, "etiqueta": TXT}, ["meta"]),
     "contexto": {"type": "array", "items": TXT, "minItems": 1, "maxItems": 2},
     "periodos": {"type": "array", "minItems": 2, "maxItems": 4, "items": OBJ({"etiqueta": TXT, "valor": NUM, "periodo": TXT, "detalle": TXT}, ["etiqueta", "valor", "periodo"])}}, []),
  "kpi-rejilla": ({"variante": {"enum": ["scorecard"]}, "datos": datos({"indicadores": INDICADORES(8, True)}, ["indicadores"])}, ["datos"]),
  "progreso": ({"variante": {"enum": ["barras", "anillo", "medidor", "ritmo", "distancia"]},
     "datos": datos({"categorias": LTXT(8), "valores": LNUM, "objetivos": LNUM, "valor": NUM, "objetivo": NUM, "minimo": NUM, "maximo": NUM,
                     "meta": NUM, "esperado": NUM, "etiqueta": TXT, "restante": TXT})}, ["datos"]),
  "sectores": ({"variante": {"enum": ["donut", "pie", "semidonut"]},
     "centro": {"type": "object", "additionalProperties": False, "properties": {"etiqueta": TXT, "valor": NUM}},
     "datos": datos({"categorias": {"type": "array", "items": TXT, "minItems": 2}, "valores": {"type": "array", "items": POS, "minItems": 2}}, ["categorias", "valores"])}, ["datos"]),
  "treemap": ({"variante": {"enum": ["plano", "jerarquico"]}, "destacar": TXT, "orden": ORDEN,
     "datos": DATOS_J({"categorias": {"type": "array", "items": TXT, "minItems": 3}, "valores": {"type": "array", "items": POS, "minItems": 3}}, [{"required": ["categorias", "valores"]}])}, ["datos"]),
  "proporcion": ({"variante": {"enum": ["barra", "cuota", "participacion", "waffle"]}, "orden": ORDEN,
     "datos": datos({"categorias": LTXT(8), "valores": {"type": "array", "items": POS, "minItems": 1}, "valor": POS, "total": POS, "anterior": POS,
                     "etiqueta": TXT, "resto": TXT, "base": TXT, "referencia": TXT})}, ["datos"]),
  "marimekko": ({"variante": {"enum": ["marimekko"]},
     "datos": datos({"grupos": {"type": "array", "items": TXT, "minItems": 2, "maxItems": 4},
                     "series": {"type": "array", "minItems": 2, "maxItems": 3, "items": {"type": "object", "additionalProperties": False, "required": ["nombre", "valores"],
                        "properties": {"nombre": TXT, "valores": {"type": "array", "items": POS, "minItems": 2, "maxItems": 4}}}}}, ["grupos", "series"])}, ["datos"]),
  "cascada": ({"variante": {"enum": ["vertical", "horizontal"]},
     "datos": datos({"inicio": EXTREMO, "categorias": LTXT(10), "valores": LNUM, "final": EXTREMO}, ["inicio", "categorias", "valores"])}, ["datos"]),
  "descomposicion": ({"variante": {"enum": ["paneles"]}, "mostrarResiduo": {"type": "boolean"},
     "datos": datos({"periodos": {"type": "array", "items": TXT, "minItems": 8, "maxItems": 156}, "valores": LNUM, "ciclo": {"type": "integer", "minimum": 2, "maximum": 52},
                     "tendencia": LNUM, "estacionalidad": LNUM, "residuo": LNUM}, ["periodos", "valores"])}, ["datos"]),
  "histograma": ({"variante": {"enum": ["histograma"]}, "marca": MARCA("mediana", "media", "ninguna"), "nombreCasos": CASOS,
     "intervalo": {"type": "number", "exclusiveMinimum": 0}, "inicio": NUM,
     "datos": dict(datos({"valores": CRUDOS(10), "limites": {"type": "array", "items": NUM, "minItems": 4, "maxItems": 31}, "casos": {"type": "array", "items": POS, "minItems": 3, "maxItems": 30}}),
                   oneOf=[{"required": ["valores"]}, {"required": ["limites", "casos"]}])}, ["datos"]),
  "cajas": ({"variante": {"enum": ["caja", "violin"]}, "nombreCasos": CASOS,
     "datos": dict(datos({"series": GRUPOS(8, True), "valores": CRUDOS(5)}), anyOf=[{"required": ["series"]}, {"required": ["valores"]}])}, ["datos"]),
  "casos": ({"variante": {"enum": ["apilados", "dispersos", "enjambre"]}, "marca": MARCA("mediana", "media", "ninguna"), "nombreCasos": CASOS,
     "datos": dict(datos({"series": GRUPOS(6, False), "valores": {"type": "array", "items": NUM, "minItems": 3, "maxItems": 300}}), anyOf=[{"required": ["series"]}, {"required": ["valores"]}])}, ["datos"]),
  "distribucion": ({"variante": {"enum": ["densidad", "normal", "acumulada"]}, "marca": MARCA("moda", "mediana", "media", "ninguna"), "nombreCasos": CASOS,
     "percentil": {"type": "number", "minimum": 1, "maximum": 99},
     "datos": dict(datos({"valores": CRUDOS(10), "media": NUM, "desviacion": {"type": "number", "exclusiveMinimum": 0}}),
                   anyOf=[{"required": ["valores"]}, {"required": ["media", "desviacion"]}])}, ["datos"]),
  "percentiles": ({"variante": {"enum": ["percentiles"]}, "orden": ORDEN, "destacar": TXT, "referencia": TXT,
     "datos": datos({"categorias": LTXT(8), "valores": LNUM, "grupo": CRUDOS(5)}, ["categorias", "valores"])}, ["datos"]),
  "rangos": ({"variante": {"enum": ["rango", "min-max", "intervalo"]}, "orden": ORDEN, "nombreValor": TXT,
     "confianza": {"type": "number", "exclusiveMinimum": 0, "exclusiveMaximum": 100},
     "datos": CATEGORIAS_O_PERIODOS(datos({"categorias": LTXT(12), "periodos": LTXT(12), "minimos": LNUM, "maximos": LNUM, "valores": LNUM,
                     "referencia": OBJ({"nombre": TXT, "valor": NUM}, ["nombre", "valor"])}, ["minimos", "maximos"]))}, ["datos"]),
  "dispersion": ({"variante": {"enum": ["simple", "tendencia", "burbujas", "burbujas-categoria", "cuadrantes", "conectada", "hexagonos"]},
     "ejes": OBJ({"x": EJE, "y": EJE, "tamano": EJE}, ["x", "y"]), "nombreCasos": CASOS, "destacar": TXT, "rotular": LISTA(1, 8, TXT),
     "cortes": OBJ({"x": NUM, "y": NUM}, ["x", "y"]), "cuadrantes": LISTA(4, 4, TXT), "destacarCuadrante": TXT,
     "datos": dict(datos({"x": LNUM, "y": LNUM, "tamanos": {"type": "array", "items": POS, "minItems": 1}, "nombres": NOMBRES, "periodos": NOMBRES,
                          "series": LISTA(1, 3, GRUPO_DISPERSION)}), anyOf=[{"required": ["x", "y"]}, {"required": ["series"]}])}, ["datos", "ejes"]),
  "matriz": ({"variante": {"enum": ["correlacion-color", "correlacion-valores", "cohortes"]}, "nombreCasos": CASOS, "umbrales": {"type": "array", "items": NUM, "minItems": 4, "maxItems": 4},
     "datos": dict(datos({"variables": LISTA(3, 10, TXT), "coeficientes": LISTA(3, 10, {"type": "array", "items": {"type": "number", "minimum": -1, "maximum": 1}, "minItems": 1}),
                          "series": LISTA(3, 10, OBJ({"nombre": TXT, "valores": CRUDOS(5)}, ["nombre", "valores"])),
                          "cohortes": LISTA(2, 12, {"oneOf": [TXT, NUM]}), "periodos": LISTA(2, 12, {"oneOf": [TXT, NUM]}),
                          "valores": LISTA(2, 12, {"type": "array", "items": POS, "minItems": 1, "maxItems": 12})}),
                   anyOf=[{"required": ["variables", "coeficientes"]}, {"required": ["series"]}, {"required": ["cohortes", "periodos", "valores"]}])}, ["datos"]),
  "radar": ({"variante": {"enum": ["perfil", "dos-perfiles"]},
     "datos": dict(datos({"dimensiones": LISTA(3, 8, TXT), "valores": LISTA(3, 8, POS), "series": LISTA(1, 2, OBJ({"nombre": TXT, "valores": LISTA(3, 8, POS)}, ["nombre", "valores"])),
                          "maximo": {"type": "number", "exclusiveMinimum": 0}}, ["dimensiones"]), anyOf=[{"required": ["valores"]}, {"required": ["series"]}])}, ["datos"]),
  "coordenadas-paralelas": ({"variante": {"enum": ["paralelas"]}, "destacar": TXT, "nombreCasos": CASOS,
     "datos": datos({"variables": LISTA(3, 8, TXT), "series": LISTA(2, 30, OBJ({"nombre": TXT, "valores": LNUM}, ["nombre", "valores"]))}, ["variables", "series"])}, ["datos"]),
  "embudo": ({"variante": {"enum": ["embudo", "conversion", "retencion"]},
     "datos": dict(datos({"etapas": NOMBRES_EMBUDO(8), "periodos": NOMBRES_EMBUDO(12), "valores": {"type": "array", "items": POS, "minItems": 2, "maxItems": 12}}, ["valores"]),
                   oneOf=[{"required": ["etapas"]}, {"required": ["periodos"]}])}, ["datos"]),
  "etapas": ({"variante": {"enum": ["pipeline", "proceso", "progresion"]}, "destacar": TXT, "nombreCasos": CASOS,
     "datos": datos({"etapas": LISTA(2, 8, TXT), "casos": LISTA(1, 60, CASO_PIPELINE), "pasos": LISTA(2, 8, PASO), "actual": TXT,
                     "porcentaje": {"type": "number", "minimum": 0, "maximum": 100}, "terminado": {"type": "boolean"}})}, ["datos"]),
  "recorrido": ({"variante": {"enum": ["experiencia"]}, "niveles": LISTA(3, 3, TXT),
     "datos": datos({"etapas": LISTA(3, 8, TXT), "valores": {"type": "array", "items": NUM, "minItems": 3, "maxItems": 8}, "contactos": LISTA(3, 8, TXT), "minimo": NUM, "maximo": NUM},
                    ["etapas", "valores", "minimo", "maximo"])}, ["datos"]),
  "cronologia": ({"variante": {"enum": ["hitos", "carriles", "vertical"]}, "destacar": TXT,
     "datos": datos({"eventos": LISTA(2, 30, EVENTO), "carriles": LISTA(2, 6, TXT), "hoy": HOY, "actual": TXT, "terminado": {"type": "boolean"}}, ["eventos"])}, ["datos"]),
  "gantt": ({"variante": {"enum": ["gantt"]},
     "datos": datos({"tareas": LISTA(1, 15, OBJ({"nombre": TXT, "inicio": FECHA, "fin": FECHA, "avance": {"type": "number", "minimum": 0, "maximum": 100}}, ["nombre", "inicio", "fin"])),
                     "hitos": LISTA(0, 5, OBJ({"nombre": TXT, "fecha": FECHA}, ["nombre", "fecha"])), "hoy": HOY}, ["tareas"])}, ["datos"]),
  "calendario": ({"variante": {"enum": ["calor", "mes"]}, "resumen": RESUMEN_T,
     "datos": datos({"inicio": DIA, "fechas": {"type": "array", "items": DIA, "minItems": 1, "maxItems": 371},
                     "valores": {"type": "array", "items": {"oneOf": [POS, {"type": "null"}]}, "minItems": 1, "maxItems": 371},
                     "mes": {"type": "string", "pattern": "^\\d{4}-\\d{2}$"}, "hoy": HOY,
                     "eventos": LISTA(0, 62, OBJ({"fecha": DIA, "nombre": TXT}, ["fecha", "nombre"])),
                     "festivos": LISTA(0, 62, {"oneOf": [DIA, OBJ({"fecha": DIA, "nombre": TXT}, ["fecha"])]})})}, ["datos"]),
  "dos-periodos": ({"variante": {"enum": ["superpuestos", "interanual"]}, "resumen": RESUMEN_T,
     "datos": datos({"periodos": {"type": "array", "items": {"oneOf": [TXT, NUM]}, "minItems": 2, "maxItems": 31},
                     "series": {"type": "array", "minItems": 2, "maxItems": 2, "items": OBJ({"nombre": TXT, "valores": LNUM, "rol": {"enum": ["actual", "anterior"]}}, ["nombre", "valores"])}},
                    ["periodos", "series"])}, ["datos"]),
  "particion": ({"variante": {"enum": ["sunburst", "icicle"]}, "destacar": TXT, "orden": ORDEN, "datos": DATOS_J()}, ["datos"]),
  "circulos-anidados": ({"variante": {"enum": ["circulos"]}, "destacar": TXT, "orden": ORDEN, "datos": DATOS_J()}, ["datos"]),
  "arbol": ({"variante": {"enum": ["ramas", "dendrograma", "organigrama"]}, "destacar": TXT, "nombreCasos": CASOS,
     "grupos": {"type": "integer", "minimum": 2, "maximum": 6}, "corte": POS, "tipificar": {"type": "boolean"},
     "datos": DATOS_J({"elementos": {"type": "array", "items": {"oneOf": [TXT, NUM]}, "minItems": 3, "maxItems": 30},
                       "variables": {"type": "array", "items": TXT, "minItems": 1},
                       "valores": {"type": "array", "minItems": 3, "maxItems": 30, "items": {"oneOf": [NUM, LNUM]}}}, [{"required": ["elementos", "valores"]}])}, ["datos"]),
  "anidados": ({"variante": {"enum": ["contenedores"]}, "destacar": TXT, "nombreCasos": CASOS, "datos": DATOS_J()}, ["datos"]),
  "ciclo-vida": ({"variante": {"enum": ["fases"]},
     "datos": datos({"fases": LISTA(3, 6, TXT), "actual": TXT, "elemento": TXT, "posicion": {"type": "number", "minimum": 0, "maximum": 100}, "medida": TXT}, ["actual"])}, ["datos"]),
}

ruta_esquema = os.path.join(RAIZ, 'esquema.json')
esq = json.load(open(ruta_esquema))
esq["$id"] = "https://cdn.jsdelivr.net/npm/edelvives-graficos@%s/esquema.json" % VERSION
esq["title"] = "Especificación de gráfico Edelvives (kit v%s)" % corto
esq["required"] = ["tipo", "titulo"]  # la unidad la exige cada tipo (en tabla de indicadores y kpi-rejilla puede ir en cada indicador)
esq["description"] = "Formato que escribe la IA. Las reglas de cantidad (series, categorías, partes) y de coherencia entre campos las comprueba además EG.validar()."
previos = [e for e in esq["allOf"] if e["if"]["properties"]["tipo"]["const"] not in NUEVOS]
nuevos = []
for t, (props, req) in NUEVOS.items():
    p = {"tipo": {"const": t}}; p.update(COMUNES); p.update(props)
    base = ["tipo", "titulo"] if t in SIN_UNIDAD else ["tipo", "titulo", "unidad"]
    nuevos.append({"if": {"properties": {"tipo": {"const": t}}}, "then": {"required": base + req, "properties": p, "additionalProperties": False}})
esq["allOf"] = nuevos + previos
esq["$defs"] = {"nodoJerarquia": DEF_NODO}
tipos = list(NUEVOS) + [e["if"]["properties"]["tipo"]["const"] for e in previos]
orden = ["barras", "barras-divergentes", "puntos", "dos-momentos", "bullet", "ranking", "tabla", "lineas", "areas", "sparkline", "kpi", "kpi-rejilla", "progreso", "sectores", "treemap", "proporcion", "marimekko", "cascada", "descomposicion",
         "histograma", "cajas", "casos", "distribucion", "percentiles", "rangos", "dispersion", "matriz", "radar", "coordenadas-paralelas", "embudo", "etapas", "recorrido",
         "cronologia", "gantt", "calendario", "dos-periodos", "ciclo-vida", "particion", "circulos-anidados", "arbol", "anidados", "sankey", "cuerdas", "flujo", "red", "mapa", "cartograma"]
esq["allOf"].sort(key=lambda e: orden.index(e["if"]["properties"]["tipo"]["const"]) if e["if"]["properties"]["tipo"]["const"] in orden else 99)
tipos = [e["if"]["properties"]["tipo"]["const"] for e in esq["allOf"]]
esq["properties"] = {"tipo": {"enum": tipos, "description": "Alias: barras-agrupadas (barras · agrupadas), barras-progreso (progreso · barras), donut (sectores · donut) y kpi-simple, kpi-variacion, kpi-objetivo, kpi-sparkline, kpi-contexto (kpi)."}}
json.dump(esq, open(ruta_esquema, 'w'), ensure_ascii=False, indent=2)
print('esquema.json:', len(tipos), 'tipos')

# ---------------------------------------------------------------- vista previa
FAMILIAS = [
  ("Comparación", [("barras-verticales", "Barras verticales"), ("barras-horizontales", "Barras horizontales"), ("barras-agrupadas", "Barras agrupadas"),
     ("barras-apiladas", "Barras apiladas"), ("barras-apiladas-100", "Barras 100 % apiladas"), ("barras-con-referencia", "Barras con referencia"),
     ("barras-divergentes", "Barras divergentes"), ("barras-piramide", "Barras bidireccionales"), ("puntos", "Dot plot"), ("piruleta", "Lollipop chart"),
     ("pesas", "Dumbbell chart"), ("pendiente", "Slope chart"), ("bullet", "Bullet chart"), ("ranking", "Ranking"), ("ranking-evolucion", "Bump chart"),
     ("tabla-comparativa", "Tabla comparativa"), ("tabla-con-barras", "Tabla con barras"), ("tabla-con-estados", "Tabla con indicadores")]),
  ("Evolución y tendencias", [("lineas-simple", "Gráfico de líneas"), ("lineas-multiples", "Líneas múltiples"), ("areas-simple", "Área"),
     ("areas-superpuestas", "Área múltiple"), ("areas-apiladas", "Área apilada"), ("areas-apiladas-100", "Área 100 % apilada"), ("lineas-escalonada", "Step chart"),
     ("sparkline", "Sparkline"), ("lineas-tendencia", "Gráfico de tendencia"), ("lineas-acumulada", "Línea acumulada"), ("lineas-media-movil", "Media móvil"),
     ("lineas-referencia", "Línea de referencia"), ("lineas-objetivo", "Línea objetivo"), ("lineas-prevision", "Línea de previsión"),
     ("lineas-vs-prevision", "Actual vs. previsión"), ("lineas-vs-anterior", "Actual vs. año anterior")]),
  ("Composición", [("sectores-pie", "Pie chart"), ("sectores-donut", "Donut chart"), ("sectores-semidonut", "Semidonut"), ("treemap", "Treemap"),
     ("proporcion-waffle", "Waffle chart"), ("marimekko", "Marimekko"), ("proporcion-barra", "Part-to-whole"), ("proporcion-cuota", "Indicador de cuota"),
     ("proporcion-participacion", "Indicador de participación")]),
  ("Distribución", [("histograma", "Histograma"), ("cajas-caja", "Box plot"), ("cajas-violin", "Violin plot"), ("casos-apilados", "Dot plot de distribución"),
     ("casos-dispersos", "Strip plot"), ("casos-enjambre", "Beeswarm plot"), ("distribucion-densidad", "Density plot"), ("distribucion-normal", "Curva de distribución"),
     ("distribucion-acumulada", "Distribución acumulada"), ("percentiles", "Percentile plot"), ("rangos-rango", "Range plot"), ("rangos-min-max", "Min–max chart"),
     ("rangos-intervalo", "Interval plot")]),
  ("Relación y correlación", [("dispersion-simple", "Scatter plot"), ("dispersion-tendencia", "Scatter con línea de tendencia"), ("dispersion-burbujas", "Bubble chart"),
     ("dispersion-burbujas-categoria", "Bubble scatter"), ("matriz-correlacion-color", "Heatmap de correlación"), ("matriz-correlacion-valores", "Matriz de correlación"),
     ("dispersion-hexagonos", "Hexbin plot"), ("dispersion-cuadrantes", "Quadrant chart"), ("radar-perfil", "Radar chart"), ("radar-dos-perfiles", "Spider chart"),
     ("coordenadas-paralelas", "Parallel coordinates"), ("dispersion-conectada", "Connected scatter")]),
  ("Procesos y conversión", [("embudo", "Funnel chart"), ("embudo-conversion", "Funnel de conversión"), ("etapas-pipeline", "Pipeline"), ("etapas-proceso", "Process flow"),
     ("etapas-progresion", "Stage progression"), ("embudo-retencion", "Retention funnel"), ("recorrido", "Customer journey")]),
  ("Temporal especializado", [("cronologia-hitos", "Timeline"), ("gantt", "Gantt"), ("calendario-calor", "Calendar heatmap"), ("calendario-mes", "Calendar chart"),
     ("cronologia-carriles", "Event timeline"), ("cronologia-vertical", "Milestone timeline"), ("dos-periodos-superpuestos", "Period comparison"),
     ("dos-periodos-interanual", "Year-over-year"), ("matriz-cohortes", "Cohort timeline"), ("ciclo-vida", "Lifecycle")]),
  ("Jerarquía", [("treemap-jerarquico", "Treemap jerárquico"), ("particion-sunburst", "Sunburst"), ("particion-icicle", "Icicle chart"), ("circulos-anidados", "Circle packing"),
     ("arbol-ramas", "Tree diagram"), ("arbol-dendrograma", "Dendrogram"), ("arbol-organigrama", "Organizational tree"), ("tabla-jerarquica", "Hierarchy diagram"),
     ("anidados", "Nested categories")]),
  ("Flujo y relaciones", [("sankey", "Sankey diagram"), ("sankey-aluvial", "Alluvial diagram"), ("cuerdas", "Chord diagram"), ("flujo", "Flow diagram"),
     ("red-comunidades", "Network graph"), ("red-bipartita", "Node-link diagram"), ("red-radial", "Relationship graph"), ("red-dependencias", "Dependency graph"),
     ("sankey-recorrido", "Journey flow")]),
  ("Geografía", [("mapa-coropletas", "Mapa coroplético"), ("mapa-puntos", "Mapa de puntos"), ("mapa-burbujas", "Mapa de burbujas"), ("mapa-simbolos", "Símbolos proporcionales"),
     ("mapa-rejilla", "Mapa de calor"), ("mapa-hexagonos", "Mapa de densidad"), ("mapa-categorias", "Mapa de áreas"), ("cartograma", "Cartograma"),
     ("mapa-flujos", "Mapa de flujo"), ("mapa-ruta", "Mapa de rutas"), ("mapa-conexiones", "Mapa de conexiones"), ("mapa-con-ranking", "Distribución territorial")]),
  ("Objetivos y cumplimiento", [("progreso-medidor", "Gauge"), ("progreso-barras", "Progress bar"), ("progreso-anillo", "Progress ring"), ("progreso-ritmo", "Goal progress"),
     ("kpi-logro", "Achievement"), ("barras-desviacion-objetivo", "Variance to target"), ("progreso-distancia", "Distance to target"), ("tabla-semaforo", "Semáforo"), ("tabla-scorecard", "Scorecard")]),
  ("Patrones de KPI", [("kpi-simple", "KPI simple"), ("kpi-unidad", "KPI + unidad"), ("kpi-contexto", "KPI + contexto"), ("kpi-variacion", "KPI + variación"),
     ("kpi-tendencia", "KPI + tendencia"), ("kpi-objetivo", "KPI + objetivo"), ("kpi-progreso", "KPI + progreso"), ("kpi-vs-anterior", "KPI actual vs. anterior"),
     ("kpi-vs-objetivo", "KPI actual vs. objetivo"), ("kpi-vs-prevision", "KPI actual vs. forecast"), ("kpi-sparkline", "KPI con sparkline"),
     ("kpi-estado", "KPI con indicador de estado"), ("kpi-ranking", "KPI con ranking"), ("kpi-comparativo", "KPI comparativo"), ("kpi-compuesto", "KPI compuesto"),
     ("kpi-multidato", "KPI multidato"), ("kpi-desglose", "KPI con desglose"), ("kpi-mini-barras", "KPI con mini gráfico"), ("kpi-periodo", "KPI con periodo"),
     ("kpi-benchmark", "KPI con benchmark"), ("kpi-rejilla", "Scorecard")]),
  ("Variación", [("cascada-vertical", "Waterfall chart"), ("cascada-horizontal", "Bridge chart"), ("barras-desviacion", "Variance chart"),
     ("barras-desviacion-periodos", "Absolute variance"), ("barras-desviacion-pct", "Percentage variance"), ("antes-despues", "Before / after"),
     ("barras-cumplimiento", "Actual vs. target"), ("barras-vs-anterior", "Actual vs. previous period"), ("barras-vs-prevision", "Actual vs. forecast"),
     ("barras-contribucion", "Contribution chart"), ("descomposicion", "Decomposition chart")]),
]
partes, llamadas, n = [], [], 0
for familia, piezas in FAMILIAS:
    partes.append('<h2 class="familia">%s</h2>\n<div class="catalogo">' % html.escape(familia))
    for archivo, nombre in piezas:
        spec = json.load(open(os.path.join(RAIZ, 'ejemplos', archivo + '.json')))
        clave = spec['tipo'] + (' · ' + spec['variante'] if spec.get('variante') else '')
        partes.append('<article class="pieza"><h3>%s <code>%s</code></h3><div id="c%d"></div>\n<details><summary>Ver la especificación</summary><pre>%s</pre></details></article>'
                      % (html.escape(nombre), html.escape(clave), n, html.escape(json.dumps(spec, ensure_ascii=False, indent=2))))
        llamadas.append("EG.render('#c%d', %s);" % (n, json.dumps(spec, ensure_ascii=False)))
        n += 1
    partes.append('</div>')

pagina = """<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Vista previa del kit de gráficos Edelvives v%(v)s</title>
<script src="dist/edelvives-graficos.js"></script>
<style>
 .contenedor{max-width:1200px;margin:0 auto;padding:40px 24px 64px}
 h1{font-size:32px;line-height:38px;margin:0}
 .intro{margin:6px 0 8px;font-size:14px;line-height:21px;color:#4A4540;max-width:72ch}
 .familia{font-size:20px;line-height:26px;margin:40px 0 16px}
 .catalogo{display:grid;gap:24px;grid-template-columns:repeat(auto-fill,minmax(min(100%%,340px),1fr))}
 .pieza h3{font-size:14px;line-height:18px;font-weight:600;margin:0 0 8px;color:#4A4540}
 .pieza h3 code{font-family:inherit;font-weight:400;color:#706B65;margin-left:6px}
 details{margin-top:8px;font-size:12px;color:#4A4540}
 summary{cursor:pointer}
 pre{background:#fff;border:1px solid #DBD5CE;border-radius:8px;padding:12px 16px;overflow-x:auto;font-size:12px;line-height:17px}
</style></head>
<body class="eg-pagina"><main class="contenedor">
<h1>Vista previa del kit v%(v)s</h1>
<p class="intro">Los %(n)d componentes del kit, dibujados con los ejemplos de la carpeta <code>ejemplos/</code>. Los datos son ilustrativos. Necesita conexión a internet para cargar ECharts y la tipografía.</p>
%(cuerpo)s
</main>
<script>
%(llamadas)s
</script></body></html>
""" % {"v": corto, "n": n, "cuerpo": "\n".join(partes), "llamadas": "\n".join(llamadas)}
open(os.path.join(RAIZ, 'vista-previa.html'), 'w').write(pagina)
print('vista-previa.html:', n, 'componentes')
