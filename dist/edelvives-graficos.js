/*!
 * Edelvives Gráficos v0.9.2
 * Sistema de gráficos y métricas de Edelvives. Modo web.
 * Uso: EdelvivesGraficos.render('#destino', especificacion)
 * Iconos: Material Symbols (Google), licencia Apache 2.0.
 */
(function (global) {
  'use strict';

  var VERSION = '0.9.2';
  var config = {
    echarts: [
      'https://cdn.jsdelivr.net/npm/echarts@6.1.0/dist/echarts.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/echarts/6.1.0/echarts.min.js'
    ],
    fuente: 'https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600;700&display=swap',
    /* Carpeta de los contornos de los mapas (TopoJSON); se cargan solo al dibujar un mapa */
    mapas: 'https://cdn.jsdelivr.net/npm/edelvives-graficos@0.9.2/dist/mapas/'
  };
  var PREFIJO = '[EdelvivesGraficos] ';
  var NBSP = '\u00A0';

  /* ------------------------------------------------------------------ */
  /* Tokens (fuente: Figma «Gráficos y métricas Edelvives», modo claro)   */
  /* ------------------------------------------------------------------ */
  var P = {
    naranja100: '#FFECD4', naranja200: '#FFCEA3', naranja300: '#FFAF73', naranja400: '#FF801F',
    naranja500: '#F56A00', naranja600: '#D95003', naranja700: '#BD4200',
    neutro000: '#FFFFFF', neutro100: '#F7F4F2', neutro200: '#F0EDEA', neutro300: '#DBD5CE',
    neutro400: '#A39B93', neutro500: '#706B65', neutro600: '#4A4540', neutro700: '#222222', neutro800: '#000000',
    exito: '#20BA76', exitoFuerte: '#0D6B43', exitoSuave: '#D1F7E8',
    alerta: '#FFB521', alertaFuerte: '#8B6200', alertaSuave: '#FFF3D0',
    error: '#D0021B', errorFuerte: '#720010', errorSuave: '#FAD4D8'
  };
  var T = {
    series: [P.naranja500, P.neutro600, P.naranja300, P.neutro400, P.naranja700, P.naranja200],
    otros: P.neutro300,
    lineas: [P.naranja500, P.neutro600, P.naranja700, P.neutro500],
    actual: P.naranja500, objetivo: P.neutro700, anterior: P.neutro400, prevision: P.naranja500,
    fondo: P.neutro000, fondoPagina: P.neutro100, rejilla: P.neutro200, base: P.neutro400,
    etiquetaEje: P.neutro500, leyenda: P.neutro600, titulo: P.neutro700, etiquetaDato: P.neutro700,
    texto: P.neutro700, textoSecundario: P.neutro500, borde: P.neutro300, pista: P.neutro300,
    tooltip: P.neutro700, subida: P.naranja500, bajada: P.neutro600
  };
  var FUENTE = "'Titillium Web', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

  var ICONOS = {"subida":"M328-400q-9 0-14.5-6t-5.5-14q0-2 6-14l145-145q5-5 10-7t11-2q6 0 11 2t10 7l145 145q3 3 4.5 6.5t1.5 7.5q0 8-5.5 14t-14.5 6H328Z","bajada":"M459-381 314-526q-3-3-4.5-6.5T308-540q0-8 5.5-14t14.5-6h304q9 0 14.5 6t5.5 14q0 2-6 14L501-381q-5 5-10 7t-11 2q-6 0-11-2t-10-7Z","sinCambio":"M240-440q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h480q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H240Z","cumplido":"m382-354 339-339q12-12 28-12t28 12q12 12 12 28.5T777-636L410-268q-12 12-28 12t-28-12L182-440q-12-12-11.5-28.5T183-497q12-12 28.5-12t28.5 12l142 143Z","objetivo":"M280-400v240q0 17-11.5 28.5T240-120q-17 0-28.5-11.5T200-160v-600q0-17 11.5-28.5T240-800h287q14 0 25 9t14 23l10 48h184q17 0 28.5 11.5T800-680v320q0 17-11.5 28.5T760-320H553q-14 0-25-9t-14-23l-10-48H280Zm306 0h134v-240H543q-14 0-25-9t-14-23l-10-48H280v240h257q14 0 25 9t14 23l10 48Zm-86-160Z","info":"M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z","periodo":"M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-40q0-17 11.5-28.5T280-880q17 0 28.5 11.5T320-840v40h320v-40q0-17 11.5-28.5T680-880q17 0 28.5 11.5T720-840v40h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z","tendenciaSube":"M108-255q-12-12-11.5-28.5T108-311l211-214q23-23 57-23t57 23l103 104 208-206h-64q-17 0-28.5-11.5T640-667q0-17 11.5-28.5T680-707h160q17 0 28.5 11.5T880-667v160q0 17-11.5 28.5T840-467q-17 0-28.5-11.5T800-507v-64L593-364q-23 23-57 23t-57-23L376-467 164-255q-11 11-28 11t-28-11Z","tendenciaBaja":"M744-320 536-526 433-423q-23 23-57 23t-57-23L108-636q-11-11-11.5-27.5T108-692q11-11 28-11t28 11l212 212 103-103q23-23 57-23t57 23l207 207v-64q0-17 11.5-28.5T840-480q17 0 28.5 11.5T880-440v160q0 17-11.5 28.5T840-240H680q-17 0-28.5-11.5T640-280q0-17 11.5-28.5T680-320h64Z","entregado":"m424-408-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-408Zm56 328q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z","enCurso":"M520-496v-144q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v159q0 8 3 15.5t9 13.5l132 132q11 11 28 11t28-11q11-11 11-28t-11-28L520-496ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z","incidencia":"M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm0-160q17 0 28.5-11.5T520-480v-160q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v160q0 17 11.5 28.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z","pendiente":"M320-440h320q17 0 28.5-11.5T680-480q0-17-11.5-28.5T640-520H320q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"};

  function icono(nombre, color, tam) {
    tam = tam || 16;
    return '<svg class="eg-icono" width="' + tam + '" height="' + tam + '" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path fill="' + color + '" d="' + ICONOS[nombre] + '"/></svg>';
  }

  /* ------------------------------------------------------------------ */
  /* Formato de números (es-ES, agrupación siempre con punto)             */
  /* ------------------------------------------------------------------ */
  function agrupar(entero) { return entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

  function numero(v, dec) {
    if (dec == null) dec = (Math.round(v) === v) ? 0 : 1;
    var partes = Math.abs(v).toFixed(dec).split('.');
    var txt = agrupar(partes[0]) + (partes[1] ? ',' + partes[1] : '');
    return (v < 0 ? '\u2212' : '') + txt;
  }

  /* Devuelve { numero, unidad, texto } */
  function formatear(v, opc) {
    opc = opc || {};
    var unidad = opc.unidad || '';
    var dec = opc.decimales;
    var sufijo = '';
    var n = v;
    if (opc.abreviar && Math.abs(v) >= 1e6) { n = v / 1e6; sufijo = 'M'; if (dec == null) dec = Math.abs(n) < 100 ? 1 : 0; }
    else if (opc.abreviar && Math.abs(v) >= 1e4) { n = v / 1e3; sufijo = 'mil'; if (dec == null) dec = 0; }
    if (dec == null) dec = (Math.round(n) === n) ? 0 : 1;
    var num = numero(n, dec);
    var u;
    if (sufijo === 'M') u = unidad === '€' ? 'M€' : ('M' + (unidad ? ' ' + unidad : ''));
    else if (sufijo === 'mil') u = 'mil' + (unidad ? ' ' + unidad : '');
    else u = unidad;
    return { numero: num, unidad: u, texto: num + (u ? NBSP + u : '') };
  }

  function formatoEje(v) {
    if (Math.abs(v) >= 1e6) return numero(v / 1e6, (v / 1e6) % 1 === 0 ? 0 : 1) + NBSP + 'M';
    if (Math.abs(v) >= 1e4) return numero(v / 1e3, 0) + NBSP + 'mil';
    return numero(v, v % 1 === 0 ? 0 : 1);
  }

  function porcentaje(v, dec) { return numero(v, dec == null ? (Math.abs(v) < 10 && Math.round(v) !== v ? 1 : 0) : dec) + NBSP + '%'; }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ------------------------------------------------------------------ */
  /* Validador                                                           */
  /* ------------------------------------------------------------------ */
  var TIPOS = ['barras', 'barras-divergentes', 'puntos', 'dos-momentos', 'bullet', 'ranking', 'tabla',
    'lineas', 'areas', 'sparkline', 'kpi', 'kpi-rejilla', 'progreso', 'sectores', 'treemap', 'proporcion', 'marimekko',
    'cascada', 'descomposicion', 'histograma', 'cajas', 'casos', 'distribucion', 'percentiles', 'rangos',
    'dispersion', 'matriz', 'radar', 'coordenadas-paralelas', 'embudo', 'etapas', 'recorrido',
    'cronologia', 'gantt', 'calendario', 'dos-periodos', 'ciclo-vida', 'particion', 'circulos-anidados', 'arbol', 'anidados',
    'sankey', 'cuerdas', 'flujo', 'red', 'mapa', 'cartograma'];
  /* Nombres antiguos que siguen funcionando durante la serie 0.x */
  var ALIAS = {
    'barras-agrupadas': { tipo: 'barras', variante: 'agrupadas' },
    'barras-progreso': { tipo: 'progreso', variante: 'barras' },
    'donut': { tipo: 'sectores', variante: 'donut' },
    'kpi-simple': { tipo: 'kpi' }, 'kpi-variacion': { tipo: 'kpi' }, 'kpi-objetivo': { tipo: 'kpi' }, 'kpi-sparkline': { tipo: 'kpi' }, 'kpi-contexto': { tipo: 'kpi' }
  };
  /* Variantes por tipo: las disponibles en esta versión y las previstas para tandas posteriores */
  var VARIANTES = {
    'barras': { disponibles: ['verticales', 'horizontales', 'agrupadas', 'apiladas', 'apiladas-100', 'con-referencia', 'vs-anterior', 'vs-prevision'], previstas: [] },
    'barras-divergentes': { disponibles: ['centro', 'piramide', 'desviacion', 'desviacion-pct', 'contribucion', 'desviacion-objetivo'], previstas: [] },
    'puntos': { disponibles: ['puntos', 'piruleta'], previstas: [] },
    'dos-momentos': { disponibles: ['pesas', 'pendiente', 'antes-despues'], previstas: [] },
    'bullet': { disponibles: ['horizontal'], previstas: [] },
    'ranking': { disponibles: ['lista', 'evolucion'], previstas: [] },
    'tabla': { disponibles: ['comparativa', 'con-barras', 'con-estados', 'scorecard', 'semaforo', 'jerarquica'], previstas: [] },
    'progreso': { disponibles: ['barras', 'anillo', 'medidor', 'ritmo', 'distancia'], previstas: [] },
    'kpi-rejilla': { disponibles: ['scorecard'], previstas: [] },
    'lineas': { disponibles: ['simple', 'multiples', 'escalonada', 'tendencia', 'acumulada', 'media-movil', 'referencia', 'objetivo', 'prevision', 'vs-prevision', 'vs-anterior'], previstas: [] },
    'areas': { disponibles: ['simple', 'superpuestas', 'apiladas', 'apiladas-100'], previstas: [] },
    'sparkline': { disponibles: ['linea'], previstas: [] },
    'sectores': { disponibles: ['donut', 'pie', 'semidonut'], previstas: [] },
    'treemap': { disponibles: ['plano', 'jerarquico'], previstas: [] },
    'proporcion': { disponibles: ['barra', 'cuota', 'participacion', 'waffle'], previstas: [] },
    'marimekko': { disponibles: ['marimekko'], previstas: [] },
    'cascada': { disponibles: ['vertical', 'horizontal'], previstas: [] },
    'descomposicion': { disponibles: ['paneles'], previstas: [] },
    'histograma': { disponibles: ['histograma'], previstas: [] },
    'cajas': { disponibles: ['caja', 'violin'], previstas: [] },
    'casos': { disponibles: ['apilados', 'dispersos', 'enjambre'], previstas: [] },
    'distribucion': { disponibles: ['densidad', 'normal', 'acumulada'], previstas: [] },
    'percentiles': { disponibles: ['percentiles'], previstas: [] },
    'rangos': { disponibles: ['rango', 'min-max', 'intervalo'], previstas: [] },
    'dispersion': { disponibles: ['simple', 'tendencia', 'burbujas', 'burbujas-categoria', 'cuadrantes', 'conectada', 'hexagonos'], previstas: [] },
    'matriz': { disponibles: ['correlacion-color', 'correlacion-valores', 'cohortes'], previstas: [] },
    'radar': { disponibles: ['perfil', 'dos-perfiles'], previstas: [] },
    'coordenadas-paralelas': { disponibles: ['paralelas'], previstas: [] },
    'embudo': { disponibles: ['embudo', 'conversion', 'retencion'], previstas: [] },
    'etapas': { disponibles: ['pipeline', 'proceso', 'progresion'], previstas: [] },
    'recorrido': { disponibles: ['experiencia'], previstas: [] },
    'cronologia': { disponibles: ['hitos', 'carriles', 'vertical'], previstas: [] },
    'gantt': { disponibles: ['gantt'], previstas: [] },
    'calendario': { disponibles: ['calor', 'mes'], previstas: [] },
    'dos-periodos': { disponibles: ['superpuestos', 'interanual'], previstas: [] },
    'ciclo-vida': { disponibles: ['fases'], previstas: [] },
    'particion': { disponibles: ['sunburst', 'icicle'], previstas: [] },
    'circulos-anidados': { disponibles: ['circulos'], previstas: [] },
    'arbol': { disponibles: ['ramas', 'dendrograma', 'organigrama'], previstas: [] },
    'anidados': { disponibles: ['contenedores'], previstas: [] },
    'sankey': { disponibles: ['sankey', 'aluvial', 'recorrido'], previstas: [] },
    'cuerdas': { disponibles: ['cuerdas'], previstas: [] },
    'flujo': { disponibles: ['flechas'], previstas: [] },
    'red': { disponibles: ['comunidades', 'bipartita', 'radial', 'dependencias'], previstas: [] },
    'mapa': { disponibles: ['coropletas', 'puntos', 'burbujas', 'simbolos', 'rejilla', 'hexagonos', 'categorias', 'flujos', 'ruta', 'conexiones', 'con-ranking'], previstas: [] },
    'cartograma': { disponibles: ['fichas'], previstas: [] }
  };
  var ROLES = ['actual', 'anterior', 'objetivo', 'prevision'];
  /* Estados: siempre icono + texto + color, en este orden fijo */
  var ESTADOS = {
    'entregado': { texto: 'Entregado', icono: 'entregado', fondo: P.exitoSuave, color: P.exitoFuerte },
    'en-proceso': { texto: 'En proceso', icono: 'enCurso', fondo: P.alertaSuave, color: P.alertaFuerte },
    'incidencia': { texto: 'Incidencia', icono: 'incidencia', fondo: P.errorSuave, color: P.errorFuerte },
    'pendiente': { texto: 'Pendiente', icono: 'pendiente', fondo: P.neutro100, color: P.neutro600 },
    /* Estados frente a un objetivo */
    'en-objetivo': { texto: 'En objetivo', icono: 'cumplido', fondo: P.exitoSuave, color: P.exitoFuerte },
    'en-riesgo': { texto: 'En riesgo', icono: 'enCurso', fondo: P.alertaSuave, color: P.alertaFuerte },
    'fuera': { texto: 'Fuera de objetivo', icono: 'incidencia', fondo: P.errorSuave, color: P.errorFuerte }
  };
  var COLUMNAS = ['texto', 'numero', 'porcentaje', 'variacion', 'barra', 'sparkline', 'estado', 'fecha'];

  function esNum(x) { return typeof x === 'number' && isFinite(x); }
  function esTexto(x) { return typeof x === 'string' && x.trim() !== ''; }
  function listaNum(x) { return Array.isArray(x) && x.length > 0 && x.every(esNum); }
  function listaTexto(x) { return Array.isArray(x) && x.length > 0 && x.every(esTexto); }
  function copia(o) { return JSON.parse(JSON.stringify(o)); }
  function suma(arr) { return arr.reduce(function (a, b) { return a + b; }, 0); }
  /* Dos cifras cuadran si difieren menos del 0,5 % de la escala (admite el redondeo de los datos) */
  function cuadra(a, b, escala) { return Math.abs(a - b) <= Math.max(1e-9, Math.abs(escala || b) * 0.005); }

  /* ---- Validación de los tipos con variantes (familia Comparación) ---- */
  function variantePorDefecto(s) {
    var d = s.datos || {};
    switch (s.tipo) {
      case 'barras': return d.prevision ? 'vs-prevision' : (Array.isArray(d.series) && d.series.length > 1 ? 'agrupadas' : 'verticales');
      case 'barras-divergentes': return Array.isArray(d.series) ? 'piramide' : 'centro';
      case 'puntos': return 'puntos';
      case 'dos-momentos': return 'pesas';
      case 'bullet': return 'horizontal';
      case 'ranking': return d.periodos ? 'evolucion' : 'lista';
      case 'lineas':
        if (d.prevision && Array.isArray(d.series) && d.series[0] && Array.isArray(d.series[0].valores) && Array.isArray(d.periodos))
          return d.series[0].valores.length < d.periodos.length ? 'prevision' : 'vs-prevision';
        return Array.isArray(d.series) && d.series.length > 1 ? 'multiples' : 'simple';
      case 'areas': return Array.isArray(d.series) && d.series.length > 1 ? 'apiladas' : 'simple';
      case 'sparkline': return 'linea';
      case 'progreso': return 'barras';
      case 'kpi-rejilla': return 'scorecard';
      case 'sectores': return 'donut';
      case 'treemap': return d.arbol != null || d.filas != null ? 'jerarquico' : 'plano';
      case 'particion': return 'sunburst';
      case 'circulos-anidados': return 'circulos';
      case 'arbol': return d.elementos != null || d.valores != null || s.grupos != null || s.corte != null ? 'dendrograma' : 'ramas';
      case 'anidados': return 'contenedores';
      case 'sankey': return d.momentos != null ? 'aluvial' : (d.etapas != null ? 'recorrido' : 'sankey');
      case 'cuerdas': return 'cuerdas';
      case 'flujo': return 'flechas';
      case 'red':
        if (d.centro != null) return 'radial';
        if (s.ruta != null || (Array.isArray(d.nodos) && d.nodos.some(function (n) { return n && n.duracion != null; }))) return 'dependencias';
        return s.columnas != null ? 'bipartita' : 'comunidades';
      case 'mapa':
        if (d.paradas != null) return 'ruta';
        if (d.origen != null || d.destinos != null) return 'flujos';
        if (d.enlaces != null) return 'conexiones';
        if (d.categorias != null) return 'categorias';
        if (d.puntos != null) return s.celda != null ? 'rejilla' : (Array.isArray(d.puntos) && d.puntos.length > 3000 ? 'hexagonos' : 'puntos');
        if (s.porPunto != null) return 'puntos';
        return s.ranking != null ? 'con-ranking' : 'coropletas';
      case 'cartograma': return 'fichas';
      case 'proporcion': return d.valor != null ? 'cuota' : 'barra';
      case 'marimekko': return 'marimekko';
      case 'cascada': return 'vertical';
      case 'descomposicion': return 'paneles';
      case 'histograma': return 'histograma';
      case 'cajas': return 'caja';
      case 'casos': return Array.isArray(d.series) ? 'dispersos' : 'apilados';
      case 'distribucion': return d.media != null || d.desviacion != null ? 'normal' : 'densidad';
      case 'percentiles': return 'percentiles';
      case 'rangos': return s.confianza != null ? 'intervalo' : (d.periodos != null ? 'min-max' : 'rango');
      case 'dispersion':
        if (d.periodos != null) return 'conectada';
        if (s.cuadrantes != null || s.cortes != null) return 'cuadrantes';
        var grupos = Array.isArray(d.series) ? d.series : null;
        if (d.tamanos != null || (grupos && grupos.some(function (g) { return g && g.tamanos != null; }))) return grupos && grupos.length > 1 ? 'burbujas-categoria' : 'burbujas';
        return !grupos && Array.isArray(d.x) && d.x.length > 500 ? 'hexagonos' : 'simple';
      case 'matriz': return d.cohortes != null ? 'cohortes' : 'correlacion-color';
      case 'radar': return Array.isArray(d.series) && d.series.length === 2 ? 'dos-perfiles' : 'perfil';
      case 'coordenadas-paralelas': return 'paralelas';
      case 'embudo': return d.periodos != null && d.etapas == null ? 'retencion' : 'embudo';
      case 'etapas': return d.casos != null ? 'pipeline' : (d.pasos != null ? 'proceso' : 'progresion');
      case 'recorrido': return 'experiencia';
      case 'cronologia':
        var ev = Array.isArray(d.eventos) ? d.eventos : [];
        if (d.carriles != null || ev.some(function (e) { return e && (e.carril != null || e.inicio != null); })) return 'carriles';
        return d.actual != null || d.terminado != null || ev.some(function (e) { return e && e.descripcion != null; }) ? 'vertical' : 'hitos';
      case 'gantt': return 'gantt';
      case 'calendario': return d.mes != null ? 'mes' : 'calor';
      case 'dos-periodos': return 'superpuestos';
      case 'ciclo-vida': return 'fases';
      case 'tabla':
        if (d.indicadores) return 'scorecard';
        if (d.arbol != null || (d.filas != null && d.columnas == null)) return 'jerarquica';
        var tipos = Array.isArray(d.columnas) ? d.columnas.map(function (c) { return c && c.tipo; }) : [];
        return tipos.indexOf('estado') >= 0 ? 'con-estados' : (tipos.indexOf('barra') >= 0 ? 'con-barras' : 'comparativa');
    }
    return null;
  }

  function validarVariantes(s, err, aviso) {
    var t = s.tipo, d = s.datos, cfg = VARIANTES[t];
    if (s.variante == null) s.variante = variantePorDefecto(s);
    var v = s.variante;
    if (cfg.disponibles.indexOf(v) < 0) {
      if (cfg.previstas.indexOf(v) >= 0) err('la variante «' + v + '» está prevista pero todavía no está disponible en esta versión del kit.');
      else err('«variante» no válida. Usa una de: ' + cfg.disponibles.join(', ') + '.');
      return;
    }
    if (s.orden != null && s.orden !== 'valor' && s.orden !== 'natural') err('«orden» debe ser "valor" (de mayor a menor) o "natural" (el orden de los datos).');
    var SIN_NEGATIVOS = 'Las barras parten de cero; para valores con signo usa el tipo barras-divergentes.';

    function categorias(max, consejo) {
      if (!listaTexto(d.categorias)) { err('«datos.categorias» debe ser una lista de textos.'); return 0; }
      if (max && d.categorias.length > max) { err('hay ' + d.categorias.length + ' categorías y el máximo es ' + max + '.' + (consejo ? ' ' + consejo : '')); return 0; }
      return d.categorias.length;
    }
    function numeros(etiqueta, arr, n, motivoPositivos) {
      if (!listaNum(arr)) { err(etiqueta + ' debe ser una lista de números.'); return false; }
      if (n && arr.length !== n) { err(etiqueta + ' tiene ' + arr.length + ' valores y hay ' + n + ' categorías.'); return false; }
      if (motivoPositivos && arr.some(function (x) { return x < 0; })) { err(etiqueta + ' tiene valores negativos. ' + motivoPositivos); return false; }
      return true;
    }
    function series(min, max, n, motivoPositivos, consejo) {
      if (!Array.isArray(d.series) || !d.series.length) { err('«datos.series» debe ser una lista de series { nombre, valores }.'); return false; }
      if (d.series.length < min || d.series.length > max) {
        err(min === max ? 'necesita exactamente ' + min + ' series y hay ' + d.series.length + '.' : 'hay ' + d.series.length + (d.series.length === 1 ? ' serie' : ' series') + ' y ' + (d.series.length < min ? 'el mínimo es ' + min : 'el máximo es ' + max) + '.' + (consejo ? ' ' + consejo : ''));
        return false;
      }
      var ok = true;
      d.series.forEach(function (se, i) {
        if (!se || typeof se !== 'object') { err('la serie ' + (i + 1) + ' debe ser un objeto { nombre, valores }.'); ok = false; return; }
        if (!esTexto(se.nombre)) { err('la serie ' + (i + 1) + ' no tiene «nombre».'); ok = false; }
        if (!numeros('la serie «' + (se.nombre || i + 1) + '»', se.valores, n, motivoPositivos)) ok = false;
        if (se.rol && ROLES.indexOf(se.rol) < 0) { err('«rol» de la serie «' + se.nombre + '» no válido. Usa: ' + ROLES.join(', ') + '.'); ok = false; }
      });
      return ok;
    }
    /* Una sola serie: admite datos.valores (preferido) o una serie única */
    function unaSerie(n, motivoPositivos, consejo) {
      if (d.valores != null) {
        if (numeros('«datos.valores»', d.valores, n, motivoPositivos)) d.series = [{ nombre: s.titulo, valores: d.valores }];
      } else if (Array.isArray(d.series) && d.series.length > 1) {
        err('esta variante lleva una sola serie: usa «datos.valores».' + (consejo ? ' ' + consejo : ''));
      } else if (Array.isArray(d.series) && d.series.length === 1) {
        series(1, 1, n, motivoPositivos);
      } else err('falta «datos.valores» (una lista de números, uno por categoría).');
    }
    function destacar(nombres, que) {
      if (s.destacar == null) return;
      if (!esTexto(s.destacar) || nombres.indexOf(s.destacar) < 0) err('«destacar» debe coincidir exactamente con ' + que + '.');
    }
    var n;

    if (t === 'barras') {
      if (v === 'verticales') { n = categorias(8, 'Con más categorías o nombres largos usa la variante "horizontales".'); unaSerie(n, SIN_NEGATIVOS, 'Para varias series usa "agrupadas" o "apiladas".'); }
      if (v === 'horizontales') { n = categorias(12, 'Agrupa las menores en «Otros» o usa el tipo ranking.'); unaSerie(n, SIN_NEGATIVOS, 'Para varias series usa "agrupadas" o "apiladas".'); }
      if (v === 'agrupadas') { n = categorias(6, 'Divide el gráfico o agrupa categorías.'); series(1, 3, n, SIN_NEGATIVOS, 'Usa varios gráficos o la variante "apiladas".'); }
      if (v === 'apiladas' || v === 'apiladas-100') { n = categorias(8); series(2, 5, n, 'Cada segmento es una parte del total y no puede ser negativo.', 'Agrupa las partes menores en «Otros».'); }
      if (v === 'con-referencia') {
        n = categorias(8, 'Con más categorías usa el tipo bullet o una tabla.');
        unaSerie(n, SIN_NEGATIVOS);
        if (d.objetivos == null) err('falta «datos.objetivos»: un número (la misma referencia para todas) o una lista con uno por categoría.');
        else if (Array.isArray(d.objetivos)) numeros('«datos.objetivos»', d.objetivos, n);
        else if (!esNum(d.objetivos)) err('«datos.objetivos» debe ser un número o una lista de números.');
        if (s.nombreObjetivo != null && !esTexto(s.nombreObjetivo)) err('«nombreObjetivo» debe ser un texto (por ejemplo "Objetivo" o "Media").');
        if (s.cumplimiento != null && typeof s.cumplimiento !== 'boolean') err('«cumplimiento» debe ser true o false.');
        if (s.cumplimiento && [].concat(d.objetivos).some(function (x) { return esNum(x) && x <= 0; })) err('con «cumplimiento» los objetivos deben ser mayores que cero: el kit calcula el % alcanzado.');
      }
      if (s.cumplimiento != null && v !== 'con-referencia') aviso('«cumplimiento» solo se usa en la variante "con-referencia"; se ignora.');
      /* Variación: los periodos pueden ir en «periodos» o en «categorias» */
      if ((v === 'vs-anterior' || v === 'vs-prevision') && d.categorias == null && d.periodos != null) d.categorias = d.periodos;
      if (v === 'vs-anterior') {
        n = categorias(12, 'Para series más largas usa lineas · vs-anterior.');
        if (!Array.isArray(d.series)) err('esta variante necesita «datos.series» con 2 series { nombre, valores }: el periodo actual y el anterior (con rol:"anterior").');
        else if (series(2, 2, n, SIN_NEGATIVOS, 'La primera serie es el periodo actual y la segunda, el anterior.')) {
          var iAnt = -1;
          d.series.forEach(function (se, i) { if (se.rol === 'anterior') iAnt = i; });
          if (iAnt < 0) d.series[1].rol = 'anterior';
          else if (iAnt === 0) d.series.reverse();
        }
      }
      if (v === 'vs-prevision') {
        n = categorias(12, 'Para series más largas usa lineas · prevision.');
        var real = d.valores != null ? d.valores : (Array.isArray(d.series) && d.series.length === 1 && d.series[0] ? d.series[0].valores : null);
        var realOK = false;
        if (!listaNum(real)) err('falta «datos.valores»: lo real, un número por cada periodo cerrado (los periodos siguientes son la previsión).');
        else if (n && real.length >= n) err('«datos.valores» (lo real) tiene ' + real.length + ' valores y hay ' + n + ' periodos: deja sin dato real los periodos de la previsión.');
        else if (real.some(function (x) { return x < 0; })) err('«datos.valores» tiene valores negativos. ' + SIN_NEGATIVOS);
        else realOK = true;
        var pvb = d.prevision;
        if (!pvb || typeof pvb !== 'object') err('falta «datos.prevision»: { valores, origen }, con un valor por cada periodo sin dato real.');
        else {
          if (!listaNum(pvb.valores)) err('«datos.prevision.valores» debe ser una lista de números.');
          else if (n && realOK && pvb.valores.length !== n - real.length) err('«datos.prevision.valores» tiene ' + pvb.valores.length + (pvb.valores.length === 1 ? ' valor' : ' valores') + ' y deberían ser ' + (n - real.length) + ' (uno por cada periodo sin dato real).');
          else if (pvb.valores.some(function (x) { return x < 0; })) err('«datos.prevision.valores» tiene valores negativos. ' + SIN_NEGATIVOS);
          if (!esTexto(pvb.origen)) err('falta «datos.prevision.origen»: indica de dónde sale la previsión (por ejemplo "Plan comercial 2026" o "Modelo estadístico").');
          if (pvb.minimo != null || pvb.maximo != null) aviso('la banda de incertidumbre solo se dibuja en lineas · prevision; se ignora.');
        }
        if (realOK) d.series = [{ nombre: 'Real', valores: real }];
      }
    }

    if (t === 'barras-divergentes') {
      if (v === 'centro') {
        n = categorias(12);
        numeros('«datos.valores»', d.valores, n);
        if (!esTexto(s.referencia)) err('falta «referencia»: indica qué representa el eje central (por ejemplo "vs. media nacional", "vs. objetivo" o "vs. 2025").');
      }
      if (v === 'piramide') { n = categorias(12); series(2, 2, n, 'En una pirámide cada lado parte de cero.'); }
      if (v === 'desviacion-objetivo') {
        n = categorias(12);
        numeros('«datos.valores»', d.valores, n);
        if (s.referencia == null) s.referencia = 'vs. objetivo';
        if (s.limiteRiesgo == null) { if (s.unidad === '%') s.limiteRiesgo = -10; else err('falta «limiteRiesgo»: la desviación negativa a partir de la cual el indicador queda fuera de objetivo (con "%", por defecto −10).'); }
        else if (!esNum(s.limiteRiesgo) || s.limiteRiesgo >= 0) err('«limiteRiesgo» debe ser un número negativo.');
      }
      if (v === 'desviacion' || v === 'desviacion-pct') {
        /* Con «periodos» la desviación se dibuja en columnas; con «categorias», en barras horizontales. La de % siempre en columnas. */
        d._columnas = v === 'desviacion-pct' || (d.categorias == null && d.periodos != null);
        if (d.categorias == null && d.periodos != null) d.categorias = d.periodos;
        n = categorias(12, d._columnas ? 'Agrupa los periodos (por ejemplo, por trimestres) o usa el tipo lineas.' : 'Muestra las principales o agrupa el resto.');
        numeros('«datos.valores»', d.valores, n);
        if (!esTexto(s.referencia)) err('falta «referencia»: indica frente a qué se mide la desviación (por ejemplo "vs. plan", "vs. presupuesto" o "vs. 2025").');
        if (v === 'desviacion-pct') {
          if (s.unidad !== '%') err('la variante «desviacion-pct» dibuja variaciones en %: usa unidad "%". Para desviaciones en ' + (s.unidad || 'unidades') + ' usa la variante "desviacion".');
          if (s.decimales == null) s.decimales = 1;
        }
        if (s.lados != null) {
          if (!(Array.isArray(s.lados) && s.lados.length === 2 && s.lados.every(esTexto))) err('«lados» debe ser una lista de 2 textos: el lado negativo y el positivo (por ejemplo ["Bajo el plan", "Sobre el plan"]).');
          else if (d._columnas) aviso('«lados» solo se rotula en las barras horizontales (con «datos.categorias»); se ignora.');
        }
      }
      if (v === 'contribucion') {
        n = categorias(10, 'Agrupa los factores menores en «Otros».');
        if (numeros('«datos.valores»', d.valores, n) && d.total != null) {
          var sumaF = suma(d.valores);
          if (!esNum(d.total)) err('«datos.total» debe ser un número: el cambio total, que debe coincidir con la suma de los factores.');
          else if (!cuadra(sumaF, d.total, Math.max(Math.abs(d.total), Math.max.apply(null, d.valores.map(Math.abs))))) err('los factores suman ' + numero(sumaF, 2).replace(/,?0+$/, '') + ' y «datos.total» es ' + numero(d.total, 2).replace(/,?0+$/, '') + ': la contribución no cuadra. Revisa los valores o añade un factor «Otros» con la diferencia.');
        }
        if (!esTexto(s.referencia)) err('falta «referencia»: el cambio que se explica (por ejemplo "crecimiento de ventas vs. 2025").');
        if (s.nombreTotal != null && !esTexto(s.nombreTotal)) err('«nombreTotal» debe ser un texto (por ejemplo "Cambio total").');
      }
      if (s.lados != null && v !== 'desviacion') aviso('«lados» solo se usa en la variante "desviacion"; se ignora.');
    }

    if (t === 'puntos') {
      n = categorias(v === 'puntos' ? 15 : 12);
      numeros('«datos.valores»', d.valores, n, v === 'piruleta' ? 'El tallo parte de cero; para valores con signo usa barras-divergentes.' : null);
      if (n) destacar(d.categorias, 'una de «datos.categorias»');
    }

    if (t === 'dos-momentos') {
      var maxDM = { pesas: 10, pendiente: 8, 'antes-despues': 6 }[v];
      n = categorias(maxDM, v === 'pendiente' ? 'Con más categorías las etiquetas se solapan: usa la variante "pesas".' : (v === 'antes-despues' ? 'Con más categorías usa la variante "pesas".' : ''));
      series(2, 2, n, v === 'antes-despues' ? 'Las columnas parten de cero; para cambios con signo usa barras-divergentes · desviacion.' : null);
      if (v === 'antes-despues') { if (s.destacar != null) aviso('en «antes-despues» todas las categorías van igual; se ignora «destacar».'); }
      else if (n) destacar(d.categorias, 'una de «datos.categorias»');
    }

    /* ---- Variación: cascada y descomposición ---- */
    if (t === 'cascada') {
      if (esNum(d.inicio)) d.inicio = { valor: d.inicio };
      if (esNum(d.final)) d.final = { valor: d.final };
      var inicioOK = d.inicio && typeof d.inicio === 'object' && esNum(d.inicio.valor);
      if (!inicioOK) err('falta «datos.inicio»: { etiqueta, valor } con el valor de partida (por ejemplo { etiqueta: "2025", valor: 1200 }).');
      else if (d.inicio.etiqueta != null && !esTexto(d.inicio.etiqueta)) err('«datos.inicio.etiqueta» debe ser un texto (por defecto "Inicio").');
      var maxPasos = v === 'vertical' ? 8 : 10;
      if (listaTexto(d.categorias) && d.categorias.length > maxPasos) { err('hay ' + d.categorias.length + ' pasos y el máximo es ' + maxPasos + '. ' + (v === 'vertical' ? 'Usa la variante "horizontal" (hasta 10) o agrupa los pasos menores en «Otros».' : 'Agrupa los pasos menores en «Otros».')); n = 0; }
      else n = categorias(maxPasos);
      var pasosOK = numeros('«datos.valores»', d.valores, n);
      var finalOK = true;
      if (d.final != null && (typeof d.final !== 'object' || (d.final.valor != null && !esNum(d.final.valor)) || (d.final.etiqueta != null && !esTexto(d.final.etiqueta)))) {
        err('«datos.final» debe ser { etiqueta, valor }: el valor es opcional (el kit lo calcula y, si lo das, comprueba que cuadra).'); finalOK = false;
      }
      if (inicioOK && pasosOK && finalOK && d.final && esNum(d.final.valor)) {
        var calculado = d.inicio.valor + suma(d.valores);
        var escala = Math.max(Math.abs(d.final.valor), Math.abs(d.inicio.valor));
        if (!cuadra(calculado, d.final.valor, escala)) err('la cascada no cuadra: el inicio (' + numero(d.inicio.valor) + ') más los pasos da ' + numero(calculado) + ' y «datos.final.valor» es ' + numero(d.final.valor) + '. Revisa los pasos o añade uno «Otros» con la diferencia.');
      }
    }

    if (t === 'descomposicion') {
      var npD = 0;
      if (!listaTexto(d.periodos)) err('«datos.periodos» debe ser una lista de textos (por ejemplo "Ene 2024", "Feb 2024").');
      else if (d.periodos.length < 8 || d.periodos.length > 156) err('hay ' + d.periodos.length + ' periodos; usa entre 8 y 156.');
      else npD = d.periodos.length;
      if (!listaNum(d.valores)) err('«datos.valores» debe ser la serie observada: un número por periodo, sin huecos.');
      else if (npD && d.valores.length !== npD) err('«datos.valores» tiene ' + d.valores.length + ' valores y hay ' + npD + ' periodos.');
      var dadas = ['tendencia', 'estacionalidad'].filter(function (k) { return d[k] != null; });
      if (dadas.length === 1) err('pasa «datos.tendencia» y «datos.estacionalidad» juntas, o ninguna de las dos y «datos.ciclo» para que el kit las calcule.');
      else if (dadas.length === 2) {
        ['tendencia', 'estacionalidad', 'residuo'].forEach(function (k) {
          if (d[k] == null) return;
          if (!listaNum(d[k])) err('«datos.' + k + '» debe ser una lista de números, uno por periodo.');
          else if (npD && d[k].length !== npD) err('«datos.' + k + '» tiene ' + d[k].length + ' valores y hay ' + npD + ' periodos.');
        });
        if (d.ciclo != null) aviso('ya pasas la tendencia y la estacionalidad; se ignora «datos.ciclo».');
      } else {
        if (d.residuo != null) err('«datos.residuo» solo se usa junto a «datos.tendencia» y «datos.estacionalidad».');
        if (!(Number.isInteger(d.ciclo) && d.ciclo >= 2 && d.ciclo <= 52)) err('falta «datos.ciclo»: los periodos que dura un ciclo estacional (12 con meses, 4 con trimestres, 7 con días). Con él el kit calcula la tendencia y la estacionalidad; si ya las tienes, pásalas en «datos.tendencia» y «datos.estacionalidad».');
        else if (npD && npD < 2 * d.ciclo) err('para separar la estacionalidad hacen falta al menos 2 ciclos completos: ' + (2 * d.ciclo) + ' periodos, y hay ' + npD + '.');
      }
      if (s.mostrarResiduo != null && typeof s.mostrarResiduo !== 'boolean') err('«mostrarResiduo» debe ser true o false.');
    }

    if (t === 'bullet') {
      if (!Array.isArray(d.metricas) || !d.metricas.length) err('«datos.metricas» debe ser una lista de { nombre, valor, objetivo, rangos }.');
      else if (d.metricas.length > 5) err('hay ' + d.metricas.length + ' métricas y el máximo es 5. Usa una tabla o varios gráficos.');
      else d.metricas.forEach(function (m, i) {
        var q = 'la métrica ' + (m && esTexto(m.nombre) ? '«' + m.nombre + '»' : i + 1);
        if (!m || typeof m !== 'object') { err(q + ' debe ser un objeto.'); return; }
        if (!esTexto(m.nombre)) err(q + ' no tiene «nombre».');
        if (!esNum(m.valor)) err(q + ' necesita «valor» numérico.');
        if (!esNum(m.objetivo)) err(q + ' necesita «objetivo» numérico. El objetivo siempre se rotula.');
        if (!listaNum(m.rangos) || m.rangos.length !== 3) err(q + ': «rangos» debe tener 3 límites superiores (bajo, medio, alto).');
        else if (!(m.rangos[0] > 0 && m.rangos[0] < m.rangos[1] && m.rangos[1] < m.rangos[2])) err(q + ': los 3 «rangos» deben ser positivos y crecientes.');
        if (esNum(m.valor) && m.valor < 0) err(q + ': el valor no puede ser negativo.');
      });
      if (s.nombreObjetivo != null && !esTexto(s.nombreObjetivo)) err('«nombreObjetivo» debe ser un texto.');
    }

    if (t === 'ranking') {
      if (v === 'lista') {
        n = categorias(30, 'Muestra solo los primeros con «limite».');
        numeros('«datos.valores»', d.valores, n);
        if (!esTexto(s.destacar)) err('falta «destacar»: el ranking señala la entidad propia. Si no hay una entidad que destacar, usa barras horizontales.');
        else if (n) destacar(d.categorias, 'una de «datos.categorias»');
        if (s.limite != null && !(Number.isInteger(s.limite) && s.limite >= 3 && s.limite <= 15)) err('«limite» debe ser un número entero entre 3 y 15.');
      }
      if (v === 'evolucion') {
        var np = 0;
        if (!listaTexto(d.periodos)) err('«datos.periodos» debe ser una lista de textos (por ejemplo "T1", "T2").');
        else if (d.periodos.length < 2 || d.periodos.length > 8) err('hay ' + d.periodos.length + ' periodos; usa entre 2 y 8.');
        else np = d.periodos.length;
        if (!Array.isArray(d.series) || d.series.length < 2 || d.series.length > 5) err('«datos.series» debe tener entre 2 y 5 series (el máximo del bump chart es 5).');
        else {
          var k = d.series.length;
          d.series.forEach(function (se, i) {
            var q = 'la serie «' + (se && se.nombre || i + 1) + '»';
            if (!se || !esTexto(se.nombre)) err('la serie ' + (i + 1) + ' no tiene «nombre».');
            if (se && se.posiciones != null) {
              if (!Array.isArray(se.posiciones) || !se.posiciones.every(function (x) { return Number.isInteger(x) && x >= 1 && x <= k; })) err(q + ': «posiciones» deben ser enteros entre 1 y ' + k + '.');
              else if (np && se.posiciones.length !== np) err(q + ' tiene ' + se.posiciones.length + ' posiciones y hay ' + np + ' periodos.');
            } else if (se) {
              if (!listaNum(se.valores)) err(q + ' necesita «valores» numéricos (el kit calcula las posiciones) o «posiciones».');
              else if (np && se.valores.length !== np) err(q + ' tiene ' + se.valores.length + ' valores y hay ' + np + ' periodos.');
            }
          });
          var mezcla = d.series.some(function (se) { return se && se.posiciones != null; }) && d.series.some(function (se) { return se && se.posiciones == null; });
          if (mezcla) err('usa «posiciones» en todas las series o en ninguna.');
          destacar(d.series.map(function (se) { return se && se.nombre; }), 'el nombre de una serie');
        }
      }
    }

    /* ---- Evolución y tendencias ---- */
    if (t === 'lineas' || t === 'areas' || t === 'sparkline') {
      var listaOK = function (arr) { return Array.isArray(arr) && arr.length > 0 && arr.every(esNum); };
      if (t === 'sparkline') {
        if (!Array.isArray(d.series) || !d.series.length) { err('«datos.series» debe ser una lista de { nombre, valores }.'); return; }
        if (d.series.length > 8) err('hay ' + d.series.length + ' filas y el máximo es 8.');
        d.series.forEach(function (se, i) {
          var q = 'la serie «' + (se && se.nombre || i + 1) + '»';
          if (!se || !esTexto(se.nombre)) err('la serie ' + (i + 1) + ' no tiene «nombre».');
          if (!se || !listaOK(se.valores) || se.valores.length < 3) err(q + ' necesita al menos 3 «valores» numéricos.');
          if (se && se.unidad != null && !esTexto(se.unidad)) err(q + ': «unidad» debe ser un texto.');
          if (se && se.valor != null && !esNum(se.valor)) err(q + ': «valor» debe ser un número (por defecto, el último de la serie).');
        });
        return;
      }
      var np = 0;
      if (!listaTexto(d.periodos)) err('«datos.periodos» debe ser una lista de textos (por ejemplo "Ene", "Feb").');
      else if (d.periodos.length < 2) err('hacen falta al menos 2 periodos.');
      else np = d.periodos.length;
      var conPrevision = t === 'lineas' && v === 'prevision';
      var maxSeries = { simple: 1, multiples: 4, escalonada: 4, tendencia: 1, acumulada: 2, 'media-movil': 1, referencia: 2, objetivo: 4, prevision: 1, 'vs-prevision': 1, 'vs-anterior': 2,
        superpuestas: 4, apiladas: 5, 'apiladas-100': 5 }[v];
      var minSeries = { multiples: 2, 'vs-anterior': 2, superpuestas: 2, apiladas: 2, 'apiladas-100': 2 }[v] || 1;
      if (!Array.isArray(d.series) || !d.series.length) { err('«datos.series» debe ser una lista de series { nombre, valores }.'); return; }
      if (d.series.length > maxSeries || d.series.length < minSeries) {
        var consejo = t === 'lineas' && d.series.length > maxSeries ? (maxSeries === 1 ? ' Para varias series usa la variante "multiples".' : ' Destaca una y agrupa el resto, o usa varios gráficos.') : '';
        err('la variante «' + v + '» admite ' + (minSeries === maxSeries ? minSeries : 'de ' + minSeries + ' a ' + maxSeries) + (maxSeries === 1 ? ' serie' : ' series') + ' y hay ' + d.series.length + '.' + consejo);
        return;
      }
      var seriesOK = true;
      d.series.forEach(function (se, i) {
        var q = 'la serie «' + (se && se.nombre || i + 1) + '»';
        if (!se || !esTexto(se.nombre)) { err('la serie ' + (i + 1) + ' no tiene «nombre».'); seriesOK = false; return; }
        if (!listaOK(se.valores)) { err(q + ' necesita «valores» numéricos.'); seriesOK = false; return; }
        if (np && conPrevision) {
          if (se.valores.length < 2 || se.valores.length >= np) { err(q + ' (lo real) debe tener entre 2 y ' + (np - 1) + ' valores: los periodos restantes son la previsión.'); seriesOK = false; }
        } else if (np && t === 'lineas' && v === 'vs-prevision') {
          if (se.valores.length < 2 || se.valores.length > np) { err(q + ' tiene ' + se.valores.length + ' valores y hay ' + np + ' periodos (lo real puede acabar antes).'); seriesOK = false; }
        } else if (np && se.valores.length !== np) { err(q + ' tiene ' + se.valores.length + ' valores y hay ' + np + ' periodos.'); seriesOK = false; }
        if (t === 'areas' && se.valores.some(function (x) { return x < 0; })) { err(q + ' tiene valores negativos; un área parte de cero.'); seriesOK = false; }
        if (se.rol && ROLES.indexOf(se.rol) < 0) err('«rol» de ' + q + ' no válido. Usa: ' + ROLES.join(', ') + '.');
        if (se.rol === 'objetivo') err('el objetivo no va como serie: usa «datos.objetivo» (un número o una lista de valores por periodo).');
      });
      if (t === 'areas' && v === 'superpuestas' && seriesOK && np) {
        for (var a = 0; a < d.series.length; a++) for (var b = a + 1; b < d.series.length; b++) {
          var signos = d.series[a].valores.map(function (x, j) { return Math.sign(x - d.series[b].valores[j]); }).filter(function (x) { return x !== 0; });
          if (signos.some(function (x) { return x !== signos[0]; })) { err('las series «' + d.series[a].nombre + '» y «' + d.series[b].nombre + '» se cruzan: las áreas superpuestas se taparían. Usa la variante "apiladas" o el tipo lineas.'); a = b = 99; }
        }
      }
      if (t === 'lineas') {
        if (d.objetivo != null) {
          if (Array.isArray(d.objetivo)) { if (!listaOK(d.objetivo)) err('«datos.objetivo» debe ser un número o una lista de números.'); else if (np && d.objetivo.length !== np) err('«datos.objetivo» tiene ' + d.objetivo.length + ' valores y hay ' + np + ' periodos.'); }
          else if (!esNum(d.objetivo)) err('«datos.objetivo» debe ser un número o una lista de números.');
        }
        if (v === 'objetivo' && d.objetivo == null) err('falta «datos.objetivo»: un número (línea fija) o un valor por periodo.');
        if (v === 'referencia') {
          var r = d.referencia;
          if (!r || typeof r !== 'object') err('falta «datos.referencia»: { nombre, valor } (por ejemplo { nombre: "Media", valor: 50 }).');
          else {
            if (!esTexto(r.nombre)) err('«datos.referencia.nombre» es obligatorio: la referencia siempre se rotula (por ejemplo "Media" o "Benchmark").');
            if (Array.isArray(r.valor)) { if (!listaOK(r.valor) || (np && r.valor.length !== np)) err('«datos.referencia.valor» debe ser un número o una lista con un valor por periodo.'); }
            else if (!esNum(r.valor)) err('«datos.referencia.valor» debe ser un número o una lista con un valor por periodo.');
          }
        } else if (d.referencia != null) aviso('«datos.referencia» solo se usa en la variante "referencia"; se ignora.');
        if (v === 'tendencia' && np && np < 4) err('la tendencia necesita al menos 4 periodos.');
        if (v === 'media-movil') {
          if (s.ventana == null) s.ventana = 3;
          if (!(Number.isInteger(s.ventana) && s.ventana >= 2 && s.ventana <= 12)) err('«ventana» debe ser un número entero entre 2 y 12 (periodos que promedia la media móvil).');
          else if (np && s.ventana >= np) err('«ventana» (' + s.ventana + ') debe ser menor que el número de periodos (' + np + ').');
        }
        if (v === 'prevision' || v === 'vs-prevision') {
          var pv = d.prevision;
          if (!pv || typeof pv !== 'object') err('falta «datos.prevision»: { valores, origen } y, si hay banda de incertidumbre, «minimo» y «maximo».');
          else {
            var k = d.series[0] && Array.isArray(d.series[0].valores) ? d.series[0].valores.length : 0;
            var esperados = v === 'prevision' ? np - k : np;
            if (!listaOK(pv.valores)) err('«datos.prevision.valores» debe ser una lista de números.');
            else if (np && k && pv.valores.length !== esperados) err('«datos.prevision.valores» tiene ' + pv.valores.length + ' valores y deberían ser ' + esperados + (v === 'prevision' ? ' (los periodos sin dato real).' : ' (uno por periodo).'));
            if (!esTexto(pv.origen)) err('falta «datos.prevision.origen»: indica de dónde sale la previsión (por ejemplo "Plan comercial 2026" o "Modelo estadístico").');
            if ((pv.minimo != null) !== (pv.maximo != null)) err('la banda de incertidumbre necesita «minimo» y «maximo».');
            else if (pv.minimo != null) {
              if (v !== 'prevision') aviso('la banda de incertidumbre solo se dibuja en la variante "prevision".');
              if (!listaOK(pv.minimo) || !listaOK(pv.maximo) || !listaOK(pv.valores) || pv.minimo.length !== pv.valores.length || pv.maximo.length !== pv.valores.length) err('«minimo» y «maximo» deben tener un valor por cada valor de la previsión.');
              else if (pv.valores.some(function (x, j) { return pv.minimo[j] > x || pv.maximo[j] < x; })) err('cada valor de la previsión debe quedar entre su «minimo» y su «maximo».');
            }
          }
        } else if (d.prevision != null) aviso('«datos.prevision» solo se usa en las variantes "prevision" y "vs-prevision"; se ignora.');
        if (v === 'vs-anterior' && d.series.length === 2 && !d.series.some(function (se) { return se.rol === 'anterior'; })) d.series[1].rol = 'anterior';
      }
    }

    /* ---- Objetivos y cumplimiento ---- */
    if (t === 'progreso') {
      if (v === 'barras' || v === 'anillo' || v === 'distancia') {
        var maxP = v === 'anillo' ? 3 : 8;
        n = categorias(maxP, v === 'anillo' ? 'Para más metas usa la variante "barras".' : '');
        numeros('«datos.valores»', d.valores, n, 'El avance no puede ser negativo.');
        if (v === 'distancia' && d.objetivos == null) err('falta «datos.objetivos»: un objetivo por categoría.');
        if (d.objetivos != null && numeros('«datos.objetivos»', d.objetivos, n) && d.objetivos.some(function (x) { return x <= 0; })) err('«datos.objetivos» deben ser mayores que cero.');
        if (v !== 'distancia' && d.objetivos == null && s.unidad !== '%') err('sin «datos.objetivos», los valores deben ser porcentajes y «unidad» debe ser "%".');
      }
      if (v === 'medidor') {
        if (!esNum(d.valor)) err('falta «datos.valor».');
        if (d.minimo == null) d.minimo = 0;
        if (d.maximo == null && s.unidad === '%') d.maximo = 100;
        if (!esNum(d.minimo) || !esNum(d.maximo) || d.minimo >= d.maximo) err('indica la escala con «datos.minimo» y «datos.maximo» (con "%", por defecto de 0 a 100).');
        if (d.objetivo != null && !esNum(d.objetivo)) err('«datos.objetivo» debe ser un número.');
      }
      if (v === 'ritmo') {
        if (!esNum(d.valor)) err('falta «datos.valor» (lo conseguido hasta hoy).');
        if (!esNum(d.meta) || d.meta <= 0) err('falta «datos.meta» (la meta del periodo, mayor que cero).');
        if (!esNum(d.esperado)) err('falta «datos.esperado»: lo que se esperaba haber conseguido hoy para llegar a la meta.');
        if (d.restante != null && !esTexto(d.restante)) err('«datos.restante» debe ser un texto (por ejemplo "Quedan 5 meses").');
      }
    }

    if (t === 'kpi-rejilla') {
      if (!Array.isArray(d.indicadores) || d.indicadores.length < 2 || d.indicadores.length > 8) err('«datos.indicadores» debe tener entre 2 y 8 indicadores { nombre, valor, estado }.');
      else d.indicadores.forEach(function (x, i) {
        if (!x || !esTexto(x.nombre) || !esNum(x.valor)) err('el indicador ' + (i + 1) + ' debe tener «nombre» y «valor».');
        else if (ESTADOS_OBJETIVO.indexOf(x.estado) < 0) err('el indicador «' + x.nombre + '» necesita «estado»: "en-objetivo", "en-riesgo" o "fuera".');
      });
    }

    if (t === 'tabla' && (v === 'scorecard' || v === 'semaforo')) {
      if (!Array.isArray(d.indicadores) || !d.indicadores.length || d.indicadores.length > 12) { err('«datos.indicadores» debe tener entre 1 y 12 indicadores { nombre, valor, objetivo }.'); return; }
      d.indicadores.forEach(function (x, i) {
        if (!x || !esTexto(x.nombre) || !esNum(x.valor) || !esNum(x.objetivo) || x.objetivo <= 0) err('el indicador ' + (i + 1) + ' debe tener «nombre», «valor» y «objetivo» (mayor que cero).');
        else if (x.sentidoPositivo != null && x.sentidoPositivo !== 'subir' && x.sentidoPositivo !== 'bajar') err('«sentidoPositivo» del indicador «' + x.nombre + '» debe ser "subir" o "bajar".');
      });
      var um = s.umbrales || {};
      s.umbrales = { objetivo: esNum(um.objetivo) ? um.objetivo : 100, riesgo: esNum(um.riesgo) ? um.riesgo : 90 };
      if (s.umbrales.riesgo >= s.umbrales.objetivo) err('«umbrales.riesgo» debe ser menor que «umbrales.objetivo» (en % de cumplimiento).');
      return;
    }

    if (t === 'tabla' && v !== 'jerarquica') {
      var cols = d.columnas;
      if (!Array.isArray(cols) || cols.length < 2 || cols.length > 8) { err('«datos.columnas» debe tener entre 2 y 8 columnas { titulo, tipo }.'); return; }
      if (!Array.isArray(d.filas) || !d.filas.length) { err('«datos.filas» debe ser una lista de filas (cada fila, una lista de celdas).'); return; }
      if (d.filas.length > 20) err('hay ' + d.filas.length + ' filas y el máximo es 20. Muestra las principales o divide la tabla.');
      cols.forEach(function (c, j) {
        if (!c || !esTexto(c.titulo)) err('la columna ' + (j + 1) + ' no tiene «titulo».');
        if (c && c.tipo == null) {
          var valores = d.filas.map(function (f) { return Array.isArray(f) ? f[j] : null; }).filter(function (x) { return x != null; });
          c.tipo = j > 0 && valores.length && valores.every(esNum) ? 'numero' : (j > 0 && valores.length && valores.every(Array.isArray) ? 'sparkline' : 'texto');
        }
        if (c && COLUMNAS.indexOf(c.tipo) < 0) err('la columna «' + c.titulo + '» tiene un «tipo» no válido. Usa: ' + COLUMNAS.join(', ') + '.');
      });
      d.filas.forEach(function (f, i) {
        if (!Array.isArray(f) || f.length !== cols.length) { err('la fila ' + (i + 1) + ' debe tener ' + cols.length + ' celdas.'); return; }
        f.forEach(function (x, j) {
          var c = cols[j]; if (!c || x == null || x === '') return;
          var q = 'la celda ' + (i + 1) + '/' + (j + 1) + ' («' + c.titulo + '»)';
          if (['numero', 'porcentaje', 'variacion', 'barra'].indexOf(c.tipo) >= 0 && !esNum(x)) err(q + ' debe ser un número sin formatear.');
          if (c.tipo === 'barra' && esNum(x) && x < 0) err(q + ' es negativa; una barra parte de cero.');
          if (c.tipo === 'sparkline' && !(Array.isArray(x) && x.length >= 3 && x.every(esNum))) err(q + ' debe ser una lista de al menos 3 números.');
          if (c.tipo === 'estado') {
            var clave = typeof x === 'object' ? x.estado : x;
            if (!ESTADOS[clave]) err(q + ': estado no válido. Usa: ' + Object.keys(ESTADOS).join(', ') + ' (o { estado, texto } para cambiar el texto).');
          }
          if ((c.tipo === 'texto' || c.tipo === 'fecha') && typeof x !== 'string' && !esNum(x)) err(q + ' debe ser un texto.');
        });
      });
      var tiposCol = cols.map(function (c) { return c && c.tipo; });
      if (v === 'con-barras' && tiposCol.indexOf('barra') < 0) err('la variante «con-barras» necesita una columna de tipo "barra".');
      if (v === 'con-estados' && tiposCol.indexOf('estado') < 0) err('la variante «con-estados» necesita una columna de tipo "estado".');
    }
  }

  /* ---- Patrones de KPI: un tipo «kpi» con bloques (valor + 1 comparación + 1 visual + contexto) ---- */
  var KPI_COMPARACION = ['variacion', 'tendencia', 'objetivo', 'anterior', 'prevision', 'estado', 'ranking', 'comparado', 'benchmark'];
  var KPI_VISUAL = ['serie', 'barras', 'desglose', 'componentes', 'secundarios', 'progreso'];
  var KPI_AMBOS = ['tendencia', 'anterior', 'prevision', 'ranking', 'comparado', 'benchmark'];
  var ESTADOS_OBJETIVO = ['en-objetivo', 'en-riesgo', 'fuera'];
  /* Convierte las especificaciones kpi-* de la 0.1 al tipo kpi */
  function desdeKpiAntiguo(s) {
    var t = s.tipo; s.tipo = 'kpi';
    function quitar(k) { var v = s[k]; delete s[k]; return v; }
    if (t === 'kpi-variacion') {
      var b = { referencia: quitar('referencia'), anterior: quitar('anterior'), porcentaje: quitar('variacion'), modo: quitar('modo'), sentidoPositivo: quitar('sentidoPositivo') };
      Object.keys(b).forEach(function (k) { if (b[k] === undefined) delete b[k]; });
      s.variacion = b;
    }
    if (t === 'kpi-objetivo' && s.objetivo != null && typeof s.objetivo !== 'object') s.objetivo = { valor: s.objetivo };
    if (t === 'kpi-sparkline' && Array.isArray(s.serie)) s.serie = { valores: s.serie };
  }
  function validarKpi(s, err, aviso) {
    var comp = KPI_COMPARACION.filter(function (k) { return s[k] != null; });
    var vis = KPI_VISUAL.filter(function (k) { return s[k] != null; });
    var ocupaVisual = comp.filter(function (k) { return KPI_AMBOS.indexOf(k) >= 0 || (k === 'objetivo' && s.objetivo && (s.objetivo.forma === 'barra' || s.objetivo.forma === 'logro')); });
    if (s.periodos != null) {
      if (!Array.isArray(s.periodos) || s.periodos.length < 2 || s.periodos.length > 4) err('«periodos» debe tener entre 2 y 4 opciones { etiqueta, valor, periodo, detalle }.');
      else s.periodos.forEach(function (o, i) {
        if (!o || !esTexto(o.etiqueta)) err('la opción ' + (i + 1) + ' de «periodos» no tiene «etiqueta» (por ejemplo "Mes").');
        if (!o || !esNum(o.valor)) err('la opción ' + (i + 1) + ' de «periodos» necesita «valor» numérico.');
        if (o && !esTexto(o.periodo)) err('la opción ' + (i + 1) + ' de «periodos» necesita «periodo»: el periodo activo rotulado (por ejemplo "Marzo 2026 (MTD)").');
      });
      if (comp.length || vis.length) err('el selector de «periodos» solo se combina con «contexto».');
      if (s.valor == null && Array.isArray(s.periodos) && s.periodos[0]) s.valor = s.periodos[0].valor;
    } else if (!esNum(s.valor)) err('falta «valor» numérico.');
    if (comp.length > 1) err('un KPI lleva como mucho un bloque de comparación y hay ' + comp.length + ' (' + comp.join(', ') + '). Elige el más importante o usa varios KPI.');
    if (vis.length > 1) err('un KPI lleva como mucho un bloque visual y hay ' + vis.length + ' (' + vis.join(', ') + ').');
    if (ocupaVisual.length && vis.length) err('«' + ocupaVisual[0] + '» ya incluye su propio gráfico; no se combina con «' + vis[0] + '».');
    var u = function (k) { return s[k]; };
    var b;
    if ((b = u('variacion')) != null) {
      if (typeof b !== 'object') err('«variacion» debe ser { anterior o porcentaje, referencia }.');
      else {
        if (!esNum(b.anterior) && !esNum(b.porcentaje)) err('«variacion» necesita «anterior» (valor de referencia) o «porcentaje».');
        if (!esTexto(b.referencia)) err('falta «referencia» en la variación (por ejemplo "vs. 2025"). Toda variación declara respecto a qué se calcula.');
        if (b.modo && b.modo !== 'neutro' && b.modo !== 'valorado') err('«modo» debe ser "neutro" o "valorado".');
        if (b.modo === 'valorado' && b.sentidoPositivo !== 'subir' && b.sentidoPositivo !== 'bajar') err('el modo "valorado" exige «sentidoPositivo»: "subir" o "bajar".');
      }
    }
    if ((b = u('tendencia')) != null) {
      if (typeof b !== 'object' || ['sube', 'baja', 'estable'].indexOf(b.sentido) < 0) err('«tendencia.sentido» debe ser "sube", "baja" o "estable".');
      else if (!esTexto(b.periodo)) err('falta «tendencia.periodo»: la flecha siempre fija su periodo (por ejemplo "Últimos 3 meses").');
    }
    if ((b = u('objetivo')) != null) {
      if (typeof b !== 'object' || !esNum(b.valor)) err('«objetivo» debe ser { valor } con un número. El objetivo siempre se rotula.');
      else if (b.valor <= 0) err('«objetivo.valor» debe ser mayor que cero.');
      if (b && b.forma != null && ['texto', 'barra', 'logro'].indexOf(b.forma) < 0) err('«objetivo.forma» debe ser "texto", "barra" o "logro".');
    }
    if ((b = u('anterior')) != null && (typeof b !== 'object' || !esNum(b.valor) || !esTexto(b.etiqueta))) err('«anterior» debe ser { valor, etiqueta } (por ejemplo { valor: 1184, etiqueta: "Mes anterior" }).');
    if ((b = u('prevision')) != null) {
      if (typeof b !== 'object' || !esNum(b.valor)) err('«prevision» debe ser { valor, origen }.');
      else if (!esTexto(b.origen)) err('falta «prevision.origen»: indica de dónde sale la previsión.');
    }
    if ((b = u('estado')) != null) {
      if (typeof b !== 'object' || ESTADOS_OBJETIVO.indexOf(b.estado) < 0) err('«estado.estado» debe ser "en-objetivo", "en-riesgo" o "fuera".');
      else if (!esTexto(b.umbral)) err('falta «estado.umbral»: documenta el umbral (por ejemplo "100 % o más del objetivo").');
    }
    if ((b = u('ranking')) != null) {
      if (typeof b !== 'object' || !Number.isInteger(b.posicion) || !Number.isInteger(b.total) || b.posicion < 1 || b.posicion > b.total) err('«ranking» debe ser { posicion, total, grupo } con enteros y posicion ≤ total.');
      else if (!esTexto(b.grupo)) err('falta «ranking.grupo»: entre quiénes se compara (por ejemplo "centros de la red").');
    }
    if ((b = u('comparado')) != null) {
      if (typeof b !== 'object' || !esTexto(b.nombre) || !esNum(b.valor)) err('«comparado» debe ser { nombre, valor }: la otra entidad, con la misma métrica y el mismo periodo.');
      if (!esTexto(s.nombre)) err('falta «nombre»: el de la entidad propia, que se compara con «comparado».');
    }
    if ((b = u('benchmark')) != null) {
      if (typeof b !== 'object' || !esNum(b.valor) || !esTexto(b.nombre)) err('«benchmark» debe ser { nombre, valor } (por ejemplo { nombre: "Sector", valor: 41 }).');
      if (b && b.maximo != null && !esNum(b.maximo)) err('«benchmark.maximo» debe ser un número (el final de la escala).');
      if (b && !esTexto(b.fuente) && !esTexto(s.nota)) aviso('cita la fuente del benchmark en «benchmark.fuente» o en «nota».');
    }
    if ((b = u('serie')) != null) {
      if (typeof b !== 'object' || !listaNum(b.valores) || b.valores.length < 3) err('«serie.valores» debe tener al menos 3 valores numéricos.');
      if (!esTexto(b && b.periodo) && !esTexto(s.periodo)) err('falta «periodo» (por ejemplo "Enero–septiembre 2026").');
    }
    if ((b = u('barras')) != null) {
      if (typeof b !== 'object' || !listaNum(b.valores) || b.valores.length < 2 || b.valores.length > 12) err('«barras.valores» debe tener entre 2 y 12 números (el último es el periodo actual).');
      else if (b.etiquetas != null && (!listaTexto(b.etiquetas) || b.etiquetas.length !== b.valores.length)) err('«barras.etiquetas» debe tener una etiqueta por valor.');
      if (b && !esTexto(b.periodo)) err('falta «barras.periodo» (por ejemplo "Últimos 6 meses").');
      if (b && listaNum(b.valores) && b.valores.some(function (x) { return x < 0; })) err('«barras.valores» no admite negativos.');
    }
    if ((b = u('desglose')) != null) {
      if (typeof b !== 'object' || !listaTexto(b.categorias) || !listaNum(b.valores) || b.categorias.length !== b.valores.length) err('«desglose» debe ser { categorias, valores } con un valor por categoría.');
      else if (b.categorias.length < 2 || b.categorias.length > 5) err('«desglose» admite de 2 a 5 partes.');
      else if (b.valores.some(function (x) { return x < 0; })) err('«desglose» solo admite partes positivas.');
    }
    if ((b = u('componentes')) != null) {
      if (typeof b !== 'object' || !listaTexto(b.categorias) || !listaNum(b.valores) || b.categorias.length !== b.valores.length) err('«componentes» debe ser { categorias, valores, maximo }.');
      else if (b.categorias.length > 5) err('«componentes» admite como mucho 5 componentes.');
      if (b && b.maximo != null && !esNum(b.maximo)) err('«componentes.maximo» debe ser un número (por defecto, 100).');
      if (!s.contexto) aviso('explica en «contexto» cómo se pondera el índice.');
    }
    if ((b = u('secundarios')) != null) {
      if (!Array.isArray(b) || !b.length || b.length > 3) err('«secundarios» admite de 1 a 3 datos { etiqueta, valor }.');
      else b.forEach(function (x, i) { if (!x || !esTexto(x.etiqueta) || !esNum(x.valor)) err('el dato secundario ' + (i + 1) + ' debe ser { etiqueta, valor }.'); });
    }
    if ((b = u('progreso')) != null) {
      if (typeof b !== 'object' || !esNum(b.meta) || b.meta <= 0) err('«progreso» debe ser { meta, etiqueta } con una meta mayor que cero.');
    }
    if (s.contexto != null) {
      if (!listaTexto(s.contexto)) err('«contexto» debe ser una lista de 1 o 2 frases (alcance, exclusiones, fuente).');
      else if (s.contexto.length > 2) aviso('«contexto» admite 2 frases; se muestran las 2 primeras.');
    }
  }

  /* ---- Composición: sectores, treemap, proporcion y marimekko ---- */
  var COMPOSICION = ['sectores', 'treemap', 'proporcion', 'marimekko'];
  /* Agrupa las partes más pequeñas en «Otros» para no pasar de max partes */
  function agruparOtros(d, max, aviso, nombre) {
    if (d.categorias.length <= max) return;
    var pares = d.categorias.map(function (c, i) { return [c, d.valores[i]]; }).sort(function (a, b) { return b[1] - a[1]; });
    var resto = pares.slice(max - 1).reduce(function (a, b) { return a + b[1]; }, 0);
    aviso('hay ' + pares.length + ' partes y el máximo ' + nombre + ' es ' + max + ': las ' + (pares.length - max + 1) + ' más pequeñas se agrupan en «Otros».');
    d.categorias = pares.slice(0, max - 1).map(function (x) { return x[0]; }).concat('Otros');
    d.valores = pares.slice(0, max - 1).map(function (x) { return x[1]; }).concat(resto);
    d._otros = true;
  }
  function validarComposicion(s, err, aviso) {
    var t = s.tipo, v = s.variante, d = s.datos;
    var POSITIVOS = 'las partes deben ser positivas y sumar el total.';
    function partes(min, consejoUno) {
      if (!listaTexto(d.categorias)) { err('«datos.categorias» debe ser una lista de textos.'); return false; }
      if (!listaNum(d.valores)) { err('«datos.valores» debe ser una lista de números sin formatear.'); return false; }
      if (d.categorias.length !== d.valores.length) { err('hay ' + d.categorias.length + ' categorías y ' + d.valores.length + ' valores.'); return false; }
      if (d.valores.some(function (x) { return x < 0; })) { err('hay valores negativos: ' + POSITIVOS + ' Para valores con signo usa barras-divergentes.'); return false; }
      if (d.categorias.length < min) { err('necesita al menos ' + min + ' partes. ' + consejoUno); return false; }
      if (!(d.valores.reduce(function (a, b) { return a + b; }, 0) > 0)) { err('las partes suman cero: no hay total que repartir.'); return false; }
      return true;
    }
    /* Proporción de un solo valor: en % (0-100) o como valor sobre «datos.total» */
    function proporcionDe(valor, campo) {
      if (esNum(d.total)) return valor / d.total * 100;
      if (s.unidad !== '%') { err('«' + campo + '» está en ' + s.unidad + ': indica también «datos.total» (el conjunto) o pasa el valor en % con unidad "%".'); return null; }
      return valor;
    }
    if (d.total != null && (!esNum(d.total) || d.total <= 0)) { err('«datos.total» debe ser un número mayor que cero.'); return; }

    if (t === 'sectores') {
      if (!partes(2, 'Para un solo valor usa un kpi; para una cuota, proporcion · cuota.')) return;
      if (v === 'semidonut') agruparOtros(d, 4, aviso, 'del semidonut');
      else agruparOtros(d, 6, aviso, 'de ' + (v === 'pie' ? 'un pie' : 'un donut'));
      if (v === 'pie' && s.centro) aviso('el pie no tiene centro; se ignora «centro». Usa la variante donut o semidonut para mostrar el total.');
      if (s.centro != null && (typeof s.centro !== 'object' || (s.centro.valor != null && !esNum(s.centro.valor)))) err('«centro» debe ser { etiqueta, valor } (valor numérico, opcional).');
      return;
    }
    if (t === 'treemap') {
      if (!partes(3, 'Con 2 partes usa sectores · donut o proporcion · barra.')) return;
      agruparOtros(d, 7, aviso, 'del treemap');
      return;
    }
    if (t === 'marimekko') {
      if (!listaTexto(d.grupos)) { err('«datos.grupos» debe ser la lista de grupos (las columnas).'); return; }
      if (d.grupos.length < 2 || d.grupos.length > 4) { err('hay ' + d.grupos.length + ' grupos y deben ser de 2 a 4. Con más, agrupa los pequeños o usa barras · apiladas-100.'); return; }
      if (!Array.isArray(d.series) || d.series.length < 2 || d.series.length > 3) { err('«datos.series» debe tener de 2 a 3 series { nombre, valores } (los segmentos de cada columna).'); return; }
      d.series.forEach(function (se, i) {
        if (!se || !esTexto(se.nombre)) { err('la serie ' + (i + 1) + ' no tiene «nombre».'); return; }
        if (!listaNum(se.valores) || se.valores.length !== d.grupos.length) err('la serie «' + se.nombre + '» debe tener ' + d.grupos.length + ' valores, uno por grupo.');
        else if (se.valores.some(function (x) { return x < 0; })) err('la serie «' + se.nombre + '» tiene valores negativos: ' + POSITIVOS);
      });
      d.grupos.forEach(function (g, j) {
        var tot = d.series.reduce(function (a, se) { return a + (se && Array.isArray(se.valores) && esNum(se.valores[j]) ? se.valores[j] : 0); }, 0);
        if (!(tot > 0)) err('el grupo «' + g + '» suma cero: no tiene ancho que dibujar.');
      });
      return;
    }
    /* proporcion */
    if (v === 'barra') {
      if (!partes(2, 'Para una sola parte usa proporcion · cuota o waffle.')) return;
      agruparOtros(d, 6, aviso, 'de la barra');
      return;
    }
    if (v === 'participacion') {
      if (!listaTexto(d.categorias)) { err('«datos.categorias» debe ser una lista de textos.'); return; }
      if (d.categorias.length > 8) { err('hay ' + d.categorias.length + ' elementos y el máximo es 8. Muestra los principales o usa barras · horizontales.'); return; }
      if (!listaNum(d.valores) || d.valores.length !== d.categorias.length) { err('«datos.valores» debe tener un número por categoría.'); return; }
      d._pct = [];
      for (var i = 0; i < d.valores.length; i++) {
        if (d.valores[i] < 0) { err('la participación de «' + d.categorias[i] + '» es negativa.'); return; }
        var q = proporcionDe(d.valores[i], 'datos.valores'); if (q == null) return;
        if (q > 100) { err('la participación de «' + d.categorias[i] + '» supera el 100 %.'); return; }
        d._pct.push(q);
      }
      return;
    }
    /* cuota y waffle: un único valor */
    if (!esNum(d.valor) || d.valor < 0) { err('falta «datos.valor»: la parte (en % o sobre «datos.total»).'); return; }
    var pct = proporcionDe(d.valor, 'datos.valor'); if (pct == null) return;
    if (pct > 100) { err('«datos.valor» supera el total (más del 100 %).'); return; }
    d._pct = pct;
    if (d.etiqueta != null && !esTexto(d.etiqueta)) err('«datos.etiqueta» debe ser un texto (el nombre de la parte).');
    if (d.resto != null && !esTexto(d.resto)) err('«datos.resto» debe ser un texto (el nombre del resto).');
    if (d.anterior != null) {
      if (!esNum(d.anterior)) err('«datos.anterior» debe ser un número, en la misma escala que «datos.valor».');
      else { var pa = proporcionDe(d.anterior, 'datos.anterior'); if (pa != null) d._pctAnterior = pa; }
    } else if (v === 'cuota') aviso('indica «datos.anterior» (la cuota del periodo anterior) para dar la referencia.');
  }

  /* ---- Distribución: histograma, cajas, casos, distribucion, percentiles y rangos ---- */
  var DISTRIBUCION = ['histograma', 'cajas', 'casos', 'distribucion', 'percentiles', 'rangos'];
  function ordenar(a) { return a.slice().sort(function (x, y) { return x - y; }); }
  /* Cuantil con interpolación lineal (el método de CUARTIL.INC de Excel); o, lista ordenada */
  function cuantil(o, p) {
    var h = (o.length - 1) * p, i = Math.floor(h);
    return i + 1 < o.length ? o[i] + (h - i) * (o[i + 1] - o[i]) : o[o.length - 1];
  }
  function media(a) { return suma(a) / a.length; }
  function desviacionTipica(a) {
    var m = media(a);
    return a.length > 1 ? Math.sqrt(a.reduce(function (acc, x) { return acc + (x - m) * (x - m); }, 0) / (a.length - 1)) : 0;
  }
  function limpio(x) { return parseFloat(x.toPrecision(12)); }
  /* Paso «bonito» (1, 2, 2,5 o 5 por una potencia de 10): el más cercano a «bruto» o, con alza, el menor que no baja de él */
  function pasoBonito(bruto, alza) {
    var e = Math.pow(10, Math.floor(Math.log(bruto) / Math.LN10)), mejor = 10 * e, dist = Infinity;
    [1, 2, 2.5, 5, 10].forEach(function (f) {
      var dd = Math.abs(Math.log(f * e / bruto));
      if ((!alza || f * e >= bruto * (1 - 1e-9)) && dd < dist) { dist = dd; mejor = f * e; }
    });
    return limpio(mejor);
  }
  /* Extremos de un eje en múltiplos de un paso bonito (unos n tramos) */
  function extremosBonitos(min, max, n) {
    if (!(max > min)) max = min + 1;
    var paso = pasoBonito((max - min) / n, true);
    return { lo: limpio(Math.floor(min / paso + 1e-9) * paso), hi: limpio(Math.ceil(max / paso - 1e-9) * paso), paso: paso };
  }
  /* Intervalos de igual ancho: [a, b) salvo el último, que incluye su límite superior. objetivo: número aproximado de intervalos */
  function intervalosDe(o, paso, inicio, objetivo, alza) {
    var min = o[0], max = o[o.length - 1];
    if (!paso) {
      paso = pasoBonito((max - min) / objetivo, alza);
      if (o.every(function (x) { return Math.round(x) === x; }) && paso % 1) paso = paso < 1.5 ? 1 : (alza ? Math.ceil(paso) : 2);
    }
    var a = inicio != null ? inicio : limpio(Math.floor(min / paso + 1e-9) * paso);
    var nb = Math.max(1, Math.ceil((max - a) / paso - 1e-9));
    var limites = [], casos = [], columnas = [];
    for (var i = 0; i <= nb; i++) limites.push(limpio(a + i * paso));
    for (i = 0; i < nb; i++) { casos.push(0); columnas.push([]); }
    o.forEach(function (x) { var j = Math.min(nb - 1, Math.max(0, Math.floor((x - a) / paso + 1e-9))); casos[j]++; columnas[j].push(x); });
    return { limites: limites, casos: casos, columnas: columnas, paso: paso };
  }
  /* Ancho de banda de Silverman para la densidad (núcleo gaussiano) */
  function bandaSilverman(o) {
    var sd = desviacionTipica(o), ric = cuantil(o, 0.75) - cuantil(o, 0.25);
    var e = Math.min(sd, ric / 1.34) || sd || 1;
    return 0.9 * e * Math.pow(o.length, -0.2);
  }
  function densidadEn(o, h, x) {
    var acc = 0;
    for (var i = 0; i < o.length; i++) { var u = (x - o[i]) / h; if (u > -6 && u < 6) acc += Math.exp(-0.5 * u * u); }
    return acc / (o.length * h * Math.sqrt(2 * Math.PI));
  }
  /* Función de distribución normal (aproximación de Abramowitz y Stegun) */
  function normalAcumulada(z) {
    var x = Math.abs(z) / Math.SQRT2, t = 1 / (1 + 0.3275911 * x);
    var erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return z >= 0 ? (1 + erf) / 2 : (1 - erf) / 2;
  }
  /* % de casos por debajo de x (o: lista ordenada) */
  function fraccionHasta(o, x) {
    var lo = 0, hi = o.length;
    while (lo < hi) { var m = (lo + hi) >> 1; if (o[m] <= x) lo = m + 1; else hi = m; }
    return lo / o.length * 100;
  }
  /* Resumen de una caja: cuartiles y bigotes hasta el último dato a menos de 1,5 veces el rango intercuartílico */
  function resumenCaja(o) {
    var q1 = cuantil(o, 0.25), q3 = cuantil(o, 0.75), r = 1.5 * (q3 - q1), bajo = q1 - r - 1e-9, alto = q3 + r + 1e-9;
    var dentro = o.filter(function (x) { return x >= bajo && x <= alto; });
    return { n: o.length, minimo: dentro[0], q1: q1, mediana: cuantil(o, 0.5), q3: q3, maximo: dentro[dentro.length - 1],
      atipicos: o.filter(function (x) { return x < bajo || x > alto; }), extremos: [o[0], o[o.length - 1]], orden: o };
  }
  /* Percentil de un valor dentro de un grupo: % de casos por debajo más la mitad de los iguales */
  function rangoPercentil(o, v) {
    var menores = 0, iguales = 0;
    o.forEach(function (x) { if (x < v) menores++; else if (x === v) iguales++; });
    return (menores + iguales / 2) / o.length * 100;
  }
  /* Mediana o media estimada de unos intervalos ya contados (interpolación dentro del intervalo) */
  function centroAgrupado(limites, casos, que) {
    var n = suma(casos);
    if (que === 'media') return casos.reduce(function (a, c, j) { return a + c * (limites[j] + limites[j + 1]) / 2; }, 0) / n;
    var acc = 0;
    for (var j = 0; j < casos.length; j++) {
      if (acc + casos[j] >= n / 2 && casos[j] > 0) return limites[j] + (n / 2 - acc) / casos[j] * (limites[j + 1] - limites[j]);
      acc += casos[j];
    }
    return limites[limites.length - 1];
  }

  function validarDistribucion(s, err, aviso) {
    var t = s.tipo, v = s.variante, d = s.datos;
    var conCasos = t === 'histograma' || t === 'cajas' || t === 'casos' || t === 'distribucion';
    if (s.nombreCasos != null) {
      if (!esTexto(s.nombreCasos)) err('«nombreCasos» debe ser un texto en plural: qué es cada caso (por ejemplo "alumnos", "centros" o "pedidos").');
      else if (!conCasos) aviso('«nombreCasos» solo se usa en histograma, cajas, casos y distribucion; se ignora.');
    }
    /* Valores en bruto: un número por caso */
    function crudos(arr, etiqueta, min, max, consejoMax) {
      if (!listaNum(arr)) { err(etiqueta + ' debe ser una lista de números en bruto, sin formatear: un valor por caso.'); return null; }
      if (arr.length < min) { err(etiqueta + ' tiene ' + arr.length + (arr.length === 1 ? ' valor' : ' valores') + ' y hacen falta al menos ' + min + ' para describir una distribución.'); return null; }
      if (max && arr.length > max) { err(etiqueta + ' tiene ' + arr.length + ' valores y el máximo es ' + max + '.' + (consejoMax ? ' ' + consejoMax : '')); return null; }
      var o = ordenar(arr);
      if (o[0] === o[o.length - 1]) { err(etiqueta + ': todos los valores son iguales (' + numero(o[0]) + '), no hay distribución que dibujar.'); return null; }
      return o;
    }
    /* marca: línea o punto de referencia (mediana, media, moda) */
    function marca(validas, defecto) {
      if (s.marca == null) { s.marca = defecto; return; }
      if (validas.indexOf(s.marca) < 0) err('«marca» no válida. Usa: ' + validas.map(function (x) { return '"' + x + '"'; }).join(', ') + '.');
    }
    function ignorar(campo, donde) { if (s[campo] != null) aviso('«' + campo + '» solo se usa en ' + donde + '; se ignora.'); }
    /* Grupos con sus valores en bruto: datos.series [{ nombre, valores }] o, para un solo grupo, datos.valores.
       sinResumen: motivo por el que no se admite «resumen» (null si se admite) */
    function grupos(maxG, minN, maxN, consejoG, sinResumen) {
      if (d.series == null && d.valores != null) d.series = [{ nombre: '', valores: d.valores }];
      else if (d.series != null && d.valores != null) aviso('ya hay «datos.series»; se ignora «datos.valores».');
      if (!Array.isArray(d.series) || !d.series.length) { err('«datos.series» debe ser una lista de grupos { nombre, valores }, con los valores en bruto de cada grupo (para un solo grupo, «datos.valores»).'); return null; }
      if (d.series.length > maxG) { err('hay ' + d.series.length + ' grupos y el máximo es ' + maxG + '. ' + consejoG); return null; }
      var res = [], ok = true;
      d.series.forEach(function (se, i) {
        if (!se || typeof se !== 'object') { err('el grupo ' + (i + 1) + ' debe ser un objeto { nombre, valores }.'); ok = false; return; }
        if (d.series.length > 1 && !esTexto(se.nombre)) { err('el grupo ' + (i + 1) + ' no tiene «nombre».'); ok = false; return; }
        var q = 'el grupo «' + (se.nombre || i + 1) + '»';
        if (se.resumen != null) {
          if (sinResumen) { err(q + ': ' + sinResumen); ok = false; return; }
          var r = se.resumen, k = ['minimo', 'q1', 'mediana', 'q3', 'maximo'];
          if (typeof r !== 'object' || !k.every(function (c) { return esNum(r[c]); })) { err(q + ': «resumen» necesita «minimo», «q1», «mediana», «q3» y «maximo» numéricos.'); ok = false; return; }
          if (!k.every(function (c, j) { return j === 0 || r[k[j - 1]] <= r[c]; })) { err(q + ': el resumen debe cumplir minimo ≤ q1 ≤ mediana ≤ q3 ≤ maximo.'); ok = false; return; }
          var at = r.atipicos == null ? [] : r.atipicos;
          if (!Array.isArray(at) || !at.every(esNum)) { err(q + ': «resumen.atipicos» debe ser una lista de números.'); ok = false; return; }
          if (at.some(function (x) { return x >= r.minimo && x <= r.maximo; })) { err(q + ': los atípicos deben quedar fuera de los bigotes (por debajo de «minimo» o por encima de «maximo»).'); ok = false; return; }
          res.push({ nombre: se.nombre || '', minimo: r.minimo, q1: r.q1, mediana: r.mediana, q3: r.q3, maximo: r.maximo, atipicos: at.slice(), resumido: true });
          return;
        }
        var o = crudos(se.valores, q, minN, maxN);
        if (!o) { ok = false; return; }
        res.push({ nombre: se.nombre || '', orden: o, n: o.length });
      });
      return ok ? res : null;
    }

    if (t === 'histograma') {
      var agrupado = d.limites != null || d.casos != null;
      if (agrupado && d.valores != null) { err('pasa los valores en bruto («datos.valores») o los intervalos ya contados («datos.limites» y «datos.casos»), no las dos cosas.'); return; }
      marca(['mediana', 'media', 'ninguna'], 'mediana');
      if (agrupado) {
        var L = d.limites, C = d.casos;
        if (!listaNum(L) || L.length < 4 || L.length > 31) { err('«datos.limites» debe ser una lista de 4 a 31 números: los límites de los intervalos, de menor a mayor (uno más que intervalos).'); return; }
        if (L.some(function (x, j) { return j > 0 && x <= L[j - 1]; })) { err('«datos.limites» debe ir de menor a mayor, sin repetidos.'); return; }
        if (!listaNum(C) || C.length !== L.length - 1) { err('«datos.casos» debe tener ' + (L.length - 1) + ' números: los casos de cada intervalo.'); return; }
        if (C.some(function (x) { return x < 0; }) || !(suma(C) > 0)) { err('«datos.casos» no puede tener negativos y debe sumar más de cero.'); return; }
        if (s.intervalo != null || s.inicio != null) aviso('los intervalos ya vienen en «datos.limites»; se ignoran «intervalo» e «inicio».');
        d._hist = { limites: L.slice(), casos: C.slice(), n: suma(C), estimado: true };
      } else {
        var o = crudos(d.valores, '«datos.valores»', 10, 100000);
        if (!o) return;
        if (s.intervalo != null && !(esNum(s.intervalo) && s.intervalo > 0)) { err('«intervalo» debe ser un número mayor que cero: el ancho de cada intervalo, en ' + s.unidad + '.'); return; }
        if (s.inicio != null && !(esNum(s.inicio) && s.inicio <= o[0])) { err('«inicio» debe ser un número menor o igual que el valor más pequeño (' + numero(o[0]) + '): es el límite inferior del primer intervalo.'); return; }
        var nObj = Math.min(16, Math.max(6, Math.ceil(Math.log(o.length) / Math.LN2 + 1)));
        var hs = intervalosDe(o, s.intervalo, s.inicio, nObj);
        if (hs.casos.length > 30) { err('con «intervalo» ' + numero(s.intervalo) + ' salen ' + hs.casos.length + ' intervalos y el máximo es 30: usa un intervalo mayor o quítalo para que el kit lo calcule.'); return; }
        d._hist = { limites: hs.limites, casos: hs.casos, n: o.length, orden: o };
      }
      d._n = d._hist.n;
      if (s.marca !== 'ninguna') {
        var hh = d._hist;
        var mv = hh.orden ? (s.marca === 'media' ? media(hh.orden) : cuantil(hh.orden, 0.5)) : centroAgrupado(hh.limites, hh.casos, s.marca);
        hh.marca = { valor: mv, nombre: s.marca === 'media' ? 'Media' : 'Mediana', estimado: !hh.orden };
      }
      return;
    }

    if (t === 'cajas') {
      ignorar('marca', 'histograma, casos y distribucion');
      var violin = v === 'violin';
      var G = grupos(violin ? 6 : 8, violin ? 10 : 5, 50000, violin ? 'Usa la variante "caja" (hasta 8) o divide el gráfico.' : 'Divide el gráfico o agrupa los grupos menores.',
        violin ? 'el violín necesita los valores en bruto de cada grupo para calcular la densidad: usa «valores» en lugar de «resumen».' : null);
      if (!G) return;
      d._grupos = G.map(function (g) { return g.resumido ? g : Object.assign(resumenCaja(g.orden), { nombre: g.nombre }); });
      if (G.every(function (g) { return !g.resumido; })) d._n = suma(G.map(function (g) { return g.n; }));
      return;
    }

    if (t === 'casos') {
      ignorar('percentil', 'distribucion · acumulada');
      if (v === 'apilados') {
        marca(['mediana', 'media', 'ninguna'], 'mediana');
        if (d.series != null) { err('«apilados» dibuja un solo conjunto de casos: usa «datos.valores». Para comparar grupos usa la variante "dispersos" o "enjambre".'); return; }
        var oa = crudos(d.valores, '«datos.valores»', 10, 100, 'Un punto por caso solo se lee con pocos casos: con más, usa el tipo histograma.');
        if (!oa) return;
        var cols = intervalosDe(oa, null, null, 12, true);
        var alto = Math.max.apply(null, cols.casos);
        if (alto > 30) { err('hay ' + alto + ' casos en un mismo intervalo y la columna no cabe (máximo 30 puntos): usa el tipo histograma.'); return; }
        d._columnas = cols; d._orden = oa; d._n = oa.length;
        return;
      }
      marca(['mediana', 'media', 'ninguna'], v === 'dispersos' ? 'media' : 'ninguna');
      var Gc = grupos(v === 'dispersos' ? 6 : 4, v === 'dispersos' ? 3 : 5, v === 'dispersos' ? 200 : 300,
        v === 'dispersos' ? 'Divide el gráfico o usa el tipo cajas, que admite 8.' : 'Usa la variante "dispersos" (hasta 6 grupos) o el tipo cajas.',
        'aquí cada punto es un caso: pasa los valores en bruto en «valores». El resumen ya calculado solo se admite en cajas · caja.');
      if (!Gc) return;
      d._grupos = Gc; d._n = suma(Gc.map(function (g) { return g.n; }));
      return;
    }

    if (t === 'distribucion') {
      if (v !== 'acumulada') ignorar('percentil', 'la variante "acumulada"');
      if (v === 'densidad') marca(['moda', 'mediana', 'media', 'ninguna'], 'moda');
      else ignorar('marca', 'la variante "densidad"');
      if (v === 'normal' && (d.media != null || d.desviacion != null)) {
        if (!esNum(d.media) || !esNum(d.desviacion) || d.desviacion <= 0) { err('la curva normal necesita «datos.media» y «datos.desviacion» (la desviación típica, mayor que cero), o los valores en bruto en «datos.valores» para que el kit las calcule.'); return; }
        if (d.valores != null) aviso('ya hay «datos.media» y «datos.desviacion»; se ignora «datos.valores».');
        d._media = d.media; d._desv = d.desviacion;
        return;
      }
      if (v !== 'normal' && (d.media != null || d.desviacion != null)) aviso('«datos.media» y «datos.desviacion» solo se usan en la variante "normal"; se ignoran.');
      var od = crudos(d.valores, '«datos.valores»', v === 'densidad' ? 20 : 10, 50000);
      if (!od) return;
      d._orden = od; d._n = od.length;
      if (v === 'normal') { d._media = media(od); d._desv = desviacionTipica(od); }
      if (v === 'acumulada') {
        if (s.percentil == null) s.percentil = 90;
        else if (!(esNum(s.percentil) && s.percentil >= 1 && s.percentil <= 99) || s.percentil === 50) err('«percentil» debe ser un número de 1 a 99 distinto de 50 (la mediana ya se marca): el percentil clave que se señala, por ejemplo 90.');
      }
      return;
    }

    if (t === 'percentiles') {
      ignorar('marca', 'histograma, casos y distribucion');
      var nP = 0;
      if (!listaTexto(d.categorias)) { err('«datos.categorias» debe ser una lista de textos: los elementos que se sitúan en el grupo.'); return; }
      if (d.categorias.length > 8) { err('hay ' + d.categorias.length + ' elementos y el máximo es 8. Muestra el propio y los de referencia, o usa el tipo ranking.'); return; }
      nP = d.categorias.length;
      if (!listaNum(d.valores) || d.valores.length !== nP) { err('«datos.valores» debe tener un número por elemento (' + nP + ').'); return; }
      if (d.grupo != null) {
        var og = crudos(d.grupo, '«datos.grupo»', 5, 100000);
        if (!og) return;
        d._pct = d.valores.map(function (x) { return rangoPercentil(og, x); });
        d._n = og.length;
      } else {
        if (d.valores.some(function (x) { return x < 0 || x > 100; })) { err('sin «datos.grupo», los valores son percentiles y van de 0 a 100. Si tienes los valores en bruto, pasa también en «datos.grupo» los de todo el grupo de referencia y el kit calcula el percentil.'); return; }
        d._pct = d.valores.slice();
      }
      if (s.destacar == null) s.destacar = d.categorias[0];
      else if (!esTexto(s.destacar) || d.categorias.indexOf(s.destacar) < 0) err('«destacar» debe coincidir exactamente con una de «datos.categorias» (el elemento propio).');
      if (s.referencia != null && !esTexto(s.referencia)) err('«referencia» debe ser un texto: el grupo de referencia (por ejemplo "entre los 120 centros de la red").');
      return;
    }

    if (t === 'rangos') {
      ignorar('marca', 'histograma, casos y distribucion');
      var iv = v === 'intervalo';
      var conPeriodos = d.categorias == null && d.periodos != null;
      if (conPeriodos) d.categorias = d.periodos;
      var maxR = v === 'min-max' ? 12 : 10;
      if (!listaTexto(d.categorias)) { err('«datos.categorias» (o «datos.periodos») debe ser una lista de textos.'); return; }
      if (d.categorias.length > maxR) { err('hay ' + d.categorias.length + (conPeriodos ? ' periodos' : ' categorías') + ' y el máximo es ' + maxR + '. ' + (conPeriodos ? 'Agrupa los periodos (por ejemplo, por trimestres)' : 'Agrupa las menores') + ' o divide el gráfico.'); return; }
      var nR = d.categorias.length, okR = true;
      ['minimos', 'maximos'].forEach(function (k) {
        if (!listaNum(d[k]) || d[k].length !== nR) { err('«datos.' + k + '» debe tener un número por categoría (' + nR + ')' + (iv ? ': el límite ' + (k === 'minimos' ? 'inferior' : 'superior') + ' de cada intervalo.' : '.')); okR = false; }
      });
      if (d.valores != null && (!listaNum(d.valores) || d.valores.length !== nR)) { err('«datos.valores» debe tener un número por categoría (' + nR + ').'); okR = false; }
      if (iv && d.valores == null) { err('falta «datos.valores»: la estimación de cada grupo (el punto), además de los límites del intervalo en «datos.minimos» y «datos.maximos».'); okR = false; }
      if (okR) d.categorias.forEach(function (c, i) {
        if (d.minimos[i] > d.maximos[i]) err('«' + c + '»: el mínimo (' + numero(d.minimos[i]) + ') es mayor que el máximo (' + numero(d.maximos[i]) + ').');
        else if (d.valores && (d.valores[i] < d.minimos[i] || d.valores[i] > d.maximos[i])) err('«' + c + '»: el valor (' + numero(d.valores[i]) + ') debe quedar entre el mínimo y el máximo.');
      });
      if (s.nombreValor != null && !esTexto(s.nombreValor)) err('«nombreValor» debe ser un texto: qué es el punto (por ejemplo "Media" o "Mediana").');
      if (iv) {
        if (!(esNum(s.confianza) && s.confianza > 0 && s.confianza < 100)) err('falta «confianza»: el nivel de confianza del intervalo, en % (por ejemplo 95). Siempre se indica.');
        var r = d.referencia;
        if (r != null && !(r && typeof r === 'object' && esTexto(r.nombre) && esNum(r.valor))) err('«datos.referencia» debe ser { nombre, valor } (por ejemplo { nombre: "Media global", valor: 59 }).');
      } else {
        ignorar('confianza', 'la variante "intervalo"');
        if (d.referencia != null) aviso('«datos.referencia» solo se usa en la variante "intervalo"; se ignora.');
      }
      if (s.orden != null && v !== 'rango') aviso('«orden» solo se usa en la variante "rango"; se ignora.');
    }
  }

  /* ---- Relación y correlación: dispersion, matriz, radar y coordenadas-paralelas ---- */
  var RELACION = ['dispersion', 'matriz', 'radar', 'coordenadas-paralelas'];
  /* Ajuste lineal por mínimos cuadrados (y = a + b·x), con el coeficiente de Pearson (r) y R² */
  function ajusteLineal(xs, ys) {
    var n = xs.length, mx = media(xs), my = media(ys), sxy = 0, sxx = 0, syy = 0;
    for (var i = 0; i < n; i++) { var dx = xs[i] - mx, dy = ys[i] - my; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; }
    var r = sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0, b = sxx > 0 ? sxy / sxx : 0;
    return { a: my - b * mx, b: b, r: r, r2: r * r };
  }
  /* Clases del coeficiente de correlación: divergente de 5 clases con Neutro 100 en el centro (Figma «Heatmap de correlación») */
  var CLASES_CORRELACION = [
    { color: P.naranja700, texto: '\u2265 0,6', nombre: 'Positiva fuerte' },
    { color: P.naranja400, texto: '0,2 a 0,6', nombre: 'Positiva moderada' },
    { color: P.neutro100, texto: '\u22120,2 a 0,2', nombre: 'Débil o nula' },
    { color: P.neutro400, texto: '\u22120,6 a \u22120,2', nombre: 'Negativa moderada' },
    { color: P.neutro500, texto: '\u2264 \u22120,6', nombre: 'Negativa fuerte' }
  ];
  /* Se clasifica el valor redondeado a 2 decimales, el mismo que se rotula */
  function claseCorrelacion(r) { r = Math.round(r * 100) / 100; return r >= 0.6 ? 0 : (r >= 0.2 ? 1 : (r > -0.2 ? 2 : (r > -0.6 ? 3 : 4))); }
  /* Máximo redondo de una escala que parte de cero (radar): el menor que sale de 2 a 5 tramos de paso bonito */
  function maximoRedondo(max) {
    var mejor = Infinity;
    for (var k = 2; k <= 5; k++) mejor = Math.min(mejor, limpio(pasoBonito(max / k, true) * k));
    return mejor;
  }
  /* Casos (mínimo y máximo) y grupos (máximo) de cada variante de dispersion */
  var LIMITES_DISPERSION = {
    'simple': [3, 500, 3], 'tendencia': [5, 500, 1], 'burbujas': [2, 25, 1], 'burbujas-categoria': [3, 40, 3],
    'cuadrantes': [3, 30, 1], 'conectada': [3, 24, 1], 'hexagonos': [50, 50000, 1]
  };
  var CONSEJO_MAXIMO = {
    'simple': 'Con tantos puntos se tapan unos a otros: usa la variante "hexagonos".',
    'tendencia': 'Con tantos puntos se tapan unos a otros: usa la variante "hexagonos".',
    'burbujas': 'Las burbujas se solaparían: muestra los casos principales.',
    'burbujas-categoria': 'Las burbujas se solaparían: muestra los casos principales.',
    'cuadrantes': 'Muestra los casos principales.',
    'conectada': 'Agrupa los periodos (por ejemplo, por años).'
  };

  function validarRelacion(s, err, aviso) {
    var t = s.tipo;
    function ignorar(campo, donde) { if (s[campo] != null) aviso('«' + campo + '» solo se usa en ' + donde + '; se ignora.'); }
    if (s.nombreCasos != null && !esTexto(s.nombreCasos)) { err('«nombreCasos» debe ser un texto en plural: qué es cada caso (por ejemplo "centros", "títulos" o "pedidos").'); return; }
    if (t !== 'dispersion') ['ejes', 'rotular', 'cortes', 'cuadrantes', 'destacarCuadrante'].forEach(function (k) { ignorar(k, 'el tipo dispersion'); });
    if (t === 'matriz' || t === 'radar') ignorar('destacar', 'dispersion y coordenadas-paralelas');
    if (t === 'radar') ignorar('nombreCasos', 'dispersion, matriz y coordenadas-paralelas');
    if (t === 'dispersion') validarDispersion(s, err, aviso, ignorar);
    else if (t === 'matriz') { if (s.variante === 'cohortes') validarCohortes(s, err, aviso); else validarMatriz(s, err, aviso); }
    else if (t === 'radar') validarRadar(s, err);
    else validarParalelas(s, err);
  }

  function validarDispersion(s, err, aviso, ignorar) {
    var v = s.variante, d = s.datos, lim = LIMITES_DISPERSION[v], burbujas = v === 'burbujas' || v === 'burbujas-categoria';
    /* Ejes: el nombre de cada variable (texto) o { nombre, unidad }; la unidad común vale para los que no traen la suya */
    var E = s.ejes, ejes = {}, okE = true;
    if (!E || typeof E !== 'object' || Array.isArray(E) || E.x == null || E.y == null) {
      err('falta «ejes»: el nombre de cada variable, { x: "…", y: "…" }, o { x: { nombre, unidad }, y: { nombre, unidad } } si tienen unidades distintas.');
      return;
    }
    ['x', 'y', 'tamano'].forEach(function (k) {
      var e = E[k];
      if (e == null) return;
      if (esTexto(e)) e = { nombre: e };
      if (!e || typeof e !== 'object' || !esTexto(e.nombre) || (e.unidad != null && !esTexto(e.unidad))) { err('«ejes.' + k + '» debe ser un texto (el nombre de la variable) o { nombre, unidad }.'); okE = false; return; }
      ejes[k] = { nombre: e.nombre, unidad: esTexto(e.unidad) ? e.unidad : s.unidad };
    });
    if (!okE) return;
    if (!esTexto(ejes.x.unidad) || !esTexto(ejes.y.unidad)) { err('falta «unidad»: la de los dos ejes (por ejemplo "€" o "puntos") o la de cada uno en «ejes.x.unidad» y «ejes.y.unidad». La unidad forma parte del significado del dato.'); return; }
    if (burbujas && !ejes.tamano) { err('falta «ejes.tamano»: qué mide el área de cada burbuja (por ejemplo "Ejemplares vendidos", o { nombre, unidad } si su unidad no es la común).'); return; }
    if (!burbujas && E.tamano != null) aviso('«ejes.tamano» solo se usa en las variantes "burbujas" y "burbujas-categoria"; se ignora.');

    /* Casos: datos.x y datos.y (un conjunto) o datos.series (grupos { nombre, x, y }) */
    var multi = d.series != null;
    if (multi && (d.x != null || d.y != null)) aviso('ya hay «datos.series»; se ignoran «datos.x» y «datos.y».');
    var grupos = multi ? d.series : [{ nombre: '', x: d.x, y: d.y, tamanos: d.tamanos, nombres: d.nombres }];
    if (!Array.isArray(grupos) || !grupos.length) { err('«datos.series» debe ser una lista de grupos { nombre, x, y }.'); return; }
    if (v === 'burbujas-categoria' && grupos.length < 2) { err('«burbujas-categoria» da un color a cada grupo: pasa de 2 a 3 grupos en «datos.series» ({ nombre, x, y, tamanos }). Para un solo conjunto usa la variante "burbujas".'); return; }
    if (grupos.length > lim[2]) {
      err(lim[2] === 1 ? 'la variante «' + v + '» dibuja un solo conjunto de casos: usa «datos.x» y «datos.y».' + (v === 'tendencia' || v === 'burbujas' ? ' Para distinguir grupos usa la variante "' + (v === 'burbujas' ? 'burbujas-categoria' : 'simple') + '".' : '')
        : 'hay ' + grupos.length + ' grupos y el máximo es ' + lim[2] + ' (un color por grupo). Agrupa los menores o divide el gráfico.');
      return;
    }
    var P_ = [], ok = true, avisoTam = false;
    grupos.forEach(function (g, gi) {
      if (!ok) return;
      if (!g || typeof g !== 'object') { err('el grupo ' + (gi + 1) + ' debe ser un objeto { nombre, x, y }.'); ok = false; return; }
      if (multi && !esTexto(g.nombre)) { err('el grupo ' + (gi + 1) + ' no tiene «nombre».'); ok = false; return; }
      var q = multi ? 'el grupo «' + g.nombre + '»' : '«datos»';
      if (!listaNum(g.x) || !listaNum(g.y)) { err(q + ': «x» e «y» deben ser listas de números en bruto, sin formatear, con un valor por caso.'); ok = false; return; }
      var n = g.x.length;
      if (g.y.length !== n) { err(q + ': «x» tiene ' + n + ' valores e «y» tiene ' + g.y.length + '; cada caso lleva uno de cada.'); ok = false; return; }
      if (burbujas) {
        if (!listaNum(g.tamanos) || g.tamanos.length !== n) { err(q + ': falta «tamanos», un número por caso (' + n + '): ' + ejes.tamano.nombre.toLowerCase() + ', que da el área de cada burbuja.'); ok = false; return; }
        if (g.tamanos.some(function (x) { return x < 0; })) { err(q + ': «tamanos» no puede tener negativos: el área de una burbuja parte de cero.'); ok = false; return; }
      } else if (g.tamanos != null) avisoTam = true;
      if (g.nombres != null && (!Array.isArray(g.nombres) || g.nombres.length !== n || !g.nombres.every(function (x) { return esTexto(x) || esNum(x); }))) { err(q + ': «nombres» debe tener un texto por caso (' + n + ').'); ok = false; return; }
      for (var i = 0; i < n; i++) P_.push({ x: g.x[i], y: g.y[i], t: burbujas ? g.tamanos[i] : null, nombre: g.nombres ? String(g.nombres[i]) : '', g: gi, i: P_.length });
    });
    if (!ok) return;
    if (avisoTam) aviso('«tamanos» solo se usa en las variantes "burbujas" y "burbujas-categoria"; se ignora.');
    var n = P_.length;
    if (n < lim[0]) { err('hay ' + n + (n === 1 ? ' caso' : ' casos') + ' y la variante «' + v + '» necesita al menos ' + lim[0] + '.' + (v === 'hexagonos' ? ' Con pocos casos usa la variante "simple".' : '')); return; }
    if (n > lim[1]) { err('hay ' + numero(n) + ' casos y el máximo de «' + v + '» es ' + numero(lim[1]) + '. ' + (CONSEJO_MAXIMO[v] || '')); return; }
    var xIguales = P_.every(function (p) { return p.x === P_[0].x; }), yIguales = P_.every(function (p) { return p.y === P_[0].y; });
    if (xIguales || yIguales) { err('todos los valores de ' + (xIguales ? '«x»' : '«y»') + ' son iguales: no hay relación que dibujar.'); return; }
    if (burbujas && !P_.some(function (p) { return p.t > 0; })) { err('todos los «tamanos» son cero: no hay burbujas que dibujar.'); return; }

    /* Nombres de los casos: hacen falta para destacar, para rotular y en los cuadrantes */
    var nombres = P_.map(function (p) { return p.nombre; });
    if (v === 'cuadrantes' && !nombres.every(Boolean)) { err('los cuadrantes rotulan cada caso: falta «datos.nombres», un texto por caso.'); return; }
    if (s.destacar != null) {
      if (v === 'burbujas-categoria' || v === 'conectada' || v === 'hexagonos' || multi) {
        aviso('«destacar» no se usa ' + (multi ? 'con varios grupos' : 'en la variante «' + v + '»') + (multi ? ' (el color ya distingue los grupos; usa «rotular»)' : '') + '; se ignora.');
        s.destacar = null;
      } else if (!esTexto(s.destacar) || nombres.indexOf(s.destacar) < 0) err('«destacar» debe coincidir exactamente con uno de «datos.nombres» (el caso propio).');
    }
    if (s.rotular != null) {
      if (v === 'cuadrantes' || v === 'conectada' || v === 'hexagonos') {
        aviso('«rotular» no se usa en la variante «' + v + '»' + (v === 'cuadrantes' ? ' (ya se rotulan todos los casos)' : '') + '; se ignora.');
        s.rotular = null;
      } else if (!listaTexto(s.rotular) || s.rotular.length > 8) err('«rotular» debe ser una lista de 1 a 8 nombres: los casos clave que se rotulan.');
      else s.rotular.forEach(function (r) { if (nombres.indexOf(r) < 0) err('«rotular»: «' + r + '» no está en «datos.nombres».'); });
    }

    if (v === 'cuadrantes') {
      var ct = s.cortes;
      if (ct != null && !(ct && typeof ct === 'object' && esNum(ct.x) && esNum(ct.y))) { err('«cortes» debe ser { x, y }: el valor de cada eje que separa los cuadrantes (sin «cortes», el kit usa la media de cada variable).'); return; }
      d._cortes = ct != null ? { x: ct.x, y: ct.y, media: false }
        : { x: media(P_.map(function (p) { return p.x; })), y: media(P_.map(function (p) { return p.y; })), media: true };
      if (s.cuadrantes != null && !(listaTexto(s.cuadrantes) && s.cuadrantes.length === 4)) { err('«cuadrantes» debe tener 4 nombres, en orden de lectura: superior izquierdo, superior derecho, inferior izquierdo e inferior derecho.'); return; }
      if (s.destacarCuadrante != null) {
        if (!s.cuadrantes) err('«destacarCuadrante» necesita «cuadrantes» (los 4 nombres).');
        else if (s.cuadrantes.indexOf(s.destacarCuadrante) < 0) err('«destacarCuadrante» debe coincidir exactamente con uno de «cuadrantes».');
      }
    } else ['cortes', 'cuadrantes', 'destacarCuadrante'].forEach(function (k) { ignorar(k, 'la variante "cuadrantes"'); });

    if (v === 'conectada') {
      if (!Array.isArray(d.periodos) || d.periodos.length !== n || !d.periodos.every(function (x) { return esTexto(x) || esNum(x); })) { err('falta «datos.periodos»: el periodo de cada punto (' + n + '), en orden cronológico. Los puntos se unen en ese orden.'); return; }
      d._periodos = d.periodos.map(String);
    } else if (d.periodos != null) aviso('«datos.periodos» solo se usa en la variante "conectada"; se ignora.');

    if (v === 'tendencia') d._ajuste = ajusteLineal(P_.map(function (p) { return p.x; }), P_.map(function (p) { return p.y; }));
    d._puntos = P_; d._grupos = grupos.map(function (g) { return g.nombre || ''; }); d._ejes = ejes; d._n = n;
  }

  function validarMatriz(s, err, aviso) {
    var d = s.datos, cv = s.variante === 'correlacion-valores', maxV = cv ? 8 : 10;
    function variables(lista, donde) {
      if (lista.length < 3 || lista.length > maxV) {
        err('hay ' + lista.length + ' variables y ' + (lista.length < 3 ? 'el mínimo es 3. Para dos variables usa el tipo dispersion con la variante "tendencia".'
          : 'el máximo es ' + maxV + '. ' + (cv ? 'Con más variables usa la variante "correlacion-color", que admite 10.' : 'Elige las variables principales.')));
        return false;
      }
      for (var i = 0; i < lista.length; i++) if (lista.indexOf(lista[i]) !== i) { err('la variable «' + lista[i] + '» está repetida en ' + donde + '.'); return false; }
      return true;
    }
    if (d.series != null) {
      if (d.coeficientes != null || d.variables != null) aviso('ya hay «datos.series» (los valores en bruto); se ignoran «datos.variables» y «datos.coeficientes».');
      if (!Array.isArray(d.series) || !d.series.every(function (se) { return se && typeof se === 'object' && esTexto(se.nombre); })) { err('«datos.series» debe ser una lista de variables { nombre, valores }, con los valores en bruto de cada caso.'); return; }
      var nombres = d.series.map(function (se) { return se.nombre; });
      if (!variables(nombres, '«datos.series»')) return;
      var nC = null, ok = true;
      d.series.forEach(function (se) {
        if (!ok) return;
        if (!listaNum(se.valores)) { err('la variable «' + se.nombre + '»: «valores» debe ser una lista de números en bruto, sin formatear, uno por caso.'); ok = false; return; }
        if (nC == null) nC = se.valores.length;
        else if (se.valores.length !== nC) { err('la variable «' + se.nombre + '» tiene ' + se.valores.length + ' valores y «' + d.series[0].nombre + '» tiene ' + nC + ': todas llevan un valor por caso, en el mismo orden.'); ok = false; return; }
        if (se.valores.every(function (x) { return x === se.valores[0]; })) { err('la variable «' + se.nombre + '» tiene todos los valores iguales: no se puede calcular su correlación.'); ok = false; }
      });
      if (!ok) return;
      if (nC < 5) { err('hay ' + nC + ' casos y hacen falta al menos 5 para calcular una correlación.'); return; }
      d._vars = nombres;
      d._coef = d.series.map(function (a, i) { return d.series.map(function (b, j) { return i === j ? 1 : ajusteLineal(a.valores, b.valores).r; }); });
      d._n = nC;
      return;
    }
    if (s.nombreCasos != null) aviso('«nombreCasos» solo se usa cuando el kit calcula los coeficientes a partir de «datos.series»; se ignora.');
    if (!listaTexto(d.variables)) { err('«datos.variables» debe ser una lista de textos (los nombres de las variables), con sus coeficientes en «datos.coeficientes». También puedes pasar los valores en bruto en «datos.series» y el kit calcula los coeficientes.'); return; }
    if (!variables(d.variables, '«datos.variables»')) return;
    var V = d.variables, nV = V.length, C = d.coeficientes;
    var formaMal = '«datos.coeficientes» debe tener ' + nV + ' filas, una por variable: la matriz completa (' + nV + ' valores por fila) o el triángulo inferior (1 valor en la primera fila, 2 en la segunda…, terminando en el 1 de la diagonal).';
    if (!Array.isArray(C) || C.length !== nV || !C.every(Array.isArray)) { err(formaMal); return; }
    var completa = C.every(function (f) { return f.length === nV; }), triangulo = C.every(function (f, i) { return f.length === i + 1; });
    if (!completa && !triangulo) { err(formaMal); return; }
    if (!C.every(function (f) { return f.every(esNum); })) { err('«datos.coeficientes» solo puede tener números, sin formatear (por ejemplo 0.82).'); return; }
    if (C.some(function (f) { return f.some(function (x) { return x < -1 - 1e-9 || x > 1 + 1e-9; }); })) { err('los coeficientes de correlación van de −1 a 1.'); return; }
    var M = V.map(function (a, i) { return V.map(function (b, j) { return completa || j <= i ? C[i][j] : C[j][i]; }); });
    for (var i = 0; i < nV; i++) {
      if (!cuadra(M[i][i], 1, 1)) { err('la diagonal debe valer 1 (cada variable consigo misma) y en «' + V[i] + '» vale ' + numero(M[i][i], 2) + '.'); return; }
      for (var j = 0; j < i; j++) if (Math.abs(M[i][j] - M[j][i]) > 0.005) { err('la matriz no es simétrica: «' + V[i] + '» con «' + V[j] + '» vale ' + numero(M[i][j], 2) + ' y «' + V[j] + '» con «' + V[i] + '», ' + numero(M[j][i], 2) + '. Pasa solo el triángulo inferior.'); return; }
    }
    d._vars = V.slice(); d._coef = M;
  }

  function validarRadar(s, err) {
    var d = s.datos, dos = s.variante === 'dos-perfiles';
    if (!listaTexto(d.dimensiones)) { err('«datos.dimensiones» debe ser una lista de textos: los ejes del radar (de 3 a 8).'); return; }
    var nD = d.dimensiones.length;
    if (nD < 3 || nD > 8) { err('hay ' + nD + ' dimensiones y el radar admite de 3 a 8. ' + (nD < 3 ? 'Con menos, usa el tipo barras.' : 'Elige las principales o usa el tipo coordenadas-paralelas.')); return; }
    var S = d.series;
    if (S == null && d.valores != null) S = [{ nombre: s.titulo, valores: d.valores }];
    if (!dos && Array.isArray(S) && S.length > 1) { err('«perfil» dibuja un solo elemento por gráfico: usa «datos.valores». Para comparar dos perfiles usa la variante "dos-perfiles".'); return; }
    if (dos && (!Array.isArray(S) || S.length !== 2 || d.series == null)) { err('«dos-perfiles» necesita exactamente 2 series { nombre, valores } en «datos.series»: la principal y la comparada.' + (Array.isArray(S) && S.length > 2 ? ' Con más perfiles el radar no se lee: usa barras agrupadas o coordenadas-paralelas.' : '')); return; }
    if (!Array.isArray(S) || !S.length) { err('falta «datos.valores»: un número por dimensión (' + nD + ').'); return; }
    var ok = true;
    S.forEach(function (se, i) {
      if (!ok) return;
      if (!se || typeof se !== 'object' || (dos && !esTexto(se.nombre))) { err('la serie ' + (i + 1) + ' debe ser un objeto { nombre, valores }.'); ok = false; return; }
      var q = dos ? 'la serie «' + se.nombre + '»' : '«datos.valores»';
      if (!listaNum(se.valores) || se.valores.length !== nD) { err(q + ' debe tener un número por dimensión (' + nD + ').'); ok = false; return; }
      if (se.valores.some(function (x) { return x < 0; })) { err(q + ' tiene valores negativos: el radar parte de cero en el centro.'); ok = false; }
    });
    if (!ok) return;
    var max = Math.max.apply(null, [].concat.apply([], S.map(function (se) { return se.valores; })));
    if (d.maximo != null) {
      if (!esNum(d.maximo) || d.maximo <= 0 || d.maximo < max) { err('«datos.maximo» (el valor del borde exterior) debe ser un número mayor o igual que el valor más alto (' + numero(max) + ').'); return; }
      d._max = d.maximo;
    } else {
      if (!(max > 0)) { err('todos los valores son cero: no hay perfil que dibujar.'); return; }
      d._max = s.unidad === '%' && max <= 100 ? 100 : maximoRedondo(max);
    }
    d._series = S;
  }

  function validarParalelas(s, err) {
    var d = s.datos;
    if (!listaTexto(d.variables)) { err('«datos.variables» debe ser una lista de textos: un eje por variable (de 3 a 8).'); return; }
    var nV = d.variables.length;
    if (nV < 3 || nV > 8) { err('hay ' + nV + ' variables y el máximo es 8 (el mínimo, 3). ' + (nV < 3 ? 'Con dos variables usa el tipo dispersion.' : 'Elige las principales.')); return; }
    if (!Array.isArray(d.series) || !d.series.length) { err('«datos.series» debe ser una lista de casos { nombre, valores }, con un valor por variable.'); return; }
    var nS = d.series.length;
    if (nS < 2 || nS > 30) { err('hay ' + nS + (nS === 1 ? ' caso' : ' casos') + ' y ' + (nS < 2 ? 'el mínimo es 2. Para un solo caso usa el tipo radar o barras.' : 'el máximo es 30: con más líneas no se distinguen. Muestra los casos principales.')); return; }
    var vistos = [], ok = true;
    d.series.forEach(function (se, i) {
      if (!ok) return;
      if (!se || typeof se !== 'object' || !esTexto(se.nombre)) { err('el caso ' + (i + 1) + ' debe ser un objeto { nombre, valores }.'); ok = false; return; }
      if (vistos.indexOf(se.nombre) >= 0) { err('el caso «' + se.nombre + '» está repetido: cada caso necesita un nombre distinto.'); ok = false; return; }
      vistos.push(se.nombre);
      if (!listaNum(se.valores) || se.valores.length !== nV) { err('el caso «' + se.nombre + '» debe tener un número por variable (' + nV + '), sin formatear.'); ok = false; }
    });
    if (!ok) return;
    if (s.destacar == null) s.destacar = d.series[0].nombre;
    else if (!esTexto(s.destacar) || vistos.indexOf(s.destacar) < 0) err('«destacar» debe coincidir exactamente con el nombre de uno de los casos de «datos.series».');
    d._n = nS;
  }

  /* ---- Procesos y conversión: embudo, etapas y recorrido ---- */
  var PROCESOS = ['embudo', 'etapas', 'recorrido'];

  function nombresUnicos(lista, donde, err) {
    for (var i = 0; i < lista.length; i++) if (lista.indexOf(lista[i]) !== i) { err('«' + lista[i] + '» está repetido en ' + donde + ': cada uno necesita un nombre distinto.'); return false; }
    return true;
  }

  function validarProcesos(s, err, aviso) {
    var t = s.tipo, v = s.variante;
    function ignorar(campo, donde) { if (s[campo] != null) aviso('«' + campo + '» solo se usa en ' + donde + '; se ignora.'); }
    if (!(t === 'etapas' && v === 'pipeline')) { ignorar('destacar', 'etapas · pipeline'); ignorar('nombreCasos', 'etapas · pipeline'); }
    if (t !== 'recorrido') ignorar('niveles', 'el tipo recorrido');
    if (t === 'embudo') validarEmbudo(s, err, aviso);
    else if (t === 'recorrido') validarRecorrido(s, err);
    else if (v === 'pipeline') validarPipeline(s, err);
    else if (v === 'proceso') validarProceso(s, err);
    else validarProgresion(s, err, aviso);
  }

  function validarEmbudo(s, err, aviso) {
    var d = s.datos, ret = s.variante === 'retencion', clave = ret ? 'periodos' : 'etapas', que = ret ? 'periodo' : 'etapa';
    if (d[clave] == null && !ret && d.periodos != null) { err('«datos.periodos» es para la variante "retencion" (hitos temporales); las etapas del embudo van en «datos.etapas».'); return; }
    if (d[clave] == null && ret && d.etapas != null) { err('la retención usa «datos.periodos»: los hitos temporales en orden (por ejemplo "Día 0", "Día 7", "Día 30"). Para las etapas de un proceso usa la variante "embudo" o "conversion".'); return; }
    var N = d[clave];
    if (!Array.isArray(N) || !N.length || !N.every(function (x) { return esTexto(x) || esNum(x); })) {
      err(ret ? 'falta «datos.periodos»: los hitos temporales en orden (por ejemplo "Día 0", "Día 7", "Día 30").'
        : 'falta «datos.etapas»: los nombres de las etapas en el orden del proceso, de la primera a la última.' + (d.categorias != null ? ' Usa «etapas» en lugar de «categorias».' : ''));
      return;
    }
    N = N.map(String);
    var n = N.length, max = ret ? 12 : 8;
    if (n < 2 || n > max) { err('hay ' + n + ' ' + que + (n === 1 ? '' : 's') + ' y ' + (n < 2 ? 'el mínimo es 2.' : 'el máximo es ' + max + '. ' + (ret ? 'Quédate con los hitos clave (por ejemplo, los días 1, 7, 30 y 90).' : 'Agrupa las etapas menores.'))); return; }
    if (!nombresUnicos(N, '«datos.' + clave + '»', err)) return;
    var V = d.valores;
    if (!listaNum(V) || V.length !== n) { err('«datos.valores» debe tener un número por ' + que + ' (' + n + '), sin formatear.'); return; }
    if (V.some(function (x) { return x < 0; })) { err('«datos.valores» tiene valores negativos: ' + (ret ? 'la retención' : 'el embudo') + ' cuenta casos.'); return; }
    if (!(V[0] > 0)) { err('el primer valor («' + N[0] + '») es 0: ' + (ret ? 'la retención se mide sobre el grupo inicial.' : 'el embudo parte de la primera etapa.')); return; }
    for (var i = 1; i < n; i++) if (V[i] > V[i - 1]) {
      err('«' + N[i] + '» (' + numero(V[i]) + ') supera a «' + N[i - 1] + '» (' + numero(V[i - 1]) + '). ' + (ret
        ? 'Lo retenido no puede crecer con el tiempo: revisa los datos o, si hay casos que vuelven, usa el tipo lineas.'
        : 'En un embudo cada etapa es una parte de la anterior: revisa el orden o, si las etapas no son sucesivas, usa barras · horizontales.'));
      return;
    }
    if (ret && s.unidad === '%' && V[0] > 100) { err('con la unidad "%" los valores son el % retenido, de 0 a 100. Si son recuentos, pon su unidad (por ejemplo "clientes") y el kit calcula el %.'); return; }
    d._nombres = N;
    d._pct = ret && s.unidad === '%' ? V.slice() : V.map(function (x) { return x / V[0] * 100; });
    if (s.variante === 'embudo' && V[n - 1] / V[0] < 0.03) aviso('la última etapa ' + (V[n - 1] / V[0] * 100 < 0.1 ? 'no llega al 0,1' + NBSP + '%' : 'es el ' + porcentaje(V[n - 1] / V[0] * 100)) + ' de la primera y en el embudo apenas se ve: la variante "conversion" lo lee mejor, o empieza el embudo en una etapa posterior.');
  }

  function validarPipeline(s, err) {
    var d = s.datos;
    if (!listaTexto(d.etapas)) { err('«datos.etapas» debe ser una lista de textos: las etapas del proceso en orden (de 2 a 6), una columna por etapa.'); return; }
    var E = d.etapas, nE = E.length;
    if (nE < 2 || nE > 6) { err('hay ' + nE + ' etapas y ' + (nE < 2 ? 'el mínimo es 2.' : 'el máximo es 6 (una columna por etapa). Agrupa las etapas menores.')); return; }
    if (!nombresUnicos(E, '«datos.etapas»', err)) return;
    var C = d.casos;
    if (!Array.isArray(C) || !C.length) { err('«datos.casos» debe ser una lista de casos { nombre, etapa }: uno por elemento (oportunidad, pedido…), con la etapa en la que está.'); return; }
    if (C.length > 60) { err('hay ' + C.length + ' casos y el máximo es 60. Con más, cuenta los casos de cada etapa con el tipo embudo o con barras.'); return; }
    var conValor = 0, ok = true;
    C.forEach(function (c, i) {
      if (!ok) return;
      if (!c || typeof c !== 'object' || !(esTexto(c.nombre) || esNum(c.nombre))) { err('el caso ' + (i + 1) + ' debe ser un objeto { nombre, etapa }.'); ok = false; return; }
      if (E.indexOf(c.etapa) < 0) { err('el caso «' + c.nombre + '»: «etapa» debe coincidir exactamente con una de «datos.etapas»' + (c.etapa != null ? ' y vale «' + c.etapa + '»' : '') + '.'); ok = false; return; }
      if (c.valor != null) {
        if (!esNum(c.valor) || c.valor < 0) { err('el caso «' + c.nombre + '»: «valor» debe ser un número mayor o igual que 0, sin formatear.'); ok = false; return; }
        conValor++;
      }
    });
    if (!ok) return;
    if (conValor && conValor < C.length) { err('solo ' + conValor + ' de los ' + C.length + ' casos ' + (conValor === 1 ? 'lleva' : 'llevan') + ' «valor»: pon el valor a todos o a ninguno.'); return; }
    if (conValor && !esTexto(s.unidad)) { err('los casos llevan «valor»: falta «unidad» (por ejemplo "€").'); return; }
    if (s.destacar != null && E.indexOf(s.destacar) < 0) { err('«destacar» debe coincidir exactamente con una de «datos.etapas» (sin «destacar», se destaca la última).'); return; }
    if (s.nombreCasos != null && !esTexto(s.nombreCasos)) { err('«nombreCasos» debe ser un texto en plural: qué es cada caso (por ejemplo "oportunidades" o "pedidos").'); return; }
    d._columnas = E.map(function (e) { return C.filter(function (c) { return c.etapa === e; }); });
    d._foco = s.destacar != null ? s.destacar : E[nE - 1];
    d._n = C.length; d._valor = conValor > 0;
  }

  function validarProceso(s, err) {
    var d = s.datos, L = d.pasos;
    if (!Array.isArray(L) || !L.length) { err('«datos.pasos» debe ser una lista con los pasos del proceso en orden: textos, o { nombre, alternativa } para una decisión.' + (d.etapas != null ? ' «datos.etapas» es para las variantes "pipeline" y "progresion".' : '')); return; }
    if (L.length < 2 || L.length > 8) { err('hay ' + L.length + ' pasos y ' + (L.length < 2 ? 'el mínimo es 2.' : 'el máximo es 8. Agrupa los pasos menores.')); return; }
    var pasos = [], ok = true;
    L.forEach(function (p, i) {
      if (!ok) return;
      if (esTexto(p)) p = { nombre: p };
      if (!p || typeof p !== 'object' || !esTexto(p.nombre)) { err('el paso ' + (i + 1) + ' debe ser un texto o un objeto { nombre }.'); ok = false; return; }
      if (p.alternativa != null && !esTexto(p.alternativa)) { err('el paso «' + p.nombre + '»: «alternativa» es el paso al que se va si la respuesta es «No» (un texto).'); ok = false; return; }
      if (p.alternativa == null && (p.si != null || p.no != null)) { err('el paso «' + p.nombre + '»: «si» y «no» solo se usan en las decisiones (pasos con «alternativa»).'); ok = false; return; }
      ['si', 'no', 'detalle'].forEach(function (k) { if (ok && p[k] != null && !esTexto(p[k])) { err('el paso «' + p.nombre + '»: «' + k + '» debe ser un texto.'); ok = false; } });
      if (ok) pasos.push({ nombre: p.nombre, alternativa: p.alternativa || null, si: p.si || 'Sí', no: p.no || 'No', detalle: p.detalle || null });
    });
    if (!ok) return;
    var decisiones = pasos.filter(function (p) { return p.alternativa; });
    if (!nombresUnicos(pasos.map(function (p) { return p.nombre; }).concat(decisiones.map(function (p) { return p.alternativa; })), 'los pasos y las alternativas', err)) return;
    if (decisiones.length > 2) { err('hay ' + decisiones.length + ' decisiones y el máximo es 2: con más ramas, el proceso no se lee de un vistazo.'); return; }
    if (pasos[pasos.length - 1].alternativa) { err('el último paso no puede ser una decisión: el «Sí» necesita un paso siguiente.'); return; }
    var k = -1, enAlt = -1;
    if (d.actual != null) {
      k = pasos.map(function (p) { return p.nombre; }).indexOf(d.actual);
      if (k < 0) enAlt = pasos.map(function (p) { return p.alternativa; }).indexOf(d.actual);
      if (k < 0 && enAlt < 0) { err('«datos.actual» debe coincidir exactamente con uno de los pasos (o con la alternativa de una decisión).'); return; }
    }
    pasos.forEach(function (p, i) {
      if (k < 0 && enAlt < 0) p.estado = 'pendiente';
      else if (enAlt >= 0) p.estado = i <= enAlt ? 'completado' : 'pendiente';
      else p.estado = i < k ? 'completado' : (i === k ? 'actual' : 'pendiente');
      if (p.alternativa) p.estadoAlt = enAlt === i ? 'actual' : 'pendiente';
    });
    d._pasos = pasos; d._k = k; d._enAlt = enAlt;
  }

  function validarProgresion(s, err, aviso) {
    var d = s.datos;
    if (!listaTexto(d.etapas)) { err('«datos.etapas» debe ser una lista de textos: las etapas en orden (de 2 a 8).'); return; }
    var E = d.etapas, n = E.length;
    if (n < 2 || n > 8) { err('hay ' + n + ' etapas y ' + (n < 2 ? 'el mínimo es 2.' : 'el máximo es 8. Agrupa las etapas menores.')); return; }
    if (!nombresUnicos(E, '«datos.etapas»', err)) return;
    if (d.terminado != null && typeof d.terminado !== 'boolean') { err('«datos.terminado» debe ser true (todas las etapas completadas) o no ir.'); return; }
    if (d.terminado) {
      if (d.actual != null) aviso('con «datos.terminado» todas las etapas están completadas; se ignora «datos.actual».');
      if (d.porcentaje != null) aviso('con «datos.terminado» el avance es el 100 %; se ignora «datos.porcentaje».');
      d._k = n; d._pct = 100; return;
    }
    if (d.actual == null) { err('falta «datos.actual»: la etapa en la que está el elemento (una de «datos.etapas»). Si ya ha terminado, pon «terminado: true».'); return; }
    var k = E.indexOf(d.actual);
    if (k < 0) { err('«datos.actual» debe coincidir exactamente con una de «datos.etapas».'); return; }
    /* Sin «porcentaje», el avance son las etapas completadas: la actual todavía no cuenta */
    var lo = k / n * 100, hi = (k + 1) / n * 100;
    if (d.porcentaje != null && !(esNum(d.porcentaje) && d.porcentaje >= lo - 1e-9 && d.porcentaje < hi)) {
      err('«datos.porcentaje» es el avance total y, en la etapa ' + (k + 1) + ' de ' + n + ', va de ' + porcentaje(lo, lo % 1 ? 1 : 0) + ' a menos de ' + porcentaje(hi, hi % 1 ? 1 : 0) + '. Sin él, el kit cuenta las etapas completadas (' + porcentaje(lo, 0) + ').');
      return;
    }
    d._k = k; d._pct = d.porcentaje != null ? d.porcentaje : lo;
  }

  function validarRecorrido(s, err) {
    var d = s.datos;
    if (!listaTexto(d.etapas)) { err('«datos.etapas» debe ser una lista de textos: las etapas del recorrido en orden (de 3 a 8).'); return; }
    var E = d.etapas, n = E.length;
    if (n < 3 || n > 8) { err('hay ' + n + ' etapas y ' + (n < 3 ? 'el mínimo es 3.' : 'el máximo es 8. Agrupa las etapas menores.')); return; }
    if (!listaNum(d.valores) || d.valores.length !== n) { err('«datos.valores» debe tener un número por etapa (' + n + '): la valoración de la experiencia, sin formatear.'); return; }
    if (d.contactos != null && !(listaTexto(d.contactos) && d.contactos.length === n)) { err('«datos.contactos» debe tener un texto por etapa (' + n + '): el punto de contacto (por ejemplo "Web" o "Tienda").'); return; }
    if (esNum(d.minimo) && esNum(d.maximo) && d.minimo >= d.maximo) { err('«datos.minimo» (' + numero(d.minimo) + ') debe ser menor que «datos.maximo» (' + numero(d.maximo) + ').'); return; }
    if (!esNum(d.minimo) || !esNum(d.maximo)) { err('faltan «datos.minimo» y «datos.maximo»: los extremos de la escala de valoración (por ejemplo 1 y 5, o 0 y 10). El centro de la escala es la línea «Media».'); return; }
    var fuera = d.valores.filter(function (x) { return x < d.minimo || x > d.maximo; });
    if (fuera.length) { err('hay valores fuera de la escala de ' + numero(d.minimo) + ' a ' + numero(d.maximo) + ': ' + fuera.map(function (x) { return numero(x); }).join(', ') + '.'); return; }
    if (s.niveles != null && !(listaTexto(s.niveles) && s.niveles.length === 3)) { err('«niveles» debe tener 3 textos, de abajo arriba: el mínimo, el centro y el máximo de la escala (por defecto "Baja", "Media" y "Alta").'); return; }
  }

  /* ---- Temporal especializado: cronologia, gantt, calendario, dos-periodos y ciclo-vida (y matriz · cohortes) ---- */
  var TEMPORAL = ['cronologia', 'gantt', 'calendario', 'dos-periodos', 'ciclo-vida'];
  var DIA_MS = 864e5;
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var DIAS_SEMANA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  var FASES_CICLO = ['Introducción', 'Crecimiento', 'Madurez', 'Declive'];
  var FECHA_MAL = 'una fecha "AAAA-MM-DD" (por ejemplo "2026-04-20") o un mes "AAAA-MM"';
  function dos(n) { return (n < 10 ? '0' : '') + n; }
  function mayuscula(t) { t = String(t); return t.charAt(0).toUpperCase() + t.slice(1); }
  /* Fecha ISO: un día («AAAA-MM-DD») o un mes («AAAA-MM»). Devuelve { t0, t1 } en ms UTC (t1: el comienzo del día o mes siguiente) */
  function leerFecha(x) {
    if (typeof x !== 'string') return null;
    var m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(x.trim());
    if (!m) return null;
    var a = +m[1], mes = +m[2] - 1;
    if (mes < 0 || mes > 11) return null;
    if (m[3] == null) return { t0: Date.UTC(a, mes, 1), t1: Date.UTC(a, mes + 1, 1), dia: false, a: a, m: mes };
    var d = +m[3], t = Date.UTC(a, mes, d), f = new Date(t);
    if (f.getUTCMonth() !== mes || f.getUTCDate() !== d) return null;
    return { t0: t, t1: t + DIA_MS, dia: true, a: a, m: mes, d: d };
  }
  function fechaDe(t) { var f = new Date(t); return leerFecha(f.getUTCFullYear() + '-' + dos(f.getUTCMonth() + 1) + '-' + dos(f.getUTCDate())); }
  /* «hoy»: una fecha o true (el día de hoy en el navegador) */
  function fechaHoy(h) {
    if (h === true) { var n = new Date(); return leerFecha(n.getFullYear() + '-' + dos(n.getMonth() + 1) + '-' + dos(n.getDate())); }
    var f = leerFecha(h);
    return f && f.dia ? f : null;
  }
  function medioFecha(f) { return (f.t0 + f.t1) / 2; }
  /* «12 ene», «12 ene 2026», «Ene» o «Ene 2026» */
  function textoFecha(f, conAnio) {
    var m = MESES[f.m].slice(0, 3);
    return f.dia ? f.d + ' ' + m + (conAnio ? ' ' + f.a : '') : mayuscula(m) + (conAnio ? ' ' + f.a : '');
  }
  /* «lunes, 12 de enero de 2026» o «enero de 2026» */
  function fechaLarga(f, conDia) {
    if (!f.dia) return MESES[f.m] + ' de ' + f.a;
    return (conDia ? DIAS_SEMANA[(new Date(f.t0).getUTCDay() + 6) % 7] + ', ' : '') + f.d + ' de ' + MESES[f.m] + ' de ' + f.a;
  }
  function diaSemana(t) { return (new Date(t).getUTCDay() + 6) % 7; } /* 0 = lunes */
  function nombreUnico(lista, nombre) { return lista.filter(function (x) { return x.nombre === nombre; }).length; }

  function validarTemporal(s, err, aviso) {
    var t = s.tipo, v = s.variante;
    function ignorar(campo, donde) { if (s[campo] != null) aviso('«' + campo + '» solo se usa en ' + donde + '; se ignora.'); }
    if (t !== 'cronologia') ignorar('destacar', 'cronologia');
    if (t !== 'dos-periodos' && !(t === 'calendario' && v === 'calor')) ignorar('resumen', 'dos-periodos · superpuestos y calendario · calor');
    if (t === 'cronologia') validarCronologia(s, err, aviso);
    else if (t === 'gantt') validarGantt(s, err, aviso);
    else if (t === 'calendario') { if (v === 'calor') validarCalor(s, err, aviso); else validarMes(s, err, aviso); }
    else if (t === 'dos-periodos') validarDosPeriodos(s, err, aviso);
    else validarCicloVida(s, err);
  }

  /* «hoy» común a cronologia y gantt */
  function validarHoy(d, err) {
    if (d.hoy == null) return true;
    d._hoy = fechaHoy(d.hoy);
    if (!d._hoy) { err('«datos.hoy» debe ser una fecha "AAAA-MM-DD" o true (el día de hoy).'); return false; }
    return true;
  }

  function validarCronologia(s, err, aviso) {
    var d = s.datos, v = s.variante, E = d.eventos;
    if (v !== 'vertical') { if (d.actual != null) aviso('«datos.actual» solo se usa en la variante "vertical"; se ignora.'); if (d.terminado != null) aviso('«datos.terminado» solo se usa en la variante "vertical"; se ignora.'); }
    if (v === 'vertical') { if (d.hoy != null) aviso('«datos.hoy» no se usa en la variante "vertical" (el estado de cada hito sale de «datos.actual»); se ignora.'); if (s.destacar != null) aviso('«destacar» no se usa en la variante "vertical"; se ignora.'); }
    if (v !== 'carriles' && d.carriles != null) aviso('«datos.carriles» solo se usa en la variante "carriles"; se ignora.');
    if (!Array.isArray(E) || !E.length) {
      err('«datos.eventos» debe ser una lista de eventos { nombre, fecha' + (v === 'carriles' ? ', carril' : '') + ' }.' + (d.hitos != null ? ' Usa «eventos» en lugar de «hitos».' : ''));
      return;
    }
    var lim = { hitos: [2, 10], carriles: [2, 30], vertical: [2, 8] }[v];
    if (E.length < lim[0] || E.length > lim[1]) {
      err('hay ' + E.length + ' evento' + (E.length === 1 ? '' : 's') + ' y ' + (E.length < lim[0] ? 'el mínimo es ' + lim[0] + '.' : 'el máximo es ' + lim[1] + '. ' +
        { hitos: 'Quédate con los hitos clave o reparte los eventos en carriles (variante "carriles").', carriles: 'Agrupa los eventos menores.', vertical: 'Agrupa los hitos menores.' }[v]));
      return;
    }
    var ev = [], ok = true;
    E.forEach(function (e, i) {
      if (!ok) return;
      function mal(m) { err('el evento ' + (esTexto(e && e.nombre) ? '«' + e.nombre + '»' : i + 1) + ': ' + m); ok = false; }
      if (!e || typeof e !== 'object' || !esTexto(e.nombre)) return mal('debe ser un objeto { nombre, fecha }.');
      var x = { nombre: e.nombre, i: i };
      if (e.descripcion != null) { if (!esTexto(e.descripcion)) return mal('«descripcion» debe ser un texto.'); if (v !== 'vertical') aviso('«descripcion» solo se muestra en la variante "vertical" (en las demás, en el tooltip).'); x.descripcion = e.descripcion; }
      if (e.inicio != null || e.fin != null) {
        if (v !== 'carriles') return mal('«inicio» y «fin» solo se usan en la variante "carriles" (eventos con duración); en "' + v + '" cada evento lleva «fecha». Para tareas con duración usa el tipo gantt.');
        if (e.fecha != null) return mal('lleva «fecha» y también «inicio» o «fin»: un evento puntual lleva «fecha»; uno con duración, «inicio» y «fin».');
        var a = leerFecha(e.inicio), b = leerFecha(e.fin);
        if (!a || !b) return mal('«inicio» y «fin» deben ser ' + FECHA_MAL + '.');
        if (b.t1 <= a.t0) return mal('«fin» (' + e.fin + ') es anterior a «inicio» (' + e.inicio + ').');
        x.t0 = a.t0; x.t1 = b.t1; x.fi = a; x.ff = b; x.tramo = true; x.t = x.t0;
      } else {
        if (e.fecha == null) return mal('falta «fecha»: ' + FECHA_MAL + (v === 'carriles' ? ' (o «inicio» y «fin» si dura varios días).' : '.'));
        var f = leerFecha(e.fecha);
        if (f) { x.f = f; x.t = medioFecha(f); x.t0 = f.t0; x.t1 = f.t1; }
        else if (v === 'vertical' && esTexto(e.fecha)) x.texto = e.fecha;
        else return mal('«fecha» debe ser ' + FECHA_MAL + (v === 'vertical' ? ' (en la variante "vertical" también vale un texto, por ejemplo "Curso 2026/27").' : '.'));
      }
      if (v === 'carriles') {
        if (!esTexto(e.carril)) return mal('falta «carril»: el tipo de evento (por ejemplo "Lanzamientos" o "Incidencias"), uno por fila.');
        x.carril = e.carril;
      } else if (e.carril != null) aviso('«carril» solo se usa en la variante "carriles"; se ignora.');
      ev.push(x);
    });
    if (!ok) return;
    if (v !== 'carriles') { var nombres = ev.map(function (x) { return x.nombre; }); if (!nombresUnicos(nombres, '«datos.eventos»', err)) return; }
    if (v === 'carriles') {
      var C = d.carriles;
      if (C != null) {
        if (!listaTexto(C)) { err('«datos.carriles» debe ser una lista de textos: los tipos de evento, en el orden de las filas.'); return; }
        if (!nombresUnicos(C, '«datos.carriles»', err)) return;
        var fuera = ev.filter(function (x) { return C.indexOf(x.carril) < 0; });
        if (fuera.length) { err('el evento «' + fuera[0].nombre + '» tiene el carril «' + fuera[0].carril + '», que no está en «datos.carriles».'); return; }
      } else { C = []; ev.forEach(function (x) { if (C.indexOf(x.carril) < 0) C.push(x.carril); }); }
      if (C.length < 2 || C.length > 6) { err('hay ' + C.length + ' carril' + (C.length === 1 ? '' : 'es') + ' y ' + (C.length < 2 ? 'el mínimo es 2. Con un solo tipo de evento usa la variante "hitos".' : 'el máximo es 6. Agrupa los tipos de evento.')); return; }
      d._carriles = C;
    }
    if (v === 'vertical') {
      for (var j = 1; j < ev.length; j++) if (ev[j].f && ev[j - 1].f && ev[j].t0 < ev[j - 1].t0) { err('los hitos van en orden cronológico y «' + ev[j].nombre + '» es anterior a «' + ev[j - 1].nombre + '».'); return; }
      if (d.terminado != null && typeof d.terminado !== 'boolean') { err('«datos.terminado» debe ser true (todos los hitos cumplidos) o no ir.'); return; }
      var k = -1;
      if (d.terminado) { if (d.actual != null) aviso('con «datos.terminado» todos los hitos están cumplidos; se ignora «datos.actual».'); k = ev.length; }
      else if (d.actual != null) {
        k = ev.map(function (x) { return x.nombre; }).indexOf(d.actual);
        if (k < 0) { err('«datos.actual» debe coincidir exactamente con el nombre de uno de los eventos: el hito en curso.'); return; }
      }
      /* Sin «actual», todos pendientes */
      ev.forEach(function (x, i) { x.estado = k < 0 ? 'pendiente' : (i < k ? 'hecho' : (i === k ? 'curso' : 'pendiente')); });
      d._ev = ev; d._k = k;
      return;
    }
    if (!validarHoy(d, err)) return;
    ev.sort(function (a, b) { return a.t - b.t || a.i - b.i; });
    var foco = -1;
    if (s.destacar != null) {
      var cuantos = nombreUnico(ev, s.destacar);
      if (!cuantos) { err('«destacar» debe coincidir exactamente con el nombre de uno de los eventos.'); return; }
      if (cuantos > 1) { err('hay ' + cuantos + ' eventos «' + s.destacar + '»: para destacar uno, dale un nombre distinto.'); return; }
      ev.forEach(function (x, i) { if (x.nombre === s.destacar) foco = i; });
    } else if (v === 'hitos' && d._hoy) {
      /* Sin «destacar», con «hoy»: el próximo hito */
      for (var q = 0; q < ev.length; q++) if (ev[q].t0 >= d._hoy.t0) { foco = q; break; }
    }
    var anios = ev.map(function (x) { return new Date(x.t0).getUTCFullYear(); }).concat(ev.map(function (x) { return new Date(x.t1 - 1).getUTCFullYear(); }));
    d._ev = ev; d._foco = foco; d._conAnio = Math.min.apply(null, anios) !== Math.max.apply(null, anios);
  }

  function validarGantt(s, err, aviso) {
    var d = s.datos, L = d.tareas, H = d.hitos || [];
    if (!Array.isArray(L) || !L.length) { err('«datos.tareas» debe ser una lista de tareas { nombre, inicio, fin } con, si quieres, su «avance» (de 0 a 100).'); return; }
    if (!Array.isArray(H)) { err('«datos.hitos» debe ser una lista de hitos { nombre, fecha }.'); return; }
    if (L.length > 15) { err('hay ' + L.length + ' tareas y el máximo es 15. Agrupa las tareas en fases.'); return; }
    if (H.length > 5) { err('hay ' + H.length + ' hitos y el máximo es 5.'); return; }
    var tareas = [], hitos = [], ok = true, conAvance = 0;
    L.forEach(function (x, i) {
      if (!ok) return;
      function mal(m) { err('la tarea ' + (esTexto(x && x.nombre) ? '«' + x.nombre + '»' : i + 1) + ': ' + m); ok = false; }
      if (!x || typeof x !== 'object' || !esTexto(x.nombre)) return mal('debe ser un objeto { nombre, inicio, fin }.');
      var a = leerFecha(x.inicio), b = leerFecha(x.fin);
      if (!a || !b) return mal('«inicio» y «fin» deben ser ' + FECHA_MAL + '.' + (x.fecha != null ? ' Un hito (sin duración) va en «datos.hitos» con su «fecha».' : ''));
      if (b.t1 <= a.t0) return mal('«fin» (' + x.fin + ') es anterior a «inicio» (' + x.inicio + ').');
      if (x.avance != null) {
        if (!esNum(x.avance) || x.avance < 0 || x.avance > 100) return mal('«avance» es el % realizado, un número de 0 a 100.');
        conAvance++;
      }
      tareas.push({ nombre: x.nombre, t0: a.t0, t1: b.t1, fi: a, ff: b, avance: x.avance });
    });
    if (!ok) return;
    H.forEach(function (x, i) {
      if (!ok) return;
      if (!x || typeof x !== 'object' || !esTexto(x.nombre)) { err('el hito ' + (i + 1) + ' debe ser un objeto { nombre, fecha }.'); ok = false; return; }
      var f = leerFecha(x.fecha);
      if (!f) { err('el hito «' + x.nombre + '»: «fecha» debe ser ' + FECHA_MAL + '.'); ok = false; return; }
      hitos.push({ nombre: x.nombre, f: f, t: medioFecha(f), t0: f.t0, t1: f.t1, hito: true });
    });
    if (!ok) return;
    if (!validarHoy(d, err)) return;
    d._tareas = tareas; d._hitos = hitos; d._avance = conAvance > 0;
  }

  function validarCalor(s, err, aviso) {
    var d = s.datos, V = d.valores, t0, dias = [];
    if (d.mes != null || d.eventos != null || d.festivos != null) aviso('«datos.mes», «datos.eventos» y «datos.festivos» son de la variante "mes"; se ignoran.');
    var okV = Array.isArray(V) && V.length > 0 && V.every(function (x) { return x === null || esNum(x); });
    if (!okV) { err('«datos.valores» debe ser una lista de números en bruto, uno por día (null si no hay dato).'); return; }
    if (d.inicio != null && d.fechas != null) { err('usa «datos.inicio» (días consecutivos) o «datos.fechas» (una fecha por valor), no los dos.'); return; }
    if (d.inicio != null) {
      var f0 = leerFecha(d.inicio);
      if (!f0 || !f0.dia) { err('«datos.inicio» es el primer día: una fecha "AAAA-MM-DD".'); return; }
      t0 = f0.t0; dias = V.map(function (x, i) { return { t: t0 + i * DIA_MS, v: x }; });
    } else if (d.fechas != null) {
      if (!Array.isArray(d.fechas) || d.fechas.length !== V.length) { err('«datos.fechas» debe tener una fecha por cada valor (' + V.length + ').'); return; }
      var ts = [], okF = true;
      d.fechas.forEach(function (x) { var f = leerFecha(x); if (!f || !f.dia) okF = false; else ts.push(f.t0); });
      if (!okF) { err('«datos.fechas» debe ser una lista de fechas "AAAA-MM-DD".'); return; }
      var rep = ts.filter(function (x, i) { return ts.indexOf(x) !== i; });
      if (rep.length) { err('el día ' + fechaLarga(fechaDe(rep[0])) + ' está repetido en «datos.fechas».'); return; }
      t0 = Math.min.apply(null, ts);
      var t1 = Math.max.apply(null, ts), mapa = {};
      ts.forEach(function (x, i) { mapa[x] = V[i]; });
      for (var t = t0; t <= t1; t += DIA_MS) dias.push({ t: t, v: mapa[t] != null ? mapa[t] : (t in mapa ? null : 0) });
    } else { err('faltan los días: «datos.inicio» (el primer día, "AAAA-MM-DD") y «datos.valores» (un valor por día consecutivo), o «datos.fechas» y «datos.valores».'); return; }
    if (dias.length < 7 || dias.length > 371) { err('hay ' + dias.length + ' días y ' + (dias.length < 7 ? 'el mínimo es 7 (una semana).' : 'el máximo es 371 (53 semanas). Para más tiempo, usa lineas con los datos por semana o por mes.')); return; }
    var conDato = dias.filter(function (x) { return x.v != null; });
    if (!conDato.length) { err('todos los días están vacíos (null).'); return; }
    if (conDato.some(function (x) { return x.v < 0; })) { err('hay valores negativos: el calendario de calor mide actividad (de 0 en adelante). Para valores con signo, usa barras-divergentes.'); return; }
    var resumen = s.resumen != null ? s.resumen : (s.unidad === '%' ? 'media' : 'total');
    if (resumen !== 'total' && resumen !== 'media') { err('«resumen» debe ser "total" (la suma de los días) o "media" (la media diaria).'); return; }
    if (resumen === 'total' && s.unidad === '%') { err('los porcentajes no se suman: con la unidad "%" el resumen es la media diaria (quita «resumen» o pon "media").'); return; }
    var vals = conDato.map(function (x) { return x.v; });
    d._dias = dias; d._max = Math.max.apply(null, vals); d._resumen = resumen;
    d._total = suma(vals); d._media = d._total / vals.length;
  }

  function validarMes(s, err, aviso) {
    var d = s.datos;
    if (d.valores != null || d.inicio != null || d.fechas != null) aviso('«datos.valores», «datos.inicio» y «datos.fechas» son de la variante "calor"; se ignoran.');
    var m = leerFecha(d.mes);
    if (!m || m.dia) { err('falta «datos.mes»: el mes que se muestra, "AAAA-MM" (por ejemplo "2026-04").'); return; }
    function delMes(f) { return f && f.dia && f.a === m.a && f.m === m.m; }
    var ok = true, eventos = {}, festivos = {};
    function lista(campo, destino, conNombre) {
      var L = d[campo];
      if (L == null) return;
      if (!Array.isArray(L)) { err('«datos.' + campo + '» debe ser una lista.'); ok = false; return; }
      if (L.length > 62) { err('hay ' + L.length + ' ' + campo + ' y el máximo es 62.'); ok = false; return; }
      L.forEach(function (x, i) {
        if (!ok) return;
        var fecha = typeof x === 'string' ? x : (x && x.fecha), nombre = x && typeof x === 'object' ? x.nombre : null;
        if (conNombre && !esTexto(nombre)) { err('el evento ' + (i + 1) + ' debe ser un objeto { fecha, nombre }.'); ok = false; return; }
        if (nombre != null && !esTexto(nombre)) { err('«datos.' + campo + '»: «nombre» debe ser un texto.'); ok = false; return; }
        var f = leerFecha(fecha);
        if (!f || !f.dia) { err('«datos.' + campo + '»: «' + fecha + '» no es una fecha "AAAA-MM-DD".'); ok = false; return; }
        if (!delMes(f)) { err('«datos.' + campo + '»: el ' + fechaLarga(f) + ' no es de ' + fechaLarga(m) + '. El calendario muestra un solo mes.'); ok = false; return; }
        (destino[f.d] = destino[f.d] || []).push(nombre || '');
      });
    }
    lista('eventos', eventos, true);
    lista('festivos', festivos, false);
    if (!ok) return;
    var hoy = null;
    if (d.hoy != null) {
      hoy = fechaHoy(d.hoy);
      if (!hoy) { err('«datos.hoy» debe ser una fecha "AAAA-MM-DD" o true (el día de hoy).'); return; }
      if (!delMes(hoy)) { if (d.hoy !== true) aviso('«datos.hoy» (' + d.hoy + ') no es de ' + fechaLarga(m) + '; no se marca.'); hoy = null; }
    }
    d._mes = m; d._eventos = eventos; d._festivos = festivos; d._hoy = hoy;
    d._nEventos = d.eventos ? d.eventos.length : 0;
  }

  function validarDosPeriodos(s, err, aviso) {
    var d = s.datos, v = s.variante, P_ = d.periodos, S = d.series;
    var lim = v === 'interanual' ? [2, 12] : [3, 31];
    if (!Array.isArray(P_) || !P_.length || !P_.every(function (x) { return esTexto(x) || esNum(x); })) {
      err('falta «datos.periodos»: las posiciones que se comparan, en orden (' + (v === 'interanual' ? 'por ejemplo "T1", "T2"… o los meses' : 'por ejemplo los días "L", "M", "X"… o "Día 1", "Día 2"…') + ').'); return;
    }
    P_ = P_.map(String);
    if (P_.length < lim[0] || P_.length > lim[1]) { err('hay ' + P_.length + ' periodos y ' + (P_.length < lim[0] ? 'el mínimo es ' + lim[0] + '.' : 'el máximo es ' + lim[1] + '.' + (v === 'interanual' ? ' Con más periodos usa la variante "superpuestos".' : ''))); return; }
    if (!Array.isArray(S) || S.length !== 2 || !S.every(function (x) { return x && typeof x === 'object' && esTexto(x.nombre); })) {
      err('«datos.series» debe tener 2 series { nombre, valores }: el periodo actual y el anterior (el segundo, o el que lleve rol:"anterior"). Para más series usa lineas o barras.'); return;
    }
    var iAnt = S.map(function (x) { return x.rol; }).indexOf('anterior');
    if (S.filter(function (x) { return x.rol === 'anterior'; }).length > 1) { err('solo una de las dos series puede llevar rol:"anterior".'); return; }
    if (S.some(function (x) { return x.rol != null && x.rol !== 'anterior' && x.rol !== 'actual'; })) { err('«rol» de una serie solo puede ser "actual" o "anterior".'); return; }
    if (iAnt < 0) iAnt = S[0].rol === 'actual' || S[1].rol !== 'actual' ? 1 : 0;
    var A = S[1 - iAnt], B = S[iAnt], n = P_.length;
    if (!listaNum(B.valores) || B.valores.length !== n) { err('la serie «' + B.nombre + '» (el periodo anterior) debe tener un número por periodo (' + n + '), sin formatear.'); return; }
    if (!listaNum(A.valores) || A.valores.length > n) { err('la serie «' + A.nombre + '» debe tener un número por periodo (' + n + '), sin formatear; si el periodo actual no ha terminado, puede tener menos.'); return; }
    if (v === 'interanual' && A.valores.concat(B.valores).some(function (x) { return x < 0; })) { err('hay valores negativos y las columnas parten de cero. Para valores con signo usa barras-divergentes.'); return; }
    if (v === 'superpuestos') {
      var resumen = s.resumen != null ? s.resumen : (s.unidad === '%' ? 'media' : 'total');
      if (resumen !== 'total' && resumen !== 'media') { err('«resumen» debe ser "total" (la suma de cada periodo) o "media" (para porcentajes, precios o valoraciones).'); return; }
      if (resumen === 'total' && s.unidad === '%') { err('los porcentajes no se suman: con la unidad "%" el resumen es la media (quita «resumen» o pon "media").'); return; }
      d._resumen = resumen;
    } else if (s.resumen != null) aviso('«resumen» solo se usa en la variante "superpuestos"; se ignora.');
    d._periodos = P_; d._act = A; d._ant = B; d._k = A.valores.length;
  }

  function validarCicloVida(s, err) {
    var d = s.datos, F = d.fases != null ? d.fases : FASES_CICLO;
    if (!listaTexto(F) || F.length < 3 || F.length > 6) { err('«datos.fases» debe tener de 3 a 6 textos, en orden (sin «fases», el kit usa ' + FASES_CICLO.join(', ') + ').'); return; }
    if (!nombresUnicos(F, '«datos.fases»', err)) return;
    var k = F.indexOf(d.actual);
    if (k < 0) { err('«datos.actual» debe coincidir exactamente con una de las fases: ' + F.join(', ') + '.'); return; }
    if (d.elemento != null && !esTexto(d.elemento)) { err('«datos.elemento» es el nombre de lo que se sitúa en la curva (por ejemplo "Lectópolis 3"): un texto.'); return; }
    if (d.medida != null && !esTexto(d.medida)) { err('«datos.medida» es el nombre del eje vertical (por defecto "Ventas"): un texto.'); return; }
    if (d.posicion != null && !(esNum(d.posicion) && d.posicion >= 0 && d.posicion <= 100)) { err('«datos.posicion» es el punto dentro de la fase actual, de 0 (al empezar) a 100 (al acabar); por defecto, 50.'); return; }
    d._fases = F.slice(); d._k = k;
  }

  /* Matriz de cohortes: una fila por cohorte y una columna por periodo desde su inicio (triángulo: las cohortes recientes tienen menos) */
  var CLASES_COHORTE = [P.naranja100, P.naranja300, P.naranja500, P.naranja600, P.naranja700];
  function validarCohortes(s, err, aviso) {
    var d = s.datos, C = d.cohortes, Pr = d.periodos, V = d.valores;
    if (s.nombreCasos != null) aviso('«nombreCasos» no se usa en la variante "cohortes"; se ignora.');
    if (!Array.isArray(C) || !C.length || !C.every(function (x) { return esTexto(x) || esNum(x); })) { err('falta «datos.cohortes»: el nombre de cada cohorte, en orden (por ejemplo los meses de alta "Ene", "Feb"…).'); return; }
    if (!Array.isArray(Pr) || !Pr.length || !Pr.every(function (x) { return esTexto(x) || esNum(x); })) { err('falta «datos.periodos»: el tiempo desde el inicio de cada cohorte, en orden (por ejemplo "M0", "M1", "M2"…).'); return; }
    C = C.map(String); Pr = Pr.map(String);
    if (C.length < 2 || C.length > 12) { err('hay ' + C.length + ' cohortes y ' + (C.length < 2 ? 'el mínimo es 2.' : 'el máximo es 12. Quédate con las más recientes o agrúpalas.')); return; }
    if (Pr.length < 2 || Pr.length > 12) { err('hay ' + Pr.length + ' periodos y ' + (Pr.length < 2 ? 'el mínimo es 2.' : 'el máximo es 12.')); return; }
    if (!nombresUnicos(C, '«datos.cohortes»', err) || !nombresUnicos(Pr, '«datos.periodos»', err)) return;
    if (!Array.isArray(V) || V.length !== C.length || !V.every(function (f) { return listaNum(f); })) { err('«datos.valores» debe tener una fila por cohorte (' + C.length + '): la lista de sus valores desde el primer periodo, sin formatear.'); return; }
    var largo = V.filter(function (f) { return f.length > Pr.length; });
    if (largo.length) { err('la cohorte «' + C[V.indexOf(largo[0])] + '» tiene ' + largo[0].length + ' valores y solo hay ' + Pr.length + ' periodos.'); return; }
    if (V.some(function (f) { return f.some(function (x) { return x < 0; }); })) { err('hay valores negativos: la matriz de cohortes mide lo que se conserva.'); return; }
    var pct = s.unidad === '%';
    if (pct && V.some(function (f) { return f.some(function (x) { return x > 100; }); })) { err('con la unidad "%" los valores son porcentajes, de 0 a 100. Si son recuentos, pon su unidad (por ejemplo "usuarios") y el kit calcula el %.'); return; }
    if (!pct) { var cero = V.map(function (f) { return f[0]; }).indexOf(0); if (cero >= 0) { err('la cohorte «' + C[cero] + '» empieza en 0: el % se calcula sobre el primer periodo de cada cohorte.'); return; } }
    var P2 = pct ? V.map(function (f) { return f.slice(); }) : V.map(function (f) { return f.map(function (x) { return x / f[0] * 100; }); });
    var cortes = s.umbrales;
    if (cortes != null) {
      if (!listaNum(cortes) || cortes.length !== 4 || cortes.some(function (x, i) { return i && x <= cortes[i - 1]; })) { err('«umbrales» debe tener 4 números crecientes (en %): los límites entre las 5 clases de color.'); return; }
    } else {
      /* Clases de igual amplitud (paso bonito) sobre los valores fuera del primer periodo, que siempre es el 100 % */
      var resto = []; P2.forEach(function (f) { f.slice(1).forEach(function (x) { resto.push(x); }); });
      if (!resto.length) resto = [].concat.apply([], P2);
      var lo = Math.min.apply(null, resto), hi = Math.max.apply(null, resto), paso = hi > lo ? pasoBonito((hi - lo) / 5) : 10;
      var c0 = limpio(Math.floor(lo / paso + 1e-9) * paso + paso);
      cortes = [0, 1, 2, 3].map(function (k) { return limpio(c0 + k * paso); });
    }
    d._cohortes = C; d._periodos = Pr; d._pct = P2; d._cortes = cortes; d._recuentos = !pct;
    d._enteros = P2.every(function (f) { return f.every(function (x) { return Math.round(x) === x; }); }) && cortes.every(function (x) { return Math.round(x) === x; });
  }
  function claseCohorte(x, cortes) { var r = Math.round(x); for (var k = 0; k < 4; k++) if (r < cortes[k]) return k; return 4; }

  /* ---- Jerarquía: treemap · jerarquico, particion, circulos-anidados, arbol, anidados y tabla · jerarquica ---- */
  var JERARQUIA = ['particion', 'circulos-anidados', 'arbol', 'anidados'];
  var RUTA = ' / ';
  function esJerarquia(s) {
    return JERARQUIA.indexOf(s.tipo) >= 0 || (s.tipo === 'treemap' && s.variante === 'jerarquico') || (s.tipo === 'tabla' && s.variante === 'jerarquica');
  }
  function esOtros(nombre) { return /^(otros|otras|resto)\b/i.test(nombre); }
  /* Lee el árbol anidado { nombre, valor, hijos } o las filas planas (un nombre por nivel y, si hace falta, el valor al final).
     Devuelve la raíz con { nombre, valor, hijos, nivel, ruta, padre } en cada nodo; los valores se suman de las hojas hacia arriba. */
  function leerArbol(s, conValor, err) {
    var d = s.datos, ok = true;
    function mal(m) { if (ok) err(m); ok = false; }
    var raiz;
    if (d.arbol != null && d.filas != null) { mal('usa «datos.arbol» o «datos.filas», no los dos.'); return null; }
    if (d.raiz != null && !esTexto(d.raiz)) { mal('«datos.raiz» debe ser un texto (el nombre del total o del origen).'); return null; }
    if (d.niveles != null && !listaTexto(d.niveles)) { mal('«datos.niveles» debe ser una lista de textos: el nombre de cada nivel.'); return null; }
    if (d.arbol != null) {
      var cuenta = 0;
      var nodo = function (o, ruta, prof) {
        if (++cuenta > 400) { mal('el árbol tiene demasiados elementos.'); return null; }
        if (prof > 5) { mal('el árbol tiene más de 5 niveles: resume los inferiores.'); return null; }
        if (typeof o === 'string' || esNum(o)) {
          if (conValor) { mal('«' + o + '» necesita un valor: escríbelo como { nombre: "' + o + '", valor: 12 }.'); return null; }
          return { nombre: String(o), hijos: [] };
        }
        if (!o || typeof o !== 'object' || Array.isArray(o)) { mal('cada elemento del árbol debe ser { nombre, valor, hijos }' + (conValor ? '' : ' o un texto') + (ruta ? ' (en «' + ruta + '»).' : '.')); return null; }
        var nombre = esTexto(o.nombre) ? o.nombre : (esNum(o.nombre) ? String(o.nombre) : null);
        if (nombre == null) { mal('hay un elemento sin «nombre»' + (ruta ? ' en «' + ruta + '»' : '') + '.'); return null; }
        var n = { nombre: nombre, hijos: [] };
        var aqui = ruta ? ruta + RUTA + nombre : nombre;
        if (o.hijos != null && !Array.isArray(o.hijos)) { mal('«hijos» de «' + aqui + '» debe ser una lista.'); return null; }
        (o.hijos || []).forEach(function (h) { var x = nodo(h, prof === 0 && esRaizObj ? '' : aqui, prof + 1); if (x) n.hijos.push(x); });
        if (o.valor != null) {
          if (!esNum(o.valor)) mal('el valor de «' + aqui + '» debe ser un número sin formatear.');
          else n.valorDado = o.valor;
        }
        if (o.altura != null) {
          if (!esNum(o.altura) || o.altura < 0) mal('la «altura» de «' + aqui + '» debe ser un número mayor o igual que cero.');
          else n.altura = o.altura;
        }
        return n;
      };
      var esRaizObj = !Array.isArray(d.arbol);
      if (esRaizObj) {
        if (!d.arbol || typeof d.arbol !== 'object') { mal('«datos.arbol» debe ser un objeto { nombre, hijos } o una lista de elementos.'); return null; }
        raiz = nodo(d.arbol, '', 0);
        if (raiz && d.raiz != null) raiz.nombre = d.raiz;
      } else {
        if (!d.arbol.length) { mal('«datos.arbol» está vacío.'); return null; }
        esRaizObj = false;
        raiz = { nombre: d.raiz || 'Total', hijos: [], virtual: d.raiz == null };
        d.arbol.forEach(function (h) { var x = nodo(h, '', 1); if (x) raiz.hijos.push(x); });
      }
    } else if (d.filas != null) {
      if (!Array.isArray(d.filas) || !d.filas.length) { mal('«datos.filas» debe ser una lista de filas: los nombres de cada nivel' + (conValor ? ' y el valor al final' : '') + ', por ejemplo ["Norte", "Centro 1"' + (conValor ? ', 210' : '') + '].'); return null; }
      if (d.filas.length > 300) { mal('hay ' + d.filas.length + ' filas y el máximo es 300.'); return null; }
      raiz = { nombre: d.raiz || 'Total', hijos: [], virtual: d.raiz == null };
      d.filas.forEach(function (f, i) {
        if (!ok) return;
        if (!Array.isArray(f) || !f.length) { mal('la fila ' + (i + 1) + ' debe ser una lista: los nombres de cada nivel' + (conValor ? ' y el valor.' : '.')); return; }
        var nombres = f.slice(), valor = null;
        if (conValor) {
          valor = nombres.pop();
          if (!esNum(valor)) { mal('la fila ' + (i + 1) + ' debe terminar con el valor (un número sin formatear).'); return; }
          if (valor < 0) { mal('la fila ' + (i + 1) + ' tiene un valor negativo: los valores son partes del total.'); return; }
        } else if (esNum(nombres[nombres.length - 1])) nombres.pop();
        while (nombres.length && (nombres[nombres.length - 1] == null || nombres[nombres.length - 1] === '')) nombres.pop();
        if (!nombres.length) { mal('la fila ' + (i + 1) + ' no tiene nombres.'); return; }
        if (!nombres.every(function (x) { return esTexto(x) || esNum(x); })) { mal('la fila ' + (i + 1) + ' tiene un hueco o un nombre que no es texto: los niveles van seguidos, del más general al más concreto.'); return; }
        if (nombres.length > 5) { mal('la fila ' + (i + 1) + ' tiene más de 5 niveles.'); return; }
        var p = raiz;
        nombres.forEach(function (nm, k) {
          nm = String(nm);
          var h = null;
          for (var j = 0; j < p.hijos.length; j++) if (p.hijos[j].nombre === nm) h = p.hijos[j];
          var hoja = k === nombres.length - 1;
          if (h && hoja) { mal('«' + nombres.join(RUTA) + '» aparece en dos filas' + (h.hijos.length ? ' y también tiene elementos debajo' : '') + '.'); return; }
          if (h && h.fila != null) { mal('«' + nombres.slice(0, k + 1).join(RUTA) + '» tiene su propia fila y también elementos debajo: pon el valor solo en las filas más concretas.'); return; }
          if (!h) { h = { nombre: nm, hijos: [] }; p.hijos.push(h); }
          if (hoja) { h.fila = i; if (conValor) h.valorDado = valor; }
          p = h;
        });
      });
    } else {
      mal('faltan los datos: «datos.arbol» (el árbol { nombre, ' + (conValor ? 'valor, ' : '') + 'hijos }) o «datos.filas» (una fila por elemento final con el nombre de cada nivel' + (conValor ? ' y el valor' : '') + ').');
      return null;
    }
    if (!ok || !raiz) return null;
    /* Nombres repetidos entre hermanos, niveles, rutas y suma de valores */
    var nodos = [], hojas = [], prof = 0;
    (function recorrer(n, padre, nivel) {
      Object.defineProperty(n, 'padre', { value: padre, writable: true, configurable: true, enumerable: false }); n.nivel = nivel;
      n.ruta = padre && padre !== raiz ? padre.ruta + RUTA + n.nombre : (padre ? n.nombre : '');
      if (padre) nodos.push(n);
      prof = Math.max(prof, nivel);
      var vistos = {};
      n.hijos.forEach(function (h) {
        if (vistos[h.nombre]) mal('«' + (n.ruta ? n.ruta + RUTA : '') + h.nombre + '» está repetido dentro del mismo grupo.');
        vistos[h.nombre] = true;
        recorrer(h, n, nivel + 1);
      });
      if (!n.hijos.length && padre) hojas.push(n);
      if (conValor) {
        if (n.hijos.length) {
          var sm = suma(n.hijos.map(function (h) { return h.valor; }));
          if (n.valorDado != null && !cuadra(n.valorDado, sm, Math.max(Math.abs(n.valorDado), Math.abs(sm)))) mal('«' + (n.ruta || n.nombre) + '» vale ' + numero(n.valorDado) + ' y sus elementos suman ' + numero(sm) + ': pon los valores solo en los elementos finales y el kit sumará el resto.');
          n.valor = sm;
        } else {
          if (padre && n.valorDado == null) mal('«' + n.ruta + '» no tiene valor: cada elemento final necesita «valor».');
          else if (n.valorDado < 0) mal('«' + n.ruta + '» tiene un valor negativo: los valores son partes del total.');
          n.valor = n.valorDado || 0;
        }
      }
    })(raiz, null, 0);
    if (!ok) return null;
    if (!nodos.length) { mal('el árbol no tiene elementos debajo de «' + raiz.nombre + '».'); return null; }
    if (conValor && !(raiz.valor > 0)) { mal('los valores suman cero: no hay total que repartir.'); return null; }
    if (d.niveles != null && d.niveles.length < prof) aviso2('«datos.niveles» tiene ' + d.niveles.length + ' nombres y el árbol tiene ' + prof + ' niveles.');
    function aviso2(m) { s._avisos = (s._avisos || []).concat(m); }
    /* Orden: de mayor a menor en cada grupo, con «Otros» al final (orden:"natural" mantiene el de los datos) */
    if (conValor && s.orden !== 'natural') (function ordenar(n) {
      n.hijos.sort(function (a, b) { return (esOtros(a.nombre) - esOtros(b.nombre)) || (b.valor - a.valor); });
      n.hijos.forEach(ordenar);
    })(raiz);
    return { raiz: raiz, nodos: nodos, hojas: hojas, prof: prof };
  }
  /* Busca un nodo por su ruta («Norte / Centro 1») o por su nombre, si no se repite */
  function buscarNodo(arbol, nombre) {
    var porRuta = arbol.nodos.filter(function (n) { return n.ruta === nombre; });
    if (porRuta.length) return { nodo: porRuta[0] };
    var porNombre = arbol.nodos.filter(function (n) { return n.nombre === nombre; });
    if (porNombre.length === 1) return { nodo: porNombre[0] };
    if (porNombre.length > 1) return { repetido: porNombre.map(function (n) { return '«' + n.ruta + '»'; }) };
    return {};
  }
  /* Agrupa los hijos que pasan de max en «Otros» (solo con valores) */
  function agruparHijos(n, max, aviso) {
    if (n.hijos.length <= max) return;
    var quedan = n.hijos.slice(0, max - 1), resto = n.hijos.slice(max - 1);
    var otros = { nombre: 'Otros', hijos: [], nivel: n.nivel + 1, valor: suma(resto.map(function (h) { return h.valor; })), agrupa: resto.length };
    otros.ruta = n.ruta ? n.ruta + RUTA + 'Otros' : 'Otros';
    Object.defineProperty(otros, 'padre', { value: n, writable: true, configurable: true, enumerable: false });
    aviso('«' + (n.ruta || n.nombre) + '» tiene ' + n.hijos.length + ' elementos y el máximo es ' + max + ': los ' + resto.length + ' más pequeños se agrupan en «Otros».');
    n.hijos = quedan.concat(otros);
  }
  function rehacerListas(a) {
    a.nodos = []; a.hojas = [];
    (function r(n) { n.hijos.forEach(function (h) { a.nodos.push(h); if (!h.hijos.length) a.hojas.push(h); r(h); }); })(a.raiz);
  }

  function validarJerarquia(s, err, aviso) {
    var t = s.tipo, v = s.variante, d = s.datos;
    if (t === 'arbol' && v === 'dendrograma') return validarDendrograma(s, err, aviso);
    var conValor = t === 'treemap' || t === 'particion' || t === 'circulos-anidados' || t === 'tabla';
    var a = leerArbol(s, conValor, err);
    (s._avisos || []).forEach(aviso); delete s._avisos;
    if (!a) return;
    var raiz = a.raiz, prof = a.prof;
    var primeros = raiz.hijos;
    function niveles(min, max, menos, mas) {
      if (prof < min) { err('tiene ' + prof + (prof === 1 ? ' nivel' : ' niveles') + ' y necesita al menos ' + min + '. ' + menos); return false; }
      if (prof > max) { err('tiene ' + prof + ' niveles y el máximo es ' + max + '. ' + mas); return false; }
      return true;
    }
    function grupos(min, max, consejo) {
      if (primeros.length < min || primeros.length > max) { err('hay ' + primeros.length + (primeros.length === 1 ? ' grupo' : ' grupos') + ' en el primer nivel y deben ser de ' + min + ' a ' + max + '. ' + consejo); return false; }
      return true;
    }
    function destacarGrupo() {
      if (s.destacar == null) { d._foco = primeros[0]; return; }
      var f = primeros.filter(function (g) { return g.nombre === s.destacar; })[0];
      if (!f) { err('«destacar» debe coincidir con un grupo del primer nivel: ' + primeros.map(function (g) { return '«' + g.nombre + '»'; }).join(', ') + '.'); return; }
      d._foco = f;
    }
    function destacarNodo(soloHojas) {
      if (s.destacar == null) return;
      if (!esTexto(s.destacar)) { err('«destacar» debe ser el nombre de un elemento (o su ruta, como "Área B / Equipo 3").'); return; }
      var r = buscarNodo(a, s.destacar);
      if (r.repetido) { err('«' + s.destacar + '» se repite en varias ramas: escribe su ruta, por ejemplo ' + r.repetido.slice(0, 2).join(' o ') + '.'); return; }
      if (!r.nodo) { err('«destacar» no coincide con ningún elemento. Escribe el nombre exacto o la ruta, como "' + a.nodos[a.nodos.length - 1].ruta + '".'); return; }
      if (soloHojas && r.nodo.hijos.length) { err('«destacar» debe ser un elemento final (sin elementos debajo).'); return; }
      d._foco = r.nodo;
    }
    var ok = true;
    if (t === 'treemap') {
      ok = niveles(2, 2, 'Con un solo nivel usa treemap · plano con «categorias» y «valores».', 'Para más niveles usa particion · icicle o sunburst.') &&
        grupos(2, 6, primeros.length < 2 ? 'Con un solo grupo usa treemap · plano.' : 'Agrupa los menores en «Otros».');
      if (ok) { primeros.forEach(function (g) { agruparHijos(g, 7, aviso); }); rehacerListas(a); destacarGrupo(); }
    } else if (t === 'particion') {
      ok = niveles(2, 3, 'Con un solo nivel usa sectores · donut.', v === 'sunburst' ? 'El sunburst admite 3 anillos; usa la variante icicle o resume los niveles.' : 'Resume los niveles inferiores.') &&
        grupos(2, 6, primeros.length < 2 ? 'Con un solo grupo, empieza el árbol un nivel más abajo.' : 'Agrupa los menores en «Otros».');
      if (ok) {
        (function r(n) { n.hijos.forEach(function (h) { agruparHijos(h, 8, aviso); r(h); }); })(raiz);
        rehacerListas(a);
        if (a.hojas.length > 40) { err('hay ' + a.hojas.length + ' elementos finales y el máximo es 40. Resume el último nivel.'); ok = false; }
        else destacarGrupo();
      }
    } else if (t === 'circulos-anidados') {
      ok = niveles(2, 2, 'Con un solo nivel usa treemap · plano o barras.', 'Para más niveles usa particion · icicle.') &&
        grupos(2, 6, primeros.length < 2 ? 'Con un solo grupo usa treemap · plano o barras.' : 'Agrupa los menores en «Otros».');
      if (ok) {
        if (a.hojas.length > 40) { err('hay ' + a.hojas.length + ' elementos y el máximo es 40.'); ok = false; }
        else if (a.hojas.some(function (h) { return !(h.valor > 0); })) { err('todos los elementos deben tener un valor mayor que cero: el área del círculo es su valor.'); ok = false; }
        else destacarGrupo();
      }
    } else if (t === 'arbol') {
      if (raiz.virtual && primeros.length > 1 && v === 'organigrama') aviso('el organigrama no tiene un origen único: se dibuja «Total» arriba. Indica «datos.raiz» o un «datos.arbol» con un solo elemento arriba.');
      if (v === 'ramas') {
        ok = niveles(1, 4, '', 'Resume los niveles inferiores o usa tabla · jerarquica.');
        if (ok && a.hojas.length > 16) { err('hay ' + a.hojas.length + ' elementos finales y el máximo es 16. Resume el último nivel o usa tabla · jerarquica.'); ok = false; }
      } else {
        ok = niveles(1, 4, '', 'Resume los niveles inferiores.');
        if (ok && a.nodos.length > 40) { err('hay ' + (a.nodos.length + 1) + ' cajas y el máximo es 40. Resume los niveles inferiores.'); ok = false; }
      }
      if (ok) destacarNodo(false);
    } else if (t === 'anidados') {
      var dibujaRaiz = !raiz.virtual;
      var hondo = dibujaRaiz ? prof : prof - 1;
      if (prof < 1 || (!dibujaRaiz && prof < 2)) { err('necesita al menos una categoría con elementos dentro.'); ok = false; }
      else if (hondo > 2) { err('tiene ' + hondo + ' niveles de contenedores y el máximo es 2 (categoría y subcategoría) más los elementos. Resume un nivel o usa tabla · jerarquica.'); ok = false; }
      else if (a.hojas.length > 48) { err('hay ' + a.hojas.length + ' elementos y el máximo es 48.'); ok = false; }
      else if (!dibujaRaiz && primeros.some(function (g) { return !g.hijos.length; })) { err('en el primer nivel van las categorías: ' + primeros.filter(function (g) { return !g.hijos.length; }).map(function (g) { return '«' + g.nombre + '»'; }).join(', ') + ' no tiene elementos dentro.'); ok = false; }
      d._dibujaRaiz = dibujaRaiz;
      if (ok) destacarNodo(true);
    } else if (t === 'tabla') {
      ok = niveles(1, 4, '', 'Resume los niveles inferiores.');
      if (ok && a.nodos.length + 1 > 30) { err('hay ' + (a.nodos.length + 1) + ' filas y el máximo es 30. Resume el último nivel o divide la tabla.'); ok = false; }
      if (s.destacar != null) aviso('la tabla jerárquica no destaca filas: los totales van en gris y los elementos finales en naranja; se ignora «destacar».');
      if (s.unidad === '%') aviso('los porcentajes no se suman: comprueba que los totales tienen sentido, o pasa los recuentos y deja que el kit sume.');
      if (s.columna != null && !esTexto(s.columna)) err('«columna» debe ser un texto (el título de la columna de valores).');
    }
    if (!ok) return;
    d._arbol = a;
  }

  /* Dendrograma: agrupación jerárquica (enlace medio, distancia euclídea sobre variables tipificadas) o árbol con «altura» */
  function validarDendrograma(s, err, aviso) {
    var d = s.datos, a, calculado = false;
    if (d.elementos != null || d.valores != null) {
      if (!Array.isArray(d.elementos) || !d.elementos.every(function (x) { return esTexto(x) || esNum(x); })) { err('«datos.elementos» debe ser la lista de nombres de los elementos que se agrupan.'); return; }
      var n = d.elementos.length;
      if (n < 3 || n > 30) { err('hay ' + n + ' elementos y deben ser de 3 a 30.'); return; }
      var nombres = d.elementos.map(String);
      if (nombres.some(function (x, i) { return nombres.indexOf(x) !== i; })) { err('hay nombres repetidos en «datos.elementos».'); return; }
      if (!Array.isArray(d.valores) || d.valores.length !== n) { err('«datos.valores» debe tener una fila por elemento (' + n + '): la lista de sus medidas, por ejemplo [72, 0.4, 18].'); return; }
      var filas = d.valores.map(function (f) { return esNum(f) ? [f] : f; });
      var m = Array.isArray(filas[0]) ? filas[0].length : 0;
      for (var i = 0; i < n; i++) if (!listaNum(filas[i]) || filas[i].length !== m) { err('la fila ' + (i + 1) + ' de «datos.valores» («' + nombres[i] + '») debe tener ' + (m || 'los mismos') + ' números, uno por variable.'); return; }
      if (d.variables != null && (!listaTexto(d.variables) || d.variables.length !== m)) { err('«datos.variables» debe tener ' + m + ' nombres, uno por columna de «datos.valores».'); return; }
      /* Tipificación: cada variable en desviaciones típicas (si hay más de una); una variable constante no separa nada y se descarta */
      var cols = [];
      for (var j = 0; j < m; j++) {
        var col = filas.map(function (f) { return f[j]; }), med = suma(col) / n;
        var dt = Math.sqrt(suma(col.map(function (x) { return (x - med) * (x - med); })) / (n - 1));
        if (dt > 0) cols.push(col.map(function (x) { return m > 1 && s.tipificar !== false ? (x - med) / dt : x; }));
      }
      if (!cols.length) { err('todos los elementos tienen los mismos valores: no hay nada que agrupar.'); return; }
      var dist = [];
      for (i = 0; i < n; i++) { dist.push([]); for (j = 0; j < n; j++) dist[i].push(Math.sqrt(suma(cols.map(function (c) { return (c[i] - c[j]) * (c[i] - c[j]); })))); }
      /* Enlace medio (UPGMA) */
      var grupos = nombres.map(function (nm, k) { return { nodo: { nombre: nm, hijos: [], altura: 0 }, miembros: [k] }; });
      while (grupos.length > 1) {
        var mejor = null;
        for (var p = 0; p < grupos.length; p++) for (var q = p + 1; q < grupos.length; q++) {
          var tot = 0;
          grupos[p].miembros.forEach(function (x) { grupos[q].miembros.forEach(function (y) { tot += dist[x][y]; }); });
          var dm = tot / (grupos[p].miembros.length * grupos[q].miembros.length);
          if (!mejor || dm < mejor.d - 1e-12) mejor = { p: p, q: q, d: dm };
        }
        var gp = grupos[mejor.p], gq = grupos[mejor.q];
        var unido = { nodo: { nombre: '', hijos: [gp.nodo, gq.nodo], altura: mejor.d }, miembros: gp.miembros.concat(gq.miembros) };
        grupos.splice(mejor.q, 1); grupos.splice(mejor.p, 1, unido);
      }
      var raizC = grupos[0].nodo, hMax = raizC.altura || 1;
      (function norm(x) { x.altura = x.altura / hMax * 100; x.hijos.forEach(norm); })(raizC);
      a = { raiz: raizC }; calculado = true;
      d._m = m;
    } else {
      var leido = leerArbol(s, false, err);
      (s._avisos || []).forEach(aviso); delete s._avisos;
      if (!leido) return;
      a = leido;
      if (leido.hojas.length < 3 || leido.hojas.length > 30) { err('hay ' + leido.hojas.length + ' elementos finales y deben ser de 3 a 30.'); return; }
      var falta = leido.nodos.concat([leido.raiz]).filter(function (x) { return x.hijos.length && x.altura == null; });
      if (falta.length) { err('en el dendrograma cada grupo necesita «altura» (la distancia a la que se unen sus elementos); le falta a ' + (falta[0].ruta ? '«' + falta[0].ruta + '»' : 'la raíz') + '. O pasa «elementos» y «valores» y el kit hace la agrupación.'); return; }
      var malo = null;
      (function comp(x) { if (!x.hijos.length) x.altura = 0; x.hijos.forEach(function (h) { comp(h); if (h.altura > x.altura) malo = x; }); })(leido.raiz);
      if (malo) { err('la altura de ' + (malo.ruta ? '«' + malo.ruta + '»' : 'la raíz') + ' es menor que la de alguno de sus grupos: cada unión va por encima de las que contiene.'); return; }
      if (!(leido.raiz.altura > 0)) { err('la raíz necesita una «altura» mayor que cero.'); return; }
    }
    /* Hojas en orden de dibujo y alturas de unión */
    var hojas = [], alturas = [];
    (function rec(x) { if (!x.hijos.length) { hojas.push(x); return; } alturas.push(x.altura); x.hijos.forEach(rec); })(a.raiz);
    var distintas = alturas.slice().sort(function (p1, p2) { return p2 - p1; }).filter(function (h, i, arr) { return i === 0 || h < arr[i - 1] - 1e-9; });
    function contar(c) { var k = 0; (function rec(x) { if (x.altura < c || !x.hijos.length) { k++; return; } x.hijos.forEach(rec); })(a.raiz); return k; }
    /* Cortes posibles: a media altura entre dos uniones consecutivas */
    var cortes = [];
    for (var k2 = 0; k2 < distintas.length; k2++) {
      var bajo = k2 + 1 < distintas.length ? distintas[k2 + 1] : 0, c = (distintas[k2] + bajo) / 2;
      cortes.push({ corte: c, grupos: contar(c), salto: distintas[k2] - bajo });
    }
    var elegido = null, maxG = Math.min(6, hojas.length - 1);
    if (s.corte != null && s.grupos != null) { err('usa «grupos» (cuántos grupos) o «corte» (la altura), no los dos.'); return; }
    if (s.grupos != null) {
      if (!Number.isInteger(s.grupos) || s.grupos < 2 || s.grupos > maxG) { err('«grupos» debe ser un número entero de 2 a ' + maxG + '.'); return; }
      elegido = cortes.filter(function (x) { return x.grupos === s.grupos; })[0];
      if (!elegido) { err('el árbol no se puede cortar en ' + s.grupos + ' grupos exactos (hay uniones de más de dos elementos a la misma altura). Prueba con ' + cortes.filter(function (x) { return x.grupos >= 2 && x.grupos <= maxG; }).map(function (x) { return x.grupos; }).join(', ') + '.'); return; }
    } else if (s.corte != null) {
      if (!esNum(s.corte) || s.corte <= 0 || s.corte >= a.raiz.altura) { err('«corte» debe ser una altura entre 0 y ' + numero(a.raiz.altura, calculado ? 0 : null) + ' (la de la raíz).'); return; }
      var g = contar(s.corte);
      if (g > maxG) { err('con ese «corte» salen ' + g + ' grupos y el máximo es ' + maxG + ': súbelo.'); return; }
      elegido = { corte: s.corte, grupos: g };
    } else {
      /* Por defecto, el corte que deja el mayor salto entre uniones (de 2 a 6 grupos) */
      cortes.filter(function (x) { return x.grupos >= 2 && x.grupos <= maxG; }).forEach(function (x) { if (!elegido || x.salto > elegido.salto + 1e-9) elegido = x; });
      if (!elegido) { err('no hay ningún corte que deje de 2 a ' + maxG + ' grupos.'); return; }
    }
    if (s.destacar != null) aviso('el dendrograma colorea los grupos que salen del corte; se ignora «destacar».');
    d._raizD = a.raiz; d._hojasD = hojas; d._corte = elegido.corte; d._grupos = elegido.grupos; d._calculado = calculado;
  }

  /* ---- Flujo y relaciones: sankey, cuerdas, flujo y red ---- */
  var FLUJO = ['sankey', 'cuerdas', 'flujo', 'red'];
  var FLECHA = ' \u2192 ';
  function nombreDe(x) { return esNum(x) ? String(x) : (esTexto(x) ? x.trim() : null); }
  /* Lee «datos.enlaces» ({ origen, destino, valor, relacion }) y «datos.nodos» (opcional: nombres o { nombre, grupo, duracion }).
     Devuelve { nodos, enlaces } solo con índices (serializable): nodo { nombre, i, grupo, duracion, entra, sale }, enlace { i, o, d, valor, relacion }.
     o: { valor: 'obligatorio' | 'opcional', dirigido, max, maxNodos, relacion, consejo } */
  function leerEnlaces(s, err, aviso, o) {
    var d = s.datos, ok = true, nodos = [], enlaces = [], porNombre = {};
    function mal(m) { if (ok) err(m); ok = false; }
    function crear(nm) { var n = { nombre: nm, i: nodos.length, entra: [], sale: [] }; nodos.push(n); porNombre[nm] = n; return n; }
    if (!Array.isArray(d.enlaces) || !d.enlaces.length) { err('falta «datos.enlaces»: una lista de { origen, destino' + (o.valor === 'obligatorio' ? ', valor' : '') + ' }.'); return null; }
    if (d.enlaces.length > o.max) { err('hay ' + d.enlaces.length + ' enlaces y el máximo es ' + o.max + '. ' + (o.consejo || 'Agrupa los menores o divide el gráfico.')); return null; }
    var fijos = d.nodos != null;
    if (fijos) {
      if (!Array.isArray(d.nodos) || !d.nodos.length) { err('«datos.nodos» debe ser una lista de nombres o de { nombre, grupo }.'); return null; }
      d.nodos.forEach(function (x, i) {
        var obj = x && typeof x === 'object' && !Array.isArray(x), nm = nombreDe(obj ? x.nombre : x);
        if (!nm) { mal('el nodo ' + (i + 1) + ' de «datos.nodos» debe ser un nombre o un objeto { nombre }.'); return; }
        if (porNombre[nm]) { mal('«' + nm + '» se repite en «datos.nodos».'); return; }
        var n = crear(nm);
        if (!obj) return;
        if (x.grupo != null) { if (nombreDe(x.grupo)) n.grupo = nombreDe(x.grupo); else mal('el «grupo» de «' + nm + '» debe ser un texto.'); }
        if (x.duracion != null) { if (esNum(x.duracion) && x.duracion >= 0) n.duracion = x.duracion; else mal('la «duracion» de «' + nm + '» debe ser un número mayor o igual que cero.'); }
      });
      if (!ok) return null;
    }
    var vistos = {};
    d.enlaces.forEach(function (e, i) {
      if (!ok) return;
      if (!e || typeof e !== 'object' || Array.isArray(e)) { mal('el enlace ' + (i + 1) + ' debe ser un objeto { origen, destino' + (o.valor === 'obligatorio' ? ', valor' : '') + ' }.'); return; }
      var a = nombreDe(e.origen), b = nombreDe(e.destino);
      if (!a || !b) { mal('al enlace ' + (i + 1) + ' le falta «origen» o «destino».'); return; }
      if (a === b) { mal('el enlace ' + (i + 1) + ' va de «' + a + '» a sí mismo: quítalo.'); return; }
      [a, b].forEach(function (nm) {
        if (porNombre[nm]) return;
        if (fijos) mal('«' + nm + '» (enlace ' + (i + 1) + ') no está en «datos.nodos». Revisa el nombre o añádelo a la lista.');
        else crear(nm);
      });
      if (!ok) return;
      var clave = o.dirigido ? a + '\u0000' + b : [a, b].sort().join('\u0000');
      if (vistos[clave]) { mal('el enlace «' + a + (o.dirigido ? FLECHA : ' \u2013 ') + b + '» se repite' + (o.dirigido ? '' : ' (en este tipo no importa el sentido)') + (o.valor === 'obligatorio' ? ': suma sus valores en uno solo.' : ': déjalo una sola vez.')); return; }
      vistos[clave] = 1;
      var v = null;
      if (o.valor === 'obligatorio') {
        if (!esNum(e.valor) || e.valor <= 0) { mal('el enlace «' + a + FLECHA + b + '» necesita un «valor» mayor que cero.'); return; }
        v = e.valor;
      } else if (e.valor != null) {
        if (!esNum(e.valor) || e.valor < 0) { mal('el «valor» del enlace «' + a + FLECHA + b + '» debe ser un número mayor o igual que cero.'); return; }
        v = e.valor;
      }
      var rel = null;
      if (e.relacion != null) {
        if (!o.relacion) aviso('solo red · radial rotula las relaciones: se ignora «relacion».');
        else if (!esTexto(e.relacion)) { mal('la «relacion» del enlace «' + a + FLECHA + b + '» debe ser un texto.'); return; }
        else rel = e.relacion.trim();
      }
      var en = { i: enlaces.length, o: porNombre[a].i, d: porNombre[b].i, valor: v, relacion: rel };
      enlaces.push(en); nodos[en.o].sale.push(en.i); nodos[en.d].entra.push(en.i);
    });
    if (!ok) return null;
    if (nodos.length > o.maxNodos) { err('hay ' + nodos.length + ' ' + (o.nombreNodos || 'nodos') + ' y el máximo es ' + o.maxNodos + '. ' + (o.consejo || 'Agrupa los menores o divide el gráfico.')); return null; }
    return { nodos: nodos, enlaces: enlaces };
  }
  function grado(n) { return n.entra.length + n.sale.length; }
  function sumaEnlaces(g, lista) { return lista.reduce(function (t, k) { return t + (g.enlaces[k].valor || 0); }, 0); }
  /* Orden topológico (Kahn). Si hay un ciclo, devuelve { ciclo: [nombres] } con un ciclo encontrado. */
  function ordenTopologico(g) {
    var faltan = g.nodos.map(function (n) { return n.entra.length; }), cola = [], orden = [];
    g.nodos.forEach(function (n) { if (!faltan[n.i]) cola.push(n.i); });
    while (cola.length) {
      var k = cola.shift(); orden.push(k);
      g.nodos[k].sale.forEach(function (e) { var d = g.enlaces[e].d; if (!--faltan[d]) cola.push(d); });
    }
    if (orden.length === g.nodos.length) return { orden: orden };
    /* Busca un ciclo entre los nodos que quedan: se avanza por enlaces dentro del resto hasta repetir un nodo */
    var resto = {}; g.nodos.forEach(function (n) { if (faltan[n.i] > 0) resto[n.i] = 1; });
    var x = +Object.keys(resto)[0], camino = [], visto = {};
    while (visto[x] == null) {
      visto[x] = camino.length; camino.push(x);
      x = g.nodos[x].sale.map(function (e) { return g.enlaces[e].d; }).filter(function (d) { return resto[d]; })[0];
    }
    return { ciclo: camino.slice(visto[x]).concat([x]).map(function (k) { return g.nodos[k].nombre; }) };
  }
  /* Nivel de cada nodo: el camino más largo desde un origen. justificar: los destinos finales van a la última columna (desde la 0.9.2 no lo usa ningún tipo) */
  function nivelesDe(g, orden, justificar) {
    var niv = g.nodos.map(function () { return 0; });
    orden.forEach(function (k) { g.nodos[k].sale.forEach(function (e) { var d = g.enlaces[e].d; niv[d] = Math.max(niv[d], niv[k] + 1); }); });
    var max = Math.max.apply(null, niv);
    if (justificar) g.nodos.forEach(function (n) { if (!n.sale.length) niv[n.i] = max; });
    return niv;
  }
  function textoCiclo(c) { return '«' + c.join(FLECHA) + '»'; }
  function sinAcentos(t) { return String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
  function buscarEnlace(g, a, b) { return g.enlaces.filter(function (e) { return e.o === a && e.d === b; })[0]; }
  /* «destacar» como camino: false, el nombre de un nodo (el camino sigue los enlaces mayores hacia atrás y hacia delante) o
     una lista de nodos unidos por enlaces. Por defecto, desde el mayor origen, por el enlace mayor en cada paso. */
  function caminoDestacado(s, g, err, porDefecto, campo) {
    campo = campo || 'destacar';
    var valorNodo = function (n) { return Math.max(sumaEnlaces(g, n.entra), sumaEnlaces(g, n.sale)); };
    function mayor(lista, extremo) { return lista.slice().sort(function (a, b) { return g.enlaces[b].valor - g.enlaces[a].valor || a - b; })[0]; }
    function hacia(k, adelante) {
      var r = [], vis = {}; vis[k] = 1;
      for (;;) {
        var n = g.nodos[k], lista = adelante ? n.sale : n.entra;
        if (!lista.length) break;
        var e = g.enlaces[mayor(lista)], sig = adelante ? e.d : e.o;
        if (vis[sig]) break; vis[sig] = 1; r.push({ e: e.i, n: sig }); k = sig;
      }
      return r;
    }
    function desde(k) {
      var atras = hacia(k, false).reverse(), adel = hacia(k, true);
      return { nodos: atras.map(function (x) { return x.n; }).concat([k], adel.map(function (x) { return x.n; })), enlaces: atras.map(function (x) { return x.e; }).concat(adel.map(function (x) { return x.e; })) };
    }
    var nombres = g.nodos.map(function (n) { return n.nombre; }), por = {}; g.nodos.forEach(function (n) { por[n.nombre] = n.i; });
    var x = s[campo];
    if (x === false) return { nodos: [], enlaces: [] };
    if (x == null) {
      if (!porDefecto) return { nodos: [], enlaces: [] };
      var origenes = g.nodos.filter(function (n) { return !n.entra.length; }).sort(function (a, b) { return valorNodo(b) - valorNodo(a) || a.i - b.i; });
      return desde(origenes[0].i);
    }
    if (esTexto(x) || esNum(x)) {
      var nm = nombreDe(x);
      if (por[nm] == null) { err('«' + campo + '» no coincide con ningún nodo. Usa uno de: ' + nombres.slice(0, 8).map(function (t) { return '«' + t + '»'; }).join(', ') + (nombres.length > 8 ? '…' : '') + '.'); return null; }
      return desde(por[nm]);
    }
    if (Array.isArray(x) && x.length >= 2) {
      var ks = [], es = [];
      for (var i = 0; i < x.length; i++) {
        var nn = nombreDe(x[i]);
        if (por[nn] == null) { err('«' + x[i] + '» (en «' + campo + '») no es ningún nodo.'); return null; }
        ks.push(por[nn]);
        if (i > 0) {
          var en = buscarEnlace(g, ks[i - 1], ks[i]);
          if (!en) { err('el camino de «' + campo + '» se corta: no hay enlace «' + g.nodos[ks[i - 1]].nombre + FLECHA + nn + '».'); return null; }
          es.push(en.i);
        }
      }
      return { nodos: ks, enlaces: es };
    }
    err('«destacar» debe ser el nombre de un nodo, una lista de nodos unidos por enlaces (el camino) o false.');
    return null;
  }

  function validarFlujo(s, err, aviso) {
    var t = s.tipo, v = s.variante;
    if (t === 'sankey' && v === 'aluvial') return validarAluvial(s, err, aviso);
    if (t === 'sankey' && v === 'recorrido') return validarRecorridoFlujo(s, err, aviso);
    if (t === 'sankey') return validarSankey(s, err, aviso);
    if (t === 'cuerdas') return validarCuerdas(s, err, aviso);
    if (t === 'flujo') return validarFlechas(s, err, aviso);
    if (t === 'red') return validarRed(s, err, aviso);
  }

  function validarSankey(s, err, aviso) {
    var d = s.datos;
    var g = leerEnlaces(s, err, aviso, { valor: 'obligatorio', dirigido: true, max: 40, maxNodos: 24, consejo: 'Agrupa los menores en «Otros» o divide el sankey.' });
    if (!g) return;
    var aislados = g.nodos.filter(function (n) { return !grado(n); });
    if (aislados.length) { err('«' + aislados[0].nombre + '» está en «datos.nodos» pero no tiene enlaces.'); return; }
    var top = ordenTopologico(g);
    if (top.ciclo) { err('el sankey no admite ciclos y hay uno: ' + textoCiclo(top.ciclo) + '. Si el flujo vuelve atrás, usa red · comunidades o red · dependencias.'); return; }
    /* Sin justificar: cada nodo final se queda en la columna siguiente a su origen (0.9.2) */
    var niv = nivelesDe(g, top.orden, false), ncol = Math.max.apply(null, niv) + 1;
    if (ncol > 4) { err('tiene ' + ncol + ' niveles y el máximo es 4. Agrupa etapas intermedias o divide el sankey.'); return; }
    var porCol = []; niv.forEach(function (c) { porCol[c] = (porCol[c] || 0) + 1; });
    var lleno = porCol.map(function (n, c) { return { n: n, c: c }; }).filter(function (x) { return x.n > 8; })[0];
    if (lleno) { err('el nivel ' + (lleno.c + 1) + ' tiene ' + lleno.n + ' nodos y el máximo es 8. Agrupa los menores en «Otros».'); return; }
    g.nodos.forEach(function (n) {
      if (!n.entra.length || !n.sale.length) return;
      var e = sumaEnlaces(g, n.entra), sa = sumaEnlaces(g, n.sale);
      if (!cuadra(e, sa, Math.max(e, sa))) aviso('a «' + n.nombre + '» llegan ' + fmtNum(e) + ' y salen ' + fmtNum(sa) + ': el nodo se dibuja con el mayor. Revisa si falta un enlace.');
    });
    var cam = caminoDestacado(s, g, err, true);
    if (!cam) return;
    /* Un sankey en el que ningún nodo junta flujos de varios orígenes es un árbol:
       se lee mejor como desglose (partición · icicle) que como flujo. */
    var esArbol = g.nodos.every(function (n) { return n.entra.length <= 1; });
    if (esArbol && ncol >= 3) aviso('ningún nodo recibe flujo de más de un origen: los datos son un total desglosado en niveles, no un flujo. ' +
      'Usa particion · icicle (o tabla · jerarquica) con datos.filas; el sankey es para recorridos que se reparten y se juntan.');
    g.nivel = niv; g.columnas = ncol; g.camino = cam;
    d._g = g;
  }
  function fmtNum(v) { return formatear(v, {}).texto; }

  /* Aluvial: momentos, categorías y una matriz de cambios por cada par de momentos consecutivos (fila = de, columna = a) */
  function validarAluvial(s, err, aviso) {
    var d = s.datos, M = d.momentos, C = d.categorias, X = d.cambios;
    if (!Array.isArray(M) || M.length < 2 || !M.every(function (x) { return nombreDe(x); })) { err('«datos.momentos» debe ser una lista de al menos 2 momentos (por ejemplo [2024, 2025, 2026]).'); return; }
    if (M.length > 6) { err('hay ' + M.length + ' momentos y el máximo es 6.'); return; }
    if (!listaTexto(C)) { err('«datos.categorias» debe ser una lista de textos.'); return; }
    if (C.length < 2 || C.length > 3) { err('hay ' + C.length + (C.length === 1 ? ' categoría' : ' categorías') + ' y deben ser de 2 a 3 (las cintas toman el color de su categoría). ' + (C.length > 3 ? 'Agrupa las menores o usa sankey · sankey con un solo camino destacado.' : '')); return; }
    if (C.some(function (c, i) { return C.indexOf(c) !== i; })) { err('las categorías no pueden repetirse.'); return; }
    var k = C.length, n = M.length;
    if (!Array.isArray(X) || X.length !== n - 1) { err('«datos.cambios» debe tener ' + (n - 1) + (n - 1 === 1 ? ' matriz' : ' matrices') + ' (una por cada paso entre momentos), con una fila por categoría de origen y una columna por categoría de destino.'); return; }
    for (var p = 0; p < X.length; p++) {
      var m = X[p], paso = '«' + M[p] + FLECHA + M[p + 1] + '»';
      if (!Array.isArray(m) || m.length !== k || !m.every(function (f) { return Array.isArray(f) && f.length === k && f.every(function (x) { return esNum(x) && x >= 0; }); })) {
        err('la matriz de ' + paso + ' debe tener ' + k + ' filas de ' + k + ' números mayores o iguales que cero (fila = categoría en ' + M[p] + ', columna = categoría en ' + M[p + 1] + ').'); return;
      }
    }
    var tot = [];
    for (p = 0; p < n; p++) {
      tot[p] = C.map(function (c, j) {
        if (p < n - 1) return suma(X[p][j]);
        return suma(X[p - 1].map(function (f) { return f[j]; }));
      });
    }
    var total = suma(tot[0]);
    if (!(total > 0)) { err('los cambios suman cero: no hay nada que dibujar.'); return; }
    for (p = 1; p < n - 1; p++) {
      for (var j = 0; j < k; j++) {
        var llega = suma(X[p - 1].map(function (f) { return f[j]; })), sale = tot[p][j];
        if (!cuadra(llega, sale, total)) { err('en ' + M[p] + ' no cuadra «' + C[j] + '»: llegan ' + fmtNum(llega) + ' desde ' + M[p - 1] + ' pero salen ' + fmtNum(sale) + ' hacia ' + M[p + 1] + '. La fila de cada categoría debe sumar lo que le llega en la matriz anterior.'); return; }
      }
    }
    for (p = 1; p < n; p++) if (!cuadra(suma(tot[p]), total, total)) aviso('el total cambia entre ' + M[0] + ' (' + fmtNum(total) + ') y ' + M[p] + ' (' + fmtNum(suma(tot[p])) + '): el aluvial supone los mismos elementos en todos los momentos.');
    var foco = 0;
    if (s.destacar != null) { foco = C.indexOf(s.destacar); if (foco < 0) { err('«destacar» debe ser una de las categorías: ' + C.map(function (c) { return '«' + c + '»'; }).join(', ') + '.'); return; } }
    d._tot = tot; d._foco = foco; d._momentos = M.map(nombreDe);
  }

  /* Recorrido (Journey flow): etapas con los que llegan a cada una; lo que se pierde entre una y otra sale hacia abajo */
  function validarRecorridoFlujo(s, err, aviso) {
    var d = s.datos, E = d.etapas, V = d.valores;
    if (!Array.isArray(E) || !E.every(function (x) { return nombreDe(x); })) { err('«datos.etapas» debe ser una lista con el nombre de cada paso.'); return; }
    if (E.length < 3 || E.length > 7) { err('hay ' + E.length + ' etapas y deben ser de 3 a 7. ' + (E.length < 3 ? 'Con dos, usa un kpi con su conversión.' : 'Agrupa pasos o usa embudo · conversion.')); return; }
    var N = E.map(nombreDe);
    if (N.some(function (x, i) { return N.indexOf(x) !== i; })) { err('las etapas no pueden repetirse.'); return; }
    if (!listaNum(V) || V.length !== E.length) { err('«datos.valores» debe tener un número por etapa (' + E.length + '): cuántos llegan a cada paso.'); return; }
    if (V.some(function (x) { return x < 0; }) || !(V[0] > 0)) { err('los valores no pueden ser negativos y la primera etapa debe ser mayor que cero.'); return; }
    if (s.unidad === '%' && V.some(function (x) { return x > 100; })) { err('con «unidad»: "%" los valores van de 0 a 100.'); return; }
    for (var i = 1; i < V.length; i++) if (V[i] > V[i - 1]) { err('«' + N[i] + '» (' + fmtNum(V[i]) + ') supera a «' + N[i - 1] + '» (' + fmtNum(V[i - 1]) + '): en un recorrido nadie llega a un paso sin pasar por el anterior. Si entran por otros caminos, usa sankey · sankey.'); return; }
    if (d.salida != null && !esTexto(d.salida)) { err('«datos.salida» debe ser un texto (por defecto, «Abandono»).'); return; }
    d._nombres = N; d._pct = V.map(function (x) { return x / V[0] * 100; });
  }

  /* Cuerdas: intercambio entre pares de grupos (sin sentido); cada grupo suma sus enlaces */
  function validarCuerdas(s, err, aviso) {
    var d = s.datos;
    var g = leerEnlaces(s, err, aviso, { valor: 'obligatorio', dirigido: false, max: 28, maxNodos: 8, nombreNodos: 'grupos', consejo: 'Agrupa los grupos menores en «Otros».' });
    if (!g) return;
    if (g.nodos.length < 3) { err('hay ' + g.nodos.length + ' grupos y el mínimo es 3. Con dos, usa barras o un kpi.'); return; }
    var aislados = g.nodos.filter(function (n) { return !grado(n); });
    if (aislados.length) { err('«' + aislados[0].nombre + '» no tiene enlaces: quítalo de «datos.nodos».'); return; }
    g.nodos.forEach(function (n) { n.total = sumaEnlaces(g, n.entra.concat(n.sale)); });
    var foco;
    if (s.destacar == null) foco = g.nodos.slice().sort(function (a, b) { return b.total - a.total || a.i - b.i; })[0].i;
    else {
      var f = g.nodos.filter(function (n) { return n.nombre === nombreDe(s.destacar); })[0];
      if (!f) { err('«destacar» debe ser uno de los grupos: ' + g.nodos.map(function (n) { return '«' + n.nombre + '»'; }).join(', ') + '.'); return; }
      foco = f.i;
    }
    g.foco = foco; d._g = g;
  }

  /* Flujo (Flow diagram): entidades y flechas con grosor proporcional al volumen, de izquierda a derecha */
  function validarFlechas(s, err, aviso) {
    var d = s.datos;
    var g = leerEnlaces(s, err, aviso, { valor: 'obligatorio', dirigido: true, max: 16, maxNodos: 12, nombreNodos: 'entidades', consejo: 'Con más entidades usa sankey · sankey.' });
    if (!g) return;
    var aislados = g.nodos.filter(function (n) { return !grado(n); });
    if (aislados.length) { err('«' + aislados[0].nombre + '» no tiene enlaces: quítalo de «datos.nodos».'); return; }
    var top = ordenTopologico(g);
    if (top.ciclo) { err('las flechas van de izquierda a derecha y hay un ciclo: ' + textoCiclo(top.ciclo) + '. Usa red · comunidades.'); return; }
    var niv = nivelesDe(g, top.orden, false), ncol = Math.max.apply(null, niv) + 1;
    if (ncol > 5) { err('tiene ' + ncol + ' niveles y el máximo es 5. Usa sankey · sankey o resume el recorrido.'); return; }
    var porCol = []; niv.forEach(function (c) { porCol[c] = (porCol[c] || 0) + 1; });
    if (Math.max.apply(null, porCol) > 4) { err('un nivel tiene ' + Math.max.apply(null, porCol) + ' entidades y el máximo es 4. Usa sankey · sankey.'); return; }
    var foco = g.enlaces.slice().sort(function (a, b) { return b.valor - a.valor || a.i - b.i; })[0].i;
    if (s.destacar != null) {
      var x = s.destacar, a = x && nombreDe(x.origen), b = x && nombreDe(x.destino), por = {};
      g.nodos.forEach(function (n) { por[n.nombre] = n.i; });
      var en = a && b && por[a] != null && por[b] != null ? buscarEnlace(g, por[a], por[b]) : null;
      if (!en) { err('«destacar» debe ser un enlace de los datos: { origen, destino } (por defecto, el mayor).'); return; }
      foco = en.i;
    }
    g.nivel = niv; g.columnas = ncol; g.foco = foco; d._g = g;
  }

  var VARIANTES_RED = { comunidades: 1, bipartita: 1, radial: 1, dependencias: 1 };
  function validarRed(s, err, aviso) {
    var d = s.datos, v = s.variante, g;
    if (v === 'radial') {
      var centro = nombreDe(d.centro);
      if (!centro) { err('falta «datos.centro»: la entidad central (por ejemplo "Centro educativo").'); return; }
      g = leerEnlaces(s, err, aviso, { valor: 'opcional', dirigido: false, max: 8, maxNodos: 9, relacion: true, consejo: 'Con más de 8 relaciones, agrupa las menos importantes o usa red · comunidades.' });
      if (!g) return;
      var c = g.nodos.filter(function (n) { return n.nombre === centro; })[0];
      if (!c) { err('«' + centro + '» (el centro) no aparece en ningún enlace.'); return; }
      var suelto = g.enlaces.filter(function (e) { return e.o !== c.i && e.d !== c.i; })[0];
      if (suelto) { err('el enlace «' + g.nodos[suelto.o].nombre + FLECHA + g.nodos[suelto.d].nombre + '» no toca el centro: en red · radial todas las relaciones salen de «' + centro + '». Usa red · comunidades.'); return; }
      var aisl = g.nodos.filter(function (n) { return !grado(n); });
      if (aisl.length) { err('«' + aisl[0].nombre + '» no tiene enlace con el centro.'); return; }
      if (g.nodos.length - 1 < 2) { err('necesita al menos 2 entidades alrededor del centro.'); return; }
      g.centro = c.i; d._g = g; return;
    }
    if (v === 'bipartita') {
      g = leerEnlaces(s, err, aviso, { valor: 'opcional', dirigido: true, max: 60, maxNodos: 24 });
      if (!g) return;
      var ambos = g.nodos.filter(function (n) { return n.entra.length && n.sale.length; })[0];
      if (ambos) { err('«' + ambos.nombre + '» es origen y destino a la vez: en la bipartita cada nodo va en una columna. Usa red · dependencias o red · comunidades.'); return; }
      var izq = g.nodos.filter(function (n) { return n.sale.length; }), der = g.nodos.filter(function (n) { return n.entra.length; });
      var sueltos = g.nodos.filter(function (n) { return !grado(n); });
      if (sueltos.length) { err('«' + sueltos[0].nombre + '» no tiene enlaces: quítalo de «datos.nodos».'); return; }
      if (izq.length > 12 || der.length > 12) { err('una columna tiene ' + Math.max(izq.length, der.length) + ' nodos y el máximo es 12. Agrupa los menores.'); return; }
      if (s.columnas != null && !(listaTexto(s.columnas) && s.columnas.length === 2)) { err('«columnas» debe tener dos textos: el título de los orígenes y el de los destinos.'); return; }
      var foco;
      if (s.destacar == null) foco = der.slice().sort(function (a, b) { return b.entra.length - a.entra.length || a.i - b.i; })[0].i;
      else {
        var f = g.nodos.filter(function (n) { return n.nombre === nombreDe(s.destacar); })[0];
        if (!f) { err('«destacar» debe ser un nodo de cualquiera de las dos columnas.'); return; }
        foco = f.i;
      }
      g.izq = izq.map(function (n) { return n.i; }); g.der = der.map(function (n) { return n.i; }); g.foco = foco; d._g = g; return;
    }
    if (v === 'dependencias') {
      g = leerEnlaces(s, err, aviso, { valor: 'opcional', dirigido: true, max: 40, maxNodos: 20, nombreNodos: 'tareas', consejo: 'Con más tareas usa gantt o divide el gráfico.' });
      if (!g) return;
      var top = ordenTopologico(g);
      if (top.ciclo) { err('las dependencias no pueden formar un ciclo y hay uno: ' + textoCiclo(top.ciclo) + '. Revisa el sentido de los enlaces (origen = lo que va antes).'); return; }
      var niv = nivelesDe(g, top.orden, false), ncol = Math.max.apply(null, niv) + 1;
      if (ncol > 6) { err('tiene ' + ncol + ' niveles y el máximo es 6. Usa gantt para planes más largos.'); return; }
      var porCol = []; niv.forEach(function (x) { porCol[x] = (porCol[x] || 0) + 1; });
      if (Math.max.apply(null, porCol) > 5) { err('un nivel tiene ' + Math.max.apply(null, porCol) + ' tareas en paralelo y el máximo es 5. Agrupa tareas o usa gantt.'); return; }
      var conDur = g.nodos.some(function (n) { return n.duracion != null; });
      if (conDur && g.nodos.some(function (n) { return n.duracion == null; })) { err('si das «duracion» a una tarea, dásela a todas (en «datos.nodos»).'); return; }
      var ruta;
      if (s.ruta != null) {
        if (!Array.isArray(s.ruta) || s.ruta.length < 2) { err('«ruta» debe ser la lista de tareas de la ruta crítica, en orden (al menos 2).'); return; }
        ruta = caminoDestacado(s, g, err, false, 'ruta');
        if (!ruta) return;
      } else {
        /* Camino más largo: por duración si la hay y, si no, por número de tareas */
        var peso = function (k) { return conDur ? g.nodos[k].duracion : 1; };
        var mejor = [], previo = [];
        top.orden.forEach(function (k) {
          var n = g.nodos[k], b = -1, pr = null;
          n.entra.forEach(function (e) { var o = g.enlaces[e].o; if (mejor[o] > b) { b = mejor[o]; pr = e; } });
          mejor[k] = (b < 0 ? 0 : b) + peso(k); previo[k] = pr;
        });
        var fin = top.orden.reduce(function (a, k) { return mejor[k] > mejor[a] ? k : a; }, top.orden[0]);
        var ks = [fin], es = [];
        while (previo[ks[0]] != null) { es.unshift(previo[ks[0]]); ks.unshift(g.enlaces[previo[ks[0]]].o); }
        ruta = { nodos: ks, enlaces: es };
        g.duracionRuta = conDur ? mejor[fin] : null;
      }
      if (s.destacar != null) aviso('en red · dependencias se destaca la ruta crítica: usa «ruta» en vez de «destacar».');
      g.nivel = niv; g.columnas = ncol; g.camino = ruta; g.conDuracion = conDur; d._g = g; return;
    }
    /* comunidades */
    g = leerEnlaces(s, err, aviso, { valor: 'opcional', dirigido: false, max: 120, maxNodos: 40, consejo: 'Muestra solo los nodos principales.' });
    if (!g) return;
    var conGrupo = g.nodos.filter(function (n) { return n.grupo != null; }).length;
    if (conGrupo && conGrupo < g.nodos.length) { err('si das «grupo» a un nodo, dáselo a todos (en «datos.nodos»), o no lo des a ninguno y el kit calcula las comunidades.'); return; }
    var com = conGrupo ? gruposDados(g) : comunidades(g);
    if (com.length > 6) aviso('hay ' + com.length + ' comunidades y la paleta tiene 6 colores: las menores van en gris.');
    g.comunidades = com; g.calculadas = !conGrupo; d._g = g;
  }
  function gruposDados(g) {
    var orden = [], por = {};
    g.nodos.forEach(function (n) { if (!por[n.grupo]) { por[n.grupo] = { nombre: n.grupo, nodos: [] }; orden.push(por[n.grupo]); } por[n.grupo].nodos.push(n.i); n.com = orden.indexOf(por[n.grupo]); });
    return ordenarComunidades(g, orden);
  }
  /* Comunidades por modularidad (agregación voraz, como Clauset-Newman-Moore): se unen las dos comunidades que más suben la
     modularidad hasta que ninguna unión la mejora. Pesos: el «valor» del enlace o 1. */
  function comunidades(g) {
    var n = g.nodos.length, W = [], grados = [], m2 = 0, i, j;
    for (i = 0; i < n; i++) { W.push([]); for (j = 0; j < n; j++) W[i].push(0); grados.push(0); }
    g.enlaces.forEach(function (e) { var w = e.valor == null ? 1 : Math.max(e.valor, 1e-9); W[e.o][e.d] += w; W[e.d][e.o] += w; grados[e.o] += w; grados[e.d] += w; m2 += 2 * w; });
    var com = []; for (i = 0; i < n; i++) com.push({ nodos: [i], a: m2 ? grados[i] / m2 : 0 });
    var E = W.map(function (f) { return f.map(function (w) { return m2 ? w / m2 : 0; }); });
    for (;;) {
      var mejor = 1e-12, bi = -1, bj = -1;
      for (i = 0; i < com.length; i++) for (j = i + 1; j < com.length; j++) {
        if (!E[i][j]) continue;
        var dq = 2 * (E[i][j] - com[i].a * com[j].a);
        if (dq > mejor) { mejor = dq; bi = i; bj = j; }
      }
      if (bi < 0) break;
      com[bi].nodos = com[bi].nodos.concat(com[bj].nodos); com[bi].a += com[bj].a;
      for (var k = 0; k < com.length; k++) { E[bi][k] += E[bj][k]; E[k][bi] = E[bi][k]; }
      E[bi][bi] += E[bj][bj];
      E.splice(bj, 1); E.forEach(function (f) { f.splice(bj, 1); }); com.splice(bj, 1);
    }
    return ordenarComunidades(g, com.map(function (c) { return { nombre: null, nodos: c.nodos.sort(function (a, b) { return a - b; }) }; }));
  }
  /* Ordena las comunidades de mayor a menor y marca su nodo central (el de más conexiones) */
  function ordenarComunidades(g, lista) {
    lista.sort(function (a, b) { return b.nodos.length - a.nodos.length || a.nodos[0] - b.nodos[0]; });
    lista.forEach(function (c, k) {
      c.nodos.forEach(function (i) { g.nodos[i].com = k; });
      c.centro = c.nodos.slice().sort(function (a, b) { return grado(g.nodos[b]) - grado(g.nodos[a]) || a - b; })[0];
    });
    return lista;
  }

  /* ---- Geografía: mapa (11 variantes) y cartograma · fichas ---- */
  var GEOGRAFIA = ['mapa', 'cartograma'];
  /* Provincias (código INE 01-52): nombre, otros nombres admitidos y capital [lon, lat] */
  var PROVINCIAS = {
    '01': ['Álava', 'Araba|Araba/Álava|Vitoria', -2.672, 42.847], '02': ['Albacete', '', -1.856, 38.994], '03': ['Alicante', 'Alacant', -0.481, 38.345],
    '04': ['Almería', '', -2.463, 36.834], '05': ['Ávila', '', -4.700, 40.656], '06': ['Badajoz', '', -6.970, 38.879],
    '07': ['Illes Balears', 'Baleares|Islas Baleares|Balears|Mallorca|Palma', 2.650, 39.570], '08': ['Barcelona', '', 2.170, 41.387], '09': ['Burgos', '', -3.700, 42.344],
    '10': ['Cáceres', '', -6.372, 39.475], '11': ['Cádiz', '', -6.288, 36.527], '12': ['Castellón', 'Castelló|Castellón de la Plana', -0.049, 39.986],
    '13': ['Ciudad Real', '', -3.927, 38.986], '14': ['Córdoba', '', -4.779, 37.888], '15': ['A Coruña', 'La Coruña|Coruña', -8.411, 43.362],
    '16': ['Cuenca', '', -2.134, 40.070], '17': ['Girona', 'Gerona', 2.824, 41.979], '18': ['Granada', '', -3.599, 37.177],
    '19': ['Guadalajara', '', -3.167, 40.633], '20': ['Gipuzkoa', 'Guipúzcoa|San Sebastián|Donostia', -1.981, 43.318], '21': ['Huelva', '', -6.945, 37.261],
    '22': ['Huesca', '', -0.408, 42.140], '23': ['Jaén', '', -3.790, 37.779], '24': ['León', '', -5.567, 42.599],
    '25': ['Lleida', 'Lérida', 0.620, 41.614], '26': ['La Rioja', 'Rioja|Logroño', -2.445, 42.465], '27': ['Lugo', '', -7.556, 43.012],
    '28': ['Madrid', '', -3.704, 40.417], '29': ['Málaga', '', -4.421, 36.721], '30': ['Murcia', '', -1.130, 37.992],
    '31': ['Navarra', 'Nafarroa|Pamplona', -1.645, 42.812], '32': ['Ourense', 'Orense', -7.864, 42.336], '33': ['Asturias', 'Oviedo', -5.849, 43.362],
    '34': ['Palencia', '', -4.528, 42.010], '35': ['Las Palmas', 'Palmas|Las Palmas de Gran Canaria|Gran Canaria', -15.414, 28.124], '36': ['Pontevedra', '', -8.645, 42.431],
    '37': ['Salamanca', '', -5.664, 40.970], '38': ['Santa Cruz de Tenerife', 'Tenerife|S. C. de Tenerife', -16.252, 28.468], '39': ['Cantabria', 'Santander', -3.804, 43.462],
    '40': ['Segovia', '', -4.118, 40.948], '41': ['Sevilla', '', -5.984, 37.389], '42': ['Soria', '', -2.468, 41.764],
    '43': ['Tarragona', '', 1.245, 41.119], '44': ['Teruel', '', -1.106, 40.344], '45': ['Toledo', '', -4.027, 39.863],
    '46': ['Valencia', 'València', -0.376, 39.470], '47': ['Valladolid', '', -4.724, 41.652], '48': ['Bizkaia', 'Vizcaya|Bilbao', -2.935, 43.263],
    '49': ['Zamora', '', -5.745, 41.503], '50': ['Zaragoza', '', -0.889, 41.649], '51': ['Ceuta', '', -5.316, 35.889], '52': ['Melilla', '', -2.938, 35.292]
  };
  /* Comunidades (código INE 01-19): nombre, otros nombres, abreviatura y ficha [columna, fila] del cartograma, capital [lon, lat] */
  var COMUNIDADES = {
    '01': ['Andalucía', '', 'AND', 2, 3, -5.984, 37.389], '02': ['Aragón', '', 'ARA', 4, 1, -0.889, 41.649],
    '03': ['Asturias', 'Principado de Asturias', 'AST', 1, 0, -5.849, 43.362], '04': ['Illes Balears', 'Baleares|Islas Baleares|Balears', 'BAL', 5, 2, 2.650, 39.570],
    '05': ['Canarias', 'Islas Canarias', 'CNR', 0, 3, -15.414, 28.124], '06': ['Cantabria', '', 'CAN', 2, 0, -3.804, 43.462],
    '07': ['Castilla y León', 'Castilla León', 'CYL', 2, 1, -4.724, 41.652], '08': ['Castilla-La Mancha', 'Castilla La Mancha', 'CLM', 3, 2, -4.027, 39.863],
    '09': ['Cataluña', 'Catalunya|Cataluna', 'CAT', 5, 1, 2.170, 41.387], '10': ['Comunitat Valenciana', 'Comunidad Valenciana|C. Valenciana|Valenciana|Valencia|País Valenciano', 'VAL', 4, 2, -0.376, 39.470],
    '11': ['Extremadura', '', 'EXT', 1, 2, -6.344, 38.916], '12': ['Galicia', '', 'GAL', 0, 0, -8.546, 42.878],
    '13': ['Madrid', 'Comunidad de Madrid', 'MAD', 2, 2, -3.704, 40.417], '14': ['Murcia', 'Región de Murcia', 'MUR', 3, 3, -1.130, 37.992],
    '15': ['Navarra', 'Comunidad Foral de Navarra|Nafarroa', 'NAV', 4, 0, -1.645, 42.812], '16': ['País Vasco', 'Euskadi|Euskadi/País Vasco', 'PV', 3, 0, -2.672, 42.847],
    '17': ['La Rioja', 'Rioja', 'RIO', 3, 1, -2.445, 42.465], '18': ['Ceuta', '', 'CEU', 1, 4, -5.316, 35.889], '19': ['Melilla', '', 'MEL', 3, 4, -2.938, 35.292]
  };
  function normalizarNombre(t) {
    return String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[.,'’()]/g, ' ').replace(/[-/]/g, ' ')
      .replace(/^(provincia|comunidad autonoma) de\s+/, '').replace(/\s+/g, ' ').trim();
  }
  var indicesGeo = {};
  /* Índice nombre normalizado → código de cada mapa (también el código INE, con o sin cero delante, y la abreviatura) */
  function indiceGeo(mapa) {
    if (indicesGeo[mapa]) return indicesGeo[mapa];
    var tabla = mapa === 'provincias' ? PROVINCIAS : COMUNIDADES, ix = {};
    Object.keys(tabla).forEach(function (id) {
      var f = tabla[id], nombres = [f[0]].concat(f[1] ? f[1].split('|') : []);
      if (mapa === 'comunidades') nombres.push(f[2]);
      nombres.forEach(function (n) { ix[normalizarNombre(n)] = id; n.split('/').forEach(function (p) { ix[normalizarNombre(p)] = id; }); });
      ix[id] = id; ix[String(+id)] = id;
    });
    return (indicesGeo[mapa] = ix);
  }
  function codigoGeo(mapa, nombre) {
    if (!esTexto(nombre) && !esNum(nombre)) return null;
    var ix = indiceGeo(mapa), n = normalizarNombre(nombre);
    if (ix[n]) return ix[n];
    var partes = String(nombre).split('/').map(normalizarNombre).filter(function (p) { return ix[p]; });
    return partes.length ? ix[partes[0]] : null;
  }
  function nombreGeo(mapa, id) { return (mapa === 'provincias' ? PROVINCIAS : COMUNIDADES)[id][0]; }
  /* Proyección del kit (la misma que usa herramientas/mapas.py para los contornos): equirrectangular, paralelo 40° N, en km.
     Canarias se traslada al recuadro del suroeste; Ceuta y Melilla se agrandan en los contornos, no en los puntos. */
  var PROY = { R: 6378.137, k: Math.cos(40 * Math.PI / 180), lon0: -3.7, canarias: [637.076, 674.349] };
  function proyectar(lon, lat) {
    var x = PROY.R * PROY.k * (lon - PROY.lon0) * Math.PI / 180, y = PROY.R * lat * Math.PI / 180;
    if (lat < 30.5 && lon < -12) { x += PROY.canarias[0]; y += PROY.canarias[1]; }
    return [x, y];
  }
  function puntoCapital(mapa, id) {
    var f = (mapa === 'provincias' ? PROVINCIAS : COMUNIDADES)[id];
    return mapa === 'provincias' ? proyectar(f[2], f[3]) : proyectar(f[5], f[6]);
  }
  /* Un lugar: el nombre (o código) de una zona del mapa, que se sitúa en su capital, o { nombre, lat, lon } */
  function leerLugar(mapa, x, etiqueta, err) {
    if (x && typeof x === 'object' && !Array.isArray(x)) {
      if (!esNum(x.lat) || !esNum(x.lon)) { err(etiqueta + ' debe llevar «lat» y «lon» (en grados) o ser el nombre de una zona del mapa.'); return null; }
      if (x.lat < 26 || x.lat > 45 || x.lon < -19.5 || x.lon > 5.5) { err(etiqueta + ' (' + x.lat + ', ' + x.lon + ') cae fuera de España: revisa que «lat» y «lon» no estén cambiados.'); return null; }
      return { nombre: esTexto(x.nombre) ? x.nombre : null, xy: proyectar(x.lon, x.lat), id: null };
    }
    var id = codigoGeo(mapa, x);
    if (!id) { err(etiqueta + ' «' + x + '» no es ' + (mapa === 'provincias' ? 'una provincia' : 'una comunidad autónoma') + ' que el kit reconozca. ' + sugerenciaGeo(mapa, x)); return null; }
    return { nombre: String(x), xy: puntoCapital(mapa, id), id: id };
  }
  function sugerenciaGeo(mapa, x) {
    var otro = mapa === 'provincias' ? 'comunidades' : 'provincias';
    if (codigoGeo(otro, x)) return 'Es ' + (otro === 'provincias' ? 'una provincia' : 'una comunidad') + ': usa «mapa: \'' + otro + '\'».';
    return 'Usa el nombre oficial o el código INE (' + (mapa === 'provincias' ? '01-52' : '01-19') + ').';
  }
  /* Elige el mapa si no lo dice la especificación: comunidades si todos los nombres lo son; si no, provincias */
  function mapaPorDefecto(nombres) {
    var validos = nombres.filter(function (n) { return esTexto(n) || esNum(n); });
    if (!validos.length) return 'comunidades';
    if (validos.every(function (n) { return codigoGeo('comunidades', n); })) return 'comunidades';
    return validos.every(function (n) { return codigoGeo('provincias', n); }) ? 'provincias' : 'comunidades';
  }
  /* Cinco clases de igual amplitud con un paso cómodo de leer y cortes redondos (o los «umbrales» de la especificación) */
  function cortesMapa(vals) {
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
    if (!(hi > lo)) hi = lo + 5;
    var bruto = (hi - lo) / 5, e = Math.pow(10, Math.floor(Math.log(bruto) / Math.LN10)), paso = e, dist = Infinity;
    [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10].forEach(function (f) { var dd = Math.abs(Math.log(f * e / bruto)); if (dd < dist) { dist = dd; paso = f * e; } });
    paso = limpio(paso);
    var g = pasoBonito(paso / 3), c1 = limpio(Math.round((lo + paso) / g) * g);
    return [0, 1, 2, 3].map(function (k) { return limpio(c1 + k * paso); });
  }
  function claseMapa(x, cortes) { for (var k = 0; k < 4; k++) if (x < cortes[k]) return k; return 4; }
  var CLASES_MAPA = [P.naranja100, P.naranja300, P.naranja500, P.naranja600, P.naranja700];
  var NIVELES_MAPA = ['Muy baja', 'Baja', 'Media', 'Alta', 'Muy alta'];
  /* Rótulos de las clases: «< 35 %», «35 – 49 %», «≥ 80 %». Con datos y cortes enteros, el tramo acaba una unidad antes del corte */
  function rotulosClases(cortes, enteros, s) {
    var u = s.unidad && s.unidad.length <= 2 ? NBSP + s.unidad : '';
    function f(x) { return numero(x, Math.round(x) === x ? 0 : null); }
    return [0, 1, 2, 3, 4].map(function (k) {
      if (k === 0) return '< ' + f(cortes[0]) + u;
      if (k === 4) return '\u2265 ' + f(cortes[3]) + u;
      return f(cortes[k - 1]) + ' \u2013 ' + f(enteros ? cortes[k] - 1 : cortes[k]) + u;
    });
  }

  function validarGeografia(s, err, aviso) {
    var d = s.datos, v = s.tipo === 'cartograma' ? 'fichas' : s.variante;
    if (s.mapa != null && s.mapa !== 'comunidades' && s.mapa !== 'provincias') { err('«mapa» debe ser "comunidades" o "provincias".'); return; }
    if (s.tipo === 'cartograma' && s.mapa === 'provincias') { err('el cartograma de fichas solo está disponible por comunidades autónomas («mapa: \'comunidades\'»). Para provincias usa el tipo mapa · coropletas.'); return; }
    var nombresDatos = [].concat(Array.isArray(d.territorios) ? d.territorios : [], Array.isArray(d.paradas) ? d.paradas : [],
      d.origen != null ? [d.origen] : [], Array.isArray(d.destinos) ? d.destinos : [],
      Array.isArray(d.enlaces) ? [].concat.apply([], d.enlaces.map(function (e) { return e ? [e.origen, e.destino] : []; })) : []);
    if (s.mapa == null) s.mapa = s.tipo === 'cartograma' ? 'comunidades' : mapaPorDefecto(nombresDatos);
    var mapa = s.mapa;
    var g = { mapa: mapa };

    /* Zonas con valor (o categoría): un nombre por zona, sin repetir */
    function zonas(conValores, min) {
      if (!Array.isArray(d.territorios) || !d.territorios.length) { err('falta «datos.territorios»: la lista de ' + mapa + ' (nombre o código INE).'); return false; }
      var ids = [], ok = true;
      d.territorios.forEach(function (t, i) {
        if (!ok) return;
        var id = codigoGeo(mapa, t);
        if (!id) { err('«' + t + '» no es ' + (mapa === 'provincias' ? 'una provincia' : 'una comunidad autónoma') + ' que el kit reconozca. ' + sugerenciaGeo(mapa, t)); ok = false; return; }
        var j = ids.indexOf(id);
        if (j >= 0) { err('«' + t + '» y «' + d.territorios[j] + '» son la misma zona (' + nombreGeo(mapa, id) + ').'); ok = false; return; }
        ids.push(id);
      });
      if (!ok) return false;
      g.ids = ids; g.nombres = d.territorios.map(String);
      /* Zonas del mapa que no están en los datos: con trama de «Sin dato» (Ceuta y Melilla, en el color de base) */
      var todas = Object.keys(mapa === 'provincias' ? PROVINCIAS : COMUNIDADES), ciudades = mapa === 'provincias' ? ['51', '52'] : ['18', '19'];
      g.faltan = todas.filter(function (id) { return ids.indexOf(id) < 0 && ciudades.indexOf(id) < 0; });
      if (conValores && min === 2 && g.faltan.length) aviso('faltan ' + g.faltan.length + ' de ' + (todas.length - 2) + ' zonas (' + listaCorta(g.faltan.map(function (id) { return nombreGeo(mapa, id); }), 4) + '): se dibujan con trama de «Sin dato».');
      if (conValores) {
        var V = d.valores;
        if (!Array.isArray(V) || V.length !== ids.length || !V.every(function (x) { return x === null || esNum(x); })) { err('«datos.valores» debe tener un número por territorio (' + ids.length + '); usa null si no hay dato.'); return false; }
        if (V.filter(esNum).length < (min || 1)) { err('hace falta al menos ' + (min || 1) + ' valor' + ((min || 1) > 1 ? 'es' : '') + ' con dato.'); return false; }
        g.valores = V;
      }
      return true;
    }
    function lugar(x, etiqueta) { return leerLugar(mapa, x, etiqueta, err); }
    function claves() {
      var vals = g.valores.filter(esNum);
      if (s.umbrales != null) {
        var c = s.umbrales;
        if (!listaNum(c) || c.length !== 4 || c.some(function (x, i) { return i && x <= c[i - 1]; })) { err('«umbrales» debe tener 4 números crecientes: los límites entre las 5 clases de color.'); return false; }
        g.cortes = c.slice();
      } else g.cortes = cortesMapa(vals);
      g.enteros = vals.every(function (x) { return Math.round(x) === x; }) && g.cortes.every(function (x) { return Math.round(x) === x; });
      g.clases = g.valores.map(function (x) { return esNum(x) ? claseMapa(x, g.cortes) : null; });
      return true;
    }

    if (v === 'coropletas' || v === 'con-ranking' || v === 'fichas') {
      if (!zonas(true, 2)) return;
      if (!claves()) return;
      g.nulos = g.faltan.length > 0 || g.valores.some(function (x) { return x === null; });
      var u = String(s.unidad || '');
      if (v !== 'fichas' && u && !/%|‰|por |\/|tasa|ratio|índice|indice/i.test(u)) aviso('el mapa coroplético compara tasas o porcentajes: con totales («' + u + '») las zonas grandes parecen más importantes. Usa una tasa (por ejemplo «% de cobertura» o «centros por 100.000 hab.») o la variante «burbujas».');
      if (v === 'con-ranking') {
        if (s.ranking != null && (!esNum(s.ranking) || s.ranking < 3 || s.ranking > 12 || Math.round(s.ranking) !== s.ranking)) { err('«ranking» es el número de zonas de la lista, de 3 a 12 (por defecto 8).'); return; }
        g.nRanking = Math.min(s.ranking || 8, g.valores.filter(esNum).length);
      }
      if (v === 'fichas' && g.ids.some(function (id) { return id === '18' || id === '19'; })) g.ceutaMelilla = true;
    } else if (v === 'categorias') {
      if (!zonas(false)) return;
      var C = d.categorias;
      if (!Array.isArray(C) || C.length !== g.ids.length || !C.every(function (x) { return x === null || esTexto(x); })) { err('«datos.categorias» debe tener un texto por territorio (' + g.ids.length + '): la zona a la que pertenece (null si no tiene).'); return; }
      var lista = Array.isArray(d.grupos) ? d.grupos.slice() : [];
      if (d.grupos != null && !listaTexto(d.grupos)) { err('«datos.grupos» es opcional: la lista de categorías en el orden de la leyenda.'); return; }
      C.forEach(function (c) { if (c != null && lista.indexOf(c) < 0) { if (d.grupos != null) aviso('la categoría «' + c + '» no está en «datos.grupos»; se añade al final.'); lista.push(c); } });
      if (lista.length > 6) { err('hay ' + lista.length + ' categorías y el máximo es 6 (la paleta categórica). Agrupa las menores.'); return; }
      if (lista.length > 5) aviso('hay 6 categorías: el mapa de áreas se lee mejor con 4 o 5.');
      g.grupos = lista; g.cat = C.map(function (c) { return c == null ? -1 : lista.indexOf(c); });
    } else if (v === 'burbujas' || v === 'simbolos') {
      if (!zonas(true)) return;
      if (g.valores.some(function (x) { return esNum(x) && x < 0; })) { err('hay valores negativos: el área del símbolo mide una cantidad. Para valores con signo usa barras-divergentes.'); return; }
      if (g.ids.length > 52) return;
      if (v === 'simbolos') {
        var f = esTexto(s.destacar) || esNum(s.destacar) ? codigoGeo(mapa, s.destacar) : null;
        if (s.destacar != null && s.destacar !== false && (!f || g.ids.indexOf(f) < 0)) { err('«destacar» debe ser uno de los territorios de «datos.territorios».'); return; }
        g.foco = s.destacar === false ? -1 : (f ? g.ids.indexOf(f) : g.valores.indexOf(Math.max.apply(null, g.valores.filter(esNum))));
      }
    } else if (v === 'puntos') {
      if (d.puntos != null) {
        if (!Array.isArray(d.puntos) || !d.puntos.length) { err('«datos.puntos» debe ser una lista de { lat, lon }.'); return; }
        if (d.puntos.length > 3000) { err('hay ' + d.puntos.length + ' puntos y el máximo es 3.000. Para tantos casos usa la variante «rejilla» o «hexagonos».'); return; }
        g.puntos = [];
        for (var i = 0; i < d.puntos.length; i++) { var lp = lugar(d.puntos[i], 'el punto ' + (i + 1)); if (!lp) return; g.puntos.push(lp.xy); }
        g.porPunto = 1; g.total = g.puntos.length;
        if (s.porPunto != null && s.porPunto !== 1) aviso('«porPunto» solo se usa con «territorios» y «valores»; con «puntos», cada punto es un caso.');
      } else {
        if (!zonas(true)) return;
        if (!g.valores.every(function (x) { return x === null || (x >= 0 && Math.round(x) === x); })) { err('con «territorios», «datos.valores» son recuentos (enteros ≥ 0): el kit reparte un punto por cada «porPunto» casos.'); return; }
        var pp = s.porPunto == null ? 1 : s.porPunto;
        if (!esNum(pp) || pp <= 0) { err('«porPunto» debe ser un número positivo: cuántos casos representa cada punto.'); return; }
        g.porPunto = pp; g.total = suma(g.valores.filter(esNum));
        var np = g.valores.reduce(function (a, x) { return a + (esNum(x) ? Math.round(x / pp) : 0); }, 0);
        if (np > 3000) { err('saldrían ' + np + ' puntos y el máximo es 3.000: sube «porPunto» (por ejemplo ' + pasoBonito(g.total / 1500, true) + ').'); return; }
        if (np < 1) { err('con «porPunto» = ' + pp + ' no sale ningún punto: bájalo.'); return; }
      }
    } else if (v === 'rejilla' || v === 'hexagonos') {
      if (!Array.isArray(d.puntos) || d.puntos.length < 10) { err('«datos.puntos» debe ser una lista de al menos 10 casos { lat, lon } (con «valor» si cada caso pesa distinto): el kit los cuenta por celda.'); return; }
      if (d.puntos.length > 50000) { err('hay ' + d.puntos.length + ' casos y el máximo es 50.000.'); return; }
      var celda = s.celda == null ? 25 : s.celda;
      if (!esNum(celda) || celda < 5 || celda > 200) { err('«celda» es el lado de la celda en km, de 5 a 200 (por defecto 25).'); return; }
      g.celda = celda; g.puntos = []; g.pesos = []; var conPeso = d.puntos.some(function (q) { return q && q.valor != null; });
      for (var j = 0; j < d.puntos.length; j++) {
        var q = d.puntos[j], lq = lugar(q, 'el caso ' + (j + 1)); if (!lq) return;
        if (conPeso && (!esNum(q.valor) || q.valor < 0)) { err('el caso ' + (j + 1) + ' necesita «valor» (≥ 0): si uno lleva valor, todos lo llevan.'); return; }
        g.puntos.push(lq.xy); g.pesos.push(conPeso ? q.valor : 1);
      }
      g.conPeso = conPeso;
      if (conPeso && !esTexto(s.unidad)) { err('con «valor» en los casos hace falta «unidad» (lo que suma cada celda).'); return; }
      celdasMapa(g, v === 'hexagonos');
      if (g.celdas.length < 2) { err('todos los casos caen en la misma celda: baja «celda» (ahora ' + numero(celda) + ' km).'); return; }
    } else if (v === 'flujos') {
      if (d.origen == null) { err('falta «datos.origen»: el lugar de donde salen los flujos.'); return; }
      g.origen = lugar(d.origen, '«datos.origen»'); if (!g.origen) return;
      if (!Array.isArray(d.destinos) || d.destinos.length < 1) { err('falta «datos.destinos»: la lista de lugares de destino.'); return; }
      if (d.destinos.length > 7) { err('hay ' + d.destinos.length + ' flujos y el máximo es 7. Agrupa los menores o usa barras.'); return; }
      g.destinos = [];
      for (var k = 0; k < d.destinos.length; k++) { var ld = lugar(d.destinos[k], 'el destino ' + (k + 1)); if (!ld) return; g.destinos.push(ld); }
      if (!listaNum(d.valores) || d.valores.length !== d.destinos.length || d.valores.some(function (x) { return x <= 0; })) { err('«datos.valores» debe tener un número positivo por destino (' + d.destinos.length + ').'); return; }
      g.valores = d.valores;
      if (g.destinos.some(function (x) { return x.xy[0] === g.origen.xy[0] && x.xy[1] === g.origen.xy[1]; })) { err('un destino coincide con el origen.'); return; }
    } else if (v === 'ruta') {
      if (!Array.isArray(d.paradas) || d.paradas.length < 2) { err('«datos.paradas» debe tener al menos 2 lugares, en el orden del recorrido.'); return; }
      if (d.paradas.length > 12) { err('hay ' + d.paradas.length + ' paradas y el máximo es 12.'); return; }
      g.paradas = [];
      for (var m2 = 0; m2 < d.paradas.length; m2++) { var lr = lugar(d.paradas[m2], 'la parada ' + (m2 + 1)); if (!lr) return; if (!lr.nombre) { err('la parada ' + (m2 + 1) + ' necesita «nombre» (va en la leyenda).'); return; } g.paradas.push(lr); }
    } else if (v === 'conexiones') {
      if (!Array.isArray(d.enlaces) || !d.enlaces.length) { err('falta «datos.enlaces»: la lista de { origen, destino } (nombres de zonas o lugares con lat y lon).'); return; }
      if (d.enlaces.length > 40) { err('hay ' + d.enlaces.length + ' conexiones y el máximo es 40.'); return; }
      g.nodos = []; g.enlaces = [];
      var nodo = function (x, et) {
        var l = lugar(x, et); if (!l) return -1;
        var clave = l.id ? 'z' + l.id : 'p' + l.xy.join(','), i0 = g.nodos.map(function (n) { return n.clave; }).indexOf(clave);
        if (i0 >= 0) return i0;
        if (!l.nombre) { err(et + ' necesita «nombre».'); return -1; }
        g.nodos.push({ nombre: l.nombre, xy: l.xy, clave: clave, grado: 0 }); return g.nodos.length - 1;
      };
      for (var e = 0; e < d.enlaces.length; e++) {
        var en = d.enlaces[e] || {};
        var a = nodo(en.origen, 'el origen de la conexión ' + (e + 1)); if (a < 0) return;
        var b = nodo(en.destino, 'el destino de la conexión ' + (e + 1)); if (b < 0) return;
        if (a === b) { err('la conexión ' + (e + 1) + ' une «' + g.nodos[a].nombre + '» consigo mismo.'); return; }
        if (g.enlaces.some(function (x) { return (x[0] === a && x[1] === b) || (x[0] === b && x[1] === a); })) { err('la conexión ' + g.nodos[a].nombre + ' – ' + g.nodos[b].nombre + ' está repetida.'); return; }
        g.enlaces.push([a, b]); g.nodos[a].grado++; g.nodos[b].grado++;
      }
      if (g.nodos.length > 24) { err('hay ' + g.nodos.length + ' lugares y el máximo es 24.'); return; }
      if (s.destacar != null && s.destacar !== false) {
        var cd = codigoGeo(mapa, s.destacar), fz = g.nodos.map(function (n) { return n.clave === 'z' + cd || normalizarNombre(n.nombre) === normalizarNombre(s.destacar); }).indexOf(true);
        if (fz < 0) { err('«destacar» debe ser uno de los lugares de las conexiones.'); return; }
        g.foco = fz;
      } else g.foco = s.destacar === false ? -1 : g.nodos.reduce(function (m, n, i) { return n.grado > g.nodos[m].grado ? i : m; }, 0);
    }
    d._geo = g;
  }
  /* Cuenta los casos por celda: cuadrados de «celda» km de lado o hexágonos de la misma área (centros en km, proyección del kit) */
  function celdasMapa(g, hex) {
    var mapaC = {}, lado = g.celda, r = hex ? Math.sqrt(2 * lado * lado / (3 * Math.sqrt(3))) : 0;
    var w = hex ? Math.sqrt(3) * r : lado, h = hex ? 1.5 * r : lado;
    g.puntos.forEach(function (p, i) {
      var cx, cy;
      if (!hex) { cx = Math.floor(p[0] / lado); cy = Math.floor(p[1] / lado); }
      else {
        /* hexágono «punta arriba» más cercano: se prueban las dos filas candidatas */
        var fila = Math.floor(p[1] / h), mejor = null;
        [fila, fila + 1].forEach(function (fy) {
          var off = (fy & 1) ? w / 2 : 0, fx = Math.round((p[0] - off) / w), dx = p[0] - (fx * w + off), dy = p[1] - fy * h, dd = dx * dx + dy * dy;
          if (!mejor || dd < mejor[2]) mejor = [fx, fy, dd];
        });
        cx = mejor[0]; cy = mejor[1];
      }
      var k = cx + ',' + cy;
      (mapaC[k] = mapaC[k] || { cx: cx, cy: cy, v: 0, n: 0 }).v += g.pesos[i]; mapaC[k].n++;
    });
    g.celdas = Object.keys(mapaC).map(function (k) {
      var c = mapaC[k];
      if (hex) { c.x = c.cx * w + ((c.cy & 1) ? w / 2 : 0); c.y = c.cy * h; } else { c.x = (c.cx + 0.5) * lado; c.y = (c.cy + 0.5) * lado; }
      return c;
    });
    g.radioHex = r; g.max = Math.max.apply(null, g.celdas.map(function (c) { return c.v; }));
    g.celdas.forEach(function (c) { c.clase = Math.min(4, Math.floor(c.v / g.max * 5 - 1e-9)); });
  }

  function validar(entrada) {
    var errores = [], avisos = [];
    if (!entrada || typeof entrada !== 'object' || Array.isArray(entrada)) {
      return { ok: false, errores: ['La especificación debe ser un objeto JSON.'], avisos: avisos, spec: null };
    }
    var s = copia(entrada);
    var t = s.tipo;
    var p = (esTexto(t) ? t : 'especificación') + ': ';
    function err(m) { errores.push(p + m); }
    function aviso(m) { avisos.push(p + m); }

    if (ALIAS[t] && ALIAS[t].tipo === 'kpi') { desdeKpiAntiguo(s); t = 'kpi'; }
    else if (ALIAS[t]) { s.tipo = ALIAS[t].tipo; if (s.variante == null) s.variante = ALIAS[t].variante; t = s.tipo; }
    if (TIPOS.indexOf(t) < 0) {
      err('«tipo» no válido. Usa uno de: ' + TIPOS.join(', ') + '.');
      return { ok: false, errores: errores, avisos: avisos, spec: s };
    }
    if (s.variante != null && !VARIANTES[t]) aviso('este tipo no tiene variantes; se ignora «variante».');
    if (!esTexto(s.titulo)) err('falta «titulo».');
    var unidadPorIndicador = t === 'kpi-rejilla' || (t === 'tabla' && s.datos && s.datos.indicadores);
    var vPrevista = VARIANTES[t] ? (s.variante != null ? s.variante : variantePorDefecto(s)) : null;
    if (unidadPorIndicador && s.unidad == null && s.datos && Array.isArray(s.datos.indicadores)) {
      s.datos.indicadores.forEach(function (x, i) { if (x && !esTexto(x.unidad)) err('el indicador «' + (x.nombre || i + 1) + '» necesita «unidad» (o indica una «unidad» común).'); });
    } else if ((t === 'matriz' && vPrevista !== 'cohortes') || t === 'etapas' || t === 'cronologia' || t === 'gantt' || t === 'ciclo-vida' ||
      (t === 'calendario' && vPrevista === 'mes') || (t === 'dispersion' && s.unidad == null) || t === 'arbol' || t === 'anidados' || t === 'red' ||
      (t === 'mapa' && ['puntos', 'rejilla', 'hexagonos', 'categorias', 'ruta', 'conexiones'].indexOf(vPrevista) >= 0)) {
      /* matriz de correlación: el coeficiente no tiene unidad; dispersion: la unidad puede ir en cada eje (lo comprueba validarDispersion);
         etapas: solo la necesita el pipeline con «valor» en los casos (lo comprueba validarPipeline); cronologia, gantt, el calendario
         de un mes y el ciclo de vida no miden una magnitud; arbol y anidados dibujan una estructura (el dendrograma, una distancia); red dibuja conexiones (en dependencias, la unidad es la de la duración);
         mapa: los puntos y las celdas cuentan casos (con «valor» en los casos, lo comprueba validarGeografia), las áreas, rutas y conexiones no miden una magnitud */
    } else if (!esTexto(s.unidad)) err('falta «unidad» (por ejemplo "€", "%", "pedidos"). La unidad forma parte del significado del dato.');
    if (s.medio && s.medio !== 'web') aviso('el kit solo tiene por ahora el modo "web"; se dibuja en modo web.');
    if (s.colores || s.color || s.fuente || s.estilo) aviso('los colores, fuentes y estilos los pone el sistema; se ignoran «colores», «color», «fuente» y «estilo».');

    var d = s.datos;
    var esKpi = t === 'kpi';

    if (!esKpi && (!d || typeof d !== 'object')) { err('falta «datos».'); return fin(); }

    if (VARIANTES[t]) validarVariantes(s, err, aviso);
    if (t === 'kpi') validarKpi(s, err, aviso);

    if (COMPOSICION.indexOf(t) >= 0 && errores.length === 0 && !(t === 'treemap' && s.variante === 'jerarquico')) validarComposicion(s, err, aviso);
    if (DISTRIBUCION.indexOf(t) >= 0 && VARIANTES[t].disponibles.indexOf(s.variante) >= 0) validarDistribucion(s, err, aviso);
    if (RELACION.indexOf(t) >= 0 && VARIANTES[t].disponibles.indexOf(s.variante) >= 0) validarRelacion(s, err, aviso);
    if (PROCESOS.indexOf(t) >= 0 && VARIANTES[t].disponibles.indexOf(s.variante) >= 0) validarProcesos(s, err, aviso);
    if (TEMPORAL.indexOf(t) >= 0 && VARIANTES[t].disponibles.indexOf(s.variante) >= 0) validarTemporal(s, err, aviso);
    if (VARIANTES[t] && VARIANTES[t].disponibles.indexOf(s.variante) >= 0 && esJerarquia(s)) validarJerarquia(s, err, aviso);
    if (FLUJO.indexOf(t) >= 0 && VARIANTES[t].disponibles.indexOf(s.variante) >= 0) validarFlujo(s, err, aviso);
    if (GEOGRAFIA.indexOf(t) >= 0 && VARIANTES[t].disponibles.indexOf(s.variante) >= 0) validarGeografia(s, err, aviso);

    return fin();
    function fin() { return { ok: errores.length === 0, errores: errores, avisos: avisos, spec: s }; }
  }

  /* ------------------------------------------------------------------ */
  /* Carga de dependencias                                               */
  /* ------------------------------------------------------------------ */
  var promesaECharts = null;
  function asegurarECharts() {
    if (global.echarts) return Promise.resolve(global.echarts);
    if (promesaECharts) return promesaECharts;
    promesaECharts = new Promise(function (resolver, rechazar) {
      var i = 0;
      (function intentar() {
        if (i >= config.echarts.length) { promesaECharts = null; return rechazar(new Error('No se pudo cargar ECharts.')); }
        var sc = document.createElement('script');
        sc.src = config.echarts[i++];
        sc.async = true;
        sc.onload = function () { if (global.echarts) resolver(global.echarts); else intentar(); };
        sc.onerror = intentar;
        document.head.appendChild(sc);
      })();
    });
    return promesaECharts;
  }

  var promesaFuente = null;
  function asegurarFuente() {
    if (promesaFuente) return promesaFuente;
    if (!document.querySelector('link[data-eg-fuente]') && config.fuente) {
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = config.fuente; l.setAttribute('data-eg-fuente', '');
      document.head.appendChild(l);
    }
    var espera = new Promise(function (r) { setTimeout(r, 1500); });
    var carga = (document.fonts && document.fonts.load)
      ? Promise.all(['400', '600', '700'].map(function (w) { return document.fonts.load(w + ' 14px "Titillium Web"'); }))
      : Promise.resolve();
    promesaFuente = Promise.race([carga, espera]).catch(function () {});
    return promesaFuente;
  }

  /* ------------------------------------------------------------------ */
  /* Estilos                                                             */
  /* ------------------------------------------------------------------ */
  var CSS = [
    '.eg-pagina{background:' + T.fondoPagina + ';color:' + T.texto + ';font-family:' + FUENTE + ';margin:0}',
    '.eg{font-family:' + FUENTE + ';color:' + T.texto + ';box-sizing:border-box;-webkit-font-smoothing:antialiased}',
    '.eg *,.eg *::before,.eg *::after{box-sizing:border-box}',
    '.eg-rejilla{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));align-items:stretch}',
    '.eg-rejilla-kpi{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))}',
    '.eg-doble{grid-column:span 2}',
    '@media (max-width:720px){.eg-doble{grid-column:auto}}',
    '.eg-tarjeta{background:' + T.fondo + ';border:1px solid ' + T.borde + ';border-radius:8px;padding:20px 24px 24px;height:100%;container-type:inline-size;min-width:0;display:flex;flex-direction:column}',
    '.eg-titulo{font-size:14px;line-height:18px;font-weight:600;margin:0;color:' + T.titulo + '}',
    '.eg-subtitulo{font-size:11px;line-height:14px;margin:2px 0 0;color:' + T.textoSecundario + '}',
    '.eg-cuerpo{margin-top:16px;position:relative;flex:1;min-height:0}',
    '.eg-lienzo{width:100%;height:260px}',
    '.eg-nota{font-size:11px;line-height:14px;color:' + T.textoSecundario + ';margin:12px 0 0}',
    '.eg-nota a{color:inherit;text-decoration:underline;text-underline-offset:2px}',
    '.eg-icono{display:inline-block;flex:none;vertical-align:middle}',
    /* KPI */
    '.eg-kpi .eg-titulo{font-size:11px;line-height:14px;font-weight:400;color:' + T.textoSecundario + '}',
    '.eg-kpi .eg-cuerpo{margin-top:8px;display:flex;flex-direction:column;gap:12px}',
    '.eg-kpi-valor{font-size:44px;line-height:48px;font-weight:700;letter-spacing:-.01em;color:' + T.texto + ';white-space:nowrap;margin:0}',
    '.eg-kpi-unidad{font-size:18px;font-weight:600;letter-spacing:0;margin-left:.2em}',
    '@container (max-width:300px){.eg-kpi-valor{font-size:30px;line-height:34px}.eg-kpi-unidad{font-size:14px}}',
    '.eg-fila{display:flex;align-items:center;flex-wrap:wrap;gap:6px 12px;font-size:11px;line-height:14px}',
    '.eg-secundario{color:' + T.textoSecundario + '}',
    '.eg-fuerte{font-weight:600;color:' + T.texto + '}',
    '.eg-chip{display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 10px 0 6px;border-radius:12px;font-size:11px;font-weight:600;color:' + T.texto + ';white-space:nowrap}',
    '.eg-chip-subida{background:' + P.naranja100 + '}',
    '.eg-chip .eg-icono[width="22"]{margin:0 -3px 0 -5px}',
    '.eg-chip-bajada,.eg-chip-igual,.eg-chip-neutro{background:' + P.neutro200 + '}',
    '.eg-chip-mejora{background:' + P.exitoSuave + '}',
    '.eg-chip-empeora{background:' + P.errorSuave + '}',
    '.eg-spark{display:flex;flex-direction:column;gap:8px;min-width:0}',
    '.eg-spark svg{display:block;width:100%;height:56px;overflow:visible}',
    '.eg-spark .eg-fila{justify-content:space-between}',
    '@container (min-width:380px){.eg-kpi-sparkline .eg-cuerpo{flex-direction:row;align-items:flex-end;justify-content:space-between;gap:24px}.eg-kpi-sparkline .eg-spark{flex:0 1 200px}}',
    '.eg-contexto{margin:0;font-size:12px;line-height:17px}',
    '.eg-contexto span{display:block}',
    /* Donut */
    '.eg-donut-cuerpo{display:flex;align-items:center;gap:24px;flex-wrap:wrap}',
    '.eg-donut-grafico{position:relative;width:184px;height:184px;flex:none}',
    '.eg-donut-grafico .eg-lienzo{width:184px;height:184px}',
    '.eg-donut-centro{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;text-align:center}',
    '.eg-donut-centro small{font-size:11px;line-height:14px;color:' + T.textoSecundario + '}',
    '.eg-donut-centro strong{font-size:30px;line-height:34px;font-weight:700}',
    '.eg-donut-centro em{font-style:normal;font-size:11px;line-height:14px;font-weight:600;color:' + T.texto + '}',
    '.eg-leyenda{list-style:none;margin:0;padding:0;flex:1 1 180px;display:grid;gap:10px;min-width:0}',
    '.eg-leyenda li{display:grid;grid-template-columns:10px 1fr auto;align-items:center;gap:10px;font-size:11px;line-height:14px;color:' + T.leyenda + '}',
    '.eg-muestra{width:10px;height:10px;border-radius:2px}',
    '.eg-leyenda b{font-weight:600;color:' + T.texto + ';text-align:right}',
    /* Composición */
    '.eg-donut-centro strong span{font-size:14px;font-weight:600;margin-left:2px}',
    '.eg-leyenda-sin li{grid-template-columns:10px 1fr}',
    '.eg-semi{position:relative;width:240px;flex:none}',
    '.eg-semi .eg-lienzo{width:240px;height:122px}',
    '.eg-semi-centro{position:absolute;left:0;right:0;top:82px;display:flex;flex-direction:column;align-items:center;pointer-events:none;text-align:center}',
    '.eg-semi-centro strong{font-size:30px;line-height:34px;font-weight:700;white-space:nowrap}',
    '.eg-semi-centro strong span{font-size:14px;font-weight:600;margin-left:2px}',
    '.eg-semi-centro small{font-size:11px;line-height:14px;color:' + T.textoSecundario + ';margin-top:6px}',
    '.eg-semi-centro small b{font-weight:600;color:' + T.texto + '}',
    '.eg-semi+.eg-leyenda{flex-basis:80px}',
    '.eg-pt{display:flex;flex-direction:column;gap:6px;padding-top:4px}',
    '.eg-pt-fila{display:flex;width:100%}',
    '.eg-pt-fila>span{min-width:0;overflow:hidden;white-space:nowrap;text-align:center;font-size:11px;line-height:14px;font-weight:600}',
    '.eg-pt-nombres>span{color:' + T.texto + ';padding:0 2px}',
    '.eg-pt-barra{height:48px}',
    '.eg-pt-barra>span{display:flex;align-items:center;justify-content:center}',
    '.eg-pt-barra>span+span{box-shadow:inset 2px 0 0 ' + T.fondo + '}',
    '.eg-pt .eg-oculto{color:transparent}',
    '.eg-pt-eje{position:relative;height:28px;border-top:1px solid ' + T.base + ';margin-top:2px;font-size:11px;line-height:14px;color:' + T.etiquetaEje + '}',
    '.eg-pt-eje span{position:absolute;top:0;padding-top:12px;transform:translateX(-50%);white-space:nowrap}',
    '.eg-pt-eje span::before{content:"";position:absolute;left:50%;top:0;height:8px;border-left:1px solid ' + T.base + '}',
    '.eg-pt-eje span:first-child{transform:none}.eg-pt-eje span:first-child::before{left:0}',
    '.eg-pt-eje span:last-child{transform:translateX(-100%)}.eg-pt-eje span:last-child::before{left:auto;right:0}',
    '.eg-pt .eg-leyenda-h{margin:6px 0 0}.eg-pt .eg-leyenda-h[hidden]{display:none}',
    '.eg-uno{display:flex;align-items:center;gap:16px 24px;flex-wrap:wrap}',
    '.eg-uno-lado{display:flex;flex-direction:column;gap:16px;min-width:0;flex:1 1 130px}',
    '.eg-uno-dato{display:flex;flex-direction:column;gap:4px;font-size:11px;line-height:14px}',
    '.eg-uno-dato .eg-kpi-valor{font-size:30px;line-height:34px}',
    '.eg-uno .eg-leyenda{flex:none;gap:8px}',
    '.eg-wf{display:grid;grid-template-columns:repeat(10,15px);grid-auto-rows:15px;gap:3px;flex:none}',
    '.eg-wf i{border-radius:2px;background:' + T.otros + '}.eg-wf i.eg-si{background:' + T.actual + '}',
    '.eg-cu{position:relative;width:152px;height:152px;flex:none}.eg-cu svg{display:block;width:100%;height:100%}',
    '.eg-cu-centro{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}',
    '.eg-cu-centro strong{font-size:30px;line-height:34px;font-weight:700}.eg-cu-centro small{font-size:11px;line-height:14px;color:' + T.textoSecundario + ';margin-top:2px}',
    '.eg-pa .eg-pista,.eg-pa .eg-barra{border-radius:3px}.eg-pa dt{color:' + T.textoSecundario + '}',
    /* Barras de progreso */
    '.eg-progreso-lista{display:grid;grid-template-columns:minmax(64px,max-content) minmax(80px,1fr) max-content;align-items:center;column-gap:16px;row-gap:16px;margin:0}',
    '.eg-progreso-lista dt{font-size:11px;line-height:14px;color:' + T.leyenda + '}',
    '.eg-progreso-lista dd{margin:0}',
    '.eg-pista{height:16px;border-radius:8px;background:' + T.pista + ';overflow:hidden}',
    '.eg-barra{height:100%;border-radius:8px;background:' + T.actual + '}',
    '.eg-progreso-lista .eg-valor{font-size:11px;line-height:14px;font-weight:600;text-align:right;min-width:40px}',
    /* Leyenda HTML */
    '.eg-leyenda-h{list-style:none;margin:0 0 14px;padding:0;display:flex;flex-wrap:wrap;gap:6px 16px;font-size:11px;line-height:14px;color:' + T.leyenda + '}',
    '.eg-leyenda-h li{display:flex;align-items:center;gap:5px}',
    '.eg-leyenda-h .eg-m{width:8px;height:8px;border-radius:2px}',
    '.eg-leyenda-h .eg-m-linea{width:14px;height:2.5px;border-radius:1px}',
    '.eg-leyenda-h .eg-ley-titulo{font-weight:600}',
    /* Sparkline y líneas mínimas */
    '.eg-mini{position:relative;display:block;width:100%;min-width:48px}',
    '.eg-mini svg{display:block;width:100%;height:100%;overflow:visible}',
    '.eg-mini i{position:absolute;width:8px;height:8px;border-radius:50%;background:' + T.actual + ';box-shadow:0 0 0 1.5px ' + T.fondo + '}',
    '.eg-sparklines{list-style:none;margin:0;padding:0}',
    '.eg-sparklines li{display:grid;grid-template-columns:minmax(56px,max-content) minmax(60px,1fr) minmax(48px,max-content);align-items:center;column-gap:16px;padding:10px 0;border-bottom:1px solid ' + T.rejilla + '}',
    '.eg-sparklines li:first-child{padding-top:2px}',
    '.eg-sparklines li:last-child{border-bottom:0;padding-bottom:0}',
    '.eg-sp-nombre{font-size:11px;line-height:14px;color:' + T.leyenda + '}',
    '.eg-sparklines b{font-size:14px;line-height:18px;font-weight:600;text-align:right;white-space:nowrap;color:' + T.texto + '}',
    '.eg-sparklines small{font-size:11px;font-weight:600;color:' + T.textoSecundario + '}',
    '.eg-celda-spark{width:110px;min-width:90px}',
    /* KPI con bloques */
    '.eg-kpi .eg-cuerpo{font-size:11px;line-height:14px}',
    '.eg-kpi-cabeza{display:flex;flex-direction:column;gap:12px;min-width:0}',
    '.eg-kpi-principal{display:flex;flex-direction:column;gap:8px;min-width:0}',
    '@container (min-width:340px){.eg-kpi-lado .eg-kpi-cabeza{flex-direction:row;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px 24px}.eg-kpi-lado .eg-kpi-principal{flex:none;max-width:100%}.eg-kpi-lado .eg-lateral{flex:1 1 140px;max-width:240px}}',
    '.eg-lateral{display:flex;flex-direction:column;gap:8px;min-width:0}',
    '.eg-kpi-gris{color:' + T.textoSecundario + '}',
    '.eg-kpi-dos{display:grid;grid-template-columns:1fr 1fr;gap:16px}',
    '.eg-kpi-col{display:flex;flex-direction:column;gap:6px;min-width:0;font-size:11px;line-height:14px}',
    '.eg-kpi-dos .eg-kpi-valor{font-size:30px;line-height:34px}',
    '.eg-kpi-dividida .eg-kpi-col+.eg-kpi-col{border-left:1px solid ' + T.borde + ';padding-left:16px}',
    '.eg-tendencia{align-items:flex-start;font-size:11px;line-height:14px}.eg-tendencia b{font-size:14px;line-height:18px;font-weight:600}',
    '.eg-escala{position:relative;padding-bottom:18px}',
    '.eg-pista-kpi{position:relative;height:12px;border-radius:6px;overflow:visible}',
    '.eg-pista-kpi .eg-barra{border-radius:6px}',
    '.eg-tramo{position:absolute;top:0;bottom:0;border:1.5px dashed ' + T.actual + ';border-left:0;border-radius:0 6px 6px 0;background:' + T.fondo + '}',
    '.eg-marca{position:absolute;top:-5px;bottom:-5px;width:2.5px;margin-left:-1.25px;background:' + T.objetivo + ';border-radius:1px}',
    '.eg-escala-rotulos{position:absolute;left:0;right:0;bottom:0;height:14px;font-size:11px;line-height:14px;color:' + T.textoSecundario + '}',
    '.eg-escala-rotulos span{position:absolute;top:0;transform:translateX(-50%);white-space:nowrap}',
    '.eg-escala-rotulos .eg-fuerte{color:' + T.texto + '}',
    '.eg-ritmo .eg-escala{padding:18px 0 0}.eg-ritmo .eg-escala-rotulos{top:0;bottom:auto}',
    '.eg-ritmo{display:flex;flex-direction:column;gap:14px}.eg-ritmo .eg-fila{align-items:baseline}',
    '.eg-extremos{justify-content:space-between}',
    '.eg-logro{display:flex;align-items:center;gap:20px}',
    '.eg-logro-icono{flex:none;width:64px;height:64px;border-radius:50%;background:' + P.exitoSuave + ';display:flex;align-items:center;justify-content:center}',
    '.eg-logro-no{background:' + P.neutro200 + '}',
    '.eg-logro-texto{display:flex;flex-direction:column;align-items:flex-start;gap:6px;font-size:11px}',
    '.eg-umbral{font-size:11px;line-height:14px}',
    '.eg-puntos-rank{display:flex;flex-wrap:wrap;gap:5px}.eg-puntos-rank i{width:8px;height:8px;border-radius:50%;background:' + T.pista + '}.eg-puntos-rank i.eg-foco{background:' + T.actual + '}',
    '.eg-rank{gap:10px}.eg-rank .eg-pos{width:28px;height:28px;border-radius:50%;background:' + T.texto + ';color:' + T.fondo + ';display:flex;align-items:center;justify-content:center;font-weight:600;font-size:12px}',
    '.eg-rank b{display:block;font-size:12px;font-weight:600}.eg-rank small{display:block;font-size:11px}',
    '.eg-comp{display:flex;flex-direction:column;gap:4px;font-size:11px;line-height:14px}',
    '.eg-comp-fila{display:flex;align-items:center;gap:16px}',
    '.eg-comp-valor{font-size:24px;line-height:28px;font-weight:700;min-width:88px;white-space:nowrap}.eg-comp-valor small{font-size:13px;font-weight:600}',
    '.eg-comp-pista{flex:1;height:12px;display:block;border-radius:6px;overflow:hidden}.eg-comp-pista span{display:block;height:100%;border-radius:6px}',
    '.eg-con-pista{background:' + T.pista + ';height:8px}',
    '.eg-componentes{gap:10px;font-size:11px}.eg-componentes .eg-fila{justify-content:space-between;margin-bottom:4px}',
    '.eg-secundarios{display:grid;gap:12px;border-top:1px solid ' + T.rejilla + ';padding-top:12px}',
    '.eg-secundarios div{display:flex;flex-direction:column;gap:2px;font-size:11px;line-height:14px}.eg-secundarios b{font-size:18px;line-height:22px;font-weight:600}',
    '.eg-secundarios small,.eg-mini-kpi small{font-size:11px;font-weight:600;color:' + T.textoSecundario + '}',
    '.eg-desglose{display:flex;flex-direction:column;gap:10px}.eg-desglose .eg-leyenda-h{margin:0}.eg-desglose b{font-weight:600;color:' + T.texto + '}',
    '.eg-desglose-barra{display:flex;gap:2px;height:12px;border-radius:2px;overflow:hidden}',
    '.eg-minibarras .eg-mb{display:flex;align-items:stretch;gap:6px;height:72px}',
    '.eg-mb>span{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:4px;min-width:6px}',
    '.eg-mb i{display:block;width:100%;max-width:18px;border-radius:2px 2px 0 0}.eg-mb small{font-size:10px;line-height:12px;color:' + T.textoSecundario + '}',
    '.eg-progreso-kpi{display:flex;flex-direction:column;gap:8px}.eg-progreso-kpi .eg-pista-kpi{overflow:hidden}',
    '.eg-pestanas{display:inline-flex;align-self:flex-start;gap:2px;padding:3px;border-radius:16px;background:' + P.neutro200 + '}',
    '.eg-pestanas button{font:inherit;font-size:11px;line-height:14px;font-weight:600;color:' + T.leyenda + ';background:none;border:0;border-radius:13px;padding:5px 12px;cursor:pointer}',
    '.eg-pestanas button[aria-selected="true"]{background:' + T.actual + ';color:' + P.neutro700 + '}',
    '.eg-pestanas button:focus-visible{outline:2px solid ' + T.objetivo + ';outline-offset:1px}',
    '.eg-panel{display:flex;flex-direction:column;gap:4px;font-size:11px;line-height:14px;margin-top:8px}.eg-panel[hidden]{display:none}',
    /* Rejilla de KPI */
    '.eg-rejilla-mini{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}',
    '.eg-mini-kpi{border:1px solid ' + T.borde + ';border-radius:6px;padding:10px 12px;display:flex;flex-direction:column;align-items:flex-start;gap:4px;font-size:11px;line-height:14px}',
    '.eg-mini-kpi b{font-size:24px;line-height:28px;font-weight:700}',
    /* Objetivos */
    '.eg-anillos{display:flex;flex-wrap:wrap;justify-content:space-around;gap:16px}',
    '.eg-anillos figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:8px;font-size:11px;color:' + T.leyenda + '}',
    '.eg-anillo{position:relative;width:96px;height:96px}.eg-anillo svg{width:100%;height:100%;display:block}',
    '.eg-anillo b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:' + T.texto + '}',
    '.eg-medidor svg{display:block;width:100%;max-width:260px;margin:0 auto;overflow:visible}',
    '.eg-svg-valor{font-family:' + FUENTE + ';font-size:30px;font-weight:700;fill:' + T.texto + '}.eg-svg-unidad{font-size:16px;font-weight:600}',
    '.eg-svg-eje{font-family:' + FUENTE + ';font-size:11px;fill:' + T.textoSecundario + '}.eg-svg-fuerte{font-family:' + FUENTE + ';font-size:11px;font-weight:600;fill:' + T.texto + '}',
    '.eg-dist{display:flex;height:16px}.eg-dist-real{background:' + T.actual + ';border-radius:2px 0 0 2px}',
    '.eg-dist-resto{border:1.5px dashed ' + T.base + ';border-left:0;border-radius:0 2px 2px 0}',
    '.eg-distancia .eg-valor{min-width:64px}',
    '.eg-celda-lista span{display:block}.eg-celda-lista b{font-weight:600}',
    /* Tabla */
    '.eg-tabla-envoltura{overflow-x:auto;margin:0 -2px}',
    '.eg-tabla{width:100%;border-collapse:collapse;font-size:11px;line-height:14px;font-variant-numeric:tabular-nums;color:' + T.texto + '}',
    '.eg-tabla th{background:' + P.neutro100 + ';color:' + T.leyenda + ';font-weight:600;text-align:left;padding:8px 10px;border-bottom:1px solid ' + T.base + ';white-space:nowrap}',
    '.eg-tabla td{padding:7px 10px;border-bottom:1px solid ' + T.rejilla + ';white-space:nowrap;vertical-align:middle}',
    '.eg-tabla .eg-num{text-align:right}',
    '.eg-tabla .eg-vacia{color:' + T.textoSecundario + '}',
    '.eg-celda-barra{width:45%;min-width:140px}',
    '.eg-celda-barra .eg-tb{display:inline-block;width:calc(100% - 52px);height:10px;vertical-align:middle}',
    '.eg-celda-barra .eg-tb span{display:block;height:100%;background:' + T.actual + ';border-radius:0 2px 2px 0}',
    '.eg-celda-barra b{display:inline-block;width:52px;text-align:right;font-weight:600;vertical-align:middle}',
    '@container (max-width:360px){.eg-tabla th,.eg-tabla td{padding-left:6px;padding-right:6px}}',
    '.eg-estado{display:inline-flex;align-items:center;gap:4px;height:22px;padding:0 10px 0 6px;border-radius:11px;font-weight:600}',
    Object.keys(ESTADOS).map(function (k) { return '.eg-estado-' + k + '{background:' + ESTADOS[k].fondo + ';color:' + ESTADOS[k].color + '}'; }).join('\n'),
    /* Procesos y conversión */
    '.eg-pipe{display:grid;grid-template-columns:repeat(var(--n),minmax(56px,1fr));gap:7px;align-items:start;overflow-x:auto}',
    '.eg-pipe header{display:flex;align-items:baseline;justify-content:space-between;gap:6px;padding-bottom:5px;margin-bottom:10px;border-bottom:2px solid ' + T.base + ';font-size:11px;line-height:14px}',
    '.eg-pipe header b{font-weight:600;color:' + T.texto + ';min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.eg-pipe header span{flex:none;color:' + T.textoSecundario + '}',
    '.eg-pipe-foco header{border-bottom-color:' + T.actual + '}',
    '.eg-pipe ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}',
    '.eg-pipe li{display:flex;align-items:center;justify-content:space-between;gap:6px;height:24px;min-width:0;padding:0 8px;border:1px solid ' + P.neutro300 + ';border-radius:4px;background:' + P.neutro100 + ';font-size:11px;line-height:14px;color:' + T.leyenda + ';white-space:nowrap}',
    '.eg-pipe li span,.eg-pipe li b{min-width:0;max-width:100%;overflow:hidden;text-overflow:ellipsis}.eg-pipe li b{font-weight:600}',
    '.eg-pipe li.eg-pipe-dos{flex-direction:column;align-items:flex-start;justify-content:center;gap:0;height:38px}',
    '.eg-pipe-foco li{background:' + T.actual + ';border-color:' + T.actual + ';color:' + T.texto + '}',
    '.eg-pipe li.eg-pipe-mas{height:auto;padding:2px 0 0;border:0;background:none;color:' + T.textoSecundario + '}',
    '.eg-etapas-progresion .eg-cuerpo{display:flex;flex-direction:column;justify-content:center}',
    '.eg-prog{display:flex;flex-direction:column;gap:30px;padding:8px 0}',
    '.eg-prog-pasos{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr))}',
    '.eg-prog-pasos li{position:relative;display:flex;flex-direction:column;align-items:center;gap:11px;min-width:0;font-size:11px;line-height:14px;color:' + T.textoSecundario + '}',
    '.eg-prog-pasos li::before{content:"";position:absolute;top:10.5px;left:-50%;width:100%;height:3px;background:' + T.actual + '}',
    '.eg-prog-pasos li:first-child::before{display:none}.eg-prog-pasos li.eg-falta::before{background:' + P.neutro300 + '}',
    '.eg-prog-pasos i{position:relative;z-index:1;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:' + P.neutro300 + '}',
    '.eg-prog-pasos i svg{display:block;width:24px;height:24px}.eg-prog-pasos .eg-hecho i{background:' + T.actual + '}',
    '.eg-prog-pasos .eg-actual i{background:' + T.fondo + ';box-shadow:inset 0 0 0 3px ' + T.actual + '}',
    '.eg-prog-pasos .eg-actual i::after{content:"";width:8px;height:8px;border-radius:50%;background:' + T.actual + '}',
    '.eg-prog-pasos span{max-width:100%;padding:0 1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.eg-prog-pasos .eg-actual span{color:' + T.texto + ';font-weight:600}',
    '.eg-prog-pie{display:flex;flex-direction:column;gap:7px;padding:0 calc(50% / var(--n))}.eg-prog-pie b{font-weight:600}',
    '.eg-prog .eg-pista{height:10px;border-radius:5px}.eg-prog .eg-barra{border-radius:5px}',
    /* Temporal especializado */
    '.eg-hitos{list-style:none;margin:0;padding:2px 0 0;display:flex;flex-direction:column}',
    '.eg-hitos li{display:grid;grid-template-columns:var(--f) 18px minmax(0,1fr) auto;column-gap:12px;align-items:start;min-height:40px;font-size:11px;line-height:18px;color:' + T.texto + '}',
    '.eg-hito-fecha{font-weight:600;white-space:nowrap}',
    '.eg-hito-eje{position:relative;align-self:stretch}',
    '.eg-hito-eje i{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:' + P.neutro300 + ';box-shadow:0 0 0 2px ' + T.fondo + '}',
    '.eg-hito-eje i svg{display:block;width:18px;height:18px}',
    '.eg-hito-hecho .eg-hito-eje i{background:' + T.actual + '}',
    '.eg-hito-curso .eg-hito-eje i{background:' + T.fondo + ';box-shadow:inset 0 0 0 3px ' + T.actual + ',0 0 0 2px ' + T.fondo + '}',
    '.eg-hito-curso .eg-hito-eje i::after{content:"";width:7px;height:7px;border-radius:50%;background:' + T.actual + '}',
    '.eg-hitos li:not(:last-child) .eg-hito-eje::after{content:"";position:absolute;left:7.5px;top:9px;bottom:-9px;width:3px;background:' + P.neutro300 + '}',
    '.eg-hitos li.eg-hito-tramo .eg-hito-eje::after{background:' + T.actual + '}',
    '.eg-hito-texto{display:flex;flex-direction:column;min-width:0}',
    '.eg-hito-texto b{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.eg-hito-texto small{font-size:11px;line-height:14px;color:' + T.textoSecundario + ';overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.eg-hito-texto .eg-hito-fecha2{display:none;font-weight:600;color:inherit}',
    '.eg-hito-pendiente .eg-hito-fecha,.eg-hito-pendiente .eg-hito-texto b,.eg-hito-pendiente .eg-hito-texto .eg-hito-fecha2{color:' + T.textoSecundario + '}',
    '.eg-hito-estado{display:inline-flex;align-items:center;justify-content:center;min-width:72px;height:20px;padding:0 10px;border-radius:10px;font-weight:600;line-height:14px;white-space:nowrap;background:' + P.naranja100 + '}',
    '.eg-hito-curso .eg-hito-estado{background:' + T.actual + '}',
    '.eg-hito-pendiente .eg-hito-estado{background:' + P.neutro100 + ';color:' + T.textoSecundario + ';box-shadow:inset 0 0 0 1px ' + P.neutro300 + '}',
    '@container (max-width:340px){.eg-hitos li{grid-template-columns:18px minmax(0,1fr) auto}.eg-hito-fecha{display:none}.eg-hito-texto .eg-hito-fecha2{display:block;font-size:11px;line-height:18px}}',
    '.eg-cal-mes{margin:0 0 4px;font-size:11px;line-height:14px;font-weight:600;color:' + T.texto + '}',
    '.eg-cal-tabla{width:calc(100% + 4px);margin:0 -2px;border-collapse:separate;border-spacing:2px;table-layout:fixed;font-size:11px;line-height:14px;color:' + T.texto + '}',
    '.eg-cal-tabla th{font-weight:600;color:' + T.leyenda + ';text-align:center;padding:0 0 2px}',
    '.eg-cal-tabla td{position:relative;height:28px;padding:0;border:1px solid ' + P.neutro200 + ';background:' + T.fondo + ';vertical-align:middle}',
    '.eg-cal-tabla td.eg-cal-vacio{border:0;background:none}',
    '.eg-cal-tabla td.eg-cal-finde{background:' + P.neutro100 + '}',
    '.eg-cal-tabla td.eg-cal-festivo{background:' + P.neutro300 + '}',
    '.eg-cal-num{display:flex;align-items:center;justify-content:center;width:20px;height:20px;margin-left:2px;border-radius:50%}',
    '.eg-cal-hoy .eg-cal-num{background:' + T.actual + ';font-weight:600}',
    '.eg-cal-ev{position:absolute;right:8px;top:14px;width:7px;height:7px;border-radius:50%;background:' + T.actual + '}',
    '.eg-cal-ley{margin:12px 0 0}',
    '.eg-cal-ley .eg-m-hoy{width:12px;height:12px;border-radius:50%;background:' + T.actual + '}',
    '.eg-cal-ley .eg-m-ev{width:7px;height:7px;border-radius:50%;background:' + T.actual + '}',
    '.eg-dp{display:flex;align-items:stretch;gap:16px}',
    '.eg-dp-grafico{flex:1 1 auto;min-width:0}',
    '.eg-dp-lado{flex:none;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:14px;min-width:96px;max-width:46%;padding-left:16px;border-left:1px solid ' + P.neutro200 + '}',
    '.eg-dp-dato{display:flex;flex-direction:column;gap:2px;font-size:11px;line-height:14px;min-width:0}',
    '.eg-dp-dato small{font-size:11px;color:' + T.textoSecundario + '}',
    '.eg-dp-dato .eg-kpi-valor{font-size:30px;line-height:34px}.eg-dp-dato .eg-kpi-unidad{font-size:14px}',
    '.eg-dp-dato b{font-size:14px;line-height:18px;font-weight:600;color:' + T.leyenda + ';white-space:nowrap}',
    '@container (max-width:320px){.eg-dp{flex-direction:column}.eg-dp-lado{flex-direction:row;flex-wrap:wrap;align-items:flex-end;max-width:none;gap:10px 20px;padding:12px 0 0;border-left:0;border-top:1px solid ' + P.neutro200 + '}}',
    /* Jerarquía */
    '.eg-sb-centro{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;text-align:center;font-size:11px;line-height:14px}',
    '.eg-sb-centro b{font-weight:600;color:' + T.texto + '}',
    '.eg-sb-centro span{color:' + T.textoSecundario + ';white-space:nowrap}',
    '.eg-desplaza{overflow-x:auto;overflow-y:hidden}',
    '.eg-an{border-radius:8px;padding:10px 12px 12px;min-width:0}',
    '.eg-an-0{background:' + P.neutro100 + ';box-shadow:inset 0 0 0 1.5px ' + P.neutro300 + '}',
    '.eg-an-1{background:' + P.neutro200 + ';border-radius:6px}',
    '.eg-an-2{background:' + T.fondo + ';border-radius:6px;box-shadow:inset 0 0 0 1px ' + P.neutro300 + '}',
    '.eg-an-t{margin:0 0 9px;font-size:11px;line-height:14px;font-weight:600;color:' + T.texto + ';overflow-wrap:anywhere}',
    '.eg-an-raiz{display:grid;gap:12px}',
    '.eg-an-subs{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(min(100%,176px),1fr))}',
    '.eg-an-subs+.eg-an-els{margin-top:12px}',
    '.eg-an-els{list-style:none;margin:0;padding:0;display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(72px,1fr))}',
    '.eg-an-els li{display:flex;align-items:center;justify-content:center;min-width:0;min-height:44px;padding:4px 6px;background:' + T.fondo + ';border:1.5px solid ' + P.neutro300 + ';border-radius:6px;font-size:11px;line-height:14px;text-align:center;color:' + T.texto + '}',
    '.eg-an-els li span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}',
    '.eg-an-els li.eg-an-foco{background:' + T.actual + ';border-color:' + T.actual + ';font-weight:600}',
    '.eg-tj{width:100%;border-collapse:collapse;font-size:11px;line-height:14px;font-variant-numeric:tabular-nums;color:' + T.texto + '}',
    '.eg-tj th{font-weight:400;color:' + T.textoSecundario + ';background:none;border-bottom:0;text-align:left;padding:0 8px 6px;white-space:nowrap}',
    '.eg-tj td{height:26px;padding:0 8px;border-bottom:1px solid ' + P.neutro200 + ';white-space:nowrap;vertical-align:middle}',
    '.eg-tj .eg-num{text-align:right}',
    '.eg-tj td.eg-num{font-weight:600}',
    '.eg-tj-nombre{width:50%;max-width:0;overflow:hidden;text-overflow:ellipsis}',
    '.eg-tj-agr b{font-weight:600}',
    '.eg-tj-hoja .eg-tj-nombre{color:' + T.leyenda + '}',
    '.eg-tj-boton{display:inline-flex;align-items:center;justify-content:flex-start;width:14px;height:14px;margin:0;padding:0;border:0;background:none;cursor:pointer;vertical-align:-3px}',
    '.eg-tj-boton svg{transition:transform .15s}',
    '.eg-tj-boton[aria-expanded="false"] svg{transform:rotate(-90deg)}',
    '.eg-tj-boton:focus-visible{outline:2px solid ' + T.actual + ';outline-offset:1px;border-radius:2px}',
    '.eg-tj-barra{width:35%}',
    '.eg-tj-barra span{display:block;height:12px;max-width:100%;background:' + P.neutro400 + '}',
    '.eg-tj-hoja .eg-tj-barra span{background:' + T.actual + '}',
    '.eg-tj-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    '.eg-tj tr[hidden]{display:none}',
    /* Error */
    '.eg-error{border-color:' + P.error + ';border-left-width:4px}',
    '.eg-error .eg-titulo{display:flex;gap:8px;align-items:center}',
    '.eg-error ul{margin:12px 0 0;padding-left:18px;font-size:12px;line-height:17px}',
    '.eg-error li+li{margin-top:4px}'
  ].join('\n');

  function asegurarEstilos() {
    if (document.getElementById('eg-estilos')) return;
    var st = document.createElement('style');
    st.id = 'eg-estilos';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ------------------------------------------------------------------ */
  /* Utilidades de render                                                */
  /* ------------------------------------------------------------------ */
  function subtituloDe(s) {
    if (esTexto(s.subtitulo)) return s.subtitulo;
    var partes = [];
    if (esTexto(s.periodo) && s.tipo !== 'kpi') partes.push(s.periodo);
    if (s.tipo === 'barras-divergentes' && ['centro', 'desviacion', 'desviacion-pct', 'contribucion'].indexOf(s.variante) >= 0 && esTexto(s.referencia)) partes.push(s.referencia);
    if (s.tipo === 'ranking' && s.variante === 'evolucion') { partes.push('posición en el ranking'); return partes.join(' · '); }
    if (s.tipo === 'barras' && s.variante === 'apiladas-100') { partes.push('% sobre el total de cada categoría'); return partes.join(' · '); }
    if (s.tipo === 'areas' && s.variante === 'apiladas-100') { partes.push('% sobre el total de cada periodo'); return partes.join(' · '); }
    if (s.tipo === 'lineas' && s.variante === 'acumulada') partes.push('acumulado');
    if (s.tipo === 'marimekko') { partes.push('% de cada grupo · el ancho es su peso en el total'); return partes.join(' · '); }
    if (s.tipo === 'proporcion') { partes.push('% sobre el total'); return partes.join(' · '); }
    if (s.tipo === 'kpi-rejilla' || (s.tipo === 'tabla' && s.datos && s.datos.indicadores)) return partes.join(' · ');
    if (DISTRIBUCION.indexOf(s.tipo) >= 0) {
      /* Distribución: la unidad, el número de casos (si el kit los cuenta) y, en el intervalo, el nivel de confianza */
      var dd = s.datos || {};
      if (s.tipo === 'percentiles') { if (esTexto(s.referencia)) partes.push(s.referencia); if (dd.grupo != null) partes.push(enUnidad(s)); return partes.join(' · '); }
      partes.push(enUnidad(s));
      if (dd._n) partes.push(numero(dd._n) + ' ' + nombreCasos(s));
      if (s.tipo === 'rangos' && s.variante === 'intervalo') partes.push('intervalos de confianza al ' + numero(s.confianza) + NBSP + '%');
      return partes.join(' · ');
    }
    if (RELACION.indexOf(s.tipo) >= 0) {
      /* Relación: en dispersión la unidad va en el título de cada eje; el subtítulo da el número de casos */
      var dr = s.datos || {};
      if (s.tipo === 'matriz' && s.variante === 'cohortes') { partes.push(dr._recuentos ? '% sobre el primer periodo de cada cohorte' : 'en %'); return partes.join(' · '); }
      if (s.tipo === 'matriz') partes.push('coeficiente de correlación de Pearson');
      if (s.tipo === 'radar' || s.tipo === 'coordenadas-paralelas') partes.push(enUnidad(s));
      if (dr._n && !(s.tipo === 'dispersion' && s.variante === 'conectada')) partes.push(numero(dr._n) + ' ' + nombreCasos(s));
      return partes.join(' · ');
    }
    if (PROCESOS.indexOf(s.tipo) >= 0) {
      /* Procesos: la retención se mide sobre el grupo inicial; el pipeline cuenta los casos; el proceso dice en qué paso está */
      var dp = s.datos || {};
      if (s.tipo === 'embudo' && s.variante === 'retencion') partes.push('% retenido sobre ' + (s.unidad === '%' ? 'el inicio' : formatear(dp.valores[0], { unidad: s.unidad }).texto));
      else if (s.tipo === 'etapas' && s.variante === 'pipeline') {
        partes.push(numero(dp._n) + ' ' + (esTexto(s.nombreCasos) ? s.nombreCasos : (!dp._valor && esTexto(s.unidad) ? s.unidad : 'casos')));
        if (dp._valor) partes.push(enUnidad(s));
      } else if (s.tipo === 'etapas') { if (s.variante === 'proceso' && dp._k >= 0) partes.push('paso ' + (dp._k + 1) + ' de ' + dp._pasos.length); }
      else if (s.tipo === 'recorrido') partes.push(enUnidad(s), 'escala de ' + numero(dp.minimo) + ' a ' + numero(dp.maximo));
      else partes.push(enUnidad(s));
      return partes.join(' · ');
    }
    if (TEMPORAL.indexOf(s.tipo) >= 0) {
      /* Temporal: cuántos hitos o tareas hay; el calendario de calor, la magnitud por día; el ciclo de vida avisa de que la curva es un esquema */
      var dt = s.datos || {}, v = s.variante;
      if (s.tipo === 'cronologia') {
        if (v === 'vertical') partes.push(dt._ev.filter(function (x) { return x.estado === 'hecho'; }).length + ' de ' + dt._ev.length + ' hitos cumplidos');
        else partes.push(numero(dt._ev.length) + (v === 'carriles' ? ' eventos' : ' hitos'));
      } else if (s.tipo === 'gantt') partes.push(dt._tareas.length + (dt._tareas.length === 1 ? ' tarea' : ' tareas') + (dt._hitos.length ? ' · ' + dt._hitos.length + (dt._hitos.length === 1 ? ' hito' : ' hitos') : ''));
      else if (s.tipo === 'calendario' && v === 'calor') partes.push(s.unidad + ' por día');
      else if (s.tipo === 'calendario') {
        var nf = Object.keys(dt._festivos || {}).length;
        if (dt._nEventos) partes.push(dt._nEventos + (dt._nEventos === 1 ? ' evento' : ' eventos'));
        if (nf) partes.push(nf + (nf === 1 ? ' festivo' : ' festivos'));
      } else if (s.tipo === 'dos-periodos') partes.push(enUnidad(s));
      else partes.push('curva orientativa, sin escala');
      return partes.join(' · ');
    }
    if (esJerarquia(s)) {
      /* Jerarquía: con valores, la unidad y la base de los %; las estructuras, cuántos elementos hay */
      var dj = s.datos || {}, aj = dj._arbol, vj = s.variante, casos = function (def) { return esTexto(s.nombreCasos) ? s.nombreCasos : def; };
      if (s.tipo === 'arbol' && vj === 'dendrograma') {
        partes.push(dj._hojasD.length + ' ' + casos('elementos'), dj._grupos + ' grupos');
        if (!dj._calculado && esTexto(s.unidad)) partes.push(enUnidad(s));
      } else if (s.tipo === 'arbol' && vj === 'organigrama') partes.push((aj.prof + 1) + ' niveles' + (esTexto(s.nombreCasos) ? ' · ' + (aj.nodos.length + 1) + ' ' + s.nombreCasos : ''));
      else if (s.tipo === 'arbol' || s.tipo === 'anidados') partes.push(aj.hojas.length + ' ' + casos(s.tipo === 'arbol' ? 'elementos finales' : 'elementos'));
      else {
        partes.push(enUnidad(s));
        if (s.tipo === 'treemap') partes.push('% dentro de cada grupo');
        if (s.tipo === 'particion') partes.push('% sobre el total');
        if (s.tipo === 'circulos-anidados') partes.push('el área es proporcional al valor');
      }
      return partes.join(' · ');
    }
    if (FLUJO.indexOf(s.tipo) >= 0) {
      /* Flujo y relaciones: la unidad de los valores; las redes, cuántos nodos y enlaces hay; las dependencias, la ruta crítica */
      var df = s.datos || {}, gf = df._g, vf = s.variante;
      if (s.tipo === 'sankey' && vf === 'recorrido') partes.push('% sobre ' + (s.unidad === '%' ? 'el inicio' : formatear(df.valores[0], { unidad: s.unidad, abreviar: s.abreviar }).texto));
      else if (s.tipo !== 'red') partes.push(enUnidad(s));
      else if (vf === 'comunidades') partes.push(gf.nodos.length + ' nodos', gf.enlaces.length + ' conexiones', gf.comunidades.length + (gf.comunidades.length === 1 ? ' comunidad' : ' comunidades'));
      else if (vf === 'bipartita') partes.push(gf.enlaces.length + ' enlaces');
      else if (vf === 'radial') partes.push(gf.enlaces.length + ' relaciones');
      else partes.push(gf.nodos.length + ' tareas', 'ruta crítica: ' + (gf.duracionRuta != null ? formatear(gf.duracionRuta, { unidad: s.unidad, decimales: s.decimales }).texto : gf.camino.nodos.length + ' tareas'));
      return partes.join(' · ');
    }
    if (GEOGRAFIA.indexOf(s.tipo) >= 0) {
      /* Geografía: la unidad y el nivel territorial; los puntos y las celdas, cuántos casos y el tamaño de celda */
      var dg = s.datos || {}, gg = dg._geo || {}, vg = s.variante, nivel = gg.mapa === 'provincias' ? 'por provincias' : 'por comunidades autónomas';
      if (vg === 'puntos') partes.push(numero(gg.total) + ' ' + nombreCasos(s));
      else if (vg === 'rejilla' || vg === 'hexagonos') partes.push((gg.conPeso ? enUnidad(s) : numero(gg.puntos.length) + ' ' + nombreCasos(s)), (vg === 'rejilla' ? 'celdas de ' : 'hexágonos de igual área que celdas de ') + numero(gg.celda) + ' km');
      else if (vg === 'ruta') partes.push(gg.paradas.length + ' paradas');
      else if (vg === 'conexiones') partes.push(gg.nodos.length + ' lugares', gg.enlaces.length + ' conexiones');
      else if (vg === 'categorias') partes.push(nivel);
      else partes.push(enUnidad(s), nivel);
      return partes.join(' · ');
    }
    if (s.unidad) partes.push(enUnidad(s));
    return partes.join(' · ');
  }
  function enUnidad(s) { return s.abreviar && s.unidad === '€' ? 'en euros' : (s.unidad === '%' ? 'en %' : 'en ' + s.unidad); }

  /* Nota escapada; si lleva «_enlaceNota» (la atribución de los mapas), la última aparición de su texto es un enlace */
  function notaHTML(s) {
    var h = esc(s.nota), e = s._enlaceNota;
    if (!e || !esTexto(e.texto) || !/^https:\/\//.test(e.url || '')) return h;
    var t = esc(e.texto), i = h.lastIndexOf(t);
    return i < 0 ? h : h.slice(0, i) + '<a href="' + esc(e.url) + '" target="_blank" rel="noopener">' + t + '</a>' + h.slice(i + t.length);
  }

  function tarjeta(el, s, cuerpo, extraClase) {
    var esKpi = s.tipo === 'kpi';
    var sub = esKpi ? '' : subtituloDe(s);
    el.innerHTML = '<section class="eg eg-tarjeta eg-' + s.tipo + (s.variante ? ' eg-' + s.tipo + '-' + s.variante : '') + (esKpi ? ' eg-kpi' : '') + (extraClase ? ' ' + extraClase : '') + '">' +
      '<header><h3 class="eg-titulo">' + esc(s.titulo) + '</h3>' + (sub ? '<p class="eg-subtitulo">' + esc(sub) + '</p>' : '') + '</header>' +
      '<div class="eg-cuerpo">' + cuerpo + '</div>' +
      (esTexto(s.nota) ? '<p class="eg-nota">' + notaHTML(s) + '</p>' : '') +
      '</section>';
    return el.querySelector('.eg-cuerpo');
  }

  function tooltipBase() {
    return {
      backgroundColor: T.tooltip, borderWidth: 0, padding: [6, 10],
      textStyle: { color: '#FFFFFF', fontSize: 11, fontFamily: FUENTE },
      extraCssText: 'border-radius:6px;box-shadow:none;'
    };
  }

  function ejeValor() {
    return {
      type: 'value', min: 0, splitNumber: 4,
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: T.etiquetaEje, fontSize: 11, fontFamily: FUENTE, formatter: formatoEje },
      splitLine: { lineStyle: { color: T.rejilla, width: 1 } }
    };
  }

  function ejeCategoria(datos, bordes) {
    return {
      type: 'category', data: datos, boundaryGap: bordes,
      axisLine: { lineStyle: { color: T.base, width: 1 } }, axisTick: { show: false },
      axisLabel: { color: T.etiquetaEje, fontSize: 11, fontFamily: FUENTE, margin: 10, hideOverlap: true }
    };
  }

  function leyenda(mostrar) {
    return {
      show: mostrar, top: 0, left: 0, itemWidth: 8, itemHeight: 8, itemGap: 16,
      textStyle: { color: T.leyenda, fontSize: 11, fontFamily: FUENTE }
    };
  }

  function colorSerie(se, i, paleta) {
    if (se.rol === 'anterior') return T.anterior;
    if (se.rol === 'prevision') return T.prevision;
    if (se.rol === 'actual') return T.actual;
    return paleta[i % paleta.length];
  }

  /* Asigna color a cada serie: los roles usan su token; el resto, la paleta en orden. */
  function coloresSeries(series, paleta) {
    var libre = 0;
    var hayActual = series.some(function (x) { return x.rol === 'actual'; });
    return series.map(function (se) {
      if (se.rol) return colorSerie(se, 0, paleta);
      var idx = libre++;
      if (hayActual && paleta[idx % paleta.length] === T.actual) idx = libre++;
      return paleta[idx % paleta.length];
    });
  }

  var ICONO_LINEA = 'path://M0 0H16V2.5H0Z';
  var ICONO_DISCONTINUA = 'path://M0 0H4V2H0ZM6 0H10V2H6ZM12 0H16V2H12Z';

  var instancias = new WeakMap();
  /* opcion puede ser un objeto o una función (ancho, alto) => objeto; en ese caso se recalcula al cambiar el ancho */
  function montarECharts(contenedor, opcion) {
    return asegurarECharts().then(function (ec) {
      var previo = instancias.get(contenedor);
      if (previo) { previo.chart.dispose(); if (previo.ro) previo.ro.disconnect(); }
      var chart = ec.init(contenedor, null, { renderer: 'svg' });
      var dinamica = typeof opcion === 'function';
      var ancho = chart.getWidth();
      chart.setOption(dinamica ? opcion(ancho, chart.getHeight()) : opcion);
      var ro = null;
      if (global.ResizeObserver) {
        ro = new ResizeObserver(function () {
          chart.resize();
          if (dinamica && Math.abs(chart.getWidth() - ancho) > 1) {
            ancho = chart.getWidth();
            var o = opcion(ancho, chart.getHeight()); o.animation = false;
            chart.setOption(o, true);
          }
        });
        ro.observe(contenedor);
      }
      instancias.set(contenedor, { chart: chart, ro: ro });
      return chart;
    });
  }

  /* Medida de texto a 11 px con la fuente del sistema (para reservar espacio a las etiquetas) */
  var contextoMedida = null;
  function medir(txt, peso) {
    if (!contextoMedida) contextoMedida = document.createElement('canvas').getContext('2d');
    contextoMedida.font = (peso || 400) + ' 11px ' + FUENTE;
    return Math.ceil(contextoMedida.measureText(String(txt)).width);
  }
  function maxMedida(textos, peso) { return textos.reduce(function (a, t) { return Math.max(a, medir(t, peso)); }, 0); }
  function lienzo(s, alto) {
    return '<div class="eg-lienzo" role="img" aria-label="' + esc(s.titulo) + '"' + (alto ? ' style="height:' + Math.round(alto) + 'px"' : '') + '></div>';
  }
  function fmtDato(v, s) { return formatear(v, { decimales: s.decimales, abreviar: s.abreviar }).texto; }
  function conSigno(v, s) { return (v > 0 ? '+' : (v < 0 ? '\u2212' : '')) + fmtDato(Math.abs(v), s); }
  function estiloTexto(color, peso) { return { color: color, fontSize: 11, fontWeight: peso || 400, fontFamily: FUENTE }; }
  function etiquetaBarra(s, posicion) {
    return Object.assign(estiloTexto(T.etiquetaDato, 600), { show: true, position: posicion, distance: 4, formatter: function (p) { return fmtDato(Array.isArray(p.value) ? p.value[0] : p.value, s); } });
  }
  function ejeCategoriaColumnas(datos, ancho) {
    var e = ejeCategoria(datos, true);
    var banda = Math.max(28, (ancho - 48) / datos.length);
    /* Todas las etiquetas visibles: se parten por palabras; si una palabra no cabe, se recorta con «…» (el nombre completo sale en el tooltip) */
    var palabra = maxMedida([].concat.apply([], datos.map(function (t) { return String(t).split(/\s+/); })));
    e.axisLabel = Object.assign({}, e.axisLabel, { interval: 0, hideOverlap: false, width: banda - 2, overflow: palabra <= banda - 2 ? 'break' : 'truncate', ellipsis: '…', lineHeight: 13 });
    return e;
  }
  function ejeCategoriaFilas(datos, color) {
    return {
      type: 'category', inverse: true, data: datos,
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: Object.assign(estiloTexto(color || T.leyenda), { margin: 12 })
    };
  }
  function ejeValorX(desdeCero) {
    return {
      type: 'value', min: desdeCero === false ? 'dataMin' : 0, scale: desdeCero === false, splitNumber: 4,
      axisLine: { show: true, lineStyle: { color: T.base, width: 1 } }, axisTick: { show: false },
      axisLabel: Object.assign(estiloTexto(T.etiquetaEje), { formatter: formatoEje }),
      splitLine: { lineStyle: { color: T.rejilla, width: 1 } }
    };
  }
  /* Texto sobre un color de relleno, según la tabla de contraste */
  function textoSobre(color) {
    return [P.naranja600, P.naranja700, P.neutro500, P.neutro600, P.neutro700, P.neutro800].indexOf(color) >= 0 ? P.neutro000 : P.neutro700;
  }
  function ordenarPares(categorias, valores, orden, ascendente) {
    var pares = categorias.map(function (c, i) { return { nombre: c, valor: valores[i], i: i }; });
    if (orden !== 'natural') pares.sort(function (a, b) { return ascendente ? a.valor - b.valor : b.valor - a.valor; });
    return pares;
  }
  function focoPorDefecto(s, pares) {
    if (esTexto(s.destacar)) return s.destacar;
    return pares.reduce(function (a, b) { return b.valor > a.valor ? b : a; }).nombre;
  }

  /* Elementos gráficos para los componentes que se dibujan a medida (en píxeles) */
  function gTexto(txt, x, y, o) {
    o = o || {};
    return { type: 'text', silent: true, z: o.z || 20, style: { text: String(txt), x: x, y: y, fill: o.color || T.leyenda, font: (o.peso || 400) + ' 11px ' + FUENTE, align: o.align || 'left', verticalAlign: o.va || 'middle' } };
  }
  function gLinea(x1, y1, x2, y2, color, ancho, z) {
    return { type: 'line', silent: true, z: z || 1, shape: { x1: x1, y1: y1, x2: x2, y2: y2 }, style: { stroke: color, lineWidth: ancho, lineCap: 'round' } };
  }
  function gPolilinea(puntos, color, ancho, z) {
    return { type: 'polyline', silent: true, z: z || 1, shape: { points: puntos }, style: { stroke: color, lineWidth: ancho, fill: null, lineJoin: 'round', lineCap: 'round' } };
  }
  function gRect(x, y, w, h, color, r, z, borde, grosor) {
    return { type: 'rect', silent: true, z: z || 1, shape: { x: x, y: y, width: Math.max(0, w), height: h, r: r || 0 }, style: { fill: color, stroke: borde || null, lineWidth: borde ? (grosor || 1) : 0 } };
  }
  function gCirculo(cx, cy, r, color, z) {
    return { type: 'circle', silent: true, z: z || 5, shape: { cx: cx, cy: cy, r: r }, style: { fill: color } };
  }
  /* Leyenda dibujada (misma medida que la de ECharts: muestra de 8 px, texto Neutro 600, separación 16 px) */
  function gLeyenda(items, y) {
    var x = 0, els = [];
    items.forEach(function (it) {
      if (it.forma === 'linea') { els.push(gLinea(x, y, x + 14, y, it.color, 2.5, 20)); x += 19; }
      else if (it.forma === 'circulo') { els.push(gCirculo(x + 4, y, 4, it.color, 20)); x += 13; }
      else if (it.forma === 'rombo') { els.push({ type: 'polygon', silent: true, z: 20, shape: { points: [[x + 4.5, y - 4.5], [x + 9, y], [x + 4.5, y + 4.5], [x, y]] }, style: { fill: it.color } }); x += 14; }
      else { els.push(gRect(x, y - 4, 8, 8, it.color, 1.5, 20, it.borde, it.grosor)); x += 13; }
      els.push(gTexto(it.texto, x, y, { color: T.leyenda })); x += medir(it.texto) + 16;
    });
    return els;
  }
  /* Leyenda en HTML para los componentes dibujados a medida: se reparte en varias líneas si no cabe */
  function leyendaHTML(items) {
    return '<ul class="eg-leyenda-h">' + items.map(function (it) {
      var muestra = it.forma === 'linea' ? '<i class="eg-m-linea" style="background:' + it.color + '"></i>'
        : it.forma === 'discontinua' ? '<i class="eg-m-linea" style="background:repeating-linear-gradient(90deg,' + it.color + ' 0 4px,transparent 4px 6px)"></i>'
        : '<i class="eg-m" style="background:' + it.color + (it.borde ? ';box-shadow:inset 0 0 0 1px ' + it.borde : '') + '"></i>';
      return '<li>' + muestra + esc(it.texto) + '</li>';
    }).join('') + '</ul>';
  }
  /* Recoloca etiquetas verticales para que no se solapen (separación mínima en px) */
  function desolapar(ys, separacion, minimo, maximo) {
    var orden = ys.map(function (y, i) { return { y: y, i: i }; }).sort(function (a, b) { return a.y - b.y; });
    for (var k = 1; k < orden.length; k++) if (orden[k].y - orden[k - 1].y < separacion) orden[k].y = orden[k - 1].y + separacion;
    var exceso = orden.length ? orden[orden.length - 1].y - maximo : 0;
    if (exceso > 0) {
      orden[orden.length - 1].y -= exceso;
      for (k = orden.length - 2; k >= 0; k--) if (orden[k + 1].y - orden[k].y < separacion) orden[k].y = orden[k + 1].y - separacion;
    }
    var res = []; orden.forEach(function (o) { res[o.i] = Math.max(minimo, o.y); });
    return res;
  }

  function textoTooltip(nombre, filas, opc) {
    return '<div style="font-weight:600;margin-bottom:2px">' + esc(nombre) + '</div>' + filas.map(function (f) {
      return '<div style="display:flex;gap:12px;justify-content:space-between"><span style="color:#DBD5CE">' + esc(f[0]) + '</span><span style="font-weight:600">' + formatear(f[1], opc).texto + '</span></div>';
    }).join('');
  }

  /* ------------------------------------------------------------------ */
  /* Renderizadores                                                      */
  /* ------------------------------------------------------------------ */
  var R = {};

  /* ================================================================== */
  /* Familia Comparación                                                 */
  /* ================================================================== */
  function opcionesTooltip(s) { return { unidad: s.unidad, decimales: s.decimales, abreviar: s.abreviar }; }
  var SOMBRA_EJE = { type: 'shadow', shadowStyle: { color: 'rgba(219,213,206,.35)' } };

  R.barras = function (el, s) {
    if (s.variante === 'horizontales') return barrasHorizontales(el, s);
    if (s.variante === 'apiladas-100') return barrasCien(el, s);
    if (s.variante === 'con-referencia') return s.cumplimiento ? barrasCumplimiento(el, s) : barrasReferencia(el, s);
    if (s.variante === 'vs-anterior') return barrasVsAnterior(el, s);
    if (s.variante === 'vs-prevision') return barrasVsPrevision(el, s);
    return barrasColumnas(el, s);
  };

  /* verticales, agrupadas y apiladas */
  function barrasColumnas(el, s) {
    var c = tarjeta(el, s, lienzo(s));
    var d = s.datos, apiladas = s.variante === 'apiladas', multi = d.series.length > 1;
    var opc = opcionesTooltip(s);
    var colores = apiladas ? d.series.map(function (x, i) { return T.series[i % T.series.length]; }) : (multi ? coloresSeries(d.series, T.series) : [T.actual]);
    var etiquetas = !apiladas && d.categorias.length * d.series.length <= 18;
    var totales = d.categorias.map(function (x, j) { return d.series.reduce(function (a, se) { return a + se.valores[j]; }, 0); });
    var series = d.series.map(function (se, i) {
      return {
        type: 'bar', name: se.nombre, data: se.valores, stack: apiladas ? 'total' : undefined,
        barMaxWidth: apiladas ? 44 : 32, barGap: '12%', barCategoryGap: apiladas ? '40%' : '32%',
        itemStyle: apiladas ? { color: colores[i], borderColor: T.fondo, borderWidth: 1 } : { color: colores[i], borderRadius: [2, 2, 0, 0] },
        emphasis: { focus: 'none', itemStyle: { opacity: 0.9 } },
        label: Object.assign(etiquetaBarra(s, 'top'), { show: etiquetas })
      };
    });
    if (apiladas) {
      series.push({ type: 'scatter', name: '__total', data: totales, symbolSize: 0, silent: true, z: 10, label: Object.assign(etiquetaBarra(s, 'top'), { distance: 6 }) });
    }
    return montarECharts(c.firstChild, function (w) { return {
      textStyle: { fontFamily: FUENTE }, animationDuration: 500,
      legend: Object.assign(leyenda(multi), { data: d.series.map(function (x) { return x.nombre; }) }),
      grid: { left: 4, right: 8, top: multi ? 40 : 20, bottom: 4, containLabel: true },
      tooltip: Object.assign(tooltipBase(), {
        trigger: 'axis', axisPointer: SOMBRA_EJE,
        formatter: function (ps) {
          ps = ps.filter(function (p) { return p.seriesName !== '__total'; });
          var filas = ps.map(function (p) { return [p.seriesName, p.value]; });
          if (apiladas) filas.push(['Total', totales[ps[0].dataIndex]]);
          return textoTooltip(ps[0].axisValue, filas, opc);
        }
      }),
      xAxis: ejeCategoriaColumnas(d.categorias, w),
      yAxis: ejeValor(),
      series: series
    }; });
  }

  function barrasHorizontales(el, s) {
    var d = s.datos, se = d.series[0];
    var pares = ordenarPares(d.categorias, se.valores, s.orden);
    var c = tarjeta(el, s, lienzo(s, Math.max(120, pares.length * 30 + 8)));
    var opc = opcionesTooltip(s);
    return montarECharts(c.firstChild, {
      textStyle: { fontFamily: FUENTE }, animationDuration: 500,
      grid: { left: 4, right: 8, top: 4, bottom: 4, containLabel: true },
      tooltip: Object.assign(tooltipBase(), { trigger: 'axis', axisPointer: SOMBRA_EJE, formatter: function (ps) { return textoTooltip(ps[0].axisValue, [[se.nombre, ps[0].value]], opc); } }),
      xAxis: { type: 'value', min: 0, show: false, max: function (e) { return e.max * 1.16; } },
      yAxis: ejeCategoriaFilas(pares.map(function (x) { return x.nombre; })),
      series: [{
        type: 'bar', name: se.nombre, data: pares.map(function (x) { return x.valor; }),
        barMaxWidth: 14, barCategoryGap: '42%',
        itemStyle: { color: T.actual, borderRadius: [0, 2, 2, 0] }, emphasis: { focus: 'none', itemStyle: { opacity: 0.9 } },
        label: etiquetaBarra(s, 'right')
      }]
    });
  }

  function barrasCien(el, s) {
    var d = s.datos, n = d.categorias.length;
    var totales = d.categorias.map(function (x, j) { return d.series.reduce(function (a, se) { return a + se.valores[j]; }, 0); });
    var c = tarjeta(el, s, lienzo(s, Math.max(140, n * 34 + 40)));
    var opc = opcionesTooltip(s);
    return montarECharts(c.firstChild, {
      textStyle: { fontFamily: FUENTE }, animationDuration: 500,
      legend: Object.assign(leyenda(true), { data: d.series.map(function (x) { return x.nombre; }) }),
      grid: { left: 4, right: 8, top: 36, bottom: 4, containLabel: true },
      tooltip: Object.assign(tooltipBase(), {
        trigger: 'axis', axisPointer: SOMBRA_EJE,
        formatter: function (ps) {
          var j = ps[0].dataIndex;
          return '<div style="font-weight:600;margin-bottom:2px">' + esc(ps[0].axisValue) + '</div>' + ps.map(function (p) {
            return '<div style="display:flex;gap:12px;justify-content:space-between"><span style="color:#DBD5CE">' + esc(p.seriesName) + '</span><span style="font-weight:600">' +
              porcentaje(p.value, 0) + ' · ' + formatear(d.series[p.seriesIndex].valores[j], opc).texto + '</span></div>';
          }).join('') + '<div style="margin-top:2px;color:#DBD5CE">Total ' + formatear(totales[j], opc).texto + '</div>';
        }
      }),
      xAxis: { type: 'value', min: 0, max: 100, show: false },
      yAxis: ejeCategoriaFilas(d.categorias),
      series: d.series.map(function (se, i) {
        var color = T.series[i % T.series.length];
        return {
          type: 'bar', name: se.nombre, stack: 'total', barMaxWidth: 20, barCategoryGap: '38%',
          data: se.valores.map(function (v, j) { return totales[j] ? v / totales[j] * 100 : 0; }),
          itemStyle: { color: color, borderColor: T.fondo, borderWidth: 1 }, emphasis: { focus: 'none' },
          label: Object.assign(estiloTexto(textoSobre(color), 600), { show: true, position: 'inside', formatter: function (p) { return p.value >= 8 ? porcentaje(p.value, 0) : ''; } })
        };
      })
    });
  }

  function barrasReferencia(el, s) {
    var d = s.datos, se = d.series[0];
    var objetivos = Array.isArray(d.objetivos) ? d.objetivos : d.categorias.map(function () { return d.objetivos; });
    var nombreObj = esTexto(s.nombreObjetivo) ? s.nombreObjetivo : 'Objetivo';
    var c = tarjeta(el, s, lienzo(s));
    var opc = opcionesTooltip(s);
    return montarECharts(c.firstChild, function (w) { return {
      textStyle: { fontFamily: FUENTE }, animationDuration: 500,
      graphic: { elements: gLeyenda([{ texto: 'Real', color: T.actual }, { texto: nombreObj, forma: 'linea', color: T.objetivo }], 6) },
      grid: { left: 4, right: 8, top: 36, bottom: 4, containLabel: true },
      tooltip: Object.assign(tooltipBase(), {
        trigger: 'axis', axisPointer: SOMBRA_EJE,
        formatter: function (ps) {
          var j = ps[0].dataIndex, pct = objetivos[j] ? se.valores[j] / objetivos[j] * 100 : 0;
          return textoTooltip(ps[0].axisValue, [['Real', se.valores[j]], [nombreObj, objetivos[j]]], opc) + '<div style="margin-top:2px;color:#DBD5CE">' + porcentaje(pct, 0) + (nombreObj === 'Objetivo' ? ' del objetivo' : ' de «' + esc(nombreObj) + '»') + '</div>';
        }
      }),
      xAxis: ejeCategoriaColumnas(d.categorias, w),
      yAxis: ejeValor(),
      series: [
        {
          type: 'bar', name: 'Real', data: se.valores, barMaxWidth: 32, barCategoryGap: '32%',
          itemStyle: { color: T.actual, borderRadius: [2, 2, 0, 0] }, emphasis: { focus: 'none', itemStyle: { opacity: 0.9 } },
          label: Object.assign(etiquetaBarra(s, 'top'), { distance: 6 })
        },
        {
          type: 'custom', name: nombreObj, z: 5, silent: true, encode: { x: 0, y: 1 },
          data: objetivos.map(function (o, i) { return [i, o]; }),
          renderItem: function (params, api) {
            var p = api.coord([api.value(0), api.value(1)]);
            var w = Math.min(32, api.size([1, 0])[0] * 0.68) + 12;
            return { type: 'line', shape: { x1: p[0] - w / 2, y1: p[1], x2: p[0] + w / 2, y2: p[1] }, style: { stroke: T.objetivo, lineWidth: 2.5 } };
          }
        }
      ]
    }; });
  }


  /* ---- Utilidades de la familia Variación (cascada, desviación, contribución, antes y después) ---- */
  var TOTAL_VAR = P.neutro400; /* totales de la cascada y de la contribución */
  var LEYENDA_CASCADA = [{ texto: 'Aumenta', color: T.subida }, { texto: 'Disminuye', color: T.bajada }, { texto: 'Total', color: TOTAL_VAR }];
  function colorSigno(v) { return v < 0 ? T.bajada : T.subida; }
  function conSignoU(v, s) {
    var f = formatear(Math.abs(v), { unidad: s.unidad, decimales: s.decimales, abreviar: s.abreviar });
    return (v > 0 ? '+' : (v < 0 ? '\u2212' : '')) + f.texto;
  }
  function ejeConSigno(v) { return (v > 0 ? '+' : '') + formatoEje(v); }
  function sinLlaves(t) { return String(t).replace(/[{}]/g, ''); }
  function cabeceraTooltip(nombre) { return '<div style="font-weight:600;margin-bottom:2px">' + esc(nombre) + '</div>'; }
  function filaTooltip(etiqueta, valor) {
    return '<div style="display:flex;gap:12px;justify-content:space-between"><span style="color:#DBD5CE">' + esc(etiqueta) + '</span><span style="font-weight:600">' + valor + '</span></div>';
  }
  function notaTooltip(txt) { return '<div style="margin-top:2px;color:#DBD5CE">' + txt + '</div>'; }
  /* Cambio de a a b: en puntos si la unidad es %; en % relativo en el resto */
  function cambioTexto(a, b, s) {
    if (s.unidad === '%') return conSigno(b - a, s) + NBSP + 'p.' + NBSP + 'p.';
    if (!a) return '\u2013';
    var p = (b - a) / Math.abs(a) * 100, r = Math.abs(p) < 1 ? Math.round(p * 10) / 10 : Math.round(p);
    return (r > 0 ? '+' : (r < 0 ? '\u2212' : '')) + numero(Math.abs(r)) + NBSP + '%';
  }
  /* Escala de unas barras horizontales con signo y etiqueta al final de cada barra: busca los píxeles por unidad (k) y la posición
     del cero (z) más grandes con los que cada etiqueta cabe junto a su barra. items: [{ v, w }] (w, ancho de la etiqueta con su hueco);
     lados: [ancho a la izquierda del cero, ancho a la derecha] para rotular encima. Devuelve { min, max, px } (px: largo de la barra
     mayor) o null si las etiquetas no caben. */
  function escalaConEtiquetas(items, ancho, lados) {
    function z(k) {
      var bajo = lados ? lados[0] : 0, alto = ancho - (lados ? lados[1] : 0);
      items.forEach(function (it) { if (it.v < 0) bajo = Math.max(bajo, it.w - k * it.v); else alto = Math.min(alto, ancho - k * it.v - it.w); });
      return bajo <= alto ? bajo : null;
    }
    var rango = items.reduce(function (a, it) { return Math.max(a, Math.abs(it.v)); }, 0) || 1;
    var lo = 0, hi = ancho / rango;
    for (var n = 0; n < 40; n++) { var m = (lo + hi) / 2; if (z(m) != null) lo = m; else hi = m; }
    var z0 = lo > 0 ? z(lo) : null;
    return z0 == null ? null : { min: -z0 / lo, max: (ancho - z0) / lo, px: lo * rango };
  }
  var LINEA_CERO = { silent: true, symbol: 'none', animation: false, label: { show: false }, lineStyle: { color: T.base, width: 1, type: 'solid' }, data: [{ yAxis: 0 }] };

  /* Actual vs. target: barras horizontales con la marca del objetivo y el % alcanzado a la derecha */
  function barrasCumplimiento(el, s) {
    var d = s.datos, se = d.series[0], opc = opcionesTooltip(s);
    var objetivos = Array.isArray(d.objetivos) ? d.objetivos : d.categorias.map(function () { return d.objetivos; });
    var nombreObj = esTexto(s.nombreObjetivo) ? s.nombreObjetivo : 'Objetivo';
    var pcts = se.valores.map(function (v, i) { return v / objetivos[i] * 100; });
    var textos = pcts.map(function (x) { return porcentaje(x, 0); });
    var anchoPct = maxMedida(textos, 600) + 18;
    var c = tarjeta(el, s, lienzo(s, d.categorias.length * 40 + 32 + 22));
    return montarECharts(c.firstChild, {
      textStyle: { fontFamily: FUENTE }, animationDuration: 500,
      graphic: { elements: gLeyenda([{ texto: 'Real', color: T.actual }, { texto: nombreObj, forma: 'linea', color: T.objetivo }], 6) },
      grid: { left: 4, right: anchoPct, top: 32, bottom: 4, containLabel: true },
      tooltip: Object.assign(tooltipBase(), {
        trigger: 'axis', axisPointer: SOMBRA_EJE,
        formatter: function (ps) {
          var j = ps[0].dataIndex;
          return textoTooltip(d.categorias[j], [['Real', se.valores[j]], [nombreObj, objetivos[j]]], opc) + notaTooltip(textos[j] + (nombreObj === 'Objetivo' ? ' del objetivo' : ' de «' + esc(nombreObj) + '»'));
        }
      }),
      xAxis: { type: 'value', min: 0, splitNumber: 3, axisLine: { show: false }, axisTick: { show: false }, axisLabel: Object.assign(estiloTexto(T.etiquetaEje), { formatter: formatoEje }), splitLine: { lineStyle: { color: T.rejilla, width: 1 } } },
      yAxis: Object.assign(ejeCategoriaFilas(d.categorias, T.etiquetaEje), { axisLine: { show: true, onZero: false, lineStyle: { color: T.base, width: 1 } } }),
      series: [
        { type: 'bar', name: 'Real', data: se.valores, barMaxWidth: 20, barCategoryGap: '50%', itemStyle: { color: T.actual, borderRadius: [0, 2, 2, 0] }, emphasis: { focus: 'none', itemStyle: { opacity: 0.9 } } },
        {
          type: 'custom', name: nombreObj, z: 5, silent: true, encode: { x: 1, y: 0 },
          data: objetivos.map(function (o, i) { return [i, o]; }),
          renderItem: function (params, api) {
            var i = params.dataIndex, p = api.coord([api.value(1), i]), alto = Math.min(20, api.size([0, 1])[1] * 0.5) + 8, xm = Math.round(p[0]);
            return { type: 'group', children: [
              { type: 'line', shape: { x1: xm, y1: p[1] - alto / 2, x2: xm, y2: p[1] + alto / 2 }, style: { stroke: T.objetivo, lineWidth: 2.5 } },
              { type: 'text', silent: true, style: { text: textos[i], x: api.getWidth() - 2, y: p[1], align: 'right', verticalAlign: 'middle', fill: T.etiquetaDato, font: '600 11px ' + FUENTE } }
            ] };
          }
        }
      ]
    });
  }

  /* Actual vs. previous period: columnas del periodo actual y línea del anterior */
  function barrasVsAnterior(el, s) {
    var d = s.datos, A = d.series[0], B = d.series[1], opc = opcionesTooltip(s);
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.firstChild, function (w) { return {
      textStyle: { fontFamily: FUENTE }, animationDuration: 500,
      graphic: { elements: gLeyenda([{ texto: A.nombre, color: T.actual }, { texto: B.nombre, forma: 'linea', color: T.anterior }], 6) },
      grid: { left: 4, right: 8, top: 36, bottom: 4, containLabel: true },
      tooltip: Object.assign(tooltipBase(), {
        trigger: 'axis', axisPointer: SOMBRA_EJE,
        formatter: function (ps) {
          var j = ps[0].dataIndex;
          return textoTooltip(d.categorias[j], [[A.nombre, A.valores[j]], [B.nombre, B.valores[j]]], opc) + notaTooltip('Cambio ' + cambioTexto(B.valores[j], A.valores[j], s));
        }
      }),
      xAxis: ejeCategoriaColumnas(d.categorias, w),
      yAxis: ejeValor(),
      series: [
        { type: 'bar', name: A.nombre, data: A.valores, barMaxWidth: 30, barCategoryGap: '32%', itemStyle: { color: T.actual, borderRadius: [2, 2, 0, 0] }, emphasis: { focus: 'none', itemStyle: { opacity: 0.9 } } },
        { type: 'line', name: B.nombre, data: B.valores, z: 5, symbol: 'circle', symbolSize: 8, showSymbol: true, lineStyle: { color: T.anterior, width: 2.5, cap: 'round', join: 'round' }, itemStyle: { color: T.anterior, borderColor: T.fondo, borderWidth: 1.5 }, emphasis: { disabled: true } }
      ]
    }; });
  }

  /* Actual vs. forecast: lo real en columna sólida y la previsión con borde discontinuo, sin relleno */
  function barrasVsPrevision(el, s) {
    var d = s.datos, real = d.series[0].valores, k = real.length, pv = d.prevision, opc = opcionesTooltip(s);
    var valores = real.concat(pv.valores);
    if (!esTexto(s.nota)) s.nota = 'Previsión: ' + pv.origen + '.';
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.firstChild, function (w) { return {
      textStyle: { fontFamily: FUENTE }, animationDuration: 500,
      graphic: { elements: gLeyenda([{ texto: 'Real', color: T.actual }, { texto: 'Previsión', color: T.fondo, borde: T.prevision, grosor: 1.5 }], 6) },
      grid: { left: 4, right: 8, top: 40, bottom: 4, containLabel: true },
      tooltip: Object.assign(tooltipBase(), {
        trigger: 'axis', axisPointer: SOMBRA_EJE,
        formatter: function (ps) { var j = ps[0].dataIndex; return cabeceraTooltip(d.categorias[j]) + filaTooltip(j < k ? 'Real' : 'Previsión', formatear(valores[j], opc).texto); }
      }),
      xAxis: ejeCategoriaColumnas(d.categorias, w),
      yAxis: ejeValor(),
      series: [
        {
          type: 'bar', name: 'Real', barMaxWidth: 30, barCategoryGap: '32%', emphasis: { focus: 'none', itemStyle: { opacity: 0.9 } },
          data: valores.map(function (v, j) {
            return j < k ? { value: v, itemStyle: { color: T.actual, borderRadius: [2, 2, 0, 0] } }
              : { value: v, itemStyle: { color: T.fondo, borderColor: T.prevision, borderWidth: 2, borderType: [4, 3], borderRadius: [2, 2, 0, 0] } };
          }),
          label: Object.assign(etiquetaBarra(s, 'top'), { distance: 5 }), labelLayout: { hideOverlap: true }
        },
        {
          type: 'custom', name: '__division', silent: true, z: 1, data: [[0, 0]],
          renderItem: function (params, api) {
            var xm = Math.round((api.coord([k - 1, 0])[0] + api.coord([k, 0])[0]) / 2) + 0.5, cs = params.coordSys;
            return { type: 'line', shape: { x1: xm, y1: cs.y, x2: xm, y2: cs.y + cs.height }, style: { stroke: T.base, lineWidth: 1, lineDash: [3, 3] } };
          }
        }
      ]
    }; });
  }

  R['barras-divergentes'] = function (el, s) {
    if (s.variante === 'piramide') return piramide(el, s);
    if (s.variante === 'desviacion' || s.variante === 'desviacion-pct') return s.datos._columnas ? desviacionColumnas(el, s) : desviacionFilas(el, s);
    if (s.variante === 'contribucion') return contribucion(el, s);
    return divergentes(el, s);
  };

  function divergentes(el, s) {
    var d = s.datos;
    var conEstados = s.variante === 'desviacion-objetivo';
    var pares = ordenarPares(d.categorias, d.valores, s.orden || (conEstados ? 'natural' : 'valor'), true);
    var maxAbs = pares.reduce(function (a, x) { return Math.max(a, Math.abs(x.valor)); }, 0) || 1;
    function color(v) {
      if (conEstados) return v >= 0 ? P.exito : (v >= s.limiteRiesgo ? P.alerta : P.error);
      var fuerte = Math.abs(v) > maxAbs / 2; return v < 0 ? (fuerte ? P.neutro500 : P.neutro400) : (fuerte ? P.naranja700 : P.naranja400);
    }
    var sufijo = conEstados && s.unidad === '%' ? NBSP + '%' : '';
    var min = Math.min(0, pares.reduce(function (a, x) { return Math.min(a, x.valor); }, 0));
    var max = Math.max(0, pares.reduce(function (a, x) { return Math.max(a, x.valor); }, 0));
    var margen = (max - min) * 0.2;
    var c = tarjeta(el, s, (conEstados ? leyendaHTML([{ texto: 'En objetivo', color: P.exito }, { texto: 'En riesgo', color: P.alerta }, { texto: 'Fuera de objetivo', color: P.error }]) : '') + lienzo(s, Math.max(120, pares.length * 28 + 8)));
    return montarECharts(c.querySelector('.eg-lienzo'), {
      textStyle: { fontFamily: FUENTE }, animationDuration: 500,
      grid: { left: 4, right: 8, top: 4, bottom: 4, containLabel: true },
      tooltip: Object.assign(tooltipBase(), {
        trigger: 'axis', axisPointer: SOMBRA_EJE,
        formatter: function (ps) { return '<div style="font-weight:600">' + esc(ps[0].axisValue) + '</div><div>' + conSigno(ps[0].value, s) + (s.unidad ? NBSP + esc(s.unidad) : '') + ' ' + esc(s.referencia) + '</div>'; }
      }),
      xAxis: { type: 'value', show: false, min: min < 0 ? min - margen : 0, max: max > 0 ? max + margen : 0 },
      yAxis: Object.assign(ejeCategoriaFilas(pares.map(function (x) { return x.nombre; }), T.etiquetaEje), { axisLine: { show: false, onZero: false } }),
      series: [{
        type: 'bar', barMaxWidth: 14, barCategoryGap: '40%', emphasis: { focus: 'none' },
        data: pares.map(function (x) {
          return { value: x.valor, itemStyle: { color: color(x.valor), borderRadius: x.valor < 0 ? [2, 0, 0, 2] : [0, 2, 2, 0] }, label: { position: x.valor < 0 ? 'left' : 'right' } };
        }),
        label: Object.assign(estiloTexto(T.etiquetaDato, 600), { show: true, distance: 4, formatter: function (p) { return conSigno(p.value, s) + sufijo; } }),
        markLine: { silent: true, symbol: 'none', animation: false, label: { show: false }, lineStyle: { color: T.base, width: 1, type: 'solid' }, data: [{ xAxis: 0 }] }
      }]
    });
  }

  /* Barras horizontales con signo (desviación por categoría y contribución). filas: [{ nombre, valor, total }] */
  function filasConSigno(el, s, filas, o) {
    var arriba = o.lados ? 22 : 4;
    var c = tarjeta(el, s, lienzo(s, filas.length * o.paso + arriba + 4));
    var etiquetas = [], conLados = !!o.lados;
    var anchoNombres = Math.max(maxMedida(filas.filter(function (f) { return !f.total; }).map(function (f) { return f.nombre; })), maxMedida(filas.filter(function (f) { return f.total; }).map(function (f) { return f.nombre; }), 600));
    var lados = o.lados ? [medir(o.lados[0]) + 10, medir(o.lados[1]) + 10] : null;
    /* Con poco ancho se renuncia, por este orden, a los rótulos de lado y a la unidad en las etiquetas (ya está en el subtítulo) */
    function disposicion(ancho) {
      var intentos = [[!!o.lados, o.conUnidad], [false, o.conUnidad], [false, false]], mejor = null;
      for (var q = 0; q < intentos.length; q++) {
        var cl = intentos[q][0], cu = intentos[q][1];
        if (q && cl === intentos[q - 1][0] && cu === intentos[q - 1][1]) continue;
        var txt = filas.map(function (f) { return cu ? conSignoU(f.valor, s) : conSigno(f.valor, s); });
        var e = escalaConEtiquetas(filas.map(function (f, i) { return { v: f.valor, w: medir(txt[i], 600) + 8 }; }), ancho, cl ? lados : null);
        var r = { escala: e || { min: -1, max: 1, px: 0 }, textos: txt, lados: cl };
        if (!mejor || r.escala.px > mejor.escala.px) mejor = r;
        if (e && e.px >= ancho * 0.3) return r;
      }
      return mejor;
    }
    return montarECharts(c.firstChild, function (w) {
      /* Los nombres ocupan como mucho el 40 % del ancho; si no caben, se recortan con «…» (el nombre completo sale en el tooltip) */
      var maxNombres = Math.max(60, Math.round(w * 0.4)), recorte = anchoNombres > maxNombres;
      var izquierda = Math.min(anchoNombres, maxNombres) + 16;
      var disp = disposicion(Math.max(40, w - izquierda - 4)), escala = disp.escala;
      etiquetas = disp.textos; conLados = disp.lados;
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        grid: { left: izquierda, right: 4, top: arriba, bottom: 4 },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (p) { var f = filas[p.dataIndex]; return cabeceraTooltip(f.nombre) + '<div>' + conSignoU(f.valor, s) + (esTexto(s.referencia) ? ' ' + esc(s.referencia) : '') + '</div>'; }
        }),
        xAxis: { type: 'value', show: false, min: escala.min, max: escala.max },
        yAxis: {
          type: 'category', inverse: true, data: filas.map(function (f) { return f.nombre; }), axisLine: { show: false, onZero: false }, axisTick: { show: false },
          axisLabel: Object.assign(estiloTexto(o.colorEtiqueta), { align: 'left', margin: izquierda, formatter: function (v, i) {
            var f = filas[i], txt = sinLlaves(recorte ? recortar(v, maxNombres, f && f.total ? 600 : 400) : v);
            return f && f.total ? '{t|' + txt + '}' : txt;
          }, rich: { t: estiloTexto(T.texto, 600) } })
        },
        series: [{
          type: 'custom', encode: { x: 1, y: 0 }, data: filas.map(function (f, i) { return [i, f.valor]; }),
          renderItem: function (params, api) {
            var i = params.dataIndex, f = filas[i];
            var p0 = api.coord([0, i]), p1 = api.coord([f.valor, i]);
            var banda = api.size([0, 1])[1], alto = Math.min(22, banda * 0.78);
            var x = Math.min(p0[0], p1[0]), ancho = Math.abs(p1[0] - p0[0]), neg = f.valor < 0;
            var hijos = [
              { type: 'rect', shape: { x: x, y: p0[1] - alto / 2, width: ancho, height: alto, r: neg ? [2, 0, 0, 2] : [0, 2, 2, 0] }, style: { fill: f.total ? TOTAL_VAR : colorSigno(f.valor) } },
              { type: 'text', silent: true, style: { text: etiquetas[i], x: neg ? x - 6 : x + ancho + 6, y: p0[1], align: neg ? 'right' : 'left', verticalAlign: 'middle', fill: T.etiquetaDato, font: '600 11px ' + FUENTE } }
            ];
            if (f.total) { var ys = Math.round(p0[1] - banda / 2) + 0.5; hijos.push({ type: 'line', silent: true, shape: { x1: 0, y1: ys, x2: api.getWidth(), y2: ys }, style: { stroke: P.neutro300, lineWidth: 1 } }); }
            if (i === 0) {
              var cs = params.coordSys, xz = Math.round(p0[0]) + 0.5;
              hijos.push({ type: 'line', silent: true, z2: 10, shape: { x1: xz, y1: cs.y - (conLados ? 18 : 0), x2: xz, y2: cs.y + cs.height }, style: { stroke: T.base, lineWidth: 1 } });
              if (conLados) {
                hijos.push({ type: 'text', silent: true, style: { text: o.lados[0], x: xz - 8, y: cs.y - 12, align: 'right', verticalAlign: 'middle', fill: T.etiquetaEje, font: '400 11px ' + FUENTE } });
                hijos.push({ type: 'text', silent: true, style: { text: o.lados[1], x: xz + 8, y: cs.y - 12, align: 'left', verticalAlign: 'middle', fill: T.etiquetaEje, font: '400 11px ' + FUENTE } });
              }
            }
            return { type: 'group', children: hijos };
          }
        }]
      };
    });
  }

  /* Variance chart: desviación de cada categoría frente a la referencia */
  function desviacionFilas(el, s) {
    var d = s.datos;
    var filas = ordenarPares(d.categorias, d.valores, s.orden || 'natural').map(function (x) { return { nombre: x.nombre, valor: x.valor }; });
    return filasConSigno(el, s, filas, { paso: 28, lados: s.lados || ['Por debajo', 'Por encima'], conUnidad: false, colorEtiqueta: T.etiquetaEje });
  }

  /* Contribution chart: factores de mayor a menor magnitud («Otros» al final) y el total del cambio */
  function contribucion(el, s) {
    var d = s.datos;
    var filas = d.categorias.map(function (c, i) { return { nombre: c, valor: d.valores[i], otros: /^(otros|otras|resto)\b/i.test(c) }; });
    if (s.orden !== 'natural') {
      filas = filas.filter(function (f) { return !f.otros; }).sort(function (a, b) { return Math.abs(b.valor) - Math.abs(a.valor); })
        .concat(filas.filter(function (f) { return f.otros; }));
    }
    filas.push({ nombre: esTexto(s.nombreTotal) ? s.nombreTotal : 'Total', valor: esNum(d.total) ? d.total : suma(d.valores), total: true });
    return filasConSigno(el, s, filas, { paso: 30, conUnidad: true, colorEtiqueta: T.leyenda });
  }

  /* Absolute variance (columnas) y Percentage variance (piruletas) sobre y bajo el cero */
  function desviacionColumnas(el, s) {
    var d = s.datos, pct = s.variante === 'desviacion-pct';
    var c = tarjeta(el, s, lienzo(s));
    var etiqueta = Object.assign(estiloTexto(T.etiquetaDato, 600), { show: true, distance: 4, formatter: function (p) { return conSigno(d.valores[p.dataIndex], s); } });
    return montarECharts(c.firstChild, function (w) {
      var eje = ejeValor(); delete eje.min;
      eje.axisLabel = Object.assign({}, eje.axisLabel, { formatter: ejeConSigno });
      var series = pct ? [
        { type: 'bar', silent: true, barWidth: 2, tooltip: { show: false }, markLine: LINEA_CERO, data: d.valores.map(function (v) { return { value: v, itemStyle: { color: colorSigno(v) } }; }) },
        {
          type: 'scatter', z: 4, symbolSize: 12, emphasis: { scale: false }, label: etiqueta, labelLayout: { hideOverlap: true },
          data: d.valores.map(function (v, i) { return { value: [d.categorias[i], v], itemStyle: { color: colorSigno(v), borderColor: T.fondo, borderWidth: 1.5 }, label: { position: v < 0 ? 'bottom' : 'top' } }; })
        }
      ] : [{
        type: 'bar', barMaxWidth: 30, barCategoryGap: '32%', emphasis: { focus: 'none', itemStyle: { opacity: 0.9 } }, label: etiqueta, labelLayout: { hideOverlap: true }, markLine: LINEA_CERO,
        data: d.valores.map(function (v) { return { value: v, itemStyle: { color: colorSigno(v), borderRadius: v < 0 ? [0, 0, 2, 2] : [2, 2, 0, 0] }, label: { position: v < 0 ? 'bottom' : 'top' } }; })
      }];
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        grid: { left: 4, right: 8, top: 24, bottom: 4, containLabel: true },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'axis', axisPointer: pct ? { type: 'line', lineStyle: { color: T.base, width: 1 } } : SOMBRA_EJE,
          formatter: function (ps) { var i = ps[0].dataIndex; return cabeceraTooltip(d.categorias[i]) + '<div>' + conSignoU(d.valores[i], s) + ' ' + esc(s.referencia) + '</div>'; }
        }),
        xAxis: Object.assign(ejeCategoriaColumnas(d.categorias, w), { axisLine: { show: false, onZero: false } }),
        yAxis: eje,
        series: series
      };
    });
  }

  function piramide(el, s) {
    var d = s.datos, A = d.series[0], B = d.series[1];
    var M = Math.max.apply(null, A.valores.concat(B.valores)) || 1;
    var anchoCat = maxMedida(d.categorias) + 28;
    var anchoValor = maxMedida(A.valores.concat(B.valores).map(function (v) { return fmtDato(v, s); }), 600) + 10;
    var c = tarjeta(el, s, lienzo(s, Math.max(140, d.categorias.length * 28 + 40)));
    var opc = opcionesTooltip(s);
    return montarECharts(c.firstChild, function (w) {
      var mitad = Math.max(40, (w - anchoCat) / 2);
      var eje = { type: 'category', inverse: true, data: d.categorias, axisLine: { show: false }, axisTick: { show: false } };
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        legend: Object.assign(leyenda(true), { data: [A.nombre, B.nombre] }),
        tooltip: Object.assign(tooltipBase(), { trigger: 'item', formatter: function (p) { return textoTooltip(p.name, [[p.seriesName, p.value]], opc); } }),
        grid: [
          { left: anchoValor, width: Math.max(10, mitad - anchoValor), top: 36, bottom: 4 },
          { left: mitad + anchoCat, width: Math.max(10, mitad - anchoValor), top: 36, bottom: 4 }
        ],
        xAxis: [
          { gridIndex: 0, type: 'value', inverse: true, min: 0, max: M, show: false },
          { gridIndex: 1, type: 'value', min: 0, max: M, show: false }
        ],
        yAxis: [
          Object.assign({ gridIndex: 0, axisLabel: { show: false } }, eje),
          Object.assign({ gridIndex: 1, position: 'left', axisLabel: Object.assign(estiloTexto(T.leyenda), { margin: anchoCat / 2, align: 'center' }) }, eje)
        ],
        series: [
          { type: 'bar', name: A.nombre, xAxisIndex: 0, yAxisIndex: 0, data: A.valores, barMaxWidth: 16, barCategoryGap: '35%', itemStyle: { color: T.actual, borderRadius: [2, 0, 0, 2] }, emphasis: { focus: 'none' }, label: etiquetaBarra(s, 'left') },
          { type: 'bar', name: B.nombre, xAxisIndex: 1, yAxisIndex: 1, data: B.valores, barMaxWidth: 16, barCategoryGap: '35%', itemStyle: { color: P.neutro600, borderRadius: [0, 2, 2, 0] }, emphasis: { focus: 'none' }, label: etiquetaBarra(s, 'right') }
        ]
      };
    });
  }

  R.puntos = function (el, s) {
    var d = s.datos, opc = opcionesTooltip(s);
    var piruleta = s.variante === 'piruleta';
    var pares = ordenarPares(d.categorias, d.valores, s.orden || (piruleta ? 'natural' : 'valor'));
    var foco = focoPorDefecto(s, pares);
    var tooltip = Object.assign(tooltipBase(), { trigger: 'item', formatter: function (p) { var x = pares[p.dataIndex]; return textoTooltip(x.nombre, [[s.titulo, x.valor]], opc); } });
    var etiqueta = Object.assign(estiloTexto(T.etiquetaDato, 600), { show: true, formatter: function (p) { return fmtDato(pares[p.dataIndex].valor, s); } });
    if (!piruleta) {
      var c = tarjeta(el, s, lienzo(s, Math.max(140, pares.length * 26 + 36)));
      return montarECharts(c.firstChild, {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500, tooltip: tooltip,
        grid: { left: 4, right: 36, top: 8, bottom: 4, containLabel: true },
        xAxis: ejeValorX(s.ejeDesdeCero),
        yAxis: ejeCategoriaFilas(pares.map(function (x) { return x.nombre; }), T.etiquetaEje),
        series: [{
          type: 'scatter', emphasis: { scale: false },
          data: pares.map(function (x) { var f = x.nombre === foco; return { value: [x.valor, x.nombre], symbolSize: f ? 14 : 10, itemStyle: { color: f ? T.actual : T.anterior }, z: f ? 4 : 3 }; }),
          label: Object.assign(etiqueta, { position: 'right', distance: 6 })
        }]
      });
    }
    var c2 = tarjeta(el, s, lienzo(s));
    return montarECharts(c2.firstChild, function (w) { return {
      textStyle: { fontFamily: FUENTE }, animationDuration: 500, tooltip: tooltip,
      grid: { left: 4, right: 8, top: 24, bottom: 4, containLabel: true },
      xAxis: ejeCategoriaColumnas(pares.map(function (x) { return x.nombre; }), w),
      yAxis: ejeValor(),
      series: [
        { type: 'bar', silent: true, barWidth: 2, tooltip: { show: false }, data: pares.map(function (x) { return { value: x.valor, itemStyle: { color: x.nombre === foco ? T.actual : T.anterior } }; }) },
        {
          type: 'scatter', emphasis: { scale: false }, z: 4,
          data: pares.map(function (x) { var f = x.nombre === foco; return { value: [x.nombre, x.valor], symbolSize: f ? 14 : 10, itemStyle: { color: f ? T.actual : T.anterior } }; }),
          label: Object.assign(etiqueta, { position: 'top', distance: 6 })
        }
      ]
    }; });
  };

  R['dos-momentos'] = function (el, s) {
    if (s.variante === 'antes-despues') return antesDespues(el, s);
    return s.variante === 'pendiente' ? pendiente(el, s) : pesas(el, s);
  };

  function pesas(el, s) {
    var d = s.datos, A = d.series[0], B = d.series[1], opc = opcionesTooltip(s);
    var c = tarjeta(el, s, lienzo(s, Math.max(150, d.categorias.length * 30 + 52)));
    return montarECharts(c.firstChild, {
      textStyle: { fontFamily: FUENTE }, animationDuration: 500,
      legend: Object.assign(leyenda(true), { data: [{ name: A.nombre, icon: 'circle' }, { name: B.nombre, icon: 'circle' }] }),
      grid: { left: 4, right: 16, top: 36, bottom: 4, containLabel: true },
      tooltip: Object.assign(tooltipBase(), {
        trigger: 'item', formatter: function (p) {
          var i = p.dataIndex, dif = B.valores[i] - A.valores[i];
          return textoTooltip(d.categorias[i], [[A.nombre, A.valores[i]], [B.nombre, B.valores[i]]], opc) + '<div style="margin-top:2px;color:#DBD5CE">Cambio ' + conSigno(dif, s) + (s.unidad === '%' ? NBSP + 'p.' + NBSP + 'p.' : NBSP + esc(s.unidad)) + '</div>';
        }
      }),
      xAxis: ejeValorX(s.ejeDesdeCero),
      yAxis: ejeCategoriaFilas(d.categorias),
      series: [
        {
          type: 'custom', name: '__conector', silent: true, z: 1, encode: { x: [0, 1], y: 2 },
          data: d.categorias.map(function (x, i) { return [A.valores[i], B.valores[i], i]; }),
          renderItem: function (params, api) {
            var p1 = api.coord([api.value(0), api.value(2)]), p2 = api.coord([api.value(1), api.value(2)]);
            return { type: 'line', shape: { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1] }, style: { stroke: P.neutro300, lineWidth: 4, lineCap: 'round' } };
          }
        },
        { type: 'scatter', name: A.nombre, z: 3, symbolSize: 10, itemStyle: { color: T.anterior }, emphasis: { scale: false }, data: A.valores.map(function (v, i) { return [v, d.categorias[i]]; }) },
        { type: 'scatter', name: B.nombre, z: 4, symbolSize: 10, itemStyle: { color: T.actual }, emphasis: { scale: false }, data: B.valores.map(function (v, i) { return [v, d.categorias[i]]; }) }
      ]
    });
  }

  function pendiente(el, s) {
    var d = s.datos, A = d.series[0], B = d.series[1], cats = d.categorias;
    var foco = esTexto(s.destacar) ? s.destacar : cats.reduce(function (a, x, i) {
      return Math.abs(B.valores[i] - A.valores[i]) > Math.abs(B.valores[a] - A.valores[a]) ? i : a;
    }, 0);
    if (typeof foco === 'number') foco = cats[foco];
    var izqLarga = cats.map(function (x, i) { return x + ' · ' + fmtDato(A.valores[i], s); });
    var izqCorta = cats.map(function (x, i) { return fmtDato(A.valores[i], s); });
    var der = cats.map(function (x, i) { return fmtDato(B.valores[i], s) + ' · ' + x; });
    var anchoLarga = maxMedida(izqLarga, 600), anchoCorta = maxMedida(izqCorta, 600), anchoD = maxMedida(der, 600);
    var todos = A.valores.concat(B.valores);
    var min = Math.min.apply(null, todos), max = Math.max.apply(null, todos);
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.firstChild, function (w, h) {
      /* Con poco ancho, el nombre de la categoría solo aparece a la derecha */
      var larga = w - anchoLarga - anchoD - 28 >= 90;
      var izq = larga ? izqLarga : izqCorta, anchoI = larga ? anchoLarga : anchoCorta;
      var xI = anchoI + 14, xD = w - anchoD - 14, arriba = 36, abajo = h - 10;
      function y(v) { return abajo - (v - min) / ((max - min) || 1) * (abajo - arriba); }
      var yI = desolapar(A.valores.map(y), 14, arriba - 6, abajo + 4);
      var yD = desolapar(B.valores.map(y), 14, arriba - 6, abajo + 4);
      var els = [
        gTexto(A.nombre, xI, 8, { peso: 600, align: 'center' }), gTexto(B.nombre, xD, 8, { peso: 600, align: 'center' }),
        gLinea(xI, 22, xI, abajo + 6, T.rejilla, 1), gLinea(xD, 22, xD, abajo + 6, T.rejilla, 1)
      ];
      cats.forEach(function (x, i) {
        var f = x === foco, col = f ? T.actual : T.anterior, y1 = y(A.valores[i]), y2 = y(B.valores[i]);
        els.push(gLinea(xI, y1, xD, y2, col, f ? 3.5 : 1.5, f ? 6 : 2));
        els.push(gCirculo(xI, y1, f ? 5 : 4, col, f ? 7 : 3), gCirculo(xD, y2, f ? 5 : 4, col, f ? 7 : 3));
        var o = { peso: f ? 600 : 400, color: f ? T.texto : T.leyenda };
        els.push(gTexto(izq[i], xI - 12, yI[i], Object.assign({ align: 'right' }, o)), gTexto(der[i], xD + 12, yD[i], o));
      });
      return { animation: false, graphic: { elements: els } };
    });
  }

  /* Before / after: columnas agrupadas (antes en Neutro 400, después en Naranja 500) y el cambio bajo cada categoría */
  function antesDespues(el, s) {
    var d = s.datos, A = d.series[0], B = d.series[1], opc = opcionesTooltip(s);
    var cambios = d.categorias.map(function (x, i) { return cambioTexto(A.valores[i], B.valores[i], s); });
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.firstChild, function (w) {
      /* Dos líneas bajo cada grupo: el nombre (recortado con «…» si no cabe) y el cambio en seminegrita */
      var banda = Math.max(28, (w - 48) / d.categorias.length) - 4;
      var eje = ejeCategoria(d.categorias, true);
      eje.axisLabel = Object.assign({}, eje.axisLabel, { interval: 0, hideOverlap: false, lineHeight: 15,
        formatter: function (v, i) { return sinLlaves(recortar(v, banda)) + '\n{d|' + cambios[i] + '}'; },
        rich: { d: Object.assign(estiloTexto(T.texto, 600), { lineHeight: 17 }) } });
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        legend: Object.assign(leyenda(true), { data: [A.nombre, B.nombre] }),
        grid: { left: 4, right: 8, top: 40, bottom: 4, containLabel: true },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'axis', axisPointer: SOMBRA_EJE,
          formatter: function (ps) { var j = ps[0].dataIndex; return textoTooltip(d.categorias[j], [[A.nombre, A.valores[j]], [B.nombre, B.valores[j]]], opc) + notaTooltip('Cambio ' + cambios[j]); }
        }),
        xAxis: eje,
        yAxis: ejeValor(),
        series: [A, B].map(function (se, i) {
          return {
            type: 'bar', name: se.nombre, data: se.valores, barMaxWidth: 30, barGap: '7%', barCategoryGap: '30%',
            itemStyle: { color: i ? T.actual : T.anterior, borderRadius: [2, 2, 0, 0] }, emphasis: { focus: 'none', itemStyle: { opacity: 0.9 } },
            label: etiquetaBarra(s, 'top'), labelLayout: { hideOverlap: true }
          };
        })
      };
    });
  }

  R.bullet = function (el, s) {
    var ms = s.datos.metricas;
    var nombreObj = esTexto(s.nombreObjetivo) ? s.nombreObjetivo : 'Objetivo';
    var derecha = ms.map(function (m) { return [fmtDato(m.valor, s), 'obj. ' + fmtDato(m.objetivo, s)]; });
    var anchoNom = maxMedida(ms.map(function (m) { return m.nombre; })) + 16;
    var anchoDer = Math.max(maxMedida(derecha.map(function (x) { return x[0]; }), 600), maxMedida(derecha.map(function (x) { return x[1]; }))) + 16;
    var c = tarjeta(el, s, leyendaHTML([
      { texto: 'Rango bajo', color: P.neutro300 }, { texto: 'Medio', color: P.neutro200 }, { texto: 'Alto', color: P.neutro100, borde: P.neutro300 },
      { texto: 'Real', color: T.actual }, { texto: nombreObj, forma: 'linea', color: T.objetivo }
    ]) + lienzo(s, ms.length * 48));
    return montarECharts(c.querySelector('.eg-lienzo'), function (w) {
      var x0 = anchoNom, ancho = Math.max(40, w - anchoNom - anchoDer);
      var els = [];
      ms.forEach(function (m, i) {
        var cy = i * 48 + 22, alto = 18;
        var tope = Math.max(m.rangos[2], m.valor, m.objetivo);
        function X(v) { return x0 + Math.max(0, Math.min(v, tope)) / tope * ancho; }
        els.push(gTexto(m.nombre, 0, cy, { color: T.leyenda }));
        els.push(gRect(x0, cy - alto / 2, X(m.rangos[2]) - x0, alto, P.neutro100, 0, 1, P.neutro300));
        els.push(gRect(x0, cy - alto / 2, X(m.rangos[1]) - x0, alto, P.neutro200, 0, 2));
        els.push(gRect(x0, cy - alto / 2, X(m.rangos[0]) - x0, alto, P.neutro300, 0, 3));
        els.push(gRect(x0, cy - 4, X(m.valor) - x0, 8, T.actual, 0, 5));
        els.push(gLinea(X(m.objetivo), cy - alto / 2 - 3, X(m.objetivo), cy + alto / 2 + 3, T.objetivo, 2.5, 8));
        els.push(gTexto(derecha[i][0], x0 + ancho + 12, cy - 7, { peso: 600, color: T.texto }));
        els.push(gTexto(derecha[i][1], x0 + ancho + 12, cy + 7, { color: T.textoSecundario }));
      });
      return { animation: false, graphic: { elements: els } };
    });
  };

  R.ranking = function (el, s) {
    return s.variante === 'evolucion' ? rankingEvolucion(el, s) : rankingLista(el, s);
  };

  function rankingLista(el, s) {
    var d = s.datos, opc = opcionesTooltip(s);
    var pares = ordenarPares(d.categorias, d.valores, 'valor');
    pares.forEach(function (x, i) { x.pos = i + 1; x.foco = x.nombre === s.destacar; });
    var limite = s.limite || 10;
    var filas = pares.slice(0, limite);
    var iFoco = pares.findIndex(function (x) { return x.foco; });
    if (iFoco >= limite) filas = pares.slice(0, limite - 1).concat([pares[iFoco]]);
    var anchoPos = maxMedida(filas.map(function (x) { return x.pos; }), 600) + 12;
    var anchoNom = Math.max(maxMedida(filas.filter(function (x) { return !x.foco; }).map(function (x) { return x.nombre; })), maxMedida(filas.filter(function (x) { return x.foco; }).map(function (x) { return x.nombre; }), 600)) + 12;
    var c = tarjeta(el, s, lienzo(s, Math.max(120, filas.length * 30 + 8)));
    var rico = function (color, peso, ancho) { return Object.assign(estiloTexto(color, peso), ancho ? { width: ancho } : {}); };
    return montarECharts(c.firstChild, {
      textStyle: { fontFamily: FUENTE }, animationDuration: 500,
      grid: { left: 4, right: 8, top: 4, bottom: 4, containLabel: true },
      tooltip: Object.assign(tooltipBase(), { trigger: 'axis', axisPointer: SOMBRA_EJE, formatter: function (ps) { var x = filas[ps[0].dataIndex]; return textoTooltip(x.pos + '.º ' + x.nombre, [[s.titulo, x.valor]], opc); } }),
      xAxis: { type: 'value', min: 0, show: false, max: function (e) { return e.max * 1.16; } },
      yAxis: {
        type: 'category', inverse: true, data: filas.map(function (x, i) { return String(i); }),
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: {
          align: 'left', margin: anchoPos + anchoNom + 4,
          formatter: function (v) { var x = filas[+v]; return '{p|' + x.pos + '}{' + (x.foco ? 'f' : 'n') + '|' + x.nombre.replace(/[{}|]/g, '') + '}'; },
          rich: { p: rico(T.textoSecundario, 600, anchoPos), n: rico(T.leyenda), f: rico(T.texto, 600) }
        }
      },
      series: [{
        type: 'bar', barMaxWidth: 16, barCategoryGap: '40%', emphasis: { focus: 'none' },
        data: filas.map(function (x) { return { value: x.valor, itemStyle: { color: x.foco ? T.actual : P.neutro300, borderRadius: [0, 2, 2, 0] } }; }),
        label: etiquetaBarra(s, 'right')
      }]
    });
  }

  function rankingEvolucion(el, s) {
    var d = s.datos, S = d.series, k = S.length, m = d.periodos.length;
    var pos = S.map(function (se) { return se.posiciones ? se.posiciones.slice() : []; });
    if (!S[0].posiciones) {
      for (var j = 0; j < m; j++) {
        S.map(function (se, i) { return i; }).sort(function (a, b) { return S[b].valores[j] - S[a].valores[j] || a - b; })
          .forEach(function (i, r) { pos[i][j] = r + 1; });
      }
    }
    var foco = esTexto(s.destacar) ? s.destacar : S[0].nombre;
    var anchoI = maxMedida(S.map(function (x) { return x.nombre; }), 600) + 14;
    var c = tarjeta(el, s, lienzo(s, Math.max(180, k * 34 + 44)));
    return montarECharts(c.firstChild, function (w, h) {
      var x0 = anchoI + 12, x1 = w - anchoI - 12, arriba = 14, abajo = h - 30;
      function X(j) { return m > 1 ? x0 + j * (x1 - x0) / (m - 1) : x0; }
      function Y(r) { return k > 1 ? arriba + (r - 1) * (abajo - arriba) / (k - 1) : arriba; }
      var els = [];
      d.periodos.forEach(function (p, j) { els.push(gTexto(p, X(j), h - 8, { color: T.etiquetaEje, align: 'center' })); });
      var orden = S.map(function (se, i) { return i; }).sort(function (a, b) { return (S[a].nombre === foco) - (S[b].nombre === foco); });
      orden.forEach(function (i) {
        var f = S[i].nombre === foco, col = f ? T.actual : T.anterior, z = f ? 10 : 2;
        els.push(gPolilinea(pos[i].map(function (r, j) { return [X(j), Y(r)]; }), col, f ? 4 : 2.5, z));
        pos[i].forEach(function (r, j) {
          els.push(gCirculo(X(j), Y(r), 9, col, z + 1));
          els.push(gTexto(r, X(j), Y(r), { peso: 600, color: T.texto, align: 'center', z: z + 2 }));
        });
        var o = { peso: f ? 600 : 400, color: f ? T.texto : T.leyenda };
        els.push(gTexto(S[i].nombre, x0 - 16, Y(pos[i][0]), Object.assign({ align: 'right' }, o)));
        els.push(gTexto(S[i].nombre, x1 + 16, Y(pos[i][m - 1]), o));
      });
      return { animation: false, graphic: { elements: els } };
    });
  }

  R.tabla = function (el, s) {
    if (s.variante === 'scorecard' || s.variante === 'semaforo') return tablaIndicadores(el, s);
    if (s.variante === 'jerarquica') return tablaJerarquica(el, s);
    var d = s.datos, cols = d.columnas;
    var maximos = cols.map(function (c, j) {
      return c.tipo === 'barra' ? (Math.max.apply(null, d.filas.map(function (f) { return esNum(f[j]) ? f[j] : 0; })) || 1) : null;
    });
    function derecha(t) { return ['numero', 'porcentaje', 'variacion', 'fecha'].indexOf(t) >= 0; }
    function numeroCol(v, c) {
      if (c.unidad === '%') return porcentaje(v, c.decimales);
      return formatear(v, { decimales: c.decimales != null ? c.decimales : s.decimales, abreviar: c.abreviar != null ? c.abreviar : s.abreviar }).texto;
    }
    function celda(v, c, j) {
      var vacia = v == null || v === '';
      if (vacia) return '<td class="' + (derecha(c.tipo) ? 'eg-num ' : '') + 'eg-vacia">–</td>';
      switch (c.tipo) {
        case 'numero': return '<td class="eg-num">' + numeroCol(v, c) + '</td>';
        case 'porcentaje': return '<td class="eg-num">' + porcentaje(v, c.decimales) + '</td>';
        case 'variacion': return '<td class="eg-num">' + (v > 0 ? '+' : (v < 0 ? '\u2212' : '')) + porcentaje(Math.abs(v), c.decimales != null ? c.decimales : 1) + '</td>';
        case 'fecha': return '<td class="eg-num eg-secundario">' + esc(v) + '</td>';
        case 'sparkline': return '<td class="eg-celda-spark">' + lineaMini(v, 20) + '</td>';
        case 'barra':
          var pct = Math.max(0, Math.min(100, v / maximos[j] * 100));
          return '<td class="eg-celda-barra"><span class="eg-tb"><span style="width:' + pct.toFixed(1) + '%"></span></span><b>' + numeroCol(v, c) + '</b></td>';
        case 'estado':
          var clave = typeof v === 'object' ? v.estado : v, e = ESTADOS[clave];
          var texto = typeof v === 'object' && esTexto(v.texto) ? v.texto : e.texto;
          return '<td><span class="eg-estado eg-estado-' + clave + '">' + icono(e.icono, e.color, 16) + esc(texto) + '</span></td>';
        default: return '<td>' + esc(v) + '</td>';
      }
    }
    var cabecera = cols.map(function (c) { return '<th scope="col"' + (derecha(c.tipo) ? ' class="eg-num"' : '') + '>' + esc(c.titulo) + '</th>'; }).join('');
    var cuerpo = d.filas.map(function (f) { return '<tr>' + f.map(function (v, j) { return celda(v, cols[j], j); }).join('') + '</tr>'; }).join('');
    tarjeta(el, s, '<div class="eg-tabla-envoltura"><table class="eg-tabla"><thead><tr>' + cabecera + '</tr></thead><tbody>' + cuerpo + '</tbody></table></div>');
    return Promise.resolve();
  };

  /* ================================================================== */
  /* Familia Evolución y tendencias                                      */
  /* ================================================================== */
  var DISCONTINUA = [6, 4];
  function ultimoIndice(arr) { for (var j = arr.length - 1; j >= 0; j--) if (arr[j] != null) return j; return -1; }
  function etiquetaFinal(texto, color, posicion) {
    return Object.assign(estiloTexto(color, 600), { show: true, position: posicion || 'top', distance: 7, align: 'right', offset: [5, 0], formatter: texto });
  }
  function tooltipLineas(opc, extra) {
    return Object.assign(tooltipBase(), {
      trigger: 'axis', axisPointer: { type: 'line', lineStyle: { color: T.base, width: 1 } },
      formatter: function (ps) {
        ps = ps.filter(function (p) { var v = typeof p.value === 'object' && p.value !== null ? p.value.value : p.value; return p.seriesName.indexOf('__') !== 0 && v != null; });
        if (!ps.length) return '';
        var filas = ps.map(function (p) { return [p.seriesName, typeof p.value === 'object' ? p.value.value : p.value]; });
        return textoTooltip(ps[0].axisValue, filas, opc) + (extra ? extra(ps[0].dataIndex) : '');
      }
    });
  }
  function regresion(valores) {
    var n = valores.length, sx = 0, sy = 0, sxy = 0, sxx = 0;
    valores.forEach(function (y, x) { sx += x; sy += y; sxy += x * y; sxx += x * x; });
    var m = (n * sxy - sx * sy) / ((n * sxx - sx * sx) || 1), b = (sy - m * sx) / n;
    return valores.map(function (y, x) { return m * x + b; });
  }

  R.lineas = function (el, s) {
    var d = s.datos, v = s.variante, opc = opcionesTooltip(s), n = d.periodos.length;
    if ((v === 'prevision' || v === 'vs-prevision') && !esTexto(s.nota)) s.nota = 'Previsión: ' + d.prevision.origen + '.';
    var c = tarjeta(el, s, lienzo(s));
    var series = d.series.map(function (se) {
      var vals = se.valores.slice();
      if (v === 'acumulada') { var acum = 0; vals = vals.map(function (x) { acum += x; return acum; }); }
      while (vals.length < n) vals.push(null);
      return { nombre: se.nombre, rol: se.rol, valores: vals };
    });
    var iActual = 0;
    if (series.some(function (se) { return se.rol === 'actual'; })) series.forEach(function (se, i) { if (se.rol === 'actual') iActual = i; });
    else for (var k = 0; k < series.length; k++) { if (!series[k].rol) { iActual = k; break; } }
    var colores = coloresSeries(series, T.lineas);
    var objetivoFijo = esNum(d.objetivo) ? d.objetivo : null, objetivoLista = Array.isArray(d.objetivo) ? d.objetivo : null;
    var conFinal = ['simple', 'escalonada', 'acumulada', 'vs-prevision', 'vs-anterior'].indexOf(v) >= 0;
    var sinPuntoFinal = v === 'media-movil' || v === 'tendencia';
    var libres = 0, salida = [], leyendaDatos = [];

    series.forEach(function (se, i) {
      var principal = i === iActual, color = colores[i];
      if (v === 'media-movil') color = T.anterior;
      var orden = se.rol ? -1 : libres++;
      var marcadores = v === 'multiples' && orden >= 2;
      var discontinua = se.rol === 'prevision' || marcadores;
      var ancho = v === 'media-movil' ? 1.5 : (v === 'tendencia' ? 2 : 2.5);
      var ultimo = ultimoIndice(se.valores);
      var cruce = -1;
      if (principal && (objetivoFijo != null || objetivoLista)) {
        for (var j = 0; j < se.valores.length; j++) {
          var obj = objetivoFijo != null ? objetivoFijo : objetivoLista[j];
          if (se.valores[j] != null && se.valores[j] >= obj) { cruce = j; break; }
        }
      }
      var conEtiqueta = (principal && conFinal) || (v === 'vs-anterior' && se.rol === 'anterior');
      var datos = se.valores.map(function (x, j) {
        if (x == null) return { value: null };
        if (principal && j === cruce) return { value: x, symbol: 'circle', symbolSize: 12, itemStyle: { color: T.actual, borderColor: T.objetivo, borderWidth: 2 } };
        if (j === ultimo && ((principal && !sinPuntoFinal) || (v === 'vs-anterior'))) {
          var item = { value: x, symbol: 'circle', symbolSize: 9, itemStyle: { color: color, borderColor: T.fondo, borderWidth: 2 } };
          if (conEtiqueta) {
            var txt = (v === 'acumulada' ? 'Total ' : '') + fmtDato(x, s);
            var abajo = v === 'vs-anterior' && se.rol === 'anterior';
            item.label = etiquetaFinal(txt, abajo ? T.leyenda : T.etiquetaDato, abajo ? 'bottom' : 'top');
          }
          return item;
        }
        return { value: x, symbol: marcadores || v === 'tendencia' ? 'circle' : 'none' };
      });
      salida.push({
        type: 'line', name: se.nombre, data: datos, showSymbol: true, symbol: 'none', symbolSize: marcadores ? 6 : 5,
        step: v === 'escalonada' ? 'end' : false, connectNulls: false, z: principal ? 5 : 3,
        lineStyle: { color: color, width: ancho, type: se.rol === 'prevision' ? DISCONTINUA : (marcadores ? [5, 3] : 'solid') },
        itemStyle: { color: color, borderColor: T.fondo, borderWidth: 1 }, emphasis: { disabled: true }
      });
      leyendaDatos.push({ name: se.nombre, icon: discontinua ? ICONO_DISCONTINUA : ICONO_LINEA, itemStyle: { color: color, borderWidth: 0 } });
      if (principal && objetivoFijo != null) {
        salida[salida.length - 1].markLine = {
          silent: true, symbol: 'none', animation: false,
          lineStyle: { color: T.objetivo, width: 1.5, type: DISCONTINUA },
          label: Object.assign(estiloTexto(T.objetivo, 600), { show: true, position: 'insideStartTop', formatter: 'Objetivo ' + fmtDato(objetivoFijo, s) }),
          data: [{ yAxis: objetivoFijo }]
        };
      }
      if (principal && v === 'referencia' && esNum(d.referencia.valor)) {
        salida[salida.length - 1].markLine = {
          silent: true, symbol: 'none', animation: false,
          lineStyle: { color: P.neutro600, width: 1.5, type: DISCONTINUA },
          label: Object.assign(estiloTexto(P.neutro600, 600), { show: true, position: 'insideStartTop', formatter: d.referencia.nombre + ' ' + fmtDato(d.referencia.valor, s) }),
          data: [{ yAxis: d.referencia.valor }]
        };
      }
    });
    var principal = series[iActual];

    if (objetivoLista) {
      salida.push({ type: 'line', name: 'Objetivo', data: objetivoLista, symbol: 'none', z: 4, lineStyle: { color: T.objetivo, width: 1.5, type: DISCONTINUA }, itemStyle: { color: T.objetivo }, emphasis: { disabled: true } });
      leyendaDatos.push({ name: 'Objetivo', icon: ICONO_DISCONTINUA });
    }
    if (v === 'referencia' && Array.isArray(d.referencia.valor)) {
      salida.push({ type: 'line', name: d.referencia.nombre, data: d.referencia.valor, symbol: 'none', z: 4, lineStyle: { color: P.neutro600, width: 1.5, type: DISCONTINUA }, itemStyle: { color: P.neutro600 }, emphasis: { disabled: true } });
      leyendaDatos.push({ name: d.referencia.nombre, icon: ICONO_DISCONTINUA });
    }
    if (v === 'tendencia') {
      salida.push({ type: 'line', name: 'Tendencia lineal', data: regresion(principal.valores), symbol: 'none', z: 6, lineStyle: { color: T.objetivo, width: 2, type: DISCONTINUA }, itemStyle: { color: T.objetivo }, emphasis: { disabled: true } });
      leyendaDatos.push({ name: 'Tendencia lineal', icon: ICONO_DISCONTINUA });
    }
    if (v === 'media-movil') {
      var w = s.ventana || 3;
      var media = principal.valores.map(function (x, j) {
        if (j < w - 1) return null;
        var suma = 0; for (var q = j - w + 1; q <= j; q++) suma += principal.valores[q];
        return suma / w;
      });
      salida.push({ type: 'line', name: 'Media móvil (' + w + ')', data: media, symbol: 'none', z: 6, lineStyle: { color: T.actual, width: 3.5 }, itemStyle: { color: T.actual }, emphasis: { disabled: true } });
      leyendaDatos.push({ name: 'Media móvil (' + w + ')', icon: ICONO_LINEA });
    }
    var pv = d.prevision, kReal = d.series[0].valores.length;
    if (v === 'vs-prevision') {
      salida.push({ type: 'line', name: 'Previsión', data: pv.valores, symbol: 'none', z: 4, lineStyle: { color: T.actual, width: 2.5, type: DISCONTINUA }, itemStyle: { color: T.actual }, emphasis: { disabled: true } });
      leyendaDatos.push({ name: 'Previsión', icon: ICONO_DISCONTINUA });
    }
    if (v === 'prevision') {
      var ultimoReal = principal.valores[kReal - 1];
      var futuro = function (lista, enUnion) { var r = []; for (var j = 0; j < n; j++) r.push(j < kReal - 1 ? null : (j === kReal - 1 ? enUnion : lista[j - kReal])); return r; };
      if (pv.minimo) {
        var base = futuro(pv.minimo, ultimoReal);
        var anchoBanda = futuro(pv.maximo.map(function (x, j) { return x - pv.minimo[j]; }), 0);
        salida.push({ type: 'line', name: '__base', data: base, stack: '__banda', symbol: 'none', silent: true, z: 1, lineStyle: { width: 0 }, emphasis: { disabled: true } });
        salida.push({ type: 'line', name: '__banda', data: anchoBanda, stack: '__banda', symbol: 'none', silent: true, z: 1, lineStyle: { width: 0 }, areaStyle: { color: P.naranja100, opacity: 1 }, emphasis: { disabled: true } });
      }
      salida.push({
        type: 'line', name: 'Previsión', data: futuro(pv.valores, ultimoReal), symbol: 'none', z: 4,
        lineStyle: { color: T.actual, width: 2.5, type: DISCONTINUA }, itemStyle: { color: T.actual }, emphasis: { disabled: true },
        markLine: { silent: true, symbol: 'none', animation: false, label: { show: false }, lineStyle: { color: T.base, width: 1, type: [3, 3] }, data: [{ xAxis: kReal - 1 }] },
        markArea: {
          silent: true, itemStyle: { color: 'transparent' },
          label: Object.assign(estiloTexto(T.leyenda, 600), { offset: [0, -2] }),
          data: [
            [{ xAxis: 0, label: { position: 'insideTopRight' }, name: 'Real' }, { xAxis: kReal - 1 }],
            [{ xAxis: kReal - 1, label: { position: 'insideTopLeft' }, name: 'Previsión' }, { xAxis: n - 1 }]
          ]
        }
      });
    }
    var extraTooltip = v === 'prevision' && pv.minimo ? function (j) {
      if (j < kReal) return '';
      return '<div style="margin-top:2px;color:#DBD5CE">Entre ' + formatear(pv.minimo[j - kReal], opc).texto + ' y ' + formatear(pv.maximo[j - kReal], opc).texto + '</div>';
    } : null;
    var conLeyenda = leyendaDatos.length > 1 && v !== 'prevision';
    return montarECharts(c.firstChild, {
      textStyle: { fontFamily: FUENTE }, animationDuration: 600,
      legend: Object.assign(leyenda(conLeyenda), { itemWidth: 16, itemHeight: 3, data: leyendaDatos }),
      grid: { left: 4, right: 14, top: conLeyenda ? 40 : (v === 'prevision' ? 26 : 22), bottom: 4, containLabel: true },
      tooltip: tooltipLineas(opc, extraTooltip),
      xAxis: ejeCategoria(d.periodos, false),
      yAxis: Object.assign(ejeValor(), s.ejeDesdeCero === false ? { min: 'dataMin', scale: true } : {}),
      series: salida
    });
  };

  R.areas = function (el, s) {
    var d = s.datos, v = s.variante, opc = opcionesTooltip(s), n = d.periodos.length;
    var suma = function (se) { return se.valores.reduce(function (a, b) { return a + b; }, 0); };
    var orden = d.series.map(function (se, i) { return i; });
    if (v === 'superpuestas') orden.sort(function (a, b) { return suma(d.series[b]) - suma(d.series[a]); });
    var totales = d.periodos.map(function (p, j) { return d.series.reduce(function (a, se) { return a + se.valores[j]; }, 0); });
    var cien = v === 'apiladas-100', apilada = v === 'apiladas' || cien, multi = d.series.length > 1;
    var c = tarjeta(el, s, lienzo(s));
    var series = orden.map(function (i, k) {
      var se = d.series[i], color = multi ? T.series[k % T.series.length] : T.actual;
      return {
        type: 'line', name: se.nombre, stack: apilada ? 'total' : undefined, symbol: 'none', z: k + 1,
        data: cien ? se.valores.map(function (x, j) { return totales[j] ? x / totales[j] * 100 : 0; }) : se.valores,
        lineStyle: multi ? { color: T.fondo, width: 1.5 } : { color: T.actual, width: 2.5 },
        areaStyle: { color: multi ? color : P.naranja100, opacity: 1 },
        itemStyle: { color: color }, emphasis: { disabled: true }
      };
    });
    var eje = ejeValor();
    if (cien) { eje.max = 100; eje.interval = 25; eje.axisLabel = Object.assign({}, eje.axisLabel, { formatter: function (x) { return porcentaje(x, 0); } }); }
    return montarECharts(c.firstChild, {
      textStyle: { fontFamily: FUENTE }, animationDuration: 600,
      legend: Object.assign(leyenda(multi), { data: series.map(function (x) { return { name: x.name, icon: 'roundRect' }; }) }),
      grid: { left: 4, right: 14, top: multi ? 40 : 22, bottom: 4, containLabel: true },
      tooltip: Object.assign(tooltipBase(), {
        trigger: 'axis', axisPointer: { type: 'line', lineStyle: { color: T.base, width: 1 } },
        formatter: function (ps) {
          var j = ps[0].dataIndex;
          var filas = ps.slice().reverse().map(function (p) {
            var real = d.series[orden[p.seriesIndex]].valores[j];
            return '<div style="display:flex;gap:12px;justify-content:space-between"><span style="color:#DBD5CE">' + esc(p.seriesName) + '</span><span style="font-weight:600">' +
              (cien ? porcentaje(p.value, 0) + ' · ' : '') + formatear(real, opc).texto + '</span></div>';
          }).join('');
          return '<div style="font-weight:600;margin-bottom:2px">' + esc(ps[0].axisValue) + '</div>' + filas + (apilada ? '<div style="margin-top:2px;color:#DBD5CE">Total ' + formatear(totales[j], opc).texto + '</div>' : '');
        }
      }),
      xAxis: ejeCategoria(d.periodos, false),
      yAxis: eje,
      series: series
    });
  };

  /* Línea mínima sin ejes, con el punto final destacado (sparkline y celdas de tabla) */
  function lineaMini(serie, alto) {
    var w = 200, m = 4, h = alto;
    var min = Math.min.apply(null, serie), max = Math.max.apply(null, serie), rango = max - min || 1;
    var pts = serie.map(function (x, i) { return [m + i * (w - 2 * m) / (serie.length - 1), h - m - (x - min) / rango * (h - 2 * m)]; });
    var trazo = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('');
    var u = pts[pts.length - 1];
    return '<span class="eg-mini" style="height:' + h + 'px"><svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true"><path d="' + trazo +
      '" fill="none" stroke="' + T.actual + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>' +
      '<i style="left:calc(' + (u[0] / w * 100).toFixed(2) + '% - 4px);top:' + (u[1] - 4).toFixed(1) + 'px"></i></span>';
  }

  R.sparkline = function (el, s) {
    var filas = s.datos.series.map(function (se) {
      var actual = esNum(se.valor) ? se.valor : se.valores[se.valores.length - 1];
      var f = formatear(actual, { unidad: se.unidad || s.unidad, decimales: s.decimales, abreviar: s.abreviar });
      return '<li><span class="eg-sp-nombre">' + esc(se.nombre) + '</span>' + lineaMini(se.valores, 28) +
        '<b>' + f.numero + (f.unidad ? '<small>' + NBSP + esc(f.unidad) + '</small>' : '') + '</b></li>';
    }).join('');
    tarjeta(el, s, '<ul class="eg-sparklines">' + filas + '</ul>');
    return Promise.resolve();
  };

  /* ================================================================== */
  /* Familia Variación: cascada y descomposición                         */
  /* ================================================================== */
  function filasCascada(d) {
    var acum = d.inicio.valor;
    var filas = [{ nombre: esTexto(d.inicio.etiqueta) ? d.inicio.etiqueta : 'Inicio', total: true, desde: 0, hasta: acum, valor: acum }];
    d.categorias.forEach(function (c, i) { var v = d.valores[i]; filas.push({ nombre: c, desde: acum, hasta: acum + v, valor: v }); acum += v; });
    var fin = d.final && esNum(d.final.valor) ? d.final.valor : acum;
    filas.push({ nombre: d.final && esTexto(d.final.etiqueta) ? d.final.etiqueta : 'Final', total: true, desde: 0, hasta: fin, valor: fin });
    return filas;
  }
  function tooltipCascada(s, filas) {
    var opc = opcionesTooltip(s);
    return Object.assign(tooltipBase(), {
      trigger: 'item',
      formatter: function (p) {
        var f = filas[p.dataIndex];
        if (f.total) return cabeceraTooltip(f.nombre) + filaTooltip('Total', formatear(f.valor, opc).texto);
        return cabeceraTooltip(f.nombre) + filaTooltip(f.valor < 0 ? 'Disminuye' : 'Aumenta', conSignoU(f.valor, s)) + filaTooltip('Acumulado', formatear(f.hasta, opc).texto);
      }
    });
  }
  function rotuloCascada(f, s) { return f.total ? fmtDato(f.valor, s) : conSigno(f.valor, s); }

  R.cascada = function (el, s) { return s.variante === 'horizontal' ? cascadaHorizontal(el, s) : cascadaVertical(el, s); };

  /* Waterfall: columnas flotantes entre el inicio y el final, unidas por conectores finos */
  function cascadaVertical(el, s) {
    var filas = filasCascada(s.datos), textos = filas.map(function (f) { return rotuloCascada(f, s); });
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.firstChild, function (w) {
      var eje = ejeValor(); delete eje.min;
      /* Si las etiquetas no caben en el ancho de cada columna, solo se rotulan los totales (el resto, en el tooltip) */
      var conEtiquetas = maxMedida(textos, 600) <= (w - 48) / filas.length + 2;
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        graphic: { elements: gLeyenda(LEYENDA_CASCADA, 6) },
        grid: { left: 4, right: 8, top: 44, bottom: 4, containLabel: true },
        tooltip: tooltipCascada(s, filas),
        xAxis: ejeCategoriaColumnas(filas.map(function (f) { return f.nombre; }), w),
        yAxis: eje,
        series: [{
          type: 'custom', encode: { x: 0, y: [1, 2] }, data: filas.map(function (f, i) { return [i, f.desde, f.hasta]; }),
          renderItem: function (params, api) {
            var i = params.dataIndex, f = filas[i];
            var a = api.coord([i, f.desde]), b = api.coord([i, f.hasta]);
            var ancho = Math.min(34, api.size([1, 0])[0] * 0.66);
            var x = a[0] - ancho / 2, y = Math.min(a[1], b[1]), alto = Math.max(1, Math.abs(b[1] - a[1]));
            var hijos = [{ type: 'rect', shape: { x: x, y: y, width: ancho, height: alto }, style: { fill: f.total ? TOTAL_VAR : colorSigno(f.valor) } }];
            if (i < filas.length - 1) {
              var yc = Math.round(b[1]) + 0.5, xs = api.coord([i + 1, f.hasta])[0] - ancho / 2;
              hijos.push({ type: 'line', silent: true, shape: { x1: x + ancho, y1: yc, x2: xs, y2: yc }, style: { stroke: P.neutro400, lineWidth: 1 } });
            }
            if (conEtiquetas || f.total) {
              var sube = f.valor >= 0;
              hijos.push({ type: 'text', silent: true, style: { text: textos[i], x: a[0], y: sube ? y - 4 : y + alto + 4, align: 'center', verticalAlign: sube ? 'bottom' : 'top', fill: T.etiquetaDato, font: '600 11px ' + FUENTE } });
            }
            return { type: 'group', children: hijos };
          }
        }]
      };
    });
  }

  /* Bridge: la misma cascada en horizontal, para nombres largos; los totales en seminegrita */
  function cascadaHorizontal(el, s) {
    var filas = filasCascada(s.datos), textos = filas.map(function (f) { return rotuloCascada(f, s); });
    var c = tarjeta(el, s, lienzo(s, filas.length * 32 + 8));
    var anchoNombres = Math.max(maxMedida(filas.filter(function (f) { return !f.total; }).map(function (f) { return f.nombre; })), maxMedida(filas.filter(function (f) { return f.total; }).map(function (f) { return f.nombre; }), 600));
    var lo = 0;
    filas.forEach(function (f) { lo = Math.min(lo, f.desde, f.hasta); });
    return montarECharts(c.firstChild, function (w) {
      var izquierda = anchoNombres + 16, util = Math.max(40, w - izquierda - 4);
      /* Píxeles por unidad: el mayor con el que la etiqueta de cada fila cabe a la derecha de su barra */
      var k = Infinity;
      filas.forEach(function (f, i) { var fin = Math.max(f.desde, f.hasta) - lo; if (fin > 0) k = Math.min(k, Math.max(1, util - medir(textos[i], 600) - 8) / fin); });
      if (!isFinite(k)) k = 1;
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        grid: { left: izquierda, right: 4, top: 4, bottom: 4 },
        tooltip: tooltipCascada(s, filas),
        xAxis: { type: 'value', show: false, min: lo, max: lo + util / k },
        yAxis: {
          type: 'category', inverse: true, data: filas.map(function (f) { return f.nombre; }), axisLine: { show: false, onZero: false }, axisTick: { show: false },
          axisLabel: Object.assign(estiloTexto(T.leyenda), { margin: 12, formatter: function (v, i) { return filas[i] && filas[i].total ? '{t|' + sinLlaves(v) + '}' : sinLlaves(v); }, rich: { t: estiloTexto(T.texto, 600) } })
        },
        series: [{
          type: 'custom', encode: { x: [1, 2], y: 0 }, data: filas.map(function (f, i) { return [i, f.desde, f.hasta]; }),
          renderItem: function (params, api) {
            var i = params.dataIndex, f = filas[i];
            var a = api.coord([f.desde, i]), b = api.coord([f.hasta, i]);
            var alto = Math.min(22, api.size([0, 1])[1] * 0.69);
            var x = Math.min(a[0], b[0]), ancho = Math.max(1, Math.abs(b[0] - a[0])), y = a[1] - alto / 2;
            var hijos = [
              { type: 'rect', shape: { x: x, y: y, width: ancho, height: alto }, style: { fill: f.total ? TOTAL_VAR : colorSigno(f.valor) } },
              { type: 'text', silent: true, style: { text: textos[i], x: x + ancho + 6, y: a[1], align: 'left', verticalAlign: 'middle', fill: T.etiquetaDato, font: '600 11px ' + FUENTE } }
            ];
            if (i < filas.length - 1) {
              var xc = Math.round(b[0]) + 0.5, siguiente = api.coord([f.hasta, i + 1])[1] - alto / 2;
              hijos.push({ type: 'line', silent: true, shape: { x1: xc, y1: y + alto, x2: xc, y2: siguiente }, style: { stroke: P.neutro400, lineWidth: 1 } });
            }
            return { type: 'group', children: hijos };
          }
        }]
      };
    });
  }

  /* Descomposición aditiva clásica: tendencia (media móvil centrada de un ciclo, extendida a los extremos con una recta),
     estacionalidad (media de cada posición del ciclo, centrada en cero) y residuo */
  function recta(xs, ys) {
    var n = xs.length, mx = suma(xs) / n, my = suma(ys) / n, num = 0, den = 0;
    xs.forEach(function (x, i) { num += (x - mx) * (ys[i] - my); den += (x - mx) * (x - mx); });
    var m = den ? num / den : 0;
    return function (x) { return my + m * (x - mx); };
  }
  function descomponer(y, m) {
    var n = y.length, h = Math.floor(m / 2), tend = y.map(function () { return null; });
    for (var t = h; t < n - h; t++) {
      var acc = 0;
      for (var j = -h; j <= h; j++) acc += (m % 2 === 0 && Math.abs(j) === h ? 0.5 : 1) * y[t + j];
      tend[t] = acc / m;
    }
    var sumas = [], cuentas = [];
    for (var q = 0; q < m; q++) { sumas.push(0); cuentas.push(0); }
    for (t = 0; t < n; t++) if (tend[t] != null) { sumas[t % m] += y[t] - tend[t]; cuentas[t % m]++; }
    var indices = sumas.map(function (x, q) { return cuentas[q] ? x / cuentas[q] : 0; });
    var media = suma(indices) / m;
    indices = indices.map(function (x) { return x - media; });
    var lo = h, hi = n - h - 1, tramo = Math.min(m, hi - lo + 1);
    var xsI = [], ysI = [], xsF = [], ysF = [];
    for (t = lo; t < lo + tramo; t++) { xsI.push(t); ysI.push(tend[t]); }
    for (t = hi - tramo + 1; t <= hi; t++) { xsF.push(t); ysF.push(tend[t]); }
    var rI = recta(xsI, ysI), rF = recta(xsF, ysF);
    for (t = 0; t < lo; t++) tend[t] = rI(t);
    for (t = hi + 1; t < n; t++) tend[t] = rF(t);
    var est = y.map(function (x, t2) { return indices[t2 % m]; });
    return { tendencia: tend, estacionalidad: est, residuo: y.map(function (x, t2) { return x - tend[t2] - est[t2]; }) };
  }

  R.descomposicion = function (el, s) {
    var d = s.datos, opc = opcionesTooltip(s), comp;
    if (d.tendencia) comp = { tendencia: d.tendencia, estacionalidad: d.estacionalidad, residuo: d.residuo || d.valores.map(function (y, i) { return y - d.tendencia[i] - d.estacionalidad[i]; }) };
    else {
      comp = descomponer(d.valores, d.ciclo);
      if (!esTexto(s.nota)) s.nota = 'Descomposición aditiva: tendencia con media móvil centrada de ' + d.ciclo + ' periodos.';
    }
    var paneles = [
      { nombre: 'Serie observada', valores: d.valores, color: T.actual, ancho: 2 },
      { nombre: 'Tendencia', valores: comp.tendencia, color: P.neutro600, ancho: 2.5 },
      { nombre: 'Estacionalidad', valores: comp.estacionalidad, color: P.naranja700, ancho: 2, centrado: true }
    ];
    if (s.mostrarResiduo) paneles.push({ nombre: 'Residuo', valores: comp.residuo, color: P.neutro500, ancho: 1.5, centrado: true });
    var ALTO = 52, PASO = 68, np = paneles.length;
    var c = tarjeta(el, s, lienzo(s, np * PASO - 16 + 26));
    var anchoNombres = maxMedida(paneles.map(function (p) { return p.nombre; }), 600) + 24;
    return montarECharts(c.firstChild, function (w) {
      var grids = [], xs = [], ys = [], series = [], els = [];
      var porPeriodo = Math.max(1, w - anchoNombres - 8) / d.periodos.length;
      var paso = Math.max(1, Math.ceil((maxMedida(d.periodos) + 14) / porPeriodo));
      if (d.ciclo && !d.tendencia) paso = Math.ceil(paso / d.ciclo) * d.ciclo;
      paneles.forEach(function (p, i) {
        var top = 4 + i * PASO, ultimo = i === np - 1;
        grids.push({ left: anchoNombres, right: 8, top: top, height: ALTO });
        xs.push({ gridIndex: i, type: 'category', data: d.periodos, boundaryGap: false, axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false },
          axisLabel: ultimo ? Object.assign(estiloTexto(T.etiquetaEje), { margin: 10, interval: function (j) { return j % paso === 0; } }) : { show: false } });
        var y = { gridIndex: i, type: 'value', show: false, splitLine: { show: false } };
        if (p.centrado) { var mx = Math.max.apply(null, p.valores.map(Math.abs)) || 1; y.min = -mx; y.max = mx; } else y.scale = true;
        ys.push(y);
        series.push({
          type: 'line', name: p.nombre, xAxisIndex: i, yAxisIndex: i, data: p.valores, symbol: 'none', z: 3,
          lineStyle: { color: p.color, width: p.ancho, cap: 'round', join: 'round' }, itemStyle: { color: p.color }, emphasis: { disabled: true },
          markLine: p.centrado ? { silent: true, symbol: 'none', animation: false, label: { show: false }, lineStyle: { color: T.rejilla, width: 1, type: 'solid' }, data: [{ yAxis: 0 }] } : undefined
        });
        els.push(gTexto(p.nombre, 0, top + ALTO / 2, { peso: 600, color: T.leyenda }));
        if (!ultimo) els.push(gLinea(anchoNombres, top + ALTO + 8.5, w - 8, top + ALTO + 8.5, T.rejilla, 1));
      });
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        grid: grids, xAxis: xs, yAxis: ys, series: series, graphic: { elements: els },
        axisPointer: { link: [{ xAxisIndex: 'all' }] },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'axis', axisPointer: { type: 'line', lineStyle: { color: T.base, width: 1 } },
          formatter: function (ps) {
            var j = ps[0].dataIndex;
            return cabeceraTooltip(d.periodos[j]) + paneles.map(function (p) { return filaTooltip(p.nombre, p.centrado ? conSignoU(p.valores[j], s) : formatear(p.valores[j], opc).texto); }).join('');
          }
        })
      };
    });
  };

  /* ================================================================== */
  /* Composición: sectores, treemap, proporcion y marimekko              */
  /* ================================================================== */
  /* Partes de mayor a menor, «Otros» al final; color de la paleta (Otros en Neutro 300) y % sobre el total */
  function partesOrdenadas(d, orden) {
    var pares = d.categorias.map(function (cat, i) { return { nombre: cat, valor: d.valores[i], otros: /^(otros|otras|resto)\b/i.test(cat) }; });
    var normales = pares.filter(function (x) { return !x.otros; });
    if (orden !== 'natural') normales.sort(function (a, b) { return b.valor - a.valor; });
    pares = normales.concat(pares.filter(function (x) { return x.otros; }));
    var total = pares.reduce(function (a, b) { return a + b.valor; }, 0);
    pares.forEach(function (x, i) { x.color = x.otros ? T.otros : T.series[i % T.series.length]; x.pct = total ? x.valor / total * 100 : 0; });
    pares.total = total;
    return pares;
  }
  function leyendaSectores(pares, conValores) {
    return '<ul class="eg-leyenda' + (conValores ? '' : ' eg-leyenda-sin') + '">' + pares.map(function (x) {
      return '<li><span class="eg-muestra" style="background:' + x.color + '"></span><span>' + esc(x.nombre) + '</span>' + (conValores ? '<b>' + porcentaje(x.pct, 0) + '</b>' : '') + '</li>';
    }).join('') + '</ul>';
  }
  /* Centro del semidonut: la unidad va junto a la cifra si cabe en el hueco (unos 120 px); si no, pasa a la línea de abajo */
  function centroSemi(v, s, etiqueta) {
    var f = fmtU(v, s);
    var ancho = medir(f.numero, 700) * 30 / 11 + (f.unidad ? medir(f.unidad, 600) * 14 / 11 + 2 : 0);
    var dentro = !f.unidad || ancho <= 120;
    return '<div class="eg-semi-centro"><strong>' + f.numero + (f.unidad && dentro ? '<span>' + esc(f.unidad) + '</span>' : '') + '</strong>' +
      '<small>' + (f.unidad && !dentro ? '<b>' + esc(f.unidad) + '</b> · ' : '') + esc(etiqueta) + '</small></div>';
  }
  function tooltipParte(s) {
    var opc = opcionesTooltip(s);
    return Object.assign(tooltipBase(), { trigger: 'item', formatter: function (p) { return textoTooltip(p.name, [[porcentaje(p.data.pct, 1), p.data.value]], opc); } });
  }
  function serieSectores(pares, extra, minimoEtiqueta) {
    return Object.assign({
      type: 'pie', startAngle: 90, avoidLabelOverlap: false, labelLine: { show: false },
      itemStyle: { borderColor: T.fondo, borderWidth: 2 }, emphasis: { scale: true, scaleSize: 3 },
      label: minimoEtiqueta ? Object.assign(estiloTexto(T.etiquetaDato, 600), { show: true, position: 'inside', formatter: function (p) { return p.data.pct >= minimoEtiqueta ? porcentaje(p.data.pct, 0) : ''; } }) : { show: false },
      data: pares.map(function (x) { return { name: x.nombre, value: x.valor, pct: x.pct, itemStyle: { color: x.color }, label: { color: textoSobre(x.color) } }; })
    }, extra);
  }

  R.sectores = function (el, s) {
    var d = s.datos, v = s.variante;
    var pares = partesOrdenadas(d);
    var centro = s.centro || {};
    var valorCentro = esNum(centro.valor) ? centro.valor : pares.total;
    var c, serie;
    if (v === 'semidonut') {
      var minSemi = 8;
      c = tarjeta(el, s, '<div class="eg-donut-cuerpo"><div class="eg-semi">' + lienzo(s) +
        centroSemi(valorCentro, s, centro.etiqueta || 'Total') + '</div>' +
        leyendaSectores(pares, pares.some(function (x) { return x.pct < minSemi; })) + '</div>');
      serie = serieSectores(pares, { radius: [66, 118], center: [120, 120], startAngle: 180, endAngle: 360 }, minSemi);
    } else if (v === 'pie') {
      var minPie = 5;
      c = tarjeta(el, s, '<div class="eg-donut-cuerpo"><div class="eg-donut-grafico">' + lienzo(s) + '</div>' +
        leyendaSectores(pares, pares.some(function (x) { return x.pct < minPie; })) + '</div>');
      serie = serieSectores(pares, { radius: [0, '96%'], center: ['50%', '50%'] }, minPie);
    } else {
      var fc = fmtU(valorCentro, s);
      c = tarjeta(el, s, '<div class="eg-donut-cuerpo"><div class="eg-donut-grafico">' + lienzo(s) +
        '<div class="eg-donut-centro"><small>' + esc(centro.etiqueta || 'Total') + '</small><strong' + (medir(fc.numero, 700) * 30 / 11 > 100 ? ' style="font-size:22px;line-height:28px"' : '') + '>' + fc.numero + '</strong>' + (fc.unidad ? '<em>' + esc(fc.unidad) + '</em>' : '') + '</div></div>' +
        leyendaSectores(pares, true) + '</div>');
      serie = serieSectores(pares, { radius: ['62%', '96%'], center: ['50%', '50%'] }, 0);
    }
    return montarECharts(c.querySelector('.eg-lienzo'), { animationDuration: 600, tooltip: tooltipParte(s), series: [serie] });
  };

  /* Treemap plano: rectángulos proporcionales (algoritmo squarify), rotulados solo si caben */
  function squarify(valores, x, y, w, h) {
    var total = valores.reduce(function (a, b) { return a + b; }, 0), res = [];
    var areas = valores.map(function (v) { return total ? v / total * w * h : 0; });
    function peor(fila, lado) {
      var suma = fila.reduce(function (a, b) { return a + b; }, 0), mx = Math.max.apply(null, fila), mn = Math.min.apply(null, fila);
      return Math.max(lado * lado * mx / (suma * suma), suma * suma / (lado * lado * mn));
    }
    var i = 0;
    while (i < areas.length) {
      var lado = Math.min(w, h), fila = [areas[i]], j = i + 1;
      while (j < areas.length && peor(fila.concat(areas[j]), lado) <= peor(fila, lado)) fila.push(areas[j++]);
      var suma = fila.reduce(function (a, b) { return a + b; }, 0);
      if (w >= h) { var cw = suma / h, yy = y; fila.forEach(function (a) { res.push({ x: x, y: yy, w: cw, h: a / cw }); yy += a / cw; }); x += cw; w -= cw; }
      else { var ch = suma / w, xx = x; fila.forEach(function (a) { res.push({ x: xx, y: y, w: a / ch, h: ch }); xx += a / ch; }); y += ch; h -= ch; }
      i = j;
    }
    return res;
  }
  function recortar(txt, ancho, peso) {
    txt = String(txt);
    if (medir(txt, peso) <= ancho) return txt;
    while (txt.length > 1 && medir(txt + '…', peso) > ancho) txt = txt.slice(0, -1);
    return txt.length > 1 ? txt.replace(/\s+$/, '') + '…' : '';
  }
  function rectRotulado(r, color, lineas) {
    var hijos = [{ type: 'rect', shape: { x: r.x, y: r.y, width: Math.max(0, r.w), height: Math.max(0, r.h) }, style: { fill: color, stroke: T.fondo, lineWidth: 2 } }];
    lineas.forEach(function (l) {
      hijos.push({ type: 'text', silent: true, style: { text: l.texto, x: l.x, y: l.y, fill: textoSobre(color), font: (l.peso || 400) + ' 11px ' + FUENTE, align: l.align || 'left', verticalAlign: 'top' } });
    });
    return { type: 'group', children: hijos };
  }

  R.treemap = function (el, s) {
    if (s.variante === 'jerarquico') return treemapJerarquico(el, s);
    var pares = partesOrdenadas(s.datos).filter(function (x) { return x.valor > 0; });
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.querySelector('.eg-lienzo'), function (ancho, alto) {
      var rects = squarify(pares.map(function (x) { return x.valor; }), 0, 0, ancho, alto);
      return {
        animation: false, tooltip: tooltipParte(s),
        series: [{
          type: 'custom', coordinateSystem: 'none',
          data: pares.map(function (x) { return { name: x.nombre, value: x.valor, pct: x.pct }; }),
          renderItem: function (p) {
            var r = rects[p.dataIndex], x = pares[p.dataIndex], lineas = [];
            var pct = porcentaje(x.pct, 0), util = r.w - 18;
            if (r.h >= 44 && util >= medir(pct)) {
              var nombre = recortar(x.nombre, util, 600);
              if (nombre) lineas.push({ texto: nombre, x: r.x + 9, y: r.y + 9, peso: 600 });
              lineas.push({ texto: pct, x: r.x + 9, y: r.y + (nombre ? 24 : 9) });
            } else if (r.h >= 26 && util >= medir(pct)) lineas.push({ texto: pct, x: r.x + 9, y: r.y + 7 });
            return rectRotulado(r, x.color, lineas);
          }
        }]
      };
    });
  };

  /* Marimekko: ancho de cada columna = peso del grupo; alto = reparto interno (100 %) */
  R.marimekko = function (el, s) {
    var d = s.datos;
    var colores = d.series.map(function (se, i) { return T.series[i]; });
    var totales = d.grupos.map(function (g, j) { return d.series.reduce(function (a, se) { return a + se.valores[j]; }, 0); });
    var total = totales.reduce(function (a, b) { return a + b; }, 0);
    var c = tarjeta(el, s, leyendaHTML(d.series.map(function (se, i) { return { texto: se.nombre, color: colores[i] }; })) + lienzo(s, 236));
    var opc = opcionesTooltip(s);
    var datos = [];
    d.series.forEach(function (se, i) { d.grupos.forEach(function (g, j) { datos.push({ name: g, value: se.valores[j], serie: i, grupo: j }); }); });
    return montarECharts(c.querySelector('.eg-lienzo'), function (ancho, alto) {
      var izq = medir('100 %') + 8, abajo = 26, arriba = 6;
      var w = Math.max(40, ancho - izq - 2), h = Math.max(40, alto - abajo - arriba);
      var y0 = arriba + h, xs = [], x = izq;
      totales.forEach(function (t) { xs.push({ x: x, w: t / total * w }); x += t / total * w; });
      var fondo = [];
      [0, 25, 50, 75, 100].forEach(function (q) {
        var yy = Math.round(y0 - q / 100 * h) + 0.5;
        fondo.push(gLinea(izq, yy, izq + w, yy, q === 0 ? T.base : T.rejilla, 1, q === 0 ? 3 : 0));
        fondo.push(gTexto(porcentaje(q, 0), izq - 8, yy, { color: T.etiquetaEje, align: 'right' }));
      });
      d.grupos.forEach(function (g, j) {
        var col = xs[j], pctG = porcentaje(totales[j] / total * 100, 0), largo = g + ' · ' + pctG;
        var txt = medir(largo) <= col.w + 6 ? largo : (medir(g) <= col.w + 6 ? g : recortar(g, col.w, 400));
        if (txt) fondo.push(gTexto(txt, col.x + col.w / 2, y0 + 10, { color: T.leyenda, align: 'center', va: 'top' }));
      });
      return {
        animation: false, graphic: fondo,
        tooltip: Object.assign(tooltipBase(), { trigger: 'item', formatter: function (p) {
          var q = p.data, pc = totales[q.grupo] ? q.value / totales[q.grupo] * 100 : 0;
          return textoTooltip(q.name + ' · ' + d.series[q.serie].nombre, [[porcentaje(pc, 1) + ' del grupo', q.value], ['Peso del grupo ' + porcentaje(totales[q.grupo] / total * 100, 1), totales[q.grupo]]], opc);
        } }),
        series: [{
          type: 'custom', coordinateSystem: 'none', z: 2, data: datos,
          renderItem: function (p) {
            var q = datos[p.dataIndex], col = xs[q.grupo], base = 0;
            for (var k = 0; k < q.serie; k++) base += d.series[k].valores[q.grupo];
            var tg = totales[q.grupo], alto1 = q.value / tg * h, yy = y0 - base / tg * h - alto1;
            var r = { x: col.x, y: yy, w: col.w, h: alto1 }, pct = porcentaje(q.value / tg * 100, 0), lineas = [];
            if (alto1 >= 18 && medir(pct, 600) <= col.w - 6) lineas.push({ texto: pct, x: col.x + col.w / 2, y: yy + alto1 / 2 - 7, peso: 600, align: 'center' });
            return rectRotulado(r, colores[q.serie], lineas);
          }
        }]
      };
    });
  };

  /* Proporción: barra parte-todo, cuota, participación y waffle (HTML + SVG) */
  R.proporcion = function (el, s) {
    var d = s.datos, v = s.variante;
    if (v === 'barra') return parteTodo(el, s);
    if (v === 'participacion') {
      var filas = d.categorias.map(function (cat, i) { return { nombre: cat, pct: d._pct[i], valor: d.valores[i] }; });
      if (s.orden !== 'natural') filas.sort(function (a, b) { return b.pct - a.pct; });
      tarjeta(el, s, '<dl class="eg-progreso-lista eg-pa">' + filas.map(function (f) {
        var detalle = esNum(d.total) ? ' title="' + esc(fmtU(f.valor, s).texto + ' de ' + fmtU(d.total, s).texto) + '"' : '';
        return '<dt>' + esc(f.nombre) + '</dt><dd' + detalle + '><div class="eg-pista" role="meter" aria-label="' + esc(f.nombre) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(f.pct) + '"><div class="eg-barra" style="width:' + Math.min(100, f.pct).toFixed(1) + '%"></div></div></dd>' +
          '<dd class="eg-valor">' + porcentaje(f.pct, 0) + '</dd>';
      }).join('') + '</dl>');
      return Promise.resolve();
    }
    var pct = d._pct, etiqueta = d.etiqueta || (v === 'cuota' ? 'Nuestra cuota' : 'Parte destacada'), resto = d.resto || 'Resto';
    var leyendaUno = leyendaSectores([{ nombre: etiqueta, color: T.actual }, { nombre: resto, color: T.otros }], false);
    var detalleTotal = esNum(d.total) ? '<span class="eg-secundario">' + esc(fmtU(d.valor, s).texto + ' de ' + fmtU(d.total, s).texto) + '</span>' : '';
    if (v === 'waffle') {
      var n = Math.round(pct), celdas = '';
      for (var k = 0; k < 100; k++) celdas += '<i' + ((9 - Math.floor(k / 10)) * 10 + k % 10 < n ? ' class="eg-si"' : '') + '></i>';
      tarjeta(el, s, '<div class="eg-uno"><div class="eg-wf" role="img" aria-label="' + esc(etiqueta + ': ' + porcentaje(pct, 0) + ' ' + (d.base || 'del total')) + '">' + celdas + '</div>' +
        '<div class="eg-uno-lado"><div class="eg-uno-dato"><p class="eg-kpi-valor">' + numero(pct, pct < 10 && Math.round(pct) !== pct ? 1 : 0) + '<span class="eg-kpi-unidad">%</span></p><span class="eg-secundario">' + esc(d.base || 'del total') + '</span>' + detalleTotal + '</div>' + leyendaUno + '</div></div>');
      return Promise.resolve();
    }
    /* cuota: anillo de 128 px (trazo 24) desde las 12 h */
    var L = 2 * Math.PI * 64, arco = Math.max(0, Math.min(100, pct)) / 100 * L, ref = '';
    if (esNum(d._pctAnterior)) {
      var dif = Math.round((pct - d._pctAnterior) * 10) / 10;
      ref = '<span class="eg-secundario">' + esc(d.referencia || 'Periodo anterior') + ': ' + porcentaje(d._pctAnterior, 0) + '</span>' +
        '<span class="eg-fuerte">' + (dif > 0 ? '+' : (dif < 0 ? '\u2212' : '')) + numero(Math.abs(dif), Math.round(dif) === dif ? 0 : 1) + NBSP + 'p.' + NBSP + 'p.</span>';
    }
    tarjeta(el, s, '<div class="eg-uno"><div class="eg-cu"><svg viewBox="0 0 152 152" role="img" aria-label="' + esc(etiqueta + ': ' + porcentaje(pct, 0)) + '">' +
      '<circle cx="76" cy="76" r="64" fill="none" stroke="' + T.otros + '" stroke-width="24"/>' +
      '<circle cx="76" cy="76" r="64" fill="none" stroke="' + T.actual + '" stroke-width="24" stroke-dasharray="' + arco.toFixed(1) + ' ' + L.toFixed(1) + '" transform="rotate(-90 76 76)"/></svg>' +
      '<div class="eg-cu-centro"><strong>' + numero(pct, pct < 10 && Math.round(pct) !== pct ? 1 : 0) + NBSP + '%</strong><small>' + esc(d.base || 'cuota') + '</small></div></div>' +
      '<div class="eg-uno-lado">' + (ref || detalleTotal ? '<div class="eg-uno-dato">' + ref + detalleTotal + '</div>' : '') + leyendaUno + '</div></div>');
    return Promise.resolve();
  };

  /* Barra parte-todo: una barra al 100 %, nombres encima y % dentro; si un rótulo no cabe se oculta y aparece la leyenda */
  function parteTodo(el, s) {
    var pares = partesOrdenadas(s.datos, s.orden);
    var nombres = '', bloques = '';
    pares.forEach(function (x) {
      var ancho = 'flex:0 0 ' + x.pct.toFixed(3) + '%', t = esc(x.nombre + ': ' + porcentaje(x.pct, 1) + ' (' + fmtU(x.valor, s).texto + ')');
      nombres += '<span style="' + ancho + '" title="' + t + '">' + esc(x.nombre) + '</span>';
      bloques += '<span style="' + ancho + ';background:' + x.color + ';color:' + textoSobre(x.color) + '" title="' + t + '">' + porcentaje(x.pct, 0) + '</span>';
    });
    var c = tarjeta(el, s, '<div class="eg-pt" role="img" aria-label="' + esc(s.titulo + ': ' + pares.map(function (x) { return x.nombre + ' ' + porcentaje(x.pct, 0); }).join(', ')) + '">' +
      '<div class="eg-pt-fila eg-pt-nombres">' + nombres + '</div><div class="eg-pt-fila eg-pt-barra">' + bloques + '</div>' +
      '<div class="eg-pt-eje"><span style="left:0">0' + NBSP + '%</span><span style="left:50%">50' + NBSP + '%</span><span style="left:100%">100' + NBSP + '%</span></div>' +
      leyendaHTML(pares.map(function (x) { return { texto: x.nombre + ' · ' + porcentaje(x.pct, 0), color: x.color }; })).replace('<ul class="eg-leyenda-h">', '<ul class="eg-leyenda-h" hidden>') + '</div>');
    var caja = c.querySelector('.eg-pt');
    function ajustar() {
      var oculto = false;
      [].forEach.call(caja.querySelectorAll('.eg-pt-fila>span'), function (sp) {
        sp.classList.remove('eg-oculto');
        if (sp.scrollWidth > sp.clientWidth + 1) { sp.classList.add('eg-oculto'); oculto = true; }
      });
      caja.querySelector('.eg-leyenda-h').hidden = !oculto;
    }
    ajustar();
    if (global.ResizeObserver) { var ro = new ResizeObserver(ajustar); ro.observe(caja); }
    return (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(ajustar);
  }

  function progresoBarras(el, s) {
    var d = s.datos;
    var filas = d.categorias.map(function (cat, i) {
      var pct = d.objetivos ? (d.objetivos[i] ? d.valores[i] / d.objetivos[i] * 100 : 0) : d.valores[i];
      var ancho = Math.max(0, Math.min(100, pct));
      var detalle = d.objetivos ? ' title="' + esc(formatear(d.valores[i], { unidad: s.unidad, abreviar: s.abreviar }).texto + ' de ' + formatear(d.objetivos[i], { unidad: s.unidad, abreviar: s.abreviar }).texto) + '"' : '';
      return '<dt>' + esc(cat) + '</dt><dd' + detalle + '><div class="eg-pista" role="progressbar" aria-label="' + esc(cat) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(pct) + '"><div class="eg-barra" style="width:' + ancho.toFixed(1) + '%"></div></div></dd>' +
        '<dd class="eg-valor">' + porcentaje(pct, 0) + '</dd>';
    }).join('');
    var sub = s.subtitulo;
    if (!esTexto(sub) && d.objetivos) s.subtitulo = (esTexto(s.periodo) ? s.periodo + ' · ' : '') + '% del objetivo';
    tarjeta(el, s, '<dl class="eg-progreso-lista">' + filas + '</dl>');
    return Promise.resolve();
  };

  function sparklineSVG(serie, fondo) {
    var w = 200, h = 56, m = 6;
    var min = Math.min.apply(null, serie), max = Math.max.apply(null, serie);
    var rango = max - min || 1;
    var pts = serie.map(function (v, i) {
      return [m + i * (w - 2 * m) / (serie.length - 1), h - m - (v - min) / rango * (h - 2 * m)];
    });
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('');
    var u = pts[pts.length - 1];
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true"><path d="' + d + '" fill="none" stroke="' + T.actual + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>' +
      '<span class="eg-spark-punto" style="position:absolute;left:calc(' + (u[0] / w * 100).toFixed(2) + '% - 4.5px);top:' + (u[1] - 4.5).toFixed(1) + 'px;width:9px;height:9px;border-radius:50%;background:' + T.actual + ';box-shadow:0 0 0 2px ' + fondo + '"></span>';
  }

  /* ================================================================== */
  /* Familia Distribución                                                */
  /* ================================================================== */
  var RELLENO_DIST = P.naranja100; /* caja, violín, densidad, banda de ±1 desviación y rangos */
  function nombreCasos(s) { return esTexto(s.nombreCasos) ? s.nombreCasos : 'casos'; }
  function mayus(t) { t = String(t); return t.charAt(0).toUpperCase() + t.slice(1); }
  function rangoTexto(a, b, s) { return fmtDato(a, s) + '\u2013' + formatear(b, opcionesTooltip(s)).texto; }
  /* Eje vertical de valores con rejilla que se ajusta a los datos (no fuerza el cero) */
  function ejeValorY(extra) { var e = ejeValor(); delete e.min; e.scale = true; return Object.assign(e, extra || {}); }
  /* Eje horizontal de valores con línea base y marcas de 4 px, sin rejilla (histograma, puntos, densidad) */
  function ejeValorConMarcas(extra) {
    extra = extra || {};
    var e = {
      type: 'value', scale: true, splitNumber: 5,
      axisLine: { show: true, onZero: false, lineStyle: { color: T.base, width: 1 } },
      axisTick: { show: true, length: 4, lineStyle: { color: T.base, width: 1 } },
      axisLabel: Object.assign(estiloTexto(T.etiquetaEje), { formatter: formatoEje, margin: 8 }),
      splitLine: { show: false }
    };
    if (extra.marcas) { e.axisTick.customValues = extra.marcas; e.axisLabel.customValues = extra.marcas; }
    delete extra.marcas;
    return Object.assign(e, extra);
  }
  /* Línea vertical discontinua (mediana, media) desde el eje hasta encima del área del gráfico, con su rótulo */
  function serieMarcaVertical(valor, texto) {
    var ancho = medir(texto, 600);
    return {
      type: 'custom', silent: true, z: 6, data: [[valor, 0]], encode: { x: 0, y: 1 }, tooltip: { show: false },
      renderItem: function (params, api) {
        var cs = params.coordSys, x = api.coord([api.value(0), 0])[0], y0 = cs.y - 4;
        var izq = x + 6 + ancho > cs.x + cs.width + 8;
        return { type: 'group', children: [
          { type: 'line', shape: { x1: x, y1: y0, x2: x, y2: cs.y + cs.height }, style: { stroke: P.neutro700, lineWidth: 1.5, lineDash: [5, 3] } },
          { type: 'text', style: { text: texto, x: izq ? x - 6 : x + 6, y: y0, fill: P.neutro700, font: '600 11px ' + FUENTE, align: izq ? 'right' : 'left', verticalAlign: 'middle' } }
        ] };
      }
    };
  }
  /* Leyenda de una línea a la derecha, arriba (media del grupo, media global) */
  function leyendaDerecha(w, texto, o) {
    o = o || {};
    var x = w - 2, tw = medir(texto, o.peso), els = [];
    els.push(gTexto(texto, x, 8, { color: o.color || T.etiquetaEje, peso: o.peso, align: 'right' }));
    var l = gLinea(x - tw - 22, 8, x - tw - 6, 8, o.trazo || P.neutro700, o.grosor || 2.5, 20);
    if (o.discontinua) { l.style.lineDash = o.discontinua; l.style.lineCap = 'butt'; }
    els.push(l);
    return els;
  }
  /* Eje de valores oculto. Sin axisLabel.show:false, ECharts 6 reserva el ancho de sus rótulos aunque el eje no se vea */
  function ejeOculto(min, max) { return { type: 'value', show: false, min: min, max: max, axisLabel: { show: false }, splitLine: { show: false } }; }
  function textoMarca(nombre, valor, s, estimado) { return nombre + ' ' + (estimado ? '\u2248' + NBSP : '') + fmtDato(valor, s); }
  /* Redondea un valor calculado (moda) a la precisión de los datos */
  function comoLosDatos(x, o) { return o.every(function (v) { return Math.round(v) === v; }) ? Math.round(x) : x; }

  R.histograma = function (el, s) {
    var h = s.datos._hist, L = h.limites, nb = L.length - 1, casos = nombreCasos(s);
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.firstChild, function (w) {
      /* Marcas en los límites de los intervalos: una de cada k para que los rótulos no se toquen */
      var porIntervalo = Math.max(1, (w - 48) / nb), rotulo = maxMedida(L.map(formatoEje)) + 12, k = 1;
      while (k * porIntervalo < rotulo && k < nb) k++;
      var series = [{
        type: 'custom', name: casos, data: h.casos.map(function (n, j) { return [L[j], L[j + 1], n, j]; }), encode: { x: [0, 1], y: 2 },
        renderItem: function (params, api) {
          var a = api.coord([api.value(0), 0]), b = api.coord([api.value(1), api.value(2)]);
          return { type: 'rect', shape: { x: a[0] + 1, y: b[1], width: Math.max(0.5, b[0] - a[0] - 2), height: a[1] - b[1] }, style: { fill: T.actual } };
        }
      }];
      if (h.marca) series.push(serieMarcaVertical(h.marca.valor, textoMarca(h.marca.nombre, h.marca.valor, s, h.marca.estimado)));
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        grid: { left: 4, right: 14, top: h.marca ? 26 : 12, bottom: 4, containLabel: true },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (p) { var j = p.value[3], n = h.casos[j]; return cabeceraTooltip(rangoTexto(L[j], L[j + 1], s)) + filaTooltip(mayus(casos), numero(n) + ' · ' + porcentaje(n / h.n * 100, 0)); }
        }),
        xAxis: ejeValorConMarcas({ min: L[0], max: L[nb], marcas: L.filter(function (x, j) { return j % k === 0; }) }),
        yAxis: Object.assign(ejeValor(), { minInterval: 1 }),
        series: series
      };
    });
  };

  R.cajas = function (el, s) {
    var d = s.datos, G = d._grupos, violin = s.variante === 'violin', opc = opcionesTooltip(s), casos = nombreCasos(s);
    var nombres = G.map(function (g) { return g.nombre; });
    if (!esTexto(s.nota)) s.nota = violin
      ? 'La forma muestra dónde se concentran los casos; la barra va del primer al tercer cuartil (Q1–Q3) y el punto es la mediana.'
      : 'La caja va del primer al tercer cuartil (Q1–Q3) y la línea es la mediana' + (G.some(function (g) { return g.resumido; }) ? '.' : '; los bigotes llegan hasta 1,5 veces el alto de la caja y los puntos más alejados son atípicos.');
    /* Violín: densidad de cada grupo, prolongada 1,5 anchos de banda más allá de los datos para que acabe en punta */
    var formas = violin ? G.map(function (g) {
      var o = g.orden, h = bandaSilverman(o), a = o[0] - 1.5 * h, b = o[o.length - 1] + 1.5 * h, pts = [];
      if (o[0] >= 0) a = Math.max(a, 0);
      if (s.unidad === '%' && o[o.length - 1] <= 100) b = Math.min(b, 100);
      for (var k = 0; k <= 60; k++) { var y = a + (b - a) * k / 60; pts.push([y, densidadEn(o, h, y)]); }
      return pts;
    }) : null;
    var maxD = violin ? Math.max.apply(null, formas.map(function (f) { return Math.max.apply(null, f.map(function (p) { return p[1]; })); })) : 1;
    var c = tarjeta(el, s, lienzo(s));
    var anchoAnot = Math.max(maxMedida(['Máx.', 'Q3', 'Q1', 'Mín.', 'Atípico']), medir('Mediana', 600)) + 16;
    return montarECharts(c.firstChild, function (w) {
      var anotar = !violin && (w - 48 - anchoAnot) / G.length >= 70;
      var series = [{
        type: 'custom', name: s.titulo,
        data: G.map(function (g, i) { return violin ? [i, formas[i][0][0], g.q1, g.mediana, g.q3, formas[i][60][0]] : [i, g.minimo, g.q1, g.mediana, g.q3, g.maximo]; }),
        encode: { x: 0, y: [1, 2, 3, 4, 5] },
        renderItem: function (params, api) {
          var i = api.value(0), g = G[i], x = api.coord([i, 0])[0], banda = api.size([1, 0])[0], cs = params.coordSys;
          var Y = function (v) { return api.coord([i, v])[1]; }, hijos = [];
          if (violin) {
            var hw = Math.min(40, banda * 0.42), der = formas[i].map(function (p) { return [x + p[1] / maxD * hw, Y(p[0])]; });
            var izq = der.map(function (p) { return [2 * x - p[0], p[1]]; }).reverse();
            hijos.push({ type: 'polygon', shape: { points: der.concat(izq) }, style: { fill: RELLENO_DIST, stroke: T.actual, lineWidth: 2, lineJoin: 'round' } });
            hijos.push({ type: 'line', shape: { x1: x, y1: Y(g.q1), x2: x, y2: Y(g.q3) }, style: { stroke: P.neutro700, lineWidth: 5 } });
            hijos.push({ type: 'circle', shape: { cx: x, cy: Y(g.mediana), r: 3.5 }, style: { fill: T.fondo, stroke: P.neutro700, lineWidth: 1.5 } });
            return { type: 'group', children: hijos };
          }
          var bw = Math.min(56, banda * 0.5), tope = Math.min(18, bw * 0.6), bigote = { stroke: P.neutro600, lineWidth: 1.5 };
          hijos.push({ type: 'line', shape: { x1: x, y1: Y(g.maximo), x2: x, y2: Y(g.q3) }, style: bigote });
          hijos.push({ type: 'line', shape: { x1: x, y1: Y(g.q1), x2: x, y2: Y(g.minimo) }, style: bigote });
          hijos.push({ type: 'line', shape: { x1: x - tope / 2, y1: Y(g.maximo), x2: x + tope / 2, y2: Y(g.maximo) }, style: bigote });
          hijos.push({ type: 'line', shape: { x1: x - tope / 2, y1: Y(g.minimo), x2: x + tope / 2, y2: Y(g.minimo) }, style: bigote });
          hijos.push({ type: 'rect', shape: { x: x - bw / 2, y: Y(g.q3), width: bw, height: Math.max(1, Y(g.q1) - Y(g.q3)) }, style: { fill: RELLENO_DIST, stroke: T.actual, lineWidth: 2 } });
          hijos.push({ type: 'line', shape: { x1: x - bw / 2 + 1, y1: Y(g.mediana), x2: x + bw / 2 - 1, y2: Y(g.mediana) }, style: { stroke: P.neutro700, lineWidth: 3 } });
          if (anotar && i === G.length - 1) {
            /* Explicación de la caja junto al último grupo */
            var rot = [['Máx.', g.maximo], ['Q3', g.q3], ['Mediana', g.mediana], ['Q1', g.q1], ['Mín.', g.minimo]];
            if (g.atipicos.length) rot.push(['Atípico', g.atipicos.reduce(function (a, b) { return Math.abs(b - g.mediana) > Math.abs(a - g.mediana) ? b : a; })]);
            var ys = desolapar(rot.map(function (r) { return Y(r[1]); }), 13, cs.y - 2, cs.y + cs.height + 2);
            rot.forEach(function (r, k) {
              var fuerte = r[0] === 'Mediana';
              hijos.push({ type: 'text', silent: true, style: { text: r[0], x: x + bw / 2 + 12, y: ys[k], fill: fuerte ? P.neutro700 : T.etiquetaEje, font: (fuerte ? 600 : 400) + ' 11px ' + FUENTE, align: 'left', verticalAlign: 'middle' } });
            });
          }
          return { type: 'group', children: hijos };
        }
      }];
      if (!violin) {
        var at = []; G.forEach(function (g, i) { g.atipicos.forEach(function (v) { at.push([i, v]); }); });
        series.push({ type: 'scatter', name: 'Atípicos', z: 4, data: at, symbolSize: 7, emphasis: { scale: false }, itemStyle: { color: T.fondo, borderColor: T.actual, borderWidth: 1.5 } });
      }
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        grid: { left: 4, right: anotar ? anchoAnot : 8, top: 12, bottom: 4, containLabel: true },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (p) {
            var g = G[p.seriesIndex === 0 ? p.dataIndex : p.value[0]], cab = g.nombre ? cabeceraTooltip(g.nombre) : '';
            if (p.seriesIndex === 1) return cab + filaTooltip('Atípico', formatear(p.value[1], opc).texto);
            var filas = [['Máximo', violin ? g.extremos[1] : g.maximo], ['Q3', g.q3], ['Mediana', g.mediana], ['Q1', g.q1], ['Mínimo', violin ? g.extremos[0] : g.minimo]];
            return cab + (g.n ? filaTooltip(mayus(casos), numero(g.n)) : '') + filas.map(function (f) { return filaTooltip(f[0], formatear(f[1], opc).texto); }).join('') +
              (!violin && g.atipicos.length ? filaTooltip('Atípicos', numero(g.atipicos.length)) : '');
          }
        }),
        xAxis: ejeCategoriaColumnas(nombres, w - (anotar ? anchoAnot : 0)),
        yAxis: ejeValorY(),
        series: series
      };
    });
  };

  R.casos = function (el, s) {
    if (s.variante === 'apilados') return casosApilados(el, s);
    return s.variante === 'enjambre' ? casosEnjambre(el, s) : casosDispersos(el, s);
  };

  /* Dot plot de distribución: un punto por caso, apilados en columnas de igual ancho */
  function casosApilados(el, s) {
    var d = s.datos, K = d._columnas, L = K.limites, nb = L.length - 1, casos = nombreCasos(s);
    var alto = Math.max.apply(null, K.casos), PASO = 11.5, conMarca = s.marca !== 'ninguna';
    var arriba = conMarca ? 30 : 10, abajo = 28;
    var c = tarjeta(el, s, lienzo(s, arriba + abajo + (alto + 0.5) * PASO));
    var mv = conMarca ? (s.marca === 'media' ? media(d._orden) : cuantil(d._orden, 0.5)) : null;
    var puntos = [];
    K.columnas.forEach(function (col, j) { col.forEach(function (x, k) { puntos.push([(L[j] + L[j + 1]) / 2, k + 0.65, j]); }); });
    return montarECharts(c.firstChild, function (w) {
      var series = [{
        type: 'scatter', name: casos, data: puntos, symbolSize: Math.max(5, Math.min(10, (w - 28) / nb - 1.5)), emphasis: { scale: false },
        itemStyle: { color: T.actual, borderColor: T.fondo, borderWidth: 1 }
      }];
      if (conMarca) series.push(serieMarcaVertical(mv, s.marca === 'media' ? 'Media' : 'Mediana'));
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        grid: { left: 14, right: 14, top: arriba, bottom: abajo, containLabel: false },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (p) { var j = p.value[2]; return cabeceraTooltip(rangoTexto(L[j], L[j + 1], s)) + filaTooltip(mayus(casos), numero(K.casos[j])); }
        }),
        xAxis: ejeValorConMarcas({ min: L[0], max: L[nb] }),
        yAxis: ejeOculto(0, alto + 0.5),
        series: series
      };
    });
  }

  /* Strip plot: los casos de cada grupo con un desplazamiento horizontal aleatorio (siempre el mismo) y la media del grupo */
  function casosDispersos(el, s) {
    var d = s.datos, G = d._grupos, opc = opcionesTooltip(s), conMarca = s.marca !== 'ninguna';
    var azar = azarFijo(20260);
    var puntos = [];
    G.forEach(function (g, i) { g.orden.forEach(function (v) { puntos.push([i, v, azar() - 0.5]); }); });
    var centros = G.map(function (g, i) { return [i, s.marca === 'mediana' ? cuantil(g.orden, 0.5) : media(g.orden)]; });
    var nombreMarca = (s.marca === 'mediana' ? 'Mediana' : 'Media') + (G.length > 1 ? ' del grupo' : '');
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.firstChild, function (w) {
      var series = [{
        type: 'custom', name: s.titulo, data: puntos, encode: { x: 0, y: 1 }, z: 3,
        renderItem: function (params, api) {
          var p = api.coord([api.value(0), api.value(1)]), banda = api.size([1, 0])[0];
          return { type: 'circle', shape: { cx: p[0] + api.value(2) * Math.min(48, banda * 0.4), cy: p[1], r: 4 }, style: { fill: T.actual, stroke: T.fondo, lineWidth: 1.5 } };
        }
      }];
      if (conMarca) series.push({
        type: 'custom', name: nombreMarca, data: centros, encode: { x: 0, y: 1 }, z: 5,
        renderItem: function (params, api) {
          var p = api.coord([api.value(0), api.value(1)]), m = Math.min(64, api.size([1, 0])[0] * 0.6) / 2;
          return { type: 'line', shape: { x1: p[0] - m, y1: p[1], x2: p[0] + m, y2: p[1] }, style: { stroke: P.neutro700, lineWidth: 2.5 } };
        }
      });
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        graphic: { elements: conMarca ? leyendaDerecha(w, nombreMarca) : [] },
        grid: { left: 4, right: 8, top: conMarca ? 28 : 12, bottom: 4, containLabel: true },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (p) {
            var g = G[p.value[0]], txt = formatear(p.value[1], opc).texto;
            return g.nombre ? cabeceraTooltip(g.nombre) + filaTooltip(p.seriesIndex === 1 ? nombreMarca : 'Valor', txt) : cabeceraTooltip(p.seriesIndex === 1 ? nombreMarca + ': ' + txt : txt);
          }
        }),
        xAxis: ejeCategoriaColumnas(G.map(function (g) { return g.nombre; }), w),
        yAxis: ejeValorY(),
        series: series
      };
    });
  }

  /* Generador pseudoaleatorio con semilla (mulberry32): el mismo dibujo cada vez */
  function azarFijo(semilla) {
    var a = semilla >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), a | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  /* Enjambre: coloca cada punto (x en píxeles), de izquierda a derecha, lo más cerca posible de la línea central sin tocar a los ya colocados */
  function enjambre(xs, D) {
    var orden = xs.map(function (x, i) { return i; }).sort(function (a, b) { return xs[a] - xs[b]; });
    var ys = new Array(xs.length), puestos = [];
    orden.forEach(function (i) {
      var x = xs[i], vecinos = [];
      for (var k = puestos.length - 1; k >= 0 && x - xs[puestos[k]] < D; k--) vecinos.push(puestos[k]);
      var candidatos = [0];
      vecinos.forEach(function (j) { var dy = Math.sqrt(D * D - (x - xs[j]) * (x - xs[j])); candidatos.push(ys[j] + dy, ys[j] - dy); });
      candidatos.sort(function (a, b) { return Math.abs(a) - Math.abs(b); });
      var y = null;
      for (var c = 0; c < candidatos.length && y == null; c++) {
        var libre = vecinos.every(function (j) { var dx = x - xs[j], dy = candidatos[c] - ys[j]; return dx * dx + dy * dy >= D * D - 1e-6; });
        if (libre) y = candidatos[c];
      }
      ys[i] = y == null ? candidatos[candidatos.length - 1] : y;
      puestos.push(i);
    });
    return ys;
  }

  /* Beeswarm: los casos de cada grupo en una fila, recolocados para que no se toquen */
  function casosEnjambre(el, s) {
    var d = s.datos, G = d._grupos, opc = opcionesTooltip(s), filas = G.length, multi = filas > 1 || G.some(function (g) { return esTexto(g.nombre); });
    var conMarca = s.marca !== 'ninguna', D = 11;
    var todos = [].concat.apply([], G.map(function (g) { return g.orden; }));
    var mn = Math.min.apply(null, todos), mx = Math.max.apply(null, todos);
    var anchoNombres = multi ? maxMedida(G.map(function (g) { return g.nombre; })) + 16 : 0;
    var c = tarjeta(el, s, lienzo(s, 200));
    /* Alto de cada fila según el enjambre más ancho, estimado con el ancho actual */
    var lz = c.firstChild, px = (Math.max(200, lz.clientWidth || 340) - anchoNombres - 30) / ((mx - mn) || 1);
    var semi = Math.max.apply(null, G.map(function (g) { return Math.max.apply(null, enjambre(g.orden.map(function (x) { return (x - mn) * px; }), D).map(Math.abs)); }));
    var banda = Math.max(multi ? 48 : 150, 2 * semi + D + 10), arriba = conMarca ? 26 : 6;
    lz.style.height = Math.round(Math.min(560, arriba + filas * banda + 30)) + 'px';
    var puntos = [];
    G.forEach(function (g, f) { g.orden.forEach(function (x, k) { puntos.push([x, f, k]); }); });
    var centros = G.map(function (g, f) { return [s.marca === 'media' ? media(g.orden) : cuantil(g.orden, 0.5), f]; });
    var nombreMarca = (s.marca === 'media' ? 'Media' : 'Mediana') + (filas > 1 ? ' del grupo' : '');
    var cache = {};
    function desplazamientos(api, cs) {
      var clave = Math.round(cs.width) + 'x' + Math.round(cs.height);
      if (cache.clave === clave) return cache.ys;
      var lim = cs.height / filas / 2 - D / 2 - 1;
      cache = { clave: clave, ys: G.map(function (g, f) {
        var ys = enjambre(g.orden.map(function (x) { return api.coord([x, f])[0]; }), D), m = Math.max.apply(null, ys.map(Math.abs));
        return m > lim && m > 0 ? ys.map(function (y) { return y * lim / m; }) : ys;
      }) };
      return cache.ys;
    }
    return montarECharts(c.firstChild, function (w) {
      var series = [{
        type: 'custom', name: s.titulo, data: puntos, encode: { x: 0, y: 1 }, z: 3,
        renderItem: function (params, api) {
          var f = api.value(1), p = api.coord([api.value(0), f]), dy = desplazamientos(api, params.coordSys)[f][api.value(2)];
          return { type: 'circle', shape: { cx: p[0], cy: p[1] + dy, r: 4.5 }, style: { fill: T.actual, stroke: T.fondo, lineWidth: 1 } };
        }
      }];
      if (conMarca) series.push({
        type: 'custom', name: nombreMarca, data: centros, encode: { x: 0, y: 1 }, z: 5,
        renderItem: function (params, api) {
          var p = api.coord([api.value(0), api.value(1)]), m = params.coordSys.height / filas * 0.42;
          return { type: 'line', shape: { x1: p[0], y1: p[1] - m, x2: p[0], y2: p[1] + m }, style: { stroke: P.neutro700, lineWidth: 2.5 } };
        }
      });
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        graphic: { elements: conMarca ? leyendaDerecha(w, nombreMarca) : [] },
        grid: { left: 4, right: 14, top: arriba, bottom: 4, containLabel: true },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (p) {
            var g = G[p.value[1]], txt = formatear(p.value[0], opc).texto;
            return g.nombre ? cabeceraTooltip(g.nombre) + filaTooltip(p.seriesIndex === 1 ? nombreMarca : 'Valor', txt) : cabeceraTooltip(p.seriesIndex === 1 ? nombreMarca + ': ' + txt : txt);
          }
        }),
        xAxis: ejeValorConMarcas(),
        yAxis: Object.assign(ejeCategoriaFilas(G.map(function (g) { return g.nombre; }), T.etiquetaEje), multi ? {} : { show: false, axisLabel: { show: false } }),
        series: series
      };
    });
  }

  R.distribucion = function (el, s) {
    if (s.variante === 'normal') return distribucionNormal(el, s);
    return s.variante === 'acumulada' ? distribucionAcumulada(el, s) : distribucionDensidad(el, s);
  };
  function tooltipPorDebajo(s, porcentajeEn, nota) {
    var opc = opcionesTooltip(s), casos = nombreCasos(s);
    return Object.assign(tooltipBase(), {
      trigger: 'axis', axisPointer: { type: 'line', lineStyle: { color: T.base, width: 1 } },
      formatter: function (ps) {
        var x = ps[0].value[0];
        return cabeceraTooltip(formatear(x, opc).texto) + '<div>' + porcentaje(porcentajeEn(x), 0) + ' de los ' + esc(casos) + ' por debajo' + (nota ? ' ' + nota : '') + '</div>';
      }
    });
  }
  /* Extremos del eje de una distribución: los de los datos más un margen, sin bajar de 0 ni pasar de 100 % si los datos no lo hacen */
  function ejeDistribucion(o, margen, s) {
    var n = o.length, a = o[0] - margen, b = o[n - 1] + margen;
    var e = extremosBonitos(a, b, 5);
    if (o[0] >= 0) e.lo = Math.max(e.lo, 0);
    if (s.unidad === '%' && o[n - 1] <= 100) e.hi = Math.min(e.hi, 100);
    return e;
  }

  /* Density plot: curva suave (núcleo gaussiano, ancho de banda de Silverman) con relleno Naranja 100 */
  function distribucionDensidad(el, s) {
    var o = s.datos._orden, h = bandaSilverman(o), e = ejeDistribucion(o, 2 * h, s), curva = [];
    for (var k = 0; k <= 160; k++) { var x = limpio(e.lo + (e.hi - e.lo) * k / 160); curva.push([x, densidadEn(o, h, x)]); }
    var ymax = Math.max.apply(null, curva.map(function (p) { return p[1]; })), punto = null;
    if (s.marca === 'moda') {
      var cima = curva.reduce(function (a, b) { return b[1] > a[1] ? b : a; });
      punto = { x: comoLosDatos(cima[0], o), nombre: 'Moda' };
    } else if (s.marca !== 'ninguna') punto = { x: s.marca === 'media' ? media(o) : cuantil(o, 0.5), nombre: s.marca === 'media' ? 'Media' : 'Mediana' };
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.firstChild, function () {
      var series = [{
        type: 'line', name: s.titulo, data: curva, symbol: 'none', z: 2, emphasis: { disabled: true },
        lineStyle: { color: T.actual, width: 2.5, cap: 'round', join: 'round' }, areaStyle: { color: RELLENO_DIST, opacity: 1 }
      }];
      if (punto) series.push({
        type: 'scatter', silent: true, z: 4, symbolSize: 10, tooltip: { show: false },
        data: [{ value: [punto.x, densidadEn(o, h, punto.x)], itemStyle: { color: T.actual, borderColor: T.fondo, borderWidth: 2 } }],
        label: Object.assign(estiloTexto(P.neutro700, 600), { show: true, position: 'top', distance: 8, formatter: textoMarca(punto.nombre, punto.x, s) })
      });
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        grid: { left: 14, right: 14, top: 12, bottom: 4, containLabel: true },
        tooltip: tooltipPorDebajo(s, function (x) { return fraccionHasta(o, x); }),
        xAxis: ejeValorConMarcas({ min: e.lo, max: e.hi, interval: (e.hi - e.lo) / e.paso > 7 ? 2 * e.paso : e.paso }),
        yAxis: ejeOculto(0, ymax * (punto ? 1.22 : 1.06)),
        series: series
      };
    });
  }

  /* Curva de distribución: normal teórica con ±1 desviación sombreada */
  function distribucionNormal(el, s) {
    var d = s.datos, mu = d._media, sd = d._desv, A = 3;
    var f = function (x) { var z = (x - mu) / sd; return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI)); };
    var curva = [], banda = [];
    for (var k = 0; k <= 128; k++) { var x = mu - A * sd + 2 * A * sd * k / 128; curva.push([x, f(x)]); }
    for (k = 0; k <= 40; k++) { x = mu - sd + 2 * sd * k / 40; banda.push([x, f(x)]); }
    if (!esTexto(s.nota) && d._orden) {
      var dentro = d._orden.filter(function (v) { return Math.abs(v - mu) <= sd; }).length / d._orden.length * 100;
      s.nota = 'Curva normal con la media (' + fmtDato(mu, s) + ') y la desviación típica (' + fmtDato(sd, s) + ') de los datos. En los datos, el ' + porcentaje(dentro, 0) + ' de los ' + nombreCasos(s) + ' queda a menos de una desviación de la media.';
    }
    var c = tarjeta(el, s, lienzo(s));
    var linea = function (x, estilo) { return [Object.assign({ coord: [x, 0] }, { lineStyle: estilo }), { coord: [x, f(x)] }]; };
    return montarECharts(c.firstChild, function () {
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        grid: { left: 14, right: 14, top: 12, bottom: 4, containLabel: true },
        tooltip: tooltipPorDebajo(s, function (x) { return normalAcumulada((x - mu) / sd) * 100; }, '(curva teórica)'),
        xAxis: {
          type: 'value', min: mu - A * sd, max: mu + A * sd,
          axisLine: { show: true, lineStyle: { color: T.base, width: 1 } }, axisTick: { show: false }, splitLine: { show: false },
          axisLabel: {
            customValues: [mu - sd, mu, mu + sd], margin: 8, lineHeight: 14,
            formatter: function (v) {
              var k = Math.round((v - mu) / sd);
              return (k === 0 ? '{m|Media}' : '{n|' + (k < 0 ? '\u22121' : '+1') + ' desv.}') + '\n{v|' + sinLlaves(fmtDato(v, s)) + '}';
            },
            rich: { n: estiloTexto(T.etiquetaEje), m: estiloTexto(P.neutro700, 600), v: estiloTexto(T.etiquetaEje) }
          }
        },
        yAxis: ejeOculto(0, f(mu) * 1.08),
        series: [
          {
            type: 'line', silent: true, data: banda, symbol: 'none', z: 1, lineStyle: { width: 0 }, areaStyle: { color: RELLENO_DIST, opacity: 1 }, tooltip: { show: false },
            markLine: { silent: true, symbol: 'none', animation: false, label: { show: false },
              data: [linea(mu - sd, { color: T.base, width: 1, type: 'solid' }), linea(mu + sd, { color: T.base, width: 1, type: 'solid' }), linea(mu, { color: P.neutro700, width: 1.5, type: [5, 3] })] }
          },
          { type: 'line', name: s.titulo, data: curva, symbol: 'none', z: 3, emphasis: { disabled: true }, lineStyle: { color: T.actual, width: 2.5, cap: 'round', join: 'round' } },
          {
            type: 'custom', silent: true, z: 5, data: [[mu, f(mu) * 0.45]], encode: { x: 0, y: 1 }, tooltip: { show: false },
            renderItem: function (params, api) {
              var p = api.coord([api.value(0), api.value(1)]), ancho = api.coord([mu + sd, 0])[0] - api.coord([mu - sd, 0])[0];
              var txt = '68\u00A0% de los ' + nombreCasos(s), cabe = medir(txt, 600) + 8 <= ancho;
              return { type: 'text', style: { text: cabe ? txt : '68\u00A0%\nde los ' + nombreCasos(s), x: p[0], y: p[1], align: 'center', verticalAlign: 'middle', fill: P.neutro700, font: '600 11px ' + FUENTE, lineHeight: 14, backgroundColor: RELLENO_DIST, padding: [2, 3] } };
            }
          }
        ]
      };
    });
  }

  /* Distribución acumulada: % de casos por debajo de cada valor, con la mediana y un percentil clave */
  function distribucionAcumulada(el, s) {
    var o = s.datos._orden, n = o.length, P2 = s.percentil;
    var curva = o.map(function (x, i) { return [x, i / (n - 1) * 100]; });
    var med = cuantil(o, 0.5), qp = cuantil(o, P2 / 100), e = extremosBonitos(o[0], o[n - 1], 5);
    var c = tarjeta(el, s, lienzo(s));
    var guia = function (desde, hasta, estilo) { return [{ coord: desde, lineStyle: estilo }, { coord: hasta }]; };
    var fuerte = { color: P.neutro600, width: 1.5, type: [5, 3] }, suave = { color: T.base, width: 1, type: [3, 3] };
    return montarECharts(c.firstChild, function () {
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        grid: { left: 4, right: 14, top: 12, bottom: 4, containLabel: true },
        tooltip: tooltipPorDebajo(s, function (x) { return fraccionHasta(o, x) ; }),
        xAxis: ejeValorConMarcas({ min: e.lo, max: e.hi, interval: (e.hi - e.lo) / e.paso > 7 ? 2 * e.paso : e.paso }),
        yAxis: Object.assign(ejeValor(), { max: 100, interval: 25, axisLabel: Object.assign(estiloTexto(T.etiquetaEje), { formatter: function (v) { return porcentaje(v, 0); } }) }),
        series: [
          {
            type: 'line', name: s.titulo, data: curva, symbol: 'none', z: 3, emphasis: { disabled: true }, lineStyle: { color: T.actual, width: 2.5, cap: 'round', join: 'round' },
            markLine: { silent: true, symbol: 'none', animation: false, label: { show: false }, z: 2,
              data: [guia([e.lo, 50], [med, 50], fuerte), guia([med, 50], [med, 0], fuerte), guia([e.lo, P2], [qp, P2], suave), guia([qp, P2], [qp, 0], suave)] }
          },
          {
            type: 'scatter', silent: true, z: 4, symbolSize: 10, tooltip: { show: false },
            itemStyle: { color: T.actual, borderColor: T.fondo, borderWidth: 2 },
            label: Object.assign(estiloTexto(P.neutro700, 600), { show: true }),
            data: [
              { value: [med, 50], label: { position: 'right', offset: [2, 13], formatter: 'Mediana (P50)' } },
              /* A la derecha y debajo del punto, como la mediana: a la izquierda (como en Figma) el rótulo cae sobre la curva */
              { value: [qp, P2], label: { position: 'right', offset: [2, 13], formatter: 'P' + numero(P2) } }
            ]
          }
        ]
      };
    });
  }

  /* Percentile plot: la posición de cada elemento en una escala de 0 a 100, con el propio en naranja */
  R.percentiles = function (el, s) {
    var d = s.datos, opc = opcionesTooltip(s), crudo = d.grupo != null;
    var pares = d.categorias.map(function (c, i) { return { nombre: c, pct: d._pct[i], valor: d.valores[i] }; });
    if (s.orden === 'valor') pares.sort(function (a, b) { return b.pct - a.pct; });
    var foco = s.destacar, FILA = 44;
    var c = tarjeta(el, s, lienzo(s, pares.length * FILA + 58));
    var MARCAS = [0, 25, 50, 75, 90];
    return montarECharts(c.firstChild, {
      textStyle: { fontFamily: FUENTE }, animationDuration: 500,
      grid: { left: 4, right: 12, top: 4, bottom: 24, containLabel: true },
      graphic: { elements: [{ type: 'text', silent: true, right: 12, bottom: 2, style: { text: 'Percentil dentro del grupo', fill: T.etiquetaEje, font: '400 11px ' + FUENTE } }] },
      tooltip: Object.assign(tooltipBase(), {
        trigger: 'item',
        formatter: function (p) {
          var x = pares[p.dataIndex];
          return cabeceraTooltip(x.nombre) + filaTooltip('Percentil', 'P' + numero(Math.round(x.pct))) + (crudo ? filaTooltip('Valor', formatear(x.valor, opc).texto) : '') +
            notaTooltip('Por encima del ' + porcentaje(x.pct, 0) + ' del grupo');
        }
      }),
      xAxis: {
        type: 'value', min: 0, max: 100,
        axisLine: { show: true, lineStyle: { color: T.base, width: 1 } },
        axisTick: { show: true, length: 5, customValues: MARCAS, lineStyle: { color: T.base, width: 1 } },
        axisLabel: Object.assign(estiloTexto(T.etiquetaEje), { customValues: MARCAS, margin: 10, formatter: function (v) { return 'P' + v; } }),
        splitLine: { show: true, lineStyle: { color: T.rejilla, width: 1 } }
      },
      yAxis: {
        type: 'category', inverse: true, data: pares.map(function (x) { return x.nombre; }),
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { margin: 16, formatter: function (v) { return v === foco ? '{f|' + sinLlaves(v) + '}' : '{o|' + sinLlaves(v) + '}'; }, rich: { f: estiloTexto(P.neutro700, 600), o: estiloTexto(P.neutro600) } }
      },
      series: [{
        type: 'bar', name: s.titulo, barWidth: 18, showBackground: true, backgroundStyle: { color: T.pista, borderRadius: 4 },
        emphasis: { focus: 'none', itemStyle: { opacity: 0.9 } },
        data: pares.map(function (x) {
          return { value: x.pct, itemStyle: { color: x.nombre === foco ? T.actual : T.anterior, borderRadius: 4 },
            label: x.pct > 86 ? { position: 'insideRight', distance: 8 } : { position: 'right', distance: 10 } };
        }),
        label: Object.assign(estiloTexto(P.neutro700, 600), { show: true, formatter: function (p) { return 'P' + numero(Math.round(p.value)); } })
      }]
    });
  };

  R.rangos = function (el, s) {
    if (s.variante === 'min-max') return rangoMinMax(el, s);
    return s.variante === 'intervalo' ? rangoIntervalo(el, s) : rangoHorizontal(el, s);
  };
  function filasRango(s, nombreValor) {
    var d = s.datos, opc = opcionesTooltip(s);
    return function (i) {
      return [['Máximo', d.maximos[i]]].concat(d.valores ? [[nombreValor, d.valores[i]]] : []).concat([['Mínimo', d.minimos[i]]])
        .map(function (f) { return filaTooltip(f[0], formatear(f[1], opc).texto); }).join('');
    };
  }

  /* Range plot: banda mín–máx en Naranja 100 con remates y el punto central en Naranja 500 */
  function rangoHorizontal(el, s) {
    var d = s.datos, nombreValor = esTexto(s.nombreValor) ? s.nombreValor : 'Media';
    var idx = d.categorias.map(function (c, i) { return i; });
    if (s.orden === 'valor') idx.sort(function (a, b) { return (d.valores ? d.valores[b] - d.valores[a] : d.maximos[b] - d.maximos[a]); });
    var filas = filasRango(s, nombreValor);
    var c = tarjeta(el, s, lienzo(s, Math.max(120, idx.length * 33 + 30)));
    return montarECharts(c.firstChild, {
      textStyle: { fontFamily: FUENTE }, animationDuration: 500,
      grid: { left: 4, right: 16, top: 4, bottom: 4, containLabel: true },
      tooltip: Object.assign(tooltipBase(), { trigger: 'item', formatter: function (p) { var i = idx[p.dataIndex]; return cabeceraTooltip(d.categorias[i]) + filas(i); } }),
      xAxis: { type: 'value', scale: true, splitNumber: 4, axisLine: { show: false }, axisTick: { show: false },
        axisLabel: Object.assign(estiloTexto(T.etiquetaEje), { formatter: formatoEje, margin: 10, hideOverlap: true }), splitLine: { lineStyle: { color: T.rejilla, width: 1 } } },
      yAxis: Object.assign(ejeCategoriaFilas(idx.map(function (i) { return d.categorias[i]; }), T.etiquetaEje), { axisLine: { show: true, lineStyle: { color: T.base, width: 1 } } }),
      series: [{
        type: 'custom', name: s.titulo, data: idx.map(function (i, k) { return [d.minimos[i], d.maximos[i], k]; }), encode: { x: [0, 1], y: 2 },
        renderItem: function (params, api) {
          var k = api.value(2), i = idx[k], a = api.coord([api.value(0), k]), b = api.coord([api.value(1), k]), y = a[1];
          var hijos = [
            { type: 'rect', shape: { x: a[0], y: y - 8, width: Math.max(1, b[0] - a[0]), height: 16 }, style: { fill: RELLENO_DIST } },
            { type: 'line', shape: { x1: a[0], y1: y - 8, x2: a[0], y2: y + 8 }, style: { stroke: T.actual, lineWidth: 2 } },
            { type: 'line', shape: { x1: b[0], y1: y - 8, x2: b[0], y2: y + 8 }, style: { stroke: T.actual, lineWidth: 2 } }
          ];
          if (d.valores) hijos.push({ type: 'circle', shape: { cx: api.coord([d.valores[i], k])[0], cy: y, r: 6 }, style: { fill: T.actual, stroke: T.fondo, lineWidth: 1.5 } });
          return { type: 'group', children: hijos };
        }
      }]
    });
  }

  /* Min–max chart: cápsula mín–máx por periodo, con la media y el máximo rotulado */
  function rangoMinMax(el, s) {
    var d = s.datos, nombreValor = esTexto(s.nombreValor) ? s.nombreValor : 'Media', filas = filasRango(s, nombreValor);
    var leyenda = [{ texto: 'Rango mín–máx', color: RELLENO_DIST, borde: T.actual, grosor: 1 }];
    if (d.valores) leyenda.push({ texto: nombreValor, forma: 'circulo', color: T.actual });
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.firstChild, function (w) {
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        graphic: { elements: gLeyenda(leyenda, 6) },
        grid: { left: 4, right: 8, top: 40, bottom: 4, containLabel: true },
        tooltip: Object.assign(tooltipBase(), { trigger: 'item', formatter: function (p) { return cabeceraTooltip(d.categorias[p.dataIndex]) + filas(p.dataIndex); } }),
        xAxis: ejeCategoriaColumnas(d.categorias, w),
        yAxis: ejeValorY(),
        series: [{
          type: 'custom', name: s.titulo, data: d.categorias.map(function (x, i) { return [i, d.minimos[i], d.maximos[i]]; }), encode: { x: 0, y: [1, 2] },
          renderItem: function (params, api) {
            var i = api.value(0), x = api.coord([i, 0])[0], cw = Math.min(22, api.size([1, 0])[0] * 0.6);
            var y1 = api.coord([i, api.value(2)])[1], y0 = api.coord([i, api.value(1)])[1], h = Math.max(cw, y0 - y1), top = (y0 + y1) / 2 - h / 2;
            var hijos = [
              { type: 'rect', shape: { x: x - cw / 2, y: top, width: cw, height: h, r: cw / 2 }, style: { fill: RELLENO_DIST } },
              { type: 'text', silent: true, style: { text: fmtDato(d.maximos[i], s), x: x, y: top - 11, fill: T.leyenda, font: '400 11px ' + FUENTE, align: 'center', verticalAlign: 'middle' } }
            ];
            if (d.valores) hijos.push({ type: 'circle', shape: { cx: x, cy: api.coord([i, d.valores[i]])[1], r: 5 }, style: { fill: T.actual, stroke: T.fondo, lineWidth: 1.5 } });
            return { type: 'group', children: hijos };
          }
        }]
      };
    });
  }

  /* Interval plot: estimación con su intervalo de confianza y, si se indica, la referencia global discontinua */
  function rangoIntervalo(el, s) {
    var d = s.datos, opc = opcionesTooltip(s), nombreValor = esTexto(s.nombreValor) ? s.nombreValor : 'Estimación', r = d.referencia;
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.firstChild, function (w) {
      var series = [{
        type: 'custom', name: s.titulo, data: d.categorias.map(function (x, i) { return [i, d.minimos[i], d.maximos[i], d.valores[i]]; }), encode: { x: 0, y: [1, 2, 3] }, z: 3,
        renderItem: function (params, api) {
          var i = api.value(0), x = api.coord([i, 0])[0], Y = function (k) { return api.coord([i, api.value(k)])[1]; }, tope = 6, trazo = { stroke: P.neutro600, lineWidth: 1.5 };
          return { type: 'group', children: [
            { type: 'line', shape: { x1: x, y1: Y(1), x2: x, y2: Y(2) }, style: trazo },
            { type: 'line', shape: { x1: x - tope, y1: Y(1), x2: x + tope, y2: Y(1) }, style: trazo },
            { type: 'line', shape: { x1: x - tope, y1: Y(2), x2: x + tope, y2: Y(2) }, style: trazo },
            { type: 'circle', z2: 2, shape: { cx: x, cy: Y(3), r: 6 }, style: { fill: T.actual, stroke: T.fondo, lineWidth: 1.5 } }
          ] };
        }
      }];
      var rotulo = r ? r.nombre + NBSP + fmtDato(r.valor, s) : '';
      if (r) series.push({
        type: 'custom', silent: true, z: 2, data: [[0, r.valor]], encode: { x: 0, y: 1 }, tooltip: { show: false },
        renderItem: function (params, api) {
          var cs = params.coordSys, y = api.coord([0, api.value(1)])[1];
          return { type: 'line', shape: { x1: cs.x, y1: y, x2: cs.x + cs.width, y2: y }, style: { stroke: P.neutro600, lineWidth: 1.5, lineDash: [6, 4] } };
        }
      });
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        graphic: { elements: r ? leyendaDerecha(w, rotulo, { peso: 600, color: P.neutro600, trazo: P.neutro600, grosor: 1.5, discontinua: [4, 3] }) : [] },
        grid: { left: 4, right: 8, top: r ? 32 : 12, bottom: 4, containLabel: true },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (p) {
            var i = p.dataIndex;
            return cabeceraTooltip(d.categorias[i]) + filaTooltip(nombreValor, formatear(d.valores[i], opc).texto) +
              filaTooltip('Intervalo al ' + numero(s.confianza) + NBSP + '%', rangoTexto(d.minimos[i], d.maximos[i], s)) + (r ? notaTooltip(esc(r.nombre) + ': ' + formatear(r.valor, opc).texto) : '');
          }
        }),
        xAxis: ejeCategoriaColumnas(d.categorias, w),
        yAxis: ejeValorY(),
        series: series
      };
    });
  }

  /* ================================================================== */
  /* Familia Relación y correlación                                      */
  /* ================================================================== */
  var COLOR_GRUPO = [P.naranja500, P.neutro600, P.naranja300]; /* un color por grupo, hasta 3 (Bubble scatter) */
  var COLOR_HEX = [P.naranja100, P.naranja300, P.naranja500, P.naranja600, P.naranja700]; /* hexbin: secuencial de 5 clases */
  var RADIO_HEX = 11.5; /* hexágono de 20 × 23 px, con el vértice arriba */
  function tituloEje(e) { return e.nombre + (e.unidad ? ' (' + e.unidad + ')' : ''); }
  function fmtEje(v, e, s) { return formatear(v, { unidad: e.unidad, decimales: s.decimales, abreviar: s.abreviar }).texto; }
  function minusculaInicial(t) { t = String(t); return t.length > 1 && t.charAt(1) === t.charAt(1).toLowerCase() ? t.charAt(0).toLowerCase() + t.slice(1) : t; }
  /* Rótulos de un eje con los decimales justos (0,25 no se redondea a 0,3) */
  function formatoEjeFino(v) {
    var a = Math.abs(v), div = a >= 1e6 ? 1e6 : (a >= 1e4 ? 1e3 : 1), n = limpio(v / div), t = String(n);
    if (t.indexOf('e') >= 0) return formatoEje(v);
    return numero(n, Math.min(3, (t.split('.')[1] || '').length)) + (div === 1e6 ? NBSP + 'M' : (div === 1e3 ? NBSP + 'mil' : ''));
  }
  function marcasDe(e) { var r = []; for (var k = 0; e.lo + k * e.paso <= e.hi + e.paso * 1e-9; k++) r.push(limpio(e.lo + k * e.paso)); return r; }
  /* Escala de un eje de dispersión: de los pasos bonitos (1, 2, 2,5 o 5 por una potencia de 10), el que deja el rango más corto con hueco
     para el punto o la burbuja (margen, en px) y sin rótulos amontonados (pxTramo: px mínimos entre marcas). Parte de cero si los datos
     empiezan cerca de él y no baja de cero si no hay negativos. */
  function escalaEje(min, max, largo, margen, maxTramos, pxTramo) {
    var desdeCero = min >= 0 && min <= 0.3 * max, hastaCero = max <= 0 && max >= 0.3 * min;
    var a = desdeCero ? 0 : min, b = hastaCero ? 0 : max;
    if (!(b > a)) { a -= 1; b += 1; }
    var E = Math.floor(Math.log(b - a) / Math.LN10), mejor = null;
    for (var e10 = E - 2; e10 <= E + 1; e10++) [1, 2, 2.5, 5].forEach(function (f) {
      var p = limpio(f * Math.pow(10, e10)), lo = limpio(Math.floor(a / p + 1e-9) * p), hi = limpio(Math.ceil(b / p - 1e-9) * p);
      for (var k = 0; k < 4; k++) {
        var u = largo / (hi - lo), lo2 = lo, hi2 = hi;
        if ((min - lo) * u < margen) lo2 = min >= 0 ? Math.max(0, limpio(lo - p)) : limpio(lo - p);
        if ((hi - max) * u < margen) hi2 = max <= 0 ? Math.min(0, limpio(hi + p)) : limpio(hi + p);
        if (lo2 === lo && hi2 === hi) break;
        lo = lo2; hi = hi2;
      }
      var tramos = Math.round((hi - lo) / p), e = { lo: lo, hi: hi, paso: p };
      if (tramos < 2 || tramos > maxTramos || largo / tramos < pxTramo(e)) return;
      e.coste = (hi - lo) * (p % 1 && b - a >= 5 ? 1.35 : 1); /* un paso con decimales solo compensa si ahorra mucho rango */
      if (!mejor || e.coste < mejor.coste - 1e-9 || (Math.abs(e.coste - mejor.coste) < 1e-9 && p > mejor.paso)) mejor = e;
    });
    return mejor || extremosBonitos(a, b, 2);
  }
  /* Plano de dos ejes de valores con la geometría fijada (sin containLabel), para saber en qué píxel cae cada dato.
     o: { x: [min, max], y: [min, max], ejes, margen (px de holgura), arriba (px por encima del área) } */
  function planoXY(w, h, o) {
    var arriba = o.arriba, abajo = 46, mg = o.margen || 0, alto0 = Math.max(60, h - arriba - abajo);
    var ey = escalaEje(o.y[0], o.y[1], alto0, mg, 6, function () { return 26; });
    var izq = maxMedida(marcasDe(ey).map(formatoEjeFino)) + 10;
    var ex = escalaEje(o.x[0], o.x[1], Math.max(100, w - izq - 14), mg, 6, function (e) { return maxMedida(marcasDe(e).map(formatoEjeFino)) + 10; });
    var et = marcasDe(ex).map(formatoEjeFino), der = Math.ceil(medir(et[et.length - 1]) / 2) + 2, ancho = w - izq - der;
    var alto = h - arriba - abajo, linea = { color: T.base, width: 1 };
    return {
      ex: ex, ey: ey, area: { x: izq, y: arriba, w: ancho, h: alto },
      px: function (x) { return izq + (x - ex.lo) / (ex.hi - ex.lo) * ancho; },
      py: function (y) { return arriba + (ey.hi - y) / (ey.hi - ey.lo) * alto; },
      grid: { left: izq, right: der, top: arriba, bottom: abajo, containLabel: false },
      xAxis: {
        type: 'value', min: ex.lo, max: ex.hi, interval: ex.paso,
        axisLine: { show: true, onZero: false, lineStyle: linea }, axisTick: { show: true, length: 4, lineStyle: linea },
        axisLabel: Object.assign(estiloTexto(T.etiquetaEje), { formatter: formatoEjeFino, margin: 8 }), splitLine: { show: false }
      },
      yAxis: {
        type: 'value', min: ey.lo, max: ey.hi, interval: ey.paso, axisLine: { show: false }, axisTick: { show: false },
        axisLabel: Object.assign(estiloTexto(T.etiquetaEje), { formatter: formatoEjeFino, margin: 8 }), splitLine: { lineStyle: { color: T.rejilla, width: 1 } }
      },
      titulos: [
        gTexto(recortar(tituloEje(o.ejes.y), o.fila1 ? w * 0.6 : w, 600), 0, 8, { color: T.leyenda, peso: 600 }),
        gTexto(recortar(tituloEje(o.ejes.x), w, 600), izq + ancho / 2, h - 7, { color: T.leyenda, peso: 600, align: 'center' })
      ]
    };
  }
  /* Leyenda de una fila arriba a la derecha, junto al título del eje vertical (ocupado: su ancho); si no cabe, en filas propias
     debajo. Devuelve { elementos, arriba } (arriba: dónde empieza el área del gráfico) */
  function leyendaArriba(items, w, ocupado) {
    if (!items.length) return { elementos: [], arriba: 26, fila1: false };
    var muestra = function (it) { return it.forma === 'tamano' ? 18 : (it.forma === 'linea' ? 16 : 8); };
    var anchos = items.map(function (it) { return it.forma === 'escala' ? medir(it.texto) + 80 + medir(it.despues) : muestra(it) + 5 + medir(it.texto); });
    var total = suma(anchos) + 16 * (items.length - 1), filas = [];
    if (total <= w - ocupado - 16) filas.push({ y: 8, x: w - total, k: items.map(function (it, k) { return k; }) });
    else {
      var f = { y: 26, x: 0, k: [], ancho: 0 };
      items.forEach(function (it, k) {
        if (f.k.length && f.ancho + 16 + anchos[k] > w) { filas.push(f); f = { y: f.y + 18, x: 0, k: [], ancho: 0 }; }
        f.ancho += (f.k.length ? 16 : 0) + anchos[k]; f.k.push(k);
      });
      filas.push(f);
    }
    var els = [];
    filas.forEach(function (f) {
      var x = f.x;
      f.k.forEach(function (k) {
        var it = items[k], y = f.y;
        if (it.forma === 'escala') {
          /* Escala secuencial: «Menos», las muestras de 14 × 10 px con borde Neutro 300 y «Más …» */
          els.push(gTexto(it.texto, x, y, { color: T.leyenda })); x += medir(it.texto) + 5;
          it.colores.forEach(function (col, j) { els.push(gRect(x + j * 14 + 0.5, y - 4.5, 13, 9, col, 0, 20, P.neutro300, 1)); });
          x += 75; els.push(gTexto(it.despues, x, y, { color: T.leyenda })); x += medir(it.despues) + 16;
          return;
        }
        if (it.forma === 'tamano') {
          els.push({ type: 'circle', silent: true, z: 20, shape: { cx: x + 3, cy: y + 3, r: 3 }, style: { fill: T.fondo, stroke: T.base, lineWidth: 1.2 } });
          els.push({ type: 'circle', silent: true, z: 20, shape: { cx: x + 12, cy: y, r: 6 }, style: { fill: T.fondo, stroke: T.base, lineWidth: 1.2 } });
        } else if (it.forma === 'linea') {
          var l = gLinea(x, y, x + 16, y, it.color, 2.5, 20);
          if (it.discontinua) { l.style.lineDash = it.discontinua; l.style.lineCap = 'butt'; }
          els.push(l);
        } else els.push(gCirculo(x + 4, y, 4, it.color, 20));
        x += muestra(it) + 5;
        els.push(gTexto(it.texto, x, y, { color: T.leyenda })); x += medir(it.texto) + 16;
      });
    });
    var ultima = filas[filas.length - 1];
    return { elementos: els, arriba: ultima.y === 8 ? 26 : ultima.y + 18, fila1: ultima.y === 8 };
  }
  /* Tooltip de un caso: nombre (o grupo), grupo y los valores de cada eje con su unidad */
  function tooltipCaso(s, E, p, grupos, extra) {
    var multi = grupos && grupos.length > 1, cab = p.nombre || (multi ? grupos[p.g] : '');
    var html = (cab ? cabeceraTooltip(cab) : '') + (p.nombre && multi ? '<div style="color:#DBD5CE;margin:-2px 0 2px">' + esc(grupos[p.g]) + '</div>' : '');
    html += filaTooltip(E.x.nombre, fmtEje(p.x, E.x, s)) + filaTooltip(E.y.nombre, fmtEje(p.y, E.y, s));
    if (p.t != null && E.tamano) html += filaTooltip(E.tamano.nombre, fmtEje(p.t, E.tamano, s));
    return html + (extra || '');
  }
  function rangoDe(lista) { return [Math.min.apply(null, lista), Math.max.apply(null, lista)]; }

  R.dispersion = function (el, s) {
    if (s.variante === 'hexagonos') return dispersionHexagonos(el, s);
    if (s.variante === 'cuadrantes') return dispersionCuadrantes(el, s);
    if (s.variante === 'conectada') return dispersionConectada(el, s);
    return dispersionPuntos(el, s);
  };

  /* Scatter plot, con tendencia, bubble chart y bubble scatter */
  function dispersionPuntos(el, s) {
    var d = s.datos, v = s.variante, E = d._ejes, Pt = d._puntos, G = d._grupos, multi = G.length > 1, aj = d._ajuste;
    var burbujas = v === 'burbujas' || v === 'burbujas-categoria';
    var foco = esTexto(s.destacar) ? s.destacar : null;
    var rotulos = (s.rotular || []).slice();
    if (foco && rotulos.indexOf(foco) < 0) rotulos.push(foco);
    var tmax = burbujas ? Math.max.apply(null, Pt.map(function (p) { return p.t; })) : 0;
    var DMAX = v === 'burbujas' ? 32 : 28; /* diámetro de la burbuja mayor (Figma: 32,6 y 28,6 px); el área es proporcional al valor */
    var diam = function (p) { return burbujas ? Math.max(4, DMAX * Math.sqrt(p.t / tmax)) : (foco && p.nombre === foco ? 12 : 9); };
    var colorDe = function (p) { return foco ? (p.nombre === foco ? T.actual : P.neutro400) : (multi ? COLOR_GRUPO[p.g] : T.actual); };
    if (aj && !esTexto(s.nota)) s.nota = 'La línea discontinua es la tendencia lineal (mínimos cuadrados). R² va de 0 a 1: cuanto más alto, más se ajustan los casos a la línea.';
    var rx = rangoDe(Pt.map(function (p) { return p.x; })), ry = rangoDe(Pt.map(function (p) { return p.y; }));
    var items = multi ? G.map(function (g, gi) { return { forma: 'circulo', color: COLOR_GRUPO[gi], texto: g }; }) : [];
    if (burbujas) items.push({ forma: 'tamano', texto: 'Tamaño = ' + minusculaInicial(tituloEje(E.tamano)) });
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.firstChild, function (w, h) {
      var ley = leyendaArriba(items, w, Math.min(w * 0.6, medir(tituloEje(E.y), 600)));
      var pl = planoXY(w, h, { x: rx, y: ry, ejes: E, margen: burbujas ? DMAX / 2 + 2 : 7, arriba: ley.arriba, fila1: ley.fila1 });
      var series = G.map(function (g, gi) {
        var propios = Pt.filter(function (p) { return p.g === gi; });
        if (burbujas) propios.sort(function (a, b) { return b.t - a.t; }); /* las pequeñas, encima de las grandes */
        else if (foco) propios.sort(function (a, b) { return (a.nombre === foco) - (b.nombre === foco); }); /* el destacado, encima */
        return {
          type: 'scatter', name: g || s.titulo, z: 3, clip: false, emphasis: { scale: false },
          data: propios.map(function (p) {
            var color = colorDe(p), item = { value: [p.x, p.y, p.i], symbolSize: diam(p), itemStyle: { color: color, borderColor: T.fondo, borderWidth: burbujas ? 2 : 1.5 } };
            if (v === 'burbujas') {
              var txt = fmtDato(p.t, s);
              if (diam(p) >= medir(txt, 600) + 12) item.label = Object.assign(estiloTexto(textoSobre(color), 600), { show: true, position: 'inside', formatter: txt });
            }
            return item;
          })
        };
      });
      var graficos = pl.titulos.concat(ley.elementos);
      if (aj) {
        series.push({
          type: 'line', name: '__tendencia', silent: true, z: 4, symbol: 'none', clip: true, tooltip: { show: false }, emphasis: { disabled: true },
          data: [[rx[0], aj.a + aj.b * rx[0]], [rx[1], aj.a + aj.b * rx[1]]], lineStyle: { color: P.neutro700, width: 2, type: DISCONTINUA }
        });
        graficos.push(gTexto('R² = ' + numero(aj.r2, 2), pl.area.x + pl.area.w, pl.area.y + 8, { color: P.neutro700, peso: 600, align: 'right' }));
      }
      /* Nombres de los casos clave, junto al punto (a la izquierda si no caben a la derecha) */
      Pt.forEach(function (p) {
        if (rotulos.indexOf(p.nombre) < 0) return;
        var fuerte = !foco || p.nombre === foco, peso = fuerte ? 600 : 400, x = pl.px(p.x), r = diam(p) / 2 + 5;
        var izq = x + r + medir(p.nombre, peso) > w - 2;
        graficos.push(gTexto(p.nombre, izq ? x - r : x + r, pl.py(p.y), { color: fuerte ? P.neutro700 : T.leyenda, peso: peso, align: izq ? 'right' : 'left' }));
      });
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        graphic: { elements: graficos },
        grid: pl.grid, xAxis: pl.xAxis, yAxis: pl.yAxis,
        tooltip: Object.assign(tooltipBase(), { trigger: 'item', formatter: function (prm) { return tooltipCaso(s, E, Pt[prm.value[2]], G); } }),
        series: series
      };
    });
  }

  /* Hexbin plot: los casos se cuentan por hexágonos de tamaño fijo en pantalla (20 × 23 px) */
  function dispersionHexagonos(el, s) {
    var d = s.datos, E = d._ejes, Pt = d._puntos, casos = nombreCasos(s), notaPropia = esTexto(s.nota);
    var rx = rangoDe(Pt.map(function (p) { return p.x; })), ry = rangoDe(Pt.map(function (p) { return p.y; }));
    if (!notaPropia) s.nota = 'Cada hexágono reúne los ' + casos + ' de su zona: cuanto más oscuro, más ' + casos + '.';
    var c = tarjeta(el, s, lienzo(s)), nota = c.parentNode.querySelector('.eg-nota');
    return montarECharts(c.firstChild, function (w, h) {
      var ley = leyendaArriba([{ forma: 'escala', colores: COLOR_HEX, texto: 'Menos', despues: 'Más ' + casos }], w, Math.min(w * 0.6, medir(tituloEje(E.y), 600)));
      var pl = planoXY(w, h, { x: rx, y: ry, ejes: E, margen: RADIO_HEX, arriba: ley.arriba, fila1: ley.fila1 });
      /* Rejilla hexagonal en píxeles, con origen en la esquina inferior izquierda del área */
      var R0 = RADIO_HEX, A = pl.area, ox = A.x, oy = A.y + A.h, celdas = {};
      Pt.forEach(function (p) {
        var x = pl.px(p.x) - ox, y = oy - pl.py(p.y);
        var q = (Math.sqrt(3) / 3 * x - y / 3) / R0, r = (2 / 3 * y) / R0;
        var cx = q, cz = r, cy = -q - r, rq = Math.round(cx), rr = Math.round(cz), rs = Math.round(cy);
        var dq = Math.abs(rq - cx), dr = Math.abs(rr - cz), ds = Math.abs(rs - cy);
        if (dq > dr && dq > ds) rq = -rr - rs; else if (dr > ds) rr = -rq - rs;
        var k = rq + ',' + rr;
        if (!celdas[k]) celdas[k] = { q: rq, r: rr, n: 0 };
        celdas[k].n++;
      });
      var lista = Object.keys(celdas).map(function (k) { return celdas[k]; });
      var max = Math.max.apply(null, lista.map(function (cl) { return cl.n; }));
      var datos = lista.map(function (cl) {
        var hx = R0 * Math.sqrt(3) * (cl.q + cl.r / 2), hy = R0 * 1.5 * cl.r;
        var vx = pl.ex.lo + hx / A.w * (pl.ex.hi - pl.ex.lo), vy = pl.ey.lo + hy / A.h * (pl.ey.hi - pl.ey.lo);
        return [vx, vy, cl.n, Math.min(4, Math.floor((cl.n - 1) / max * 5))];
      });
      if (nota && !notaPropia) nota.textContent = 'Cada hexágono reúne los ' + casos + ' de su zona: cuanto más oscuro, más ' + casos + ' (de 1 a ' + numero(max) + ').';
      var decX = Math.max(0, Math.ceil(-Math.log(pl.ex.paso / 10) / Math.LN10)), decY = Math.max(0, Math.ceil(-Math.log(pl.ey.paso / 10) / Math.LN10));
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        graphic: { elements: pl.titulos.concat(ley.elementos) },
        grid: pl.grid, xAxis: pl.xAxis, yAxis: pl.yAxis,
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (prm) {
            var vv = prm.value;
            return cabeceraTooltip('En esta zona') + filaTooltip(mayus(casos), numero(vv[2])) +
              filaTooltip(E.x.nombre, '\u2248' + NBSP + formatear(Math.round(vv[0] * Math.pow(10, decX)) / Math.pow(10, decX), { unidad: E.x.unidad, abreviar: s.abreviar }).texto) +
              filaTooltip(E.y.nombre, '\u2248' + NBSP + formatear(Math.round(vv[1] * Math.pow(10, decY)) / Math.pow(10, decY), { unidad: E.y.unidad, abreviar: s.abreviar }).texto);
          }
        }),
        series: [{
          type: 'custom', name: s.titulo, data: datos, encode: { x: 0, y: 1 }, clip: true, z: 3,
          renderItem: function (params, api) {
            var p = api.coord([api.value(0), api.value(1)]), pts = [];
            for (var k = 0; k < 6; k++) { var a = Math.PI / 180 * (60 * k - 30); pts.push([p[0] + R0 * Math.cos(a), p[1] + R0 * Math.sin(a)]); }
            return { type: 'polygon', shape: { points: pts }, style: { fill: COLOR_HEX[api.value(3)], stroke: T.fondo, lineWidth: 1 } };
          }
        }]
      };
    });
  }

  /* Quadrant chart: dos cortes dividen el plano; el cuadrante clave en Neutro 100 y el caso propio en naranja */
  function dispersionCuadrantes(el, s) {
    var d = s.datos, E = d._ejes, Pt = d._puntos, ct = d._cortes, Q = s.cuadrantes, clave = s.destacarCuadrante, foco = esTexto(s.destacar) ? s.destacar : null;
    if (ct.media && !esTexto(s.nota)) s.nota = 'Las líneas marcan la media de cada variable.';
    /* Escala simétrica alrededor del corte, para que la cruz quede en el centro */
    var hx = Math.max.apply(null, Pt.map(function (p) { return Math.abs(p.x - ct.x); })) * 1.25 || 1;
    var hy = Math.max.apply(null, Pt.map(function (p) { return Math.abs(p.y - ct.y); })) * 1.3 || 1;
    var nombreCuadrante = function (p) { return Q ? Q[(p.y >= ct.y ? 0 : 2) + (p.x >= ct.x ? 1 : 0)] : ''; };
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.firstChild, function (w, h) {
      var tituloY = E.y.nombre + ' (bajo a alto)', tituloX = E.x.nombre + ' (bajo a alto)';
      var orden = Pt.slice().sort(function (a, b) { return (a.nombre === foco) - (b.nombre === foco); });
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        graphic: { elements: [
          gTexto(recortar(tituloY, w, 600), 0, 8, { color: T.leyenda, peso: 600 }),
          gTexto(recortar(tituloX, w, 600), w - 2, h - 8, { color: T.leyenda, peso: 600, align: 'right' })
        ] },
        grid: { left: 2, right: 2, top: 22, bottom: 24, containLabel: false },
        xAxis: ejeOculto(ct.x - hx, ct.x + hx),
        yAxis: ejeOculto(ct.y - hy, ct.y + hy),
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (prm) { if (prm.seriesIndex === 0) return ''; var p = Pt[prm.value[2]], q = nombreCuadrante(p); return tooltipCaso(s, E, p, null, q ? notaTooltip(esc(q)) : ''); }
        }),
        series: [{
          /* Fondo: marco, cuadrante clave, cortes y nombres de los cuadrantes */
          type: 'custom', silent: true, z: 1, data: [[ct.x, ct.y]], encode: { x: 0, y: 1 }, tooltip: { show: false },
          renderItem: function (params, api) {
            var cs = params.coordSys, o = api.coord([ct.x, ct.y]), hijos = [];
            var esquinas = [[cs.x, cs.y, o[0] - cs.x, o[1] - cs.y], [o[0], cs.y, cs.x + cs.width - o[0], o[1] - cs.y],
              [cs.x, o[1], o[0] - cs.x, cs.y + cs.height - o[1]], [o[0], o[1], cs.x + cs.width - o[0], cs.y + cs.height - o[1]]];
            if (Q && clave) { var e = esquinas[Q.indexOf(clave)]; hijos.push({ type: 'rect', shape: { x: e[0], y: e[1], width: e[2], height: e[3] }, style: { fill: P.neutro100 } }); }
            hijos.push({ type: 'rect', shape: { x: cs.x + 0.5, y: cs.y + 0.5, width: cs.width - 1, height: cs.height - 1 }, style: { fill: null, stroke: T.rejilla, lineWidth: 1 } });
            hijos.push({ type: 'line', shape: { x1: o[0], y1: cs.y, x2: o[0], y2: cs.y + cs.height }, style: { stroke: T.base, lineWidth: 1.5 } });
            hijos.push({ type: 'line', shape: { x1: cs.x, y1: o[1], x2: cs.x + cs.width, y2: o[1] }, style: { stroke: T.base, lineWidth: 1.5 } });
            if (Q) Q.forEach(function (nq, k) {
              var der = k % 2 === 1, abajo = k >= 2, e = esquinas[k];
              hijos.push({ type: 'text', style: { text: recortar(nq, e[2] - 20, 600), x: der ? cs.x + cs.width - 10 : cs.x + 10, y: abajo ? cs.y + cs.height - 10 : cs.y + 10,
                fill: nq === clave ? T.leyenda : T.etiquetaEje, font: '600 11px ' + FUENTE, align: der ? 'right' : 'left', verticalAlign: abajo ? 'bottom' : 'top' } });
            });
            return { type: 'group', children: hijos };
          }
        }, {
          type: 'scatter', name: s.titulo, z: 3, clip: false, emphasis: { scale: false },
          labelLayout: { hideOverlap: true },
          data: orden.map(function (p) {
            var dest = p.nombre === foco, peso = dest ? 600 : 400;
            return {
              value: [p.x, p.y, p.i], symbolSize: dest ? 16 : 12, itemStyle: { color: dest ? T.actual : P.neutro400, borderColor: T.fondo, borderWidth: 1.5 },
              label: Object.assign(estiloTexto(dest ? P.neutro700 : T.leyenda, peso), { show: true, distance: 6, formatter: p.nombre,
                position: (p.x - (ct.x - hx)) / (2 * hx) * (w - 4) + 14 + medir(p.nombre, peso) > w - 4 ? 'left' : 'right' })
            };
          })
        }]
      };
    });
  }

  /* Connected scatter: los puntos se unen en orden cronológico; inicio en Neutro 400, final mayor y rotulado */
  function dispersionConectada(el, s) {
    var d = s.datos, E = d._ejes, Pt = d._puntos, per = d._periodos, n = Pt.length;
    var rx = rangoDe(Pt.map(function (p) { return p.x; })), ry = rangoDe(Pt.map(function (p) { return p.y; }));
    /* Periodos intermedios rotulados: hasta 3, repartidos */
    var m = Math.min(3, Math.floor((n - 2) / 2)), intermedios = [];
    for (var j = 1; j <= m; j++) intermedios.push(Math.round(j * (n - 1) / (m + 1)));
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.firstChild, function (w, h) {
      var pl = planoXY(w, h, { x: rx, y: ry, ejes: E, margen: 8, arriba: 26 });
      var px = Pt.map(function (p) { return [pl.px(p.x), pl.py(p.y)]; });
      /* Cada rótulo va hacia el lado abierto (opuesto a los tramos que llegan al punto); si ahí choca con un tramo, otro rótulo o el borde,
         prueba girando 45° y 90°. El intermedio que no cabe se omite; el inicio y el final se rotulan siempre */
      var A = pl.area, cajas = px.map(function (q) { return [q[0] - 6, q[1] - 6, q[0] + 6, q[1] + 6]; }), rotulos = [];
      function cruza(c, p, q) {
        if ((p[0] > c[0] && p[0] < c[2] && p[1] > c[1] && p[1] < c[3]) || (q[0] > c[0] && q[0] < c[2] && q[1] > c[1] && q[1] < c[3])) return true;
        var lados = [[c[0], c[1], c[2], c[1]], [c[2], c[1], c[2], c[3]], [c[0], c[3], c[2], c[3]], [c[0], c[1], c[0], c[3]]];
        return lados.some(function (l) {
          var d1 = (q[0] - p[0]) * (l[1] - p[1]) - (q[1] - p[1]) * (l[0] - p[0]), d2 = (q[0] - p[0]) * (l[3] - p[1]) - (q[1] - p[1]) * (l[2] - p[0]);
          var d3 = (l[2] - l[0]) * (p[1] - l[1]) - (l[3] - l[1]) * (p[0] - l[0]), d4 = (l[2] - l[0]) * (q[1] - l[1]) - (l[3] - l[1]) * (q[0] - l[0]);
          return d1 * d2 < 0 && d3 * d4 < 0;
        });
      }
      [0, n - 1].concat(intermedios).forEach(function (i, orden) {
        var vx = 0, vy = 0;
        [i - 1, i + 1].forEach(function (k) {
          if (k < 0 || k >= n) return;
          var dx = px[k][0] - px[i][0], dy = px[k][1] - px[i][1], l = Math.sqrt(dx * dx + dy * dy) || 1;
          vx += dx / l; vy += dy / l;
        });
        var l = Math.sqrt(vx * vx + vy * vy);
        if (l < 0.3) { /* tramo recto: el rótulo sale en perpendicular, hacia arriba */
          var ta = px[Math.max(0, i - 1)], tb = px[Math.min(n - 1, i + 1)], tx = tb[0] - ta[0], ty = tb[1] - ta[1], tl = Math.sqrt(tx * tx + ty * ty) || 1;
          vx = ty / tl; vy = -tx / tl; if (vy < 0) { vx = -vx; vy = -vy; } l = 1;
        }
        var extremo = orden < 2, peso = extremo ? 600 : 400, txt = per[i], tw = medir(txt, peso), elegido = null, primero = null;
        [0, 45, -45, 90, -90, 135, -135].some(function (giro) {
          var g = giro * Math.PI / 180, ux = -(vx * Math.cos(g) - vy * Math.sin(g)) / l, uy = -(vx * Math.sin(g) + vy * Math.cos(g)) / l;
          var x = px[i][0] + ux * 11, y = px[i][1] + uy * 11;
          var align = ux > 0.38 ? 'left' : (ux < -0.38 ? 'right' : 'center'), va = uy > 0.38 ? 'top' : (uy < -0.38 ? 'bottom' : 'middle');
          var x0 = align === 'left' ? x : (align === 'right' ? x - tw : x - tw / 2), y0 = va === 'top' ? y : (va === 'bottom' ? y - 14 : y - 7);
          var caja = [x0 - 1, y0, x0 + tw + 1, y0 + 14], op = { x: x, y: va === 'top' ? y + 7 : (va === 'bottom' ? y - 7 : y), align: align, caja: caja };
          if (!primero) primero = op;
          var fuera = x0 < A.x || x0 + tw > w - 2 || y0 < A.y - 4 || y0 + 14 > A.y + A.h;
          var choca = fuera || cajas.some(function (c2, k) { return k !== i && caja[0] < c2[2] && caja[2] > c2[0] && caja[1] < c2[3] && caja[3] > c2[1]; }) ||
            px.some(function (q, k) { return k > 0 && cruza(caja, px[k - 1], q); });
          if (!choca) elegido = op;
          return !choca;
        });
        if (!elegido && !extremo) return;
        elegido = elegido || primero;
        cajas.push(elegido.caja);
        rotulos.push(gTexto(txt, elegido.x, elegido.y, { color: extremo ? P.neutro700 : T.etiquetaEje, peso: peso, align: elegido.align }));
      });
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        graphic: { elements: pl.titulos.concat(rotulos) },
        grid: pl.grid, xAxis: pl.xAxis, yAxis: pl.yAxis,
        tooltip: Object.assign(tooltipBase(), { trigger: 'item', formatter: function (prm) { var p = Pt[prm.dataIndex]; return tooltipCaso(s, E, { x: p.x, y: p.y, nombre: per[prm.dataIndex] }, null); } }),
        series: [{
          type: 'line', name: s.titulo, z: 3, clip: false, showSymbol: true, symbol: 'circle', symbolSize: 9, emphasis: { scale: false, lineStyle: { width: 2.5 } },
          lineStyle: { color: T.actual, width: 2.5, cap: 'round', join: 'round' },
          itemStyle: { color: T.actual, borderColor: T.fondo, borderWidth: 1.5 },
          data: Pt.map(function (p, i) {
            var item = { value: [p.x, p.y] };
            if (i === 0) item.itemStyle = { color: T.base, borderColor: T.fondo, borderWidth: 1.5 };
            if (i === n - 1) item.symbolSize = 12;
            return item;
          })
        }]
      };
    });
  }

  /* Matriz de correlación: en color (matriz completa con leyenda) o con el coeficiente en cada celda (triángulo inferior) */
  R.matriz = function (el, s) {
    if (s.variante === 'cohortes') return matrizCohortes(el, s);
    var d = s.datos, V = d._vars, M = d._coef, n = V.length, conValores = s.variante === 'correlacion-valores';
    var texto = function (i, j) { return i === j ? '1' : numero(M[i][j], 2); };
    var maxNombre = Math.min(110, maxMedida(V)), anchoFila = maxNombre + 10;
    var anchoLeyenda = 24 + Math.max(medir('Coeficiente', 600) - 24, maxMedida(CLASES_CORRELACION.map(function (k) { return k.texto; })));
    /* Disposición para un ancho W (y un alto H, si ya está fijado): la leyenda va al lado si las celdas siguen midiendo 26 px */
    function disposicion(W, H, lado) {
      if (lado == null) lado = !conValores && (W - anchoFila - anchoLeyenda - 24) / n >= 26;
      var ac = conValores ? Math.min(56, (W - anchoFila - 4) / n) : Math.min(n <= 4 ? 44 : 36, (W - anchoFila - (lado ? anchoLeyenda + 24 : 4)) / n);
      var girar = maxNombre > ac - 4, arriba = girar ? Math.round(maxNombre * 0.72) + 12 : 22;
      var al = conValores ? Math.min(30, Math.max(22, ac * 0.62)) : ac;
      if (H && arriba + n * al + 4 > H + 0.5) { var k = (H - arriba - 4) / (n * al); al *= k; if (!conValores) ac = al; }
      /* Con la leyenda al lado, el lienzo mide al menos lo que ella (título y 5 clases) */
      return { lado: lado, ac: ac, al: al, girar: girar, arriba: arriba, alto: Math.max(arriba + n * al + 4, lado ? arriba + 32 + 4 * 26 + 12 : 0), valores: conValores && medir('\u22120,00', 600) + 6 <= ac && al >= 16 };
    }
    var c = tarjeta(el, s, lienzo(s, 200)), lz = c.firstChild;
    var D0 = disposicion(Math.max(200, lz.clientWidth || 340));
    if (!D0.lado && !conValores) lz.insertAdjacentHTML('beforebegin', leyendaHTML(CLASES_CORRELACION.map(function (k) { return { color: k.color, texto: k.texto, borde: P.neutro300 }; }))
      .replace('<ul class="eg-leyenda-h">', '<ul class="eg-leyenda-h"><li class="eg-ley-titulo">Coeficiente</li>'));
    lz.style.height = Math.round(D0.alto) + 'px';
    return montarECharts(lz, function (w, h) {
      var Dp = disposicion(w, h, D0.lado), grafico = [];
      if (Dp.lado) {
        var lx = anchoFila + n * Dp.ac + 24, ly = Dp.arriba + 2;
        grafico.push(gTexto('Coeficiente', lx, ly + 7, { color: T.leyenda, peso: 600 }));
        CLASES_CORRELACION.forEach(function (k, j) {
          var y = ly + 30 + j * 26;
          grafico.push(gRect(lx + 0.5, y - 7.5, 15, 15, k.color, 0, 20, P.neutro300, 1));
          grafico.push(gTexto(k.texto, lx + 24, y, { color: T.leyenda }));
        });
      }
      if (Dp.girar) V.forEach(function (t, j) {
        var g = gTexto(recortar(t, 110, 400), anchoFila + (j + 0.5) * Dp.ac - 3, Dp.arriba - 6, { color: T.etiquetaEje });
        g.x = g.style.x; g.y = g.style.y; g.style.x = 0; g.style.y = 0; g.rotation = Math.PI / 4;
        grafico.push(g);
      });
      var celdas = [];
      for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) if (!conValores || j <= i) celdas.push([j, i, M[i][j]]);
      var ejeNombres = function (pos) {
        return {
          type: 'category', data: V, position: pos, inverse: pos === 'left',
          axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false },
          axisLabel: Object.assign(estiloTexto(T.etiquetaEje), pos === 'top'
            ? { show: !Dp.girar, interval: 0, margin: 6, formatter: function (t) { return recortar(t, Dp.ac, 400); } }
            : { interval: 0, margin: 8, formatter: function (t) { return recortar(t, 110, 400); } })
        };
      };
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 400,
        graphic: { elements: grafico },
        grid: { left: anchoFila, top: Dp.arriba, width: n * Dp.ac, height: n * Dp.al, containLabel: false },
        xAxis: ejeNombres('top'), yAxis: ejeNombres('left'),
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (prm) {
            var i = prm.value[1], j = prm.value[0];
            return cabeceraTooltip(V[i] + ' \u00D7 ' + V[j]) + (i === j ? notaTooltip('Misma variable') :
              filaTooltip('Coeficiente', texto(i, j)) + notaTooltip(CLASES_CORRELACION[claseCorrelacion(M[i][j])].nombre));
          }
        }),
        series: [{
          type: 'custom', name: s.titulo, data: celdas, encode: { x: 0, y: 1 }, z: 3,
          renderItem: function (params, api) {
            var j = api.value(0), i = api.value(1), p = api.coord([j, i]), cw = api.size([1, 1]);
            var color = i === j ? CLASES_CORRELACION[0].color : CLASES_CORRELACION[claseCorrelacion(M[i][j])].color;
            var hijos = [{ type: 'rect', shape: { x: p[0] - cw[0] / 2 + 1, y: p[1] - cw[1] / 2 + 1, width: cw[0] - 2, height: cw[1] - 2 }, style: { fill: color } }];
            if (Dp.valores) hijos.push({ type: 'text', silent: true, style: { text: texto(i, j), x: p[0], y: p[1], fill: textoSobre(color), font: '600 11px ' + FUENTE, align: 'center', verticalAlign: 'middle' } });
            return { type: 'group', children: hijos };
          }
        }]
      };
    });
  };

  /* Radar: perfil (relleno Naranja 100, rejilla poligonal) o dos perfiles (sin relleno, rejilla circular, la comparada discontinua) */
  function partirEnDos(t, max) {
    t = String(t);
    if (medir(t) <= max || t.indexOf(' ') < 0) return t;
    var p = t.split(' '), mejor = t, peor = Infinity;
    for (var k = 1; k < p.length; k++) {
      var a = p.slice(0, k).join(' '), b = p.slice(k).join(' '), m = Math.max(medir(a), medir(b));
      if (m < peor) { peor = m; mejor = a + '\n' + b; }
    }
    return mejor;
  }
  R.radar = function (el, s) {
    var d = s.datos, dos = s.variante === 'dos-perfiles', D = d.dimensiones, max = d._max, S = d._series, opc = opcionesTooltip(s);
    /* ECharts reparte los ejes en sentido antihorario; Figma, en horario: se dan en orden 0, n−1, …, 1 */
    var orden = [0].concat(D.map(function (t, k) { return D.length - 1 - k; }).slice(0, D.length - 1));
    var nombres = orden.map(function (k) { return partirEnDos(D[k], 96); });
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.firstChild, function (w, h) {
      var arriba = dos ? 22 : 0, alto = h - arriba, semiW = w / 2 - 2, semiH = alto / 2 - 2, radio = 120, n = nombres.length;
      /* Radio máximo con el que cada nombre cabe hacia su lado (el eje i sale a 90° + 360°·i/n, en sentido antihorario) */
      nombres.forEach(function (t, i) {
        var a = Math.PI / 2 + 2 * Math.PI * i / n, co = Math.abs(Math.cos(a)), se = Math.abs(Math.sin(a)), l = t.split('\n');
        var lw = maxMedida(l), lh = 14 * l.length;
        if (co > 0.1) radio = Math.min(radio, (semiW - lw) / co - 10); else radio = Math.min(radio, semiW);
        if (se > 0.1) radio = Math.min(radio, (semiH - lh) / se - 10);
      });
      radio = Math.max(36, radio);
      var cx = w / 2, cy = arriba + alto / 2;
      var datos = S.map(function (se, i) {
        var comparada = dos && i === 1;
        return {
          name: se.nombre, value: orden.map(function (k) { return se.valores[k]; }), symbol: 'circle', symbolSize: comparada ? 7 : 8, z: comparada ? 2 : 3,
          lineStyle: { color: comparada ? P.neutro600 : T.actual, width: 2.5, type: comparada ? [4, 3] : 'solid', join: 'round' },
          itemStyle: { color: comparada ? P.neutro600 : T.actual, borderColor: T.fondo, borderWidth: comparada ? 1 : 1.5 },
          areaStyle: dos ? { opacity: 0 } : { color: P.naranja100, opacity: 1 }
        };
      });
      if (dos) datos.reverse(); /* la principal, encima */
      var escala = [0.5, 1].map(function (k) { return gTexto(formatoEjeFino(limpio(max * k)), cx + 5, cy - radio * k + 2, { color: T.etiquetaEje, va: 'top' }); });
      var opcion = {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        graphic: { elements: escala },
        radar: {
          center: [cx, cy], radius: radio, startAngle: 90, splitNumber: 4, shape: dos ? 'circle' : 'polygon', nameGap: 10,
          indicator: nombres.map(function (t) { return { name: t, min: 0, max: max }; }),
          axisName: { color: T.leyenda, fontSize: 11, fontFamily: FUENTE, lineHeight: 14 },
          splitLine: { lineStyle: { color: T.rejilla, width: 1 } }, splitArea: { show: false },
          axisLine: { lineStyle: { color: T.rejilla, width: 1 } }, axisTick: { show: false }, axisLabel: { show: false }
        },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (prm) { var se = S.filter(function (x) { return x.nombre === prm.name; })[0]; return cabeceraTooltip(prm.name) + D.map(function (t, k) { return filaTooltip(t, formatear(se.valores[k], opc).texto); }).join(''); }
        }),
        series: [{ type: 'radar', name: s.titulo, emphasis: { disabled: true }, data: datos }]
      };
      if (dos) opcion.legend = Object.assign(leyenda(true), { itemWidth: 16, itemHeight: 3, selectedMode: false,
        data: [{ name: S[0].nombre, icon: ICONO_LINEA, itemStyle: { color: T.actual, borderWidth: 0 } }, { name: S[1].nombre, icon: ICONO_DISCONTINUA, itemStyle: { color: P.neutro600, borderWidth: 0 } }] });
      return opcion;
    });
  };

  /* Coordenadas paralelas: un eje por variable, con la misma escala; la línea destacada en naranja y el resto en Neutro 400 */
  R['coordenadas-paralelas'] = function (el, s) {
    var d = s.datos, V = d.variables, S = d.series, foco = s.destacar, opc = opcionesTooltip(s);
    var todos = [].concat.apply([], S.map(function (se) { return se.valores; }));
    var e = escalaEje(Math.min.apply(null, todos), Math.max.apply(null, todos), 180, 0, 5, function () { return 30; });
    var resto = 'Resto' + (esTexto(s.nombreCasos) ? ' de ' + s.nombreCasos : '');
    var orden = S.slice().sort(function (a, b) { return (a.nombre === foco) - (b.nombre === foco); });
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.firstChild, function (w) {
      var eje = ejeCategoriaColumnas(V, w);
      eje.boundaryGap = false;
      eje.axisLine = { show: false };
      eje.splitLine = { show: true, lineStyle: { color: T.base, width: 1.5 } };
      eje.axisLabel = Object.assign({}, eje.axisLabel, { color: T.leyenda, width: Math.max(40, (w - 40) / (V.length - 1) - 4) });
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500,
        graphic: { elements: gLeyenda([{ forma: 'linea', color: T.actual, texto: foco }, { forma: 'linea', color: T.base, texto: resto }], 8) },
        grid: { left: Math.max(maxMedida([e.lo, e.hi].map(formatoEjeFino)) + 10, Math.min(eje.axisLabel.width, medir(V[0])) / 2 + 2), right: Math.min(eje.axisLabel.width, medir(V[V.length - 1])) / 2 + 2, top: 34, bottom: 38, containLabel: false },
        xAxis: eje,
        yAxis: {
          type: 'value', min: e.lo, max: e.hi, axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false },
          axisLabel: Object.assign(estiloTexto(T.etiquetaEje), { formatter: formatoEjeFino, margin: 8, customValues: [e.lo, e.hi] })
        },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (prm) {
            var se = S.filter(function (x) { return x.nombre === prm.seriesName; })[0];
            return cabeceraTooltip(se.nombre) + V.map(function (t, k) { return filaTooltip(t, formatear(se.valores[k], opc).texto); }).join('');
          }
        }),
        series: orden.map(function (se) {
          var dest = se.nombre === foco;
          return {
            type: 'line', name: se.nombre, data: se.valores, z: dest ? 5 : 2, showSymbol: true, symbol: 'circle', symbolSize: dest ? 8 : 7,
            emphasis: { disabled: true }, lineStyle: { color: dest ? T.actual : T.base, width: dest ? 3 : 1.5, join: 'round' },
            itemStyle: dest ? { color: T.actual, borderColor: T.fondo, borderWidth: 1.5 } : { color: T.base, opacity: 0 }
          };
        })
      };
    });
  };

  /* ================================================================== */
  /* Familia Procesos y conversión                                       */
  /* ================================================================== */
  var PASO_EMBUDO = 38, ALTO_EMBUDO = 34; /* Funnel chart: etapas de 34 px separadas 4 px */
  function tasa(x) { return isFinite(x) ? porcentaje(x) : '\u2013'; }
  function textoG(txt, x, y, color, peso, align) {
    return { type: 'text', silent: true, style: { text: txt, x: x, y: y, align: align || 'center', verticalAlign: 'middle', fill: color, font: (peso || 400) + ' 11px ' + FUENTE } };
  }
  /* Tooltip de una etapa: su valor, el % sobre la primera etapa y el % sobre la anterior */
  function tooltipEmbudo(s, i) {
    var d = s.datos, V = d.valores, N = d._nombres;
    var h = cabeceraTooltip(N[i]) + filaTooltip('Valor', fmtU(V[i], s).texto);
    if (i > 0) h += filaTooltip('Sobre «' + N[0] + '»', tasa(V[i] / V[0] * 100));
    if (i > 1) h += filaTooltip('Sobre «' + N[i - 1] + '»', tasa(V[i - 1] ? V[i] / V[i - 1] * 100 : NaN));
    return h;
  }

  R.embudo = function (el, s) {
    if (s.variante === 'conversion') return embudoConversion(el, s);
    if (s.variante === 'retencion') return embudoRetencion(el, s);
    return embudoForma(el, s);
  };

  /* Funnel chart: trapecios centrados con el ancho proporcional al valor (cada etapa se estrecha hasta la siguiente; la última, al 70 %) */
  function embudoForma(el, s) {
    var d = s.datos, N = d._nombres, V = d.valores, n = N.length;
    var textos = V.map(function (x) { return fmtDato(x, s); });
    var c = tarjeta(el, s, lienzo(s, n * PASO_EMBUDO - 4));
    return montarECharts(c.firstChild, function (w) {
      var izq = Math.min(maxMedida(N), Math.round(w * 0.3)), x0 = izq + 16, x1 = w - maxMedida(textos, 600) - 16;
      var ancho = Math.max(24, Math.min(x1 - x0, 400)), cx = (x0 + x1) / 2;
      var anchos = V.map(function (x) { return Math.max(4, x / V[0] * ancho); });
      return {
        animation: false,
        tooltip: Object.assign(tooltipBase(), { trigger: 'item', formatter: function (p) { return tooltipEmbudo(s, p.dataIndex); } }),
        series: [{
          type: 'custom', coordinateSystem: 'none', data: V.map(function (x, i) { return { name: N[i], value: x }; }),
          renderItem: function (p) {
            var i = p.dataIndex, y = i * PASO_EMBUDO, a = anchos[i], b = i < n - 1 ? anchos[i + 1] : a * 0.7, ym = y + ALTO_EMBUDO / 2;
            return { type: 'group', children: [
              { type: 'polygon', shape: { points: [[cx - a / 2, y], [cx + a / 2, y], [cx + b / 2, y + ALTO_EMBUDO], [cx - b / 2, y + ALTO_EMBUDO]] }, style: { fill: T.actual } },
              textoG(recortar(N[i], izq), 0, ym, T.leyenda, 400, 'left'),
              textoG(textos[i], w, ym, T.etiquetaDato, 600, 'right')
            ] };
          }
        }]
      };
    });
  }

  /* Funnel de conversión: barras alineadas a la izquierda, la tasa sobre la etapa anterior a la derecha y la conversión global al pie */
  function embudoConversion(el, s) {
    var d = s.datos, N = d._nombres, V = d.valores, n = N.length, ARRIBA = 24, PASO = 32, ALTO = 24;
    var textos = V.map(function (x) { return fmtDato(x, s); });
    var tasas = V.map(function (x, i) { return i ? tasa(V[i - 1] ? x / V[i - 1] * 100 : NaN) : '\u2014'; });
    var global = 'Conversión global ' + tasa(V[n - 1] / V[0] * 100);
    var c = tarjeta(el, s, lienzo(s, ARRIBA + n * PASO + 28));
    return montarECharts(c.firstChild, function (w) {
      var izq = Math.min(maxMedida(N), Math.round(w * 0.3)), x0 = izq + 8;
      var colTasa = Math.max(medir('Conversión'), maxMedida(tasas, 600));
      var maxBarra = Math.max(20, w - x0 - colTasa - 16 - maxMedida(textos, 600) - 6), yL = ARRIBA + n * PASO + 6.5;
      return {
        animation: false,
        graphic: { elements: [
          gTexto('Conversión', w, 7, { color: T.etiquetaEje, align: 'right' }),
          { type: 'line', silent: true, z: 1, shape: { x1: 0, y1: yL, x2: w, y2: yL }, style: { stroke: T.borde, lineWidth: 1 } },
          gTexto(global, w, yL + 14, { color: T.texto, peso: 600, align: 'right' })
        ] },
        tooltip: Object.assign(tooltipBase(), { trigger: 'item', formatter: function (p) { return tooltipEmbudo(s, p.dataIndex); } }),
        series: [{
          type: 'custom', coordinateSystem: 'none', data: V.map(function (x, i) { return { name: N[i], value: x }; }),
          renderItem: function (p) {
            var i = p.dataIndex, y = ARRIBA + i * PASO, bw = Math.max(2, V[i] / V[0] * maxBarra), ym = y + ALTO / 2;
            return { type: 'group', children: [
              { type: 'rect', shape: { x: x0, y: y, width: bw, height: ALTO }, style: { fill: T.actual } },
              textoG(recortar(N[i], izq), izq, ym, T.leyenda, 400, 'right'),
              textoG(textos[i], x0 + bw + 6, ym, T.etiquetaDato, 600, 'left'),
              textoG(tasas[i], w, ym, T.etiquetaDato, 600, 'right')
            ] };
          }
        }]
      };
    });
  }

  /* Retention funnel: columnas al 100 % (retenido en Naranja 500, perdido en Neutro 300) con la caída entre hitos en puntos */
  function embudoRetencion(el, s) {
    var d = s.datos, N = d._nombres, V = d.valores, Pc = d._pct, n = N.length, cuenta = s.unidad !== '%';
    function puntos(x) { var r = Math.abs(x) >= 1 ? Math.round(x) : Math.round(x * 10) / 10; return (r > 0 ? '\u2212' : '') + numero(Math.abs(r)) + NBSP + 'p.' + NBSP + 'p.'; }
    var caidas = Pc.map(function (x, i) { return i ? Pc[i - 1] - x : 0; });
    var c = tarjeta(el, s, leyendaHTML([{ texto: 'Retenido', color: T.actual }, { texto: 'Perdido', color: T.otros }]) + lienzo(s, 236));
    var izq = medir(porcentaje(100, 0)) + 8;
    return montarECharts(c.querySelector('.eg-lienzo'), function (w, h) {
      var ARR = 26, ABA = 28, banda = (w - izq) / n, alto = h - ARR - ABA;
      var rotulos = maxMedida(Pc.map(function (x) { return porcentaje(x, 0); }), 600) <= banda * 0.65 - 4;
      var graf = caidas.every(function (x, i) { return !i || medir(puntos(x)) <= banda - 8; })
        ? caidas.slice(1).map(function (x, i) { return gTexto(puntos(x), izq + banda * (i + 1), ARR - 13, { color: T.etiquetaEje, align: 'center' }); }) : [];
      var eje = ejeCategoriaColumnas(N, w);
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500, graphic: { elements: graf },
        grid: { left: izq, right: 0, top: ARR, bottom: ABA, containLabel: false },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'axis', axisPointer: SOMBRA_EJE,
          formatter: function (ps) {
            var i = ps[0].dataIndex;
            return cabeceraTooltip(N[i]) + filaTooltip('Retenido', porcentaje(Pc[i]) + (cuenta ? ' · ' + fmtU(V[i], s).texto : '')) +
              filaTooltip('Perdido', porcentaje(100 - Pc[i]) + (cuenta ? ' · ' + fmtU(V[0] - V[i], s).texto : '')) +
              (i ? filaTooltip('Desde «' + N[i - 1] + '»', puntos(caidas[i])) : '');
          }
        }),
        xAxis: eje,
        yAxis: {
          type: 'value', min: 0, max: 100, interval: 25, axisLine: { show: false }, axisTick: { show: false },
          axisLabel: Object.assign(estiloTexto(T.etiquetaEje), { margin: 8, formatter: function (v) { return porcentaje(v, 0); } }),
          splitLine: { lineStyle: { color: T.rejilla, width: 1 } }
        },
        series: [
          {
            type: 'bar', name: 'Retenido', stack: 'retencion', barCategoryGap: '35%', itemStyle: { color: T.actual }, emphasis: { disabled: true },
            data: Pc.map(function (x) { return { value: x, label: { position: x / 100 * alto >= 22 ? 'insideTop' : 'top' } }; }),
            label: Object.assign(estiloTexto(T.etiquetaDato, 600), { show: rotulos, distance: 4, formatter: function (p) { return porcentaje(p.value, 0); } })
          },
          { type: 'bar', name: 'Perdido', stack: 'retencion', itemStyle: { color: T.otros }, emphasis: { disabled: true }, data: Pc.map(function (x) { return 100 - x; }) }
        ]
      };
    });
  }

  R.etapas = function (el, s) {
    if (s.variante === 'pipeline') return pipeline(el, s);
    if (s.variante === 'proceso') return procesoFlujo(el, s);
    return progresion(el, s);
  };

  /* Pipeline: una columna por etapa con el recuento y una tarjeta por caso; la etapa destacada (por defecto la final) en Naranja 500 */
  function pipeline(el, s) {
    var d = s.datos, MAX = 6;
    var html = '<div class="eg-pipe" style="--n:' + d.etapas.length + '">' + d.etapas.map(function (e, j) {
      var casos = d._columnas[j], vis = casos.length > MAX ? casos.slice(0, MAX - 1) : casos;
      return '<section class="eg-pipe-col' + (e === d._foco ? ' eg-pipe-foco' : '') + '" aria-label="' + esc(e + ': ' + casos.length) + '">' +
        '<header><b title="' + esc(e) + '">' + esc(e) + '</b><span>' + numero(casos.length) + '</span></header><ul>' +
        vis.map(function (q) {
          var v = d._valor ? fmtU(q.valor, s).texto : '';
          return '<li' + (v ? ' class="eg-pipe-dos"' : '') + ' title="' + esc(q.nombre + (v ? ' · ' + v : '')) + '"><span>' + esc(q.nombre) + '</span>' + (v ? '<b>' + esc(v) + '</b>' : '') + '</li>';
        }).join('') + (casos.length > vis.length ? '<li class="eg-pipe-mas">+' + numero(casos.length - vis.length) + ' más</li>' : '') + '</ul></section>';
    }).join('') + '</div>';
    tarjeta(el, s, html);
    return Promise.resolve();
  }

  /* Process flow: cajas por paso (completado en Neutro 300, actual en Naranja 500, pendiente sin relleno) y decisiones en rombo.
     Si no caben en una fila, siguen en la de abajo, también de izquierda a derecha, unidas por un conector en codo. */
  var ESTILO_PASO = {
    completado: { nombre: 'Completado', fondo: P.neutro300, borde: P.neutro300, texto: P.neutro700, peso: 400 },
    actual: { nombre: 'Actual', fondo: P.naranja500, borde: P.naranja500, texto: P.neutro700, peso: 600 },
    pendiente: { nombre: 'Pendiente', fondo: P.neutro000, borde: P.neutro400, texto: P.neutro500, peso: 400 }
  };
  /* Parte un texto en líneas que caben en ancho (máximo max; la última se recorta con «…») */
  function partirLineas(txt, ancho, peso, max) {
    var lineas = [], cur = '';
    String(txt).split(/\s+/).forEach(function (p) {
      var prueba = cur ? cur + ' ' + p : p;
      if (!cur || medir(prueba, peso) <= ancho) cur = prueba; else { lineas.push(cur); cur = p; }
    });
    if (cur) lineas.push(cur);
    if (lineas.length > max) lineas = lineas.slice(0, max - 1).concat([lineas.slice(max - 1).join(' ')]);
    return lineas.map(function (l) { return recortar(l, ancho, peso); });
  }
  /* Flecha de (x1, y1) a (x2, y2): línea de 1,5 px y punta de 7 × 8 px en Neutro 400 */
  function flecha(x1, y1, x2, y2) {
    var a = Math.atan2(y2 - y1, x2 - x1), bx = x2 - 7 * Math.cos(a), by = y2 - 7 * Math.sin(a), px = -Math.sin(a) * 4, py = Math.cos(a) * 4;
    return [
      { type: 'line', silent: true, z: 1, shape: { x1: x1, y1: y1, x2: bx + Math.cos(a), y2: by + Math.sin(a) }, style: { stroke: T.base, lineWidth: 1.5 } },
      { type: 'polygon', silent: true, z: 1, shape: { points: [[x2, y2], [bx + px, by + py], [bx - px, by - py]] }, style: { fill: T.base } }
    ];
  }
  /* Reparte los pasos en filas (las menos posibles) y calcula el centro de cada uno. Una decisión no cierra una fila. */
  function disponerProceso(pasos, W) {
    var n = pasos.length, textos = pasos.map(function (p) { return p.alternativa || p.nombre; }).concat(pasos.filter(function (p) { return !p.alternativa; }).map(function (p) { return p.nombre; }));
    var natural = Math.min(128, Math.max(64, maxMedida(textos, 600) + 20));
    function anchoDe(p, wb) { return p.alternativa ? Math.max(wb + 4, Math.min(160, Math.ceil(medir(p.nombre, 600) / 0.7) + 12)) : wb; }
    function hueco(p) { return p.alternativa ? Math.max(30, medir(p.si, 600) + 18) : 16; }
    function anchoFila(fila, wb) { return fila.reduce(function (t, i, j) { return t + anchoDe(pasos[i], wb) + (j < fila.length - 1 ? hueco(pasos[i]) : 0); }, 0); }
    function trocear(k) {
      var filas = [], i = 0;
      while (i < n) {
        var fin = Math.min(n, i + k), fila = [];
        while (fin < n && fin - 1 > i && pasos[fin - 1].alternativa) fin--;
        for (var j = i; j < fin; j++) fila.push(j);
        filas.push(fila); i = fin;
      }
      return filas;
    }
    var filas = null, wb = 64;
    for (var r = 1; r <= n && !filas; r++) {
      var cand = trocear(Math.ceil(n / r));
      for (var x = natural; x >= 64; x -= 2) if (cand.every(function (f) { return anchoFila(f, x) <= W - 4; })) { filas = cand; wb = x; break; }
    }
    if (!filas) filas = trocear(1);
    var geo = [], y = 0, alto = 0, bajos = [];
    filas.forEach(function (fila) {
      var conDec = fila.some(function (i) { return pasos[i].alternativa; }), hF = conDec ? 52 : 44, yc = y + hF / 2, cx = 0;
      fila.forEach(function (i, j) {
        var wi = anchoDe(pasos[i], wb);
        if (j === 0) cx = wi / 2;
        else { var a = pasos[fila[j - 1]]; cx += anchoDe(a, wb) / 2 + hueco(a) + wi / 2; }
        geo[i] = { x: Math.round(cx + 1) + 0.5, y: Math.round(yc + 1) + 0.5, w: wi, h: pasos[i].alternativa ? 52 : 44 };
      });
      alto = y + hF + (conDec ? 52 : 0);
      bajos.push(Math.round(alto + 1) + 0.5);
      y = alto + 32;
    });
    return { filas: filas, wb: wb, geo: geo, bajos: bajos, alto: alto + 3 };
  }

  function procesoFlujo(el, s) {
    var d = s.datos, pasos = d._pasos, conEstado = d._k >= 0 || d._enAlt >= 0;
    var items = pasos.map(function (p, i) { return { i: i, tipo: p.alternativa ? 'rombo' : 'caja', nombre: p.nombre, estado: p.estado, p: p }; })
      .concat(pasos.map(function (p, i) { return p.alternativa ? { i: i, tipo: 'alternativa', nombre: p.alternativa, estado: p.estadoAlt, p: p } : null; }).filter(Boolean));
    var presentes = items.map(function (q) { return q.estado; });
    var ley = conEstado ? leyendaHTML(['completado', 'actual', 'pendiente'].filter(function (e) { return presentes.indexOf(e) >= 0; }).map(function (e) {
      return { texto: ESTILO_PASO[e].nombre, color: ESTILO_PASO[e].fondo, borde: e === 'pendiente' ? ESTILO_PASO[e].borde : null };
    })) : '';
    var c = tarjeta(el, s, ley + lienzo(s, 120)), lz = c.querySelector('.eg-lienzo');
    return montarECharts(lz, function (w) {
      var g = disponerProceso(pasos, w), els = [];
      if (Math.abs(lz.offsetHeight - g.alto) > 1) lz.style.height = Math.ceil(g.alto) + 'px';
      g.filas.forEach(function (fila, r) {
        fila.forEach(function (i, j) {
          var a = g.geo[i], p = pasos[i];
          if (j < fila.length - 1) {
            var b = g.geo[fila[j + 1]], x1 = a.x + a.w / 2 + 2, x2 = b.x - b.w / 2 - 2;
            els = els.concat(flecha(x1, a.y, x2, a.y));
            if (p.alternativa) els.push(gTexto(p.si, (x1 + x2) / 2, a.y - 11, { color: T.texto, peso: 600, align: 'center' }));
          }
          if (p.alternativa) {
            els = els.concat(flecha(a.x, a.y + 28, a.x, a.y + 48));
            els.push(gTexto(p.no, a.x + 8, a.y + 37, { color: T.texto, peso: 600 }));
          }
        });
        if (r < g.filas.length - 1) {
          /* Conector en codo: baja del último paso de la fila, vuelve a la izquierda y entra por arriba en el primero de la siguiente */
          var u = g.geo[fila[fila.length - 1]], v = g.geo[g.filas[r + 1][0]], yM = g.bajos[r] + 12;
          els.push({ type: 'polyline', silent: true, z: 1, shape: { points: [[u.x, u.y + u.h / 2 + 2], [u.x, yM], [v.x, yM], [v.x, yM + 2]] }, style: { stroke: T.base, lineWidth: 1.5, fill: null, lineJoin: 'round' } });
          els = els.concat(flecha(v.x, yM, v.x, v.y - v.h / 2 - 2));
        }
      });
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (prm) {
            var q = items[prm.dataIndex], h = cabeceraTooltip(q.nombre), alt = q.tipo === 'alternativa' ? 'alternativa de «' + esc(q.p.nombre) + '»' : '';
            if (conEstado) h += notaTooltip(ESTILO_PASO[q.estado].nombre + (alt ? ' · ' + alt : ''));
            else if (alt) h += notaTooltip(mayus(alt));
            if (q.tipo === 'rombo') h += filaTooltip(q.p.si, esc(pasos[q.i + 1].nombre)) + filaTooltip(q.p.no, esc(q.p.alternativa));
            if (q.tipo !== 'alternativa' && q.p.detalle) h += notaTooltip(esc(q.p.detalle));
            return h;
          }
        }),
        series: [{
          type: 'custom', coordinateSystem: 'none', data: items.map(function (q) { return { name: q.nombre, value: 1 }; }),
          renderItem: function (prm) {
            var q = items[prm.dataIndex], a = g.geo[q.i], e = ESTILO_PASO[q.estado], hijos;
            if (q.tipo === 'rombo') {
              hijos = [{ type: 'polygon', shape: { points: [[a.x, a.y - 26], [a.x + a.w / 2, a.y], [a.x, a.y + 26], [a.x - a.w / 2, a.y]] }, style: { fill: e.fondo, stroke: e.borde, lineWidth: 1.5, lineJoin: 'round' } },
                textoG(recortar(q.nombre, a.w * 0.7 - 6, e.peso), a.x, a.y, q.estado === 'pendiente' ? T.leyenda : e.texto, e.peso)];
            } else {
              var alt = q.tipo === 'alternativa', bh = alt ? 28 : 44, by = alt ? a.y + 64 : a.y;
              var lineas = partirLineas(q.nombre, g.wb - 12, e.peso, alt ? 1 : 2);
              hijos = [{ type: 'rect', shape: { x: a.x - g.wb / 2, y: by - bh / 2, width: g.wb, height: bh, r: 6 }, style: { fill: e.fondo, stroke: e.borde, lineWidth: 1.5 } }];
              lineas.forEach(function (l, k) { hijos.push(textoG(l, a.x, by + (k - (lineas.length - 1) / 2) * 14, e.texto, e.peso)); });
            }
            return { type: 'group', children: hijos };
          }
        }]
      };
    });
  }

  /* Stage progression: etapas completadas en Naranja 500 (con marca), la actual con anillo y las pendientes en Neutro 300;
     debajo, «Etapa k de n» y el % de avance: las etapas completadas (la actual aún no cuenta), o «porcentaje» si se indica */
  function progresion(el, s) {
    var d = s.datos, E = d.etapas, n = E.length, k = d._k, pct = d._pct, pie = k >= n ? 'Completado' : 'Etapa ' + (k + 1) + ' de ' + n;
    var marca = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 12l3.5 3.5L17.5 8.5" fill="none" stroke="' + T.fondo + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    tarjeta(el, s, '<div class="eg-prog" style="--n:' + n + '"><ol class="eg-prog-pasos">' + E.map(function (e, i) {
      return '<li class="' + (i < k ? 'eg-hecho' : (i === k ? 'eg-actual' : 'eg-falta')) + '"' + (i === k ? ' aria-current="step"' : '') + ' title="' + esc(e) + '"><i>' + (i < k ? marca : '') + '</i><span>' + esc(e) + '</span></li>';
    }).join('') + '</ol><div class="eg-prog-pie"><div class="eg-fila eg-extremos"><b>' + pie + '</b><b>' + porcentaje(pct, 0) + '</b></div>' +
      '<div class="eg-pista" role="progressbar" aria-label="Avance" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(pct) + '"><div class="eg-barra" style="width:' + Math.min(100, pct).toFixed(1) + '%"></div></div></div></div>');
    return Promise.resolve();
  }

  /* Rótulos centrados en bandas de ancho bw desde x0 (sin pasar de max): un texto que no cabe en su banda se deja entero si los vecinos
     le dejan sitio (6 px de separación); si no, se parte en líneas (hasta maxLineas) o se recorta */
  function rotulosBandas(textos, peso, x0, bw, max, maxLineas) {
    var anchos = textos.map(function (t) { return medir(t, peso); }), lim = bw - 2, fin = [];
    function ext(i, a) { var c = x0 + (i + 0.5) * bw, l = c - a / 2, r = c + a / 2; if (l < x0) { r += x0 - l; l = x0; } if (r > max) { l -= r - max; r = max; } return [l, r]; }
    return textos.map(function (t, i) {
      var a = anchos[i], c = x0 + (i + 0.5) * bw, e;
      if (a > lim) {
        e = ext(i, a);
        var ok = (i === 0 || e[0] >= fin[i - 1][1] + 6) && (i === textos.length - 1 || e[1] <= ext(i + 1, Math.min(anchos[i + 1], lim))[0] - 6);
        if (ok) { fin[i] = e; return { lineas: [t], x: (e[0] + e[1]) / 2 }; }
      }
      var lineas = maxLineas > 1 ? partirLineas(t, lim, peso, maxLineas) : [recortar(t, lim, peso)], m = maxMedida(lineas, peso);
      fin[i] = [c - m / 2, c + m / 2];
      return { lineas: lineas, x: c };
    });
  }

  /* Customer journey: curva de la experiencia sobre las etapas, con bandas neutras alternas, la línea «Media» en el centro de la escala
     y los puntos de contacto al pie */
  R.recorrido = function (el, s) {
    var d = s.datos, E = d.etapas, V = d.valores, C = d.contactos, n = E.length, opc = opcionesTooltip(s);
    var niv = s.niveles || ['Baja', 'Media', 'Alta'];
    var c = tarjeta(el, s, lienzo(s, 240));
    return montarECharts(c.firstChild, function (w, h) {
      var izq = maxMedida(niv) + 6, bw = (w - izq) / n, yT = 44, yB = h - (C ? 36 : 18), ym = Math.round((yT + yB) / 2) + 0.5, graf = [];
      var nombres = rotulosBandas(E, 600, izq, bw, w, 2), pies = C ? rotulosBandas(C, 400, izq, bw, w, 1) : [];
      E.forEach(function (e, i) {
        if (i % 2 === 0) graf.push(gRect(izq + i * bw, 0, bw, h, P.neutro100, 0, 0));
        var r = nombres[i];
        r.lineas.forEach(function (l, k) { graf.push(gTexto(l, r.x, r.lineas.length > 1 ? 7 + k * 14 : 13, { color: T.texto, peso: 600, align: 'center' })); });
        if (C) graf.push(gTexto(pies[i].lineas[0], pies[i].x, h - 13, { color: T.etiquetaEje, align: 'center' }));
      });
      [[yB, niv[0]], [ym, niv[1]], [yT, niv[2]]].forEach(function (q) { graf.push(gTexto(q[1], izq - 6, q[0], { color: T.etiquetaEje, align: 'right' })); });
      graf.push({ type: 'line', silent: true, z: 1, shape: { x1: izq, y1: ym, x2: w, y2: ym }, style: { stroke: T.base, lineWidth: 1, lineDash: [4, 3] } });
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500, graphic: { elements: graf },
        grid: { left: izq, right: 0, top: yT, bottom: h - yB, containLabel: false },
        xAxis: { type: 'category', data: E, boundaryGap: true, show: false },
        yAxis: { type: 'value', min: d.minimo, max: d.maximo, show: false, axisLabel: { show: false } },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (p) { var i = p.dataIndex; return cabeceraTooltip(E[i]) + (C ? filaTooltip('Punto de contacto', esc(C[i])) : '') + filaTooltip('Valoración', formatear(V[i], opc).texto); }
        }),
        series: [{
          type: 'line', data: V, z: 5, clip: false, symbol: 'circle', symbolSize: 13, showSymbol: true, emphasis: { scale: false },
          lineStyle: { color: T.actual, width: 3, cap: 'round', join: 'round' }, itemStyle: { color: T.actual, borderColor: T.fondo, borderWidth: 2 }
        }]
      };
    });
  };

  /* ================================================================== */
  /* Familia Temporal especializado                                      */
  /* ================================================================== */
  var COLOR_HOY = P.neutro700;
  /* Texto con fondo blanco: la línea de «Hoy» pasa por detrás sin taparlo */
  function gTextoFondo(txt, x, y, o) { var g = gTexto(txt, x, y, o); g.style.backgroundColor = T.fondo; g.style.padding = [1, 2]; return g; }
  /* Rango de un eje de tiempo: meses enteros o, si dura menos de dos meses, días (con uno de margen a cada lado) */
  function rangoTiempo(items, hoy) {
    var a = Infinity, b = -Infinity;
    items.forEach(function (x) { a = Math.min(a, x.t0); b = Math.max(b, x.t1); });
    if (hoy) { a = Math.min(a, hoy.t0); b = Math.max(b, hoy.t1); }
    if (b - a <= 62 * DIA_MS) return { t0: a - DIA_MS, t1: b + DIA_MS, dias: true };
    var p = new Date(a), q = new Date(b - 1);
    return { t0: Date.UTC(p.getUTCFullYear(), p.getUTCMonth(), 1), t1: Date.UTC(q.getUTCFullYear(), q.getUTCMonth() + 1, 1), dias: false };
  }
  /* Marcas de un eje de tiempo: el paso más fino (días; semanas desde el lunes; 1, 2, 3 o 6 meses; años) que deja minPx entre marcas.
     Con varios años, enero se rotula con el año (y la primera marca lo lleva si cabe). Devuelve { marcas: [{ t, texto }], meses, dias } */
  function marcasTiempo(r, largo, minPx) {
    var px = largo / ((r.t1 - r.t0) / DIA_MS), res = [], t;
    var multi = new Date(r.t0).getUTCFullYear() !== new Date(r.t1 - 1).getUTCFullYear();
    if (r.dias) {
      var pd = [1, 2, 7, 14, 28].filter(function (p) { return p * px >= minPx; })[0] || 28;
      t = r.t0;
      if (pd >= 7) while (diaSemana(t) !== 0) t += DIA_MS;
      for (; t <= r.t1 + 1; t += pd * DIA_MS) res.push({ t: t, texto: textoFecha(fechaDe(t)) });
      return { marcas: res, meses: 0, dias: pd };
    }
    var pm = [1, 2, 3, 6, 12, 24, 60].filter(function (p) { return p * 30.44 * px >= minPx; })[0] || 120;
    var d0 = new Date(r.t0), idx = Math.ceil((d0.getUTCFullYear() * 12 + d0.getUTCMonth()) / pm) * pm;
    for (; ; idx += pm) {
      var a = Math.floor(idx / 12), m = idx % 12;
      t = Date.UTC(a, m, 1);
      if (t > r.t1 + 1) break;
      res.push({ t: t, texto: pm >= 12 || (multi && m === 0) ? String(a) : mayuscula(MESES[m].slice(0, 3)) });
    }
    if (multi && pm < 12 && res.length && new Date(res[0].t).getUTCMonth() !== 0) {
      var con = res[0].texto + ' ' + new Date(res[0].t).getUTCFullYear();
      if (res.length < 2 || (res[1].t - res[0].t) / DIA_MS * px >= medir(con) / 2 + medir(res[1].texto) / 2 + 10) res[0].texto = con;
    }
    return { marcas: res, meses: pm, dias: 0 };
  }
  /* Línea de «Hoy»: discontinua en Neutro 700, con el rótulo en seminegrita a su derecha (o a la izquierda si no cabe) */
  function lineaHoy(x, y0, y1, yTexto, w) {
    var izq = x + 5 + medir('Hoy', 600) + 2 > w;
    return [
      { type: 'line', silent: true, z: 3, shape: { x1: x, y1: y0, x2: x, y2: y1 }, style: { stroke: COLOR_HOY, lineWidth: 1.5, lineDash: [4, 3] } },
      gTexto('Hoy', izq ? x - 5 : x + 5, yTexto, { color: COLOR_HOY, peso: 600, align: izq ? 'right' : 'left', z: 25 })
    ];
  }
  /* Rótulo centrado en x que no se sale del lienzo (0 a w) */
  function gTextoEje(txt, x, y, w, fondo) {
    var tw = medir(txt), o = { color: T.etiquetaEje, align: 'center' };
    if (x - tw / 2 < 0) { x = 0; o.align = 'left'; } else if (x + tw / 2 > w) { x = w; o.align = 'right'; }
    return fondo ? gTextoFondo(txt, x, y, o) : gTexto(txt, x, y, o);
  }
  function tooltipEvento(e, conCarril) {
    var h = cabeceraTooltip(e.nombre);
    if (conCarril) h += filaTooltip('Tipo', esc(e.carril));
    if (e.tramo) h += filaTooltip('Inicio', esc(textoFecha(e.fi, true))) + filaTooltip('Fin', esc(textoFecha(e.ff, true))) + filaTooltip('Duración', numero(Math.round((e.t1 - e.t0) / DIA_MS)) + ' días');
    else h += notaTooltip(esc(mayuscula(fechaLarga(e.f, true))));
    if (e.descripcion) h += notaTooltip(esc(e.descripcion));
    return h;
  }

  R.cronologia = function (el, s) {
    if (s.variante === 'vertical') return cronologiaVertical(el, s);
    if (s.variante === 'carriles') return cronologiaCarriles(el, s);
    return cronologiaHitos(el, s);
  };

  /* Timeline: eje continuo y los hitos alternados arriba y abajo (si un rótulo choca, pasa al otro lado o a una fila más alejada);
     el hito destacado (por defecto, el próximo a «hoy») en Naranja 500 */
  function cronologiaHitos(el, s) {
    var d = s.datos, E = d._ev, hoy = d._hoy;
    var nombres = E.map(function (e) { return recortar(e.nombre, 120); });
    var fechas = E.map(function (e) { return textoFecha(e.f, d._conAnio); });
    var anchos = E.map(function (e, i) { return Math.max(medir(nombres[i]), medir(fechas[i], 600)); });
    var c = tarjeta(el, s, lienzo(s, 200)), lz = c.firstChild;
    return montarECharts(lz, function (w) {
      var r = rangoTiempo(E, hoy), x0 = 24, x1 = w - 24;
      var X = function (t) { return x0 + (t - r.t0) / (r.t1 - r.t0) * (x1 - x0); };
      var puestos = [], filas = { arriba: 0, abajo: 0 }, xh = hoy ? X(medioFecha(hoy)) : null;
      E.forEach(function (e, i) {
        var x = X(e.t), aw = anchos[i] + 4, cx = Math.max(aw / 2, Math.min(w - aw / 2, x));
        /* El rótulo se aparta de la línea de «Hoy» si puede hacerlo sin dejar de cubrir su tallo */
        if (xh != null && Math.abs(cx - xh) < aw / 2 + 3) {
          var cx2 = x >= xh ? xh + aw / 2 + 3 : xh - aw / 2 - 3;
          if (Math.abs(cx2 - x) <= aw / 2 - 4 && cx2 - aw / 2 >= 0 && cx2 + aw / 2 <= w) cx = cx2;
        }
        var pref = i % 2 === 0 ? 'arriba' : 'abajo', otro = pref === 'arriba' ? 'abajo' : 'arriba', elegido = null, menor = Infinity;
        /* El primer hueco libre (alternando lados y alejándose del eje hasta 4 filas); si no hay, el que menos solapa */
        [[pref, 0], [otro, 0], [pref, 1], [otro, 1], [pref, 2], [otro, 2], [pref, 3], [otro, 3]].some(function (cand) {
          var coste = 0;
          puestos.forEach(function (o) {
            if (o.lado !== cand[0]) return;
            if (o.nivel === cand[1]) coste += Math.max(0, Math.min(cx + aw / 2, o.cx + o.aw / 2) - Math.max(cx - aw / 2, o.cx - o.aw / 2) + 12);
            /* El tallo de un rótulo alejado no atraviesa los rótulos más cercanos al eje (ni al revés) */
            else if (o.nivel < cand[1] ? Math.abs(x - o.cx) < o.aw / 2 + 4 : Math.abs(o.x - cx) < aw / 2 + 4) coste += 40;
          });
          if (coste < menor) { menor = coste; elegido = cand; }
          return coste === 0;
        });
        puestos.push({ x: x, cx: cx, aw: aw, lado: elegido[0], nivel: elegido[1] });
        filas[elegido[0]] = Math.max(filas[elegido[0]], elegido[1] + 1);
      });
      var arr = hoy ? 22 : 0, ya = Math.round(arr + (filas.arriba ? 65 + 32 * (filas.arriba - 1) : 18)) + 0.5;
      var alto = Math.ceil(ya + (filas.abajo ? 77 + 32 * (filas.abajo - 1) : 28) + 2);
      if (Math.abs(lz.offsetHeight - alto) > 1) lz.style.height = alto + 'px';
      var els = [gLinea(x0 - 8, ya, x1 + 8, ya, T.base, 2, 1)];
      var tallos = puestos.filter(function (o) { return o.lado === 'abajo'; }).map(function (o) { return o.x; });
      marcasTiempo(r, x1 - x0, 44).marcas.forEach(function (m) {
        var x = Math.round(X(m.t)) + 0.5, mw = medir(m.texto);
        if (x < x0 - 1 || x > x1 + 1) return;
        els.push({ type: 'line', silent: true, z: 1, shape: { x1: x, y1: ya - 4, x2: x, y2: ya + 4 }, style: { stroke: T.base, lineWidth: 1 } });
        /* Un rótulo del eje que pisaría el tallo de un hito de abajo se omite (queda la marca) */
        if (!tallos.some(function (tx) { return Math.abs(tx - x) < mw / 2 + 4; })) els.push(gTextoEje(m.texto, x, ya + 16, w, true));
      });
      puestos.forEach(function (o, i) {
        var arriba = o.lado === 'arriba', fin = arriba ? ya - 24 - 32 * o.nivel : ya + 36 + 32 * o.nivel;
        var yF = arriba ? fin - 20 : fin + 20, yN = arriba ? yF - 14 : yF + 14;
        els.push({ type: 'line', silent: true, z: 2, shape: { x1: o.x, y1: ya, x2: o.x, y2: fin }, style: { stroke: T.base, lineWidth: 1.5 } });
        els.push(gTextoFondo(fechas[i], o.cx, yF, { color: T.texto, peso: 600, align: 'center' }));
        els.push(gTextoFondo(nombres[i], o.cx, yN, { color: T.leyenda, align: 'center' }));
      });
      if (hoy) els = els.concat(lineaHoy(Math.round(X(medioFecha(hoy))) + 0.5, 1, alto - 1, 8, w));
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), { trigger: 'item', formatter: function (p) { return tooltipEvento(E[p.dataIndex]); } }),
        series: [{
          type: 'custom', coordinateSystem: 'none', z: 5, data: E.map(function (e) { return { name: e.nombre, value: 1 }; }),
          renderItem: function (p) {
            return { type: 'circle', shape: { cx: puestos[p.dataIndex].x, cy: ya, r: 6.5 }, style: { fill: p.dataIndex === d._foco ? T.actual : P.neutro600, stroke: T.fondo, lineWidth: 2 } };
          }
        }]
      };
    });
  }

  /* Event timeline: un carril por tipo de evento (fondos alternos en Neutro 100). Los eventos puntuales llevan una forma por carril;
     los que duran, una barra. El destacado, en Naranja 500. Los rótulos que no caben se omiten (el tooltip los da). */
  var FORMAS_CARRIL = ['circulo', 'rombo', 'cuadrado', 'triangulo'];
  function formaPunto(forma, x, y, color) {
    if (forma === 'circulo') return { type: 'circle', shape: { cx: x, cy: y, r: 6 }, style: { fill: color, stroke: T.fondo, lineWidth: 2 } };
    if (forma === 'rombo') return { type: 'polygon', shape: { points: [[x, y - 6], [x + 6, y], [x, y + 6], [x - 6, y]] }, style: { fill: color } };
    if (forma === 'cuadrado') return { type: 'rect', shape: { x: x - 5, y: y - 5, width: 10, height: 10, r: 1.5 }, style: { fill: color } };
    return { type: 'polygon', shape: { points: [[x, y - 6], [x + 6.5, y + 5], [x - 6.5, y + 5]] }, style: { fill: color } };
  }
  function cronologiaCarriles(el, s) {
    var d = s.datos, E = d._ev, C = d._carriles, hoy = d._hoy, AC = 48, arr = hoy ? 18 : 0, formas = {}, nf = 0;
    C.forEach(function (x) { if (E.some(function (e) { return e.carril === x && !e.tramo; })) formas[x] = FORMAS_CARRIL[nf++ % FORMAS_CARRIL.length]; });
    var c = tarjeta(el, s, lienzo(s, arr + C.length * AC + 30));
    return montarECharts(c.firstChild, function (w) {
      var izq = 8 + Math.min(maxMedida(C, 600), Math.round(w * 0.3)) + 16, x0 = izq + 8, x1 = w - 8;
      var r = rangoTiempo(E, hoy), X = function (t) { return x0 + (t - r.t0) / (r.t1 - r.t0) * (x1 - x0); };
      var yEje = arr + C.length * AC + 6.5, els = [];
      C.forEach(function (nombre, j) {
        var y = arr + j * AC;
        if (j % 2 === 0) els.push(gRect(0, y, w, AC, P.neutro100, 0, 0));
        els.push(gTexto(recortar(nombre, izq - 24, 600), 8, y + AC / 2 + 6, { color: T.texto, peso: 600 }));
      });
      els.push({ type: 'line', silent: true, z: 1, shape: { x1: x0, y1: yEje, x2: x1, y2: yEje }, style: { stroke: T.base, lineWidth: 1 } });
      marcasTiempo(r, x1 - x0, 44).marcas.forEach(function (m) {
        var x = Math.round(X(m.t)) + 0.5;
        if (x < x0 - 1 || x > x1 + 1) return;
        els.push({ type: 'line', silent: true, z: 1, shape: { x1: x, y1: yEje, x2: x, y2: yEje + 4 }, style: { stroke: T.base, lineWidth: 1 } });
        els.push(gTextoEje(m.texto, x, yEje + 14, w));
      });
      /* Rótulos: primero el destacado y después por orden cronológico, solo si no chocan en su carril */
      var ocupado = C.map(function () { return []; });
      E.map(function (e, i) { return i; }).sort(function (a, b) { return (b === d._foco) - (a === d._foco) || E[a].t - E[b].t; }).forEach(function (i) {
        var e = E[i], j = C.indexOf(e.carril), foco = i === d._foco, peso = foco ? 600 : 400, txt = recortar(e.nombre, 150, peso), tw = medir(txt, peso);
        var l = Math.max(izq, Math.min(w - tw, e.tramo ? X(e.t0) : X(e.t) - tw / 2));
        if (ocupado[j].some(function (q) { return l < q[1] + 6 && l + tw > q[0] - 6; })) return;
        ocupado[j].push([l, l + tw]);
        els.push(gTexto(txt, l, arr + j * AC + 13, { color: foco ? T.texto : T.leyenda, peso: peso, z: 22 }));
      });
      if (hoy) els = els.concat(lineaHoy(Math.round(X(medioFecha(hoy))) + 0.5, 1, yEje, 8, w));
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), { trigger: 'item', formatter: function (p) { return tooltipEvento(E[p.dataIndex], true); } }),
        series: [{
          type: 'custom', coordinateSystem: 'none', z: 5, data: E.map(function (e) { return { name: e.nombre, value: 1 }; }),
          renderItem: function (p) {
            var e = E[p.dataIndex], j = C.indexOf(e.carril), yc = arr + j * AC + 30, color;
            if (e.tramo) {
              var a = X(e.t0), b = Math.max(a + 4, X(e.t1));
              color = p.dataIndex === d._foco ? T.actual : P.neutro400;
              return { type: 'rect', shape: { x: a, y: yc - 7, width: b - a, height: 14, r: 4 }, style: { fill: color, stroke: T.fondo, lineWidth: 1 } };
            }
            return formaPunto(formas[e.carril], X(e.t), yc, p.dataIndex === d._foco ? T.actual : P.neutro600);
          }
        }]
      };
    });
  }

  /* Milestone timeline: lista vertical con fecha, marca de estado, nombre, descripción y etiqueta de estado. El tramo cumplido del eje,
     en Naranja 500; el pendiente, en Neutro 300 */
  function cronologiaVertical(el, s) {
    var d = s.datos, E = d._ev, ETQ = { hecho: 'Hecho', curso: 'En curso', pendiente: 'Pendiente' };
    var marca = '<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M5.2 9.2l2.6 2.6 5-5.6" fill="none" stroke="' + T.fondo + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var fechas = E.map(function (e) { return e.f ? textoFecha(e.f, true) : e.texto; });
    tarjeta(el, s, '<ol class="eg-hitos" style="--f:' + (maxMedida(fechas, 600) + 1) + 'px">' + E.map(function (e, i) {
      return '<li class="eg-hito-' + e.estado + (i < d._k ? ' eg-hito-tramo' : '') + '"' + (e.estado === 'curso' ? ' aria-current="step"' : '') + '>' +
        '<span class="eg-hito-fecha">' + esc(fechas[i]) + '</span><span class="eg-hito-eje"><i>' + (e.estado === 'hecho' ? marca : '') + '</i></span>' +
        '<span class="eg-hito-texto"><small class="eg-hito-fecha2">' + esc(fechas[i]) + '</small><b title="' + esc(e.nombre) + '">' + esc(e.nombre) + '</b>' +
        (e.descripcion ? '<small title="' + esc(e.descripcion) + '">' + esc(e.descripcion) + '</small>' : '') + '</span>' +
        '<span class="eg-hito-estado">' + ETQ[e.estado] + '</span></li>';
    }).join('') + '</ol>');
    return Promise.resolve();
  }

  /* Gantt: lo previsto en Neutro 300 y lo realizado (el «avance» de cada tarea) en Naranja 500; los hitos, rombos en Neutro 700;
     la línea de «Hoy» discontinua. La rejilla vertical marca los meses (o las semanas o los días en planes cortos). */
  R.gantt = function (el, s) {
    var d = s.datos, filas = d._tareas.concat(d._hitos), hoy = d._hoy, n = filas.length, ARR = 26, PASO = 28;
    var ley = [{ texto: 'Previsto', color: P.neutro300 }].concat(d._avance ? [{ texto: 'Realizado', color: T.actual }] : [])
      .concat(d._hitos.length ? [{ texto: 'Hito', color: P.neutro700, forma: 'rombo' }] : []);
    if (ley.length < 2) ley = [];
    var yB = ARR + 7 + n * PASO, c = tarjeta(el, s, lienzo(s, yB + (ley.length ? 24 : 4)));
    return montarECharts(c.firstChild, function (w) {
      var izq = Math.min(maxMedida(filas.map(function (f) { return f.nombre; }), 600), Math.round(w * 0.38)) + 16, x0 = izq, x1 = w - 10;
      var r = rangoTiempo(filas, hoy), X = function (t) { return x0 + (t - r.t0) / (r.t1 - r.t0) * (x1 - x0); };
      var m = marcasTiempo(r, x1 - x0, 40), xs = m.marcas.map(function (q) { return X(q.t); }), els = [];
      [x0].concat(xs, [x1]).forEach(function (x, k, todos) {
        if (k && Math.abs(x - todos[k - 1]) < 2) return;
        x = Math.round(x) + 0.5;
        els.push({ type: 'line', silent: true, z: 0, shape: { x1: x, y1: ARR - 2, x2: x, y2: yB }, style: { stroke: P.neutro200, lineWidth: 1 } });
      });
      els.push({ type: 'line', silent: true, z: 1, shape: { x1: 0, y1: ARR + 0.5, x2: w, y2: ARR + 0.5 }, style: { stroke: T.base, lineWidth: 1 } });
      var enBanda = m.meses === 1 || m.dias === 1;
      m.marcas.forEach(function (q, k) {
        var xa = xs[k], xb = k + 1 < xs.length ? xs[k + 1] : x1, tw = medir(q.texto);
        if (xa >= x1 - 1) return;
        if (enBanda) { if (tw <= xb - xa - 4) els.push(gTexto(q.texto, (xa + xb) / 2, 13, { color: T.leyenda, align: 'center' })); }
        else if (xa + 4 + tw <= x1) els.push(gTexto(q.texto, xa + 4, 13, { color: T.leyenda }));
      });
      filas.forEach(function (f, i) {
        els.push(gTexto(recortar(f.nombre, izq - 16, f.hito ? 600 : 400), 0, ARR + 7 + i * PASO + PASO / 2, { color: T.texto, peso: f.hito ? 600 : 400 }));
      });
      if (hoy) {
        els = els.concat(lineaHoy(Math.round(X(medioFecha(hoy))) + 0.5, ARR, yB, ARR + 8, w));
      }
      if (ley.length) els = els.concat(gLeyenda(ley, yB + 14));
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (p) {
            var f = filas[p.dataIndex], h = cabeceraTooltip(f.nombre);
            if (f.hito) return h + notaTooltip('Hito · ' + esc(fechaLarga(f.f)));
            h += filaTooltip('Inicio', esc(textoFecha(f.fi, true))) + filaTooltip('Fin', esc(textoFecha(f.ff, true))) + filaTooltip('Duración', numero(Math.round((f.t1 - f.t0) / DIA_MS)) + ' días');
            if (f.avance != null) h += filaTooltip('Realizado', porcentaje(f.avance, f.avance % 1 ? 1 : 0));
            return h;
          }
        }),
        series: [{
          type: 'custom', coordinateSystem: 'none', z: 5, data: filas.map(function (f) { return { name: f.nombre, value: 1 }; }),
          renderItem: function (p) {
            var f = filas[p.dataIndex], yc = ARR + 7 + p.dataIndex * PASO + PASO / 2;
            if (f.hito) { var xm = X(f.t); return { type: 'polygon', shape: { points: [[xm, yc - 9], [xm + 9, yc], [xm, yc + 9], [xm - 9, yc]] }, style: { fill: P.neutro700 } }; }
            var a = X(f.t0), b = Math.max(a + 4, X(f.t1)), hijos = [{ type: 'rect', shape: { x: a, y: yc - 9, width: b - a, height: 18, r: 4 }, style: { fill: P.neutro300 } }];
            if (f.avance > 0) hijos.push({ type: 'rect', shape: { x: a, y: yc - 9, width: Math.max(4, (b - a) * f.avance / 100), height: 18, r: 4 }, style: { fill: T.actual } });
            return { type: 'group', children: hijos };
          }
        }]
      };
    });
  };

  R.calendario = function (el, s) { return s.variante === 'mes' ? calendarioMes(el, s) : calendarioCalor(el, s); };

  /* Calendar heatmap: semanas en columnas (de lunes a domingo) y días en filas. Secuencial de 5 clases: Neutro 200 para el cero
     y cuatro tramos iguales hasta el máximo en Naranja 100, 300, 500 y 700 */
  var CLASES_CALOR = [P.neutro200, P.naranja100, P.naranja300, P.naranja500, P.naranja700];
  function claseCalor(v, max) { return v > 0 ? Math.min(4, 1 + Math.floor(v / max * 4 - 1e-9)) : 0; }
  function calendarioCalor(el, s) {
    var d = s.datos, D = d._dias, lunes = D[0].t - diaSemana(D[0].t) * DIA_MS, izq = 16, ARR = 20;
    var col = function (t) { return Math.floor((t - lunes) / DIA_MS / 7 + 1e-9); }, nS = col(D[D.length - 1].t) + 1;
    var sinDato = D.some(function (x) { return x.v == null; }), multi = new Date(D[0].t).getUTCFullYear() !== new Date(D[D.length - 1].t).getUTCFullYear();
    var resumen = d._resumen === 'media' ? 'Media diaria: ' + fmtU(d._media, s).texto : fmtU(d._total, s).texto + ' en ' + (nS === 1 ? '1 semana' : nS + ' semanas');
    var opc = opcionesTooltip(s), c = tarjeta(el, s, lienzo(s, 160)), lz = c.firstChild;
    return montarECharts(lz, function (w) {
      var paso = Math.max(4, Math.min(18, Math.floor((w - izq) / nS * 10) / 10)), lado = paso - (paso < 8 ? 1 : 2);
      var yL = ARR + 7 * paso + 16, x = izq, els = [];
      /* Leyenda «Menos … Más» y el resumen a la derecha (debajo si no caben juntos) */
      els.push(gTexto('Menos', x, yL, { color: T.etiquetaEje })); x += medir('Menos') + 8;
      CLASES_CALOR.forEach(function (k) { els.push(gRect(x + 0.5, yL - 5.5, 11, 11, k, 2, 20, P.neutro300, 1)); x += 16; });
      els.push(gTexto('Más', x + 4, yL, { color: T.etiquetaEje })); x += 4 + medir('Más');
      if (sinDato) { x += 16; els.push(gRect(x + 0.5, yL - 5.5, 11, 11, T.fondo, 2, 20, P.neutro300, 1)); els.push(gTexto('Sin dato', x + 17, yL, { color: T.etiquetaEje })); x += 17 + medir('Sin dato'); }
      var abajo = x + 16 + medir(resumen, 600) > w, alto = Math.ceil(yL + 9 + (abajo ? 20 : 0));
      els.push(gTexto(resumen, abajo ? izq : w, abajo ? yL + 20 : yL, { color: T.texto, peso: 600, align: abajo ? 'left' : 'right' }));
      if (Math.abs(lz.offsetHeight - alto) > 1) lz.style.height = alto + 'px';
      /* Meses arriba, en la semana de su día 1 (el mes empezado, en la primera; se quita si choca con el siguiente) */
      var meses = [];
      D.forEach(function (q, i) {
        var f = new Date(q.t);
        if (i && f.getUTCDate() !== 1) return;
        var txt = multi && f.getUTCMonth() === 0 ? String(f.getUTCFullYear()) : mayuscula(MESES[f.getUTCMonth()].slice(0, 3)), mx = izq + col(q.t) * paso, ult = meses[meses.length - 1];
        if (mx + medir(txt) > w) return;
        if (ult && mx < ult.x + ult.w + 6) { if (ult.empezado) meses.pop(); else return; }
        meses.push({ x: mx, w: medir(txt), texto: txt, empezado: i === 0 && f.getUTCDate() !== 1 });
      });
      meses.forEach(function (q) { els.push(gTexto(q.texto, q.x, 8, { color: T.leyenda })); });
      /* Los días de la semana que caben sin pisarse: L, X y V; o L y V; o solo L */
      (2 * paso >= 13 ? [[0, 'L'], [2, 'X'], [4, 'V']] : (4 * paso >= 13 ? [[0, 'L'], [4, 'V']] : [[0, 'L']])).forEach(function (q) { els.push(gTexto(q[1], izq - 6, ARR + q[0] * paso + lado / 2, { color: T.etiquetaEje, align: 'right' })); });
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (p) { var q = D[p.dataIndex], opc = { decimales: s.decimales, abreviar: s.abreviar, unidad: s.unidad === '%' ? '%' : '' }; return cabeceraTooltip(mayuscula(fechaLarga(fechaDe(q.t), true))) + (q.v == null ? notaTooltip('Sin dato') : filaTooltip(s.unidad === '%' ? 'Valor' : mayuscula(s.unidad), formatear(q.v, opc).texto)); }
        }),
        series: [{
          type: 'custom', coordinateSystem: 'none', data: D.map(function (q) { return { value: q.v == null ? 0 : q.v }; }),
          renderItem: function (p) {
            var q = D[p.dataIndex], cx = izq + col(q.t) * paso, cy = ARR + diaSemana(q.t) * paso, nulo = q.v == null;
            return { type: 'rect', shape: { x: cx + (nulo ? 0.5 : 0), y: cy + (nulo ? 0.5 : 0), width: lado - (nulo ? 1 : 0), height: lado - (nulo ? 1 : 0), r: Math.min(2, lado / 4) },
              style: { fill: nulo ? T.fondo : CLASES_CALOR[claseCalor(q.v, d._max)], stroke: nulo ? P.neutro300 : null, lineWidth: nulo ? 1 : 0 } };
          }
        }]
      };
    });
  }

  /* Calendar chart: un mes con los fines de semana en Neutro 100, los festivos en Neutro 300, los eventos con un punto
     y hoy con un círculo: cada cosa con su forma, sin depender solo del color */
  function calendarioMes(el, s) {
    var d = s.datos, m = d._mes, nDias = Math.round((m.t1 - m.t0) / DIA_MS), desfase = diaSemana(m.t0), hayFinde = false, html = '';
    var semanas = Math.ceil((desfase + nDias) / 7);
    for (var fila = 0; fila < semanas; fila++) {
      html += '<tr>';
      for (var j = 0; j < 7; j++) {
        var dia = fila * 7 + j - desfase + 1;
        if (dia < 1 || dia > nDias) { html += '<td class="eg-cal-vacio"></td>'; continue; }
        var ev = d._eventos[dia], fe = d._festivos[dia], hoy = d._hoy && d._hoy.d === dia, clases = [];
        if (j >= 5) { clases.push('eg-cal-finde'); hayFinde = true; }
        if (fe) clases.push('eg-cal-festivo');
        if (hoy) clases.push('eg-cal-hoy');
        var desc = [mayuscula(fechaLarga(leerFecha(m.a + '-' + dos(m.m + 1) + '-' + dos(dia)), true))];
        if (hoy) desc.push('Hoy');
        if (fe) desc.push('Festivo' + (fe.filter(Boolean).length ? ': ' + fe.filter(Boolean).join(', ') : ''));
        if (ev) desc.push(ev.join(' · '));
        html += '<td' + (clases.length ? ' class="' + clases.join(' ') + '"' : '') + ' title="' + esc(desc.join('\n')) + '" aria-label="' + esc(desc.join('. ')) + '"' + (hoy ? ' aria-current="date"' : '') + '>' +
          '<span class="eg-cal-num">' + dia + '</span>' + (ev ? '<i class="eg-cal-ev" aria-hidden="true"></i>' : '') + '</td>';
      }
      html += '</tr>';
    }
    var ley = [];
    if (d._hoy) ley.push('<li><i class="eg-m-hoy"></i>Hoy</li>');
    if (d._nEventos) ley.push('<li><i class="eg-m-ev"></i>Evento</li>');
    if (Object.keys(d._festivos).length) ley.push('<li><i class="eg-m" style="width:11px;height:11px;background:' + P.neutro300 + '"></i>Festivo</li>');
    if (hayFinde) ley.push('<li><i class="eg-m" style="width:11px;height:11px;background:' + P.neutro100 + ';box-shadow:inset 0 0 0 1px ' + P.neutro200 + '"></i>Fin de semana</li>');
    tarjeta(el, s, '<div class="eg-cal"><p class="eg-cal-mes">' + mayuscula(MESES[m.m]) + ' ' + m.a + '</p><table class="eg-cal-tabla"><thead><tr>' +
      ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(function (x, i) { return '<th scope="col" abbr="' + DIAS_SEMANA[i] + '">' + x + '</th>'; }).join('') + '</tr></thead><tbody>' + html + '</tbody></table>' +
      '<ul class="eg-leyenda-h eg-cal-ley">' + ley.join('') + '</ul></div>');
    return Promise.resolve();
  }

  R['dos-periodos'] = function (el, s) { return s.variante === 'interanual' ? periodosInteranual(el, s) : periodosSuperpuestos(el, s); };
  /* Cambio de b (anterior) a a (actual): en % relativo; en puntos si la unidad es % */
  function chipCambio(b, a, s) {
    if (s.unidad === '%') { var dif = Math.round((a - b) * 10) / 10; return chipVariacion(dif, null, null, (dif > 0 ? '+' : (dif < 0 ? '\u2212' : '')) + numero(Math.abs(dif)) + NBSP + 'p.' + NBSP + 'p.'); }
    return b ? chipVariacion((a - b) / Math.abs(b) * 100) : '';
  }

  /* Period comparison: los dos periodos alineados por posición (el actual en Naranja 500 con puntos; el anterior en Neutro 400,
     discontinuo) y a la derecha el total (o la media) de cada uno y la variación. Si el actual no ha terminado, se compara con las
     mismas posiciones del anterior. */
  function periodosSuperpuestos(el, s) {
    var d = s.datos, Pr = d._periodos, A = d._act, B = d._ant, k = d._k, media = d._resumen === 'media', opc = opcionesTooltip(s);
    var agr = function (vals) { var x = suma(vals.slice(0, k)); return media ? x / k : x; }, va = agr(A.valores), vb = agr(B.valores);
    var etiqueta = function (nombre, parcial) { return nombre + (media ? ' (media)' : '') + (parcial ? ' · hasta ' + Pr[k - 1] : ''); };
    /* La unidad va en el subtítulo; junto a las cifras solo si es un símbolo corto (€, %) */
    var su = s.unidad.length <= 2 ? s : Object.assign({}, s, { unidad: '' });
    var lado = '<aside class="eg-dp-lado"><div class="eg-dp-dato"><small>' + esc(etiqueta(A.nombre)) + '</small>' + valorGrande(va, su) + '</div>' +
      '<div class="eg-dp-dato"><small>' + esc(etiqueta(B.nombre, k < Pr.length)) + '</small><b>' + esc(fmtU(vb, su).texto) + '</b></div>' + chipCambio(vb, va, s) + '</aside>';
    var ley = leyendaHTML([{ texto: A.nombre, color: T.actual, forma: 'linea' }, { texto: B.nombre, color: T.anterior, forma: 'discontinua' }]);
    var c = tarjeta(el, s, '<div class="eg-dp"><div class="eg-dp-grafico">' + ley + lienzo(s, 210) + '</div>' + lado + '</div>');
    return montarECharts(c.querySelector('.eg-lienzo'), {
      textStyle: { fontFamily: FUENTE }, animationDuration: 500,
      grid: { left: 4, right: 8, top: 10, bottom: 4, containLabel: true },
      tooltip: Object.assign(tooltipBase(), {
        trigger: 'axis', axisPointer: { type: 'line', lineStyle: { color: T.base, width: 1 } },
        formatter: function (ps) {
          var i = ps[0].dataIndex, filas = (i < k ? [[A.nombre, A.valores[i]]] : []).concat([[B.nombre, B.valores[i]]]);
          return textoTooltip(Pr[i], filas, opc) + (i < k ? notaTooltip('Variación ' + cambioTexto(B.valores[i], A.valores[i], s)) : '');
        }
      }),
      xAxis: ejeCategoria(Pr, true),
      yAxis: ejeValor(),
      series: [
        { type: 'line', name: B.nombre, data: B.valores, z: 3, symbol: 'none', lineStyle: { color: T.anterior, width: 2.5, type: [5, 3] }, itemStyle: { color: T.anterior }, emphasis: { disabled: true } },
        { type: 'line', name: A.nombre, data: A.valores, z: 5, symbol: 'circle', symbolSize: 7, showSymbol: true, lineStyle: { color: T.actual, width: 2.5 },
          itemStyle: { color: T.actual, borderColor: T.fondo, borderWidth: 1.5 }, emphasis: { disabled: true } }
      ]
    });
  }

  /* Year-over-year: columnas del año anterior (Neutro 400) y del actual (Naranja 500) por periodo, con el valor encima si cabe
     y la variación interanual rotulada debajo */
  function periodosInteranual(el, s) {
    var d = s.datos, Pr = d._periodos, A = d._act, B = d._ant, k = d._k, n = Pr.length, opc = opcionesTooltip(s);
    var cambios = Pr.map(function (p, i) { return i < k ? cambioTexto(B.valores[i], A.valores[i], s) : '\u2013'; });
    var e = extremosBonitos(0, Math.max.apply(null, A.valores.concat(B.valores)) || 1, 3), marcas = marcasDe(e);
    var etA = A.valores.map(function (x) { return fmtDato(x, s); }), etB = B.valores.map(function (x) { return fmtDato(x, s); });
    var c = tarjeta(el, s, lienzo(s, 230));
    return montarECharts(c.firstChild, function (w, h) {
      var izq = maxMedida(marcas.map(formatoEje)) + 10, ARR = 30, ABA = 52, banda = (w - izq) / n;
      var bw = Math.max(4, Math.min(26, (banda * 0.64 - 2) / 2)), rotulos = Math.max(maxMedida(etA, 600), maxMedida(etB)) <= bw + 2;
      /* La variación: con su signo de % (o p. p.) si cabe; si no, solo la cifra y la unidad en el rótulo de la fila; si tampoco, se omite */
      var unidadCambio = s.unidad === '%' ? 'p.' + NBSP + 'p.' : '%', cortos = cambios.map(function (t) { return t.replace(NBSP + unidadCambio, ''); });
      var textos = maxMedida(cambios, 600) <= banda - 6 ? cambios : (maxMedida(cortos, 600) <= banda - 6 ? cortos : null);
      var rotuloFila = textos === cortos ? 'Var. ' + unidadCambio : 'Var.', graf = [];
      if (textos) {
        textos.forEach(function (t, i) { graf.push(gTexto(t, izq + (i + 0.5) * banda, h - 18, { color: T.texto, peso: 600, align: 'center' })); });
        if (medir(rotuloFila) + 6 <= izq + banda / 2 - medir(textos[0], 600) / 2) graf.push(gTexto(rotuloFila, 0, h - 18, { color: T.etiquetaEje }));
      }
      return {
        textStyle: { fontFamily: FUENTE }, animationDuration: 500, graphic: { elements: graf },
        legend: Object.assign(leyenda(true), { selectedMode: false, data: [{ name: B.nombre, itemStyle: { color: T.anterior, borderWidth: 0 } }, { name: A.nombre, itemStyle: { color: T.actual, borderWidth: 0 } }] }),
        grid: { left: izq, right: 0, top: ARR, bottom: ABA, containLabel: false },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'axis', axisPointer: SOMBRA_EJE,
          formatter: function (ps) {
            var i = ps[0].dataIndex, filas = [[B.nombre, B.valores[i]]].concat(i < k ? [[A.nombre, A.valores[i]]] : []);
            return textoTooltip(Pr[i], filas, opc) + (i < k ? notaTooltip('Variación interanual ' + cambios[i]) : '');
          }
        }),
        /* Todos los periodos si caben; si no, ECharts deja uno de cada dos (o de cada tres…) */
        xAxis: Object.assign(ejeCategoria(Pr, true), { axisLabel: Object.assign(estiloTexto(T.etiquetaEje), { margin: 6, interval: maxMedida(Pr) <= banda - 4 ? 0 : 'auto' }) }),
        yAxis: { type: 'value', min: 0, max: e.hi, interval: e.paso, axisLine: { show: false }, axisTick: { show: false },
          axisLabel: Object.assign(estiloTexto(T.etiquetaEje), { margin: 8, formatter: formatoEje }), splitLine: { lineStyle: { color: T.rejilla, width: 1 } } },
        series: [[B, P.neutro600, 400, etB, T.anterior], [A, T.etiquetaDato, 600, etA, T.actual]].map(function (q) {
          return {
            type: 'bar', name: q[0].nombre, data: q[0].valores, barWidth: bw, barGap: (2 / bw * 100).toFixed(1) + '%', itemStyle: { color: q[4] }, emphasis: { disabled: true },
            label: Object.assign(estiloTexto(q[1], q[2]), { show: rotulos, position: 'top', distance: 3, formatter: function (p) { return q[3][p.dataIndex]; } })
          };
        })
      };
    });
  }

  /* Lifecycle: curva orientativa (sin escala) en fases; la actual sobre Neutro 100 con su nombre en seminegrita y el elemento marcado
     sobre la curva. Con 4 fases, los límites de Figma (22 %, 50 % y 78 %); con otro número, fases iguales. */
  var CURVA_CICLO = [0.96, 0.96, 0.96, 0.96, 0.952, 0.941, 0.929, 0.914, 0.897, 0.878, 0.856, 0.83, 0.802, 0.771, 0.736, 0.699, 0.658, 0.615, 0.57, 0.523,
    0.473, 0.423, 0.373, 0.322, 0.273, 0.226, 0.181, 0.14, 0.102, 0.07, 0.044, 0.022, 0.008, 0.001, 0, 0.006, 0.019, 0.039, 0.064, 0.096, 0.132, 0.172,
    0.217, 0.264, 0.312, 0.362, 0.413, 0.463, 0.513, 0.561, 0.607, 0.65, 0.691, 0.729, 0.764, 0.796, 0.825, 0.851, 0.873, 0.893, 0.911];
  function alturaCiclo(u) { var x = Math.max(0, Math.min(1, u)) * 60, i = Math.min(59, Math.floor(x)), f = x - i; return CURVA_CICLO[i] * (1 - f) + CURVA_CICLO[i + 1] * f; }
  R['ciclo-vida'] = function (el, s) {
    var d = s.datos, F = d._fases, k = d._k, n = F.length, medida = d.medida || 'Ventas';
    var lim = n === 4 ? [0, 0.22, 0.5, 0.78, 1] : F.map(function (f, i) { return i / n; }).concat([1]);
    var u = lim[k] + (d.posicion != null ? d.posicion : 50) / 100 * (lim[k + 1] - lim[k]);
    var lineas = d.elemento ? [[d.elemento, 600, T.texto], ['en ' + minusculaInicial(F[k]), 400, T.leyenda]] : [['Fase actual', 600, T.texto]];
    var c = tarjeta(el, s, lienzo(s, 220));
    return montarECharts(c.firstChild, function (w, h) {
      var izq = Math.min(Math.max(36, medir(medida) + 10), Math.round(w * 0.25)), x0 = izq, x1 = w - 2, yb = 24, yc = 36, ya = h - 44 + 0.5;
      var X = function (q) { return x0 + q * (x1 - x0); }, Y = function (q) { return yc + alturaCiclo(q) * (ya - yc); };
      var pts = CURVA_CICLO.map(function (y, i) { return [X(i / 60), yc + y * (ya - yc)]; }), els = [];
      els.push(gRect(X(lim[k]), yb, X(lim[k + 1]) - X(lim[k]), ya - yb, P.neutro100, 0, 0));
      els.push({ type: 'polygon', silent: true, z: 1, shape: { points: pts.concat([[x1, ya], [x0, ya]]) }, style: { fill: P.naranja100 } });
      els.push({ type: 'line', silent: true, z: 2, shape: { x1: x0, y1: ya, x2: x1, y2: ya }, style: { stroke: T.base, lineWidth: 1 } });
      els.push({ type: 'polyline', silent: true, z: 3, shape: { points: pts }, style: { stroke: T.actual, lineWidth: 3, fill: null, lineJoin: 'round', lineCap: 'round' } });
      lim.slice(1, -1).forEach(function (q) { var x = Math.round(X(q)) + 0.5; els.push({ type: 'line', silent: true, z: 4, shape: { x1: x, y1: yb, x2: x, y2: ya }, style: { stroke: T.base, lineWidth: 1, lineDash: [4, 3] } }); });
      F.forEach(function (f, i) {
        var a = X(lim[i]), b = X(lim[i + 1]), actual = i === k;
        els.push(gTexto(recortar(f, b - a - 4, actual ? 600 : 400), (a + b) / 2, 13, { color: actual ? T.texto : T.leyenda, peso: actual ? 600 : 400, align: 'center' }));
      });
      els.push(gTexto(recortar(medida, izq - 8), izq - 6, yc - 6, { color: T.etiquetaEje, align: 'right' }));
      els.push(gTexto('Tiempo \u2192', x0, ya + 14, { color: T.etiquetaEje }));
      /* El rótulo del elemento va debajo del punto si está en la mitad alta de la curva; si no, encima */
      var mx = X(u), my = Y(u), abajo = my < (yc + ya) / 2, lw = Math.max.apply(null, lineas.map(function (l) { return medir(l[0], l[1]); }));
      var lx = Math.max(x0 + lw / 2, Math.min(x1 - lw / 2, mx)), yFin = abajo ? my + 44 : my - 44;
      els.push({ type: 'line', silent: true, z: 6, shape: { x1: mx, y1: my + (abajo ? 6.5 : -6.5), x2: mx, y2: yFin }, style: { stroke: P.neutro700, lineWidth: 1 } });
      lineas.forEach(function (l, i) {
        var y = abajo ? yFin + 9 + i * 14 : yFin - 9 - (lineas.length - 1 - i) * 14;
        els.push(gTexto(l[0], lx, y, { color: l[2], peso: l[1], align: 'center', z: 22 }));
      });
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), { trigger: 'item', formatter: function () { return cabeceraTooltip(d.elemento || 'Fase actual') + filaTooltip('Fase', esc(F[k])) + filaTooltip('Etapa', (k + 1) + ' de ' + n); } }),
        series: [{ type: 'custom', coordinateSystem: 'none', z: 8, data: [{ name: d.elemento || F[k], value: 1 }],
          renderItem: function () { return { type: 'circle', shape: { cx: mx, cy: my, r: 6.5 }, style: { fill: T.actual, stroke: T.fondo, lineWidth: 2 } }; } }]
      };
    });
  };

  /* Cohort timeline: matriz cohorte × tiempo con el % en la celda. Secuencial de 5 clases (Naranja 100 a 700) con la leyenda de umbrales */
  function matrizCohortes(el, s) {
    var d = s.datos, C = d._cohortes, Pr = d._periodos, Pc = d._pct, ct = d._cortes, nC = C.length, nP = Pr.length, opc = opcionesTooltip(s);
    var fc = function (x) { return numero(x, x % 1 ? 1 : 0); };
    var etq = function (j) {
      if (j === 0) return '<' + NBSP + fc(ct[0]) + NBSP + '%';
      if (j === 4) return '\u2265' + NBSP + fc(ct[3]) + NBSP + '%';
      return fc(ct[j - 1]) + '\u2013' + fc(d._enteros ? ct[j] - 1 : ct[j]) + NBSP + '%';
    };
    var ley = leyendaHTML(CLASES_COHORTE.map(function (col, j) { return { color: col, texto: etq(j), borde: P.neutro300 }; }));
    var izq = Math.max(Math.min(110, maxMedida(C)), medir('Cohorte', 600)) + 10, ARR = 24, PF = 24, AF = 21;
    var celdas = [];
    Pc.forEach(function (fila, i) { fila.forEach(function (x, j) { celdas.push([j, i, x]); }); });
    var c = tarjeta(el, s, ley + lienzo(s, ARR + nC * PF));
    return montarECharts(c.querySelector('.eg-lienzo'), function (w) {
      var paso = Math.min(56, (w - izq) / nP), cw = paso - 3, conValores = medir('100' + NBSP + '%', 600) + 6 <= cw, els = [];
      els.push(gTexto('Cohorte', 0, 10, { color: T.leyenda, peso: 600 }));
      Pr.forEach(function (p, j) { els.push(gTexto(recortar(p, cw, 600), izq + j * paso + cw / 2, 10, { color: T.leyenda, peso: 600, align: 'center' })); });
      C.forEach(function (x, i) { els.push(gTexto(recortar(x, izq - 10), izq - 8, ARR + i * PF + AF / 2, { color: T.leyenda, align: 'right' })); });
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (p) {
            var j = celdas[p.dataIndex][0], i = celdas[p.dataIndex][1], x = celdas[p.dataIndex][2];
            return cabeceraTooltip(C[i] + ' \u00B7 ' + Pr[j]) + (d._recuentos ? filaTooltip(mayuscula(s.unidad), formatear(d.valores[i][j], { decimales: s.decimales, abreviar: s.abreviar }).texto) +
              filaTooltip('Sobre el inicio', porcentaje(x, x % 1 && x < 10 ? 1 : 0)) : filaTooltip('Valor', porcentaje(x, x % 1 ? 1 : 0)));
          }
        }),
        series: [{
          type: 'custom', coordinateSystem: 'none', data: celdas.map(function (q) { return { value: q[2] }; }),
          renderItem: function (p) {
            var q = celdas[p.dataIndex], color = CLASES_COHORTE[claseCohorte(q[2], ct)], x = izq + q[0] * paso, y = ARR + q[1] * PF;
            var hijos = [{ type: 'rect', shape: { x: x, y: y, width: cw, height: AF, r: 3 }, style: { fill: color } }];
            if (conValores) hijos.push({ type: 'text', silent: true, style: { text: porcentaje(Math.round(q[2]), 0), x: x + cw / 2, y: y + AF / 2, fill: textoSobre(color), font: '600 11px ' + FUENTE, align: 'center', verticalAlign: 'middle' } });
            return { type: 'group', children: hijos };
          }
        }]
      };
    });
  }

  /* ================================================================== */
  /* Jerarquía: treemap · jerarquico, particion, circulos-anidados,      */
  /* arbol, anidados y tabla · jerarquica                                */
  /* ================================================================== */
  /* Familias de tonos: el grupo destacado en naranja y el resto en neutros; los hijos, escalones del color del padre */
  var RAMPA_NARANJA = [P.naranja700, P.naranja600, P.naranja500, P.naranja400, P.naranja300, P.naranja200, P.naranja100];
  var RAMPA_NEUTRO = [P.neutro700, P.neutro600, P.neutro500, P.neutro400, P.neutro300, P.neutro200];
  /* n índices de la rampa desde «desde»: de dos en dos si caben; si no, repartidos hasta el último */
  function indicesTonos(desde, ultimo, n) {
    var r = [];
    for (var k = 0; k < n; k++) r.push(desde + 2 * (n - 1) <= ultimo ? desde + 2 * k : (n === 1 ? desde : Math.round(desde + k * (ultimo - desde) / (n - 1))));
    return r;
  }
  /* Tonos de los n elementos de un grupo (treemap y círculos): naranja desde el 500 (desde el 700 con 4 o más), neutro desde el 600 */
  function tonosGrupo(naranja, n) {
    var rampa = naranja ? RAMPA_NARANJA : RAMPA_NEUTRO;
    return indicesTonos(naranja ? (n >= 4 ? 0 : 2) : 1, rampa.length - 1, n).map(function (i) { return rampa[i]; });
  }
  /* Colorea el árbol: cada grupo del primer nivel con su familia y cada nivel, más claro que el anterior (sunburst e icicle) */
  function colorearNiveles(raiz, foco) {
    raiz.hijos.forEach(function (g) {
      var naranja = g === foco, rampa = naranja ? RAMPA_NARANJA : RAMPA_NEUTRO, ultimo = rampa.length - 1;
      g._i = naranja ? 2 : 1; g._color = rampa[g._i];
      (function bajar(p) {
        if (!p.hijos.length) return;
        var n = p.hijos.length, idx;
        if (p.nivel === 1) { var desde = p._i + 2 + n - 1 <= ultimo ? p._i + 2 : p._i + 1; idx = indicesTonos(Math.min(ultimo, desde), ultimo, n); }
        else idx = p.hijos.map(function () { return Math.min(ultimo, p._i + 1); });
        p.hijos.forEach(function (h, k) { h._i = idx[k]; h._color = rampa[h._i]; bajar(h); });
      })(g);
    });
  }
  /* Los tonos más claros llevan un borde para no perderse sobre el blanco */
  function bordeTono(c) {
    if (c === P.naranja100 || c === P.naranja200) return P.naranja300;
    if (c === P.neutro200 || c === P.neutro100) return P.neutro300;
    return null;
  }
  function pctDe(n, base) { return base && base.valor ? n.valor / base.valor * 100 : 0; }
  function filaTip(etiqueta, texto) {
    return '<div style="display:flex;gap:12px;justify-content:space-between"><span style="color:#DBD5CE">' + esc(etiqueta) + '</span><span style="font-weight:600">' + esc(texto) + '</span></div>';
  }
  function cabeceraTip(txt) { return '<div style="font-weight:600;margin-bottom:2px">' + esc(txt) + '</div>'; }
  /* Tooltip de un nodo con valor: el valor, el % sobre su grupo y el % sobre el total */
  function tipNodo(n, s, raiz) {
    var h = cabeceraTip(n.ruta || n.nombre) + filaTip('Valor', fmtU(n.valor, s).texto);
    if (n.agrupa) h += filaTip('Agrupa', n.agrupa + ' elementos');
    if (n.padre && n.padre !== raiz) h += filaTip('% de ' + n.padre.nombre, porcentaje(pctDe(n, n.padre), 1));
    if (n !== raiz) h += filaTip('% del total', porcentaje(pctDe(n, raiz), 1));
    return h;
  }
  /* Los datos de ECharts llevan solo el índice del nodo (_k): el nodo tiene referencias circulares (padre) que ECharts no puede copiar */
  function tooltipNodos(lista, fn) { return Object.assign(tooltipBase(), { trigger: 'item', formatter: function (p) { return p.data && p.data._k != null && lista[p.data._k] ? fn(lista[p.data._k]) : ''; } }); }

  /* Treemap jerárquico: los grupos con su cabecera y, dentro, sus elementos (squarify en dos pasos) */
  function treemapJerarquico(el, s) {
    var a = s.datos._arbol, raiz = a.raiz, foco = s.datos._foco;
    var grupos = raiz.hijos.filter(function (g) { return g.valor > 0; });
    grupos.forEach(function (g) {
      var tonos = tonosGrupo(g === foco, g.hijos.length);
      g.hijos.forEach(function (h, k) { h._color = esOtros(h.nombre) && g !== foco ? P.neutro300 : tonos[k]; });
    });
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.querySelector('.eg-lienzo'), function (ancho, alto) {
      var celdas = [], textos = [];
      var rg = squarify(grupos.map(function (g) { return g.valor; }), 0, 0, ancho, alto);
      grupos.forEach(function (g, i) {
        var r = rg[i], cab = r.h >= 64 && r.w >= 36 ? 22 : 0;
        if (cab) {
          var largo = g.nombre + ' · ' + porcentaje(pctDe(g, raiz), 0), util = r.w - 4;
          var txt = medir(largo, 600) <= util ? largo : recortar(g.nombre, util, 600);
          if (txt) textos.push(gTexto(txt, r.x + 2, r.y + 4, { color: T.texto, peso: 600, va: 'top' }));
        }
        var hijos = g.hijos.filter(function (h) { return h.valor > 0; });
        var rh = squarify(hijos.map(function (h) { return h.valor; }), r.x + 1, r.y + cab + 1, Math.max(0, r.w - 2), Math.max(0, r.h - cab - 2));
        hijos.forEach(function (h, k) { celdas.push({ r: rh[k], n: h }); });
      });
      return {
        animation: false, graphic: { elements: textos },
        tooltip: tooltipNodos(celdas.map(function (q) { return q.n; }), function (n) { return tipNodo(n, s, raiz); }),
        series: [{
          type: 'custom', coordinateSystem: 'none',
          data: celdas.map(function (q, k) { return { name: q.n.nombre, value: q.n.valor, _k: k }; }),
          renderItem: function (p) {
            var q = celdas[p.dataIndex], r = q.r, lineas = [];
            var pct = porcentaje(pctDe(q.n, q.n.padre), 0), util = r.w - 18;
            if (r.h >= 44 && util >= medir(pct)) {
              var nombre = recortar(q.n.nombre, util, 600);
              if (nombre) lineas.push({ texto: nombre, x: r.x + 9, y: r.y + 9, peso: 600 });
              lineas.push({ texto: pct, x: r.x + 9, y: r.y + (nombre ? 24 : 9) });
            } else if (r.h >= 26 && util >= medir(pct)) lineas.push({ texto: pct, x: r.x + 9, y: r.y + 7 });
            return rectRotulado(r, q.n._color, lineas);
          }
        }]
      };
    });
  }

  /* Partición: sunburst (anillos) e icicle (franjas de arriba abajo) */
  R.particion = function (el, s) {
    var a = s.datos._arbol, raiz = a.raiz;
    colorearNiveles(raiz, s.datos._foco);
    return s.variante === 'icicle' ? icicle(el, s, a) : sunburst(el, s, a);
  };
  function sunburst(el, s, a) {
    var raiz = a.raiz, prof = a.prof;
    /* Leyenda: los elementos del segundo nivel (como mucho 10), con su % sobre el total */
    var segundo = [];
    raiz.hijos.forEach(function (g) { g.hijos.forEach(function (h) { segundo.push(h); }); });
    var conLeyenda = segundo.length <= 10;
    var nombreLey = function (h) { return segundo.filter(function (x) { return x.nombre === h.nombre; }).length > 1 ? h.padre.nombre + ' · ' + h.nombre : h.nombre; };
    var leyenda = conLeyenda ? '<ul class="eg-leyenda">' + segundo.map(function (h) {
      var b = bordeTono(h._color);
      return '<li><span class="eg-muestra" style="background:' + h._color + (b ? ';box-shadow:inset 0 0 0 1.5px ' + b : '') + '"></span><span>' + esc(nombreLey(h)) + '</span><b>' + porcentaje(pctDe(h, raiz), 0) + '</b></li>';
    }).join('') + '</ul>' : '';
    var total = fmtU(raiz.valor, s);
    var c = tarjeta(el, s, '<div class="eg-donut-cuerpo"><div class="eg-donut-grafico">' + lienzo(s) +
      '<div class="eg-sb-centro"><b>' + esc(recortar(raiz.nombre, 52, 600)) + '</b><span>' + esc(medir(total.texto) <= 54 ? total.texto : total.numero) + '</span></div></div>' + leyenda + '</div>');
    var radios = prof === 2 ? [[31, 60], [60, 92]] : [[27, 50], [50, 72], [72, 92]];
    var lista = [];
    function datos(n) {
      return n.hijos.filter(function (h) { return h.valor > 0; }).map(function (h) {
        var b = h.nivel > 1 ? bordeTono(h._color) : null;
        lista.push(h);
        var it = { name: h.nombre, value: h.valor, _k: lista.length - 1, itemStyle: { color: h._color, borderColor: b || T.fondo, borderWidth: b ? 1.5 : 2 } };
        if (h.nivel === 1) {
          /* Cabe en horizontal (hasta 34 px) o a lo largo del arco, recortado a su longitud */
          var arco = h.valor / raiz.valor * 2 * Math.PI * (radios[0][0] + radios[0][1]) / 2 - 10;
          var horizontal = medir(h.nombre, 600) <= 34;
          var txt = horizontal ? h.nombre : recortar(h.nombre, Math.min(arco, 120), 600);
          it.label = { color: textoSobre(h._color), rotate: horizontal ? 0 : 'tangential', show: !!txt && (horizontal ? arco >= 24 : !/…$/.test(txt) || txt.length >= 5), formatter: txt };
        }
        if (h.hijos.length) it.children = datos(h);
        return it;
      });
    }
    var niveles = [{}].concat(radios.map(function (r, i) {
      return { r0: r[0], r: r[1], label: i === 0 ? Object.assign(estiloTexto(T.etiquetaDato, 600), { show: true }) : { show: false } };
    }));
    var arbolSb = datos(raiz);
    return montarECharts(c.querySelector('.eg-lienzo'), {
      animationDuration: 600,
      tooltip: tooltipNodos(lista, function (n) { return tipNodo(n, s, raiz); }),
      series: [{ type: 'sunburst', center: ['50%', '50%'], sort: null, nodeClick: false, startAngle: 90, emphasis: { focus: 'none' }, levels: niveles, data: arbolSb }]
    });
  }
  function icicle(el, s, a) {
    var raiz = a.raiz, filas = a.prof + 1, hF = filas <= 3 ? 56 : 44, sep = 6;
    var alto = filas * hF + (filas - 1) * sep;
    var c = tarjeta(el, s, lienzo(s, alto));
    var todos = [raiz].concat(a.nodos);
    raiz._color = P.neutro700;
    return montarECharts(c.querySelector('.eg-lienzo'), function (ancho) {
      var celdas = [];
      (function colocar(n, x, w) {
        celdas.push({ n: n, r: { x: x, y: n.nivel * (hF + sep), w: w, h: hF } });
        var xx = x;
        n.hijos.forEach(function (h) { var wh = n.valor ? h.valor / n.valor * w : 0; if (wh > 0) colocar(h, xx, wh); xx += wh; });
      })(raiz, 0, ancho);
      return {
        animation: false,
        tooltip: tooltipNodos(celdas.map(function (q) { return q.n; }), function (n) { return tipNodo(n, s, raiz); }),
        series: [{
          type: 'custom', coordinateSystem: 'none',
          data: celdas.map(function (q, k) { return { name: q.n.nombre, value: q.n.valor, _k: k }; }),
          renderItem: function (p) {
            var q = celdas[p.dataIndex], n = q.n, r = q.r, util = r.w - 20, lineas = [];
            var cifra = n === raiz ? fmtU(n.valor, s).texto : porcentaje(pctDe(n, raiz), 0);
            var largo = n.nombre + ' · ' + cifra;
            var txt = medir(largo, 600) <= util ? largo : (util >= 24 ? recortar(n.nombre, util, 600) : '');
            if (/…$/.test(txt) && txt.length < 5) txt = '';
            if (txt && r.h >= 26) lineas.push({ texto: txt, x: r.x + 10, y: r.y + 11, peso: 600 });
            return rectRotulado(r, n._color, lineas);
          }
        }]
      };
    });
  }

  /* Círculos anidados: empaquetado de círculos (algoritmo de d3-hierarchy: hermanos en cadena frontal y círculo envolvente mínimo) */
  function cEmpaquetar(circulos) {
    var n = circulos.length;
    if (!n) return 0;
    var a = circulos[0], b, c, aa, ca, i, j, k, sj, sk;
    a.x = 0; a.y = 0;
    if (n === 1) return a.r;
    b = circulos[1]; a.x = -b.r; b.x = a.r; b.y = 0;
    if (n === 2) return a.r + b.r;
    cColocar(b, a, c = circulos[2]);
    a = { _: a }; b = { _: b }; c = { _: c };
    a.sig = c.ant = b; b.sig = a.ant = c; c.sig = b.ant = a;
    paso: for (i = 3; i < n; ++i) {
      cColocar(a._, b._, c = circulos[i]); c = { _: c };
      j = b.sig; k = a.ant; sj = b._.r; sk = a._.r;
      do {
        if (sj <= sk) {
          if (cCorta(j._, c._)) { b = j; a.sig = b; b.ant = a; --i; continue paso; }
          sj += j._.r; j = j.sig;
        } else {
          if (cCorta(k._, c._)) { a = k; a.sig = b; b.ant = a; --i; continue paso; }
          sk += k._.r; k = k.ant;
        }
      } while (j !== k.sig);
      c.ant = a; c.sig = b; a.sig = b.ant = b = c;
      aa = cPuntua(a);
      while ((c = c.sig) !== b) { if ((ca = cPuntua(c)) < aa) { a = c; aa = ca; } }
      b = a.sig;
    }
    var frente = [b._]; c = b;
    while ((c = c.sig) !== b) frente.push(c._);
    var e = cEnvolver(frente);
    for (i = 0; i < n; ++i) { circulos[i].x -= e.x; circulos[i].y -= e.y; }
    return e.r;
  }
  function cColocar(b, a, c) {
    var dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy, x, y, a2, b2;
    if (d2) {
      a2 = a.r + c.r; a2 *= a2; b2 = b.r + c.r; b2 *= b2;
      if (a2 > b2) { x = (d2 + b2 - a2) / (2 * d2); y = Math.sqrt(Math.max(0, b2 / d2 - x * x)); c.x = b.x - x * dx - y * dy; c.y = b.y - x * dy + y * dx; }
      else { x = (d2 + a2 - b2) / (2 * d2); y = Math.sqrt(Math.max(0, a2 / d2 - x * x)); c.x = a.x + x * dx - y * dy; c.y = a.y + x * dy + y * dx; }
    } else { c.x = a.x + c.r; c.y = a.y; }
  }
  function cCorta(a, b) { var dr = a.r + b.r - 1e-6, dx = b.x - a.x, dy = b.y - a.y; return dr > 0 && dr * dr > dx * dx + dy * dy; }
  function cPuntua(nodo) { var a = nodo._, b = nodo.sig._, ab = a.r + b.r, dx = (a.x * b.r + b.x * a.r) / ab, dy = (a.y * b.r + b.y * a.r) / ab; return dx * dx + dy * dy; }
  function cEnvolver(circulos) {
    var i = 0, n = circulos.length, B = [], p, e = null;
    while (i < n) { p = circulos[i]; if (e && cContieneDebil(e, p)) ++i; else { B = cAmpliarBase(B, p); e = cBase(B); i = 0; } }
    return e;
  }
  function cAmpliarBase(B, p) {
    var i, j;
    if (cContieneTodos(p, B)) return [p];
    for (i = 0; i < B.length; ++i) if (cNoContiene(p, B[i]) && cContieneTodos(cBase2(B[i], p), B)) return [B[i], p];
    for (i = 0; i < B.length - 1; ++i) for (j = i + 1; j < B.length; ++j) {
      if (cNoContiene(cBase2(B[i], B[j]), p) && cNoContiene(cBase2(B[i], p), B[j]) && cNoContiene(cBase2(B[j], p), B[i]) && cContieneTodos(cBase3(B[i], B[j], p), B)) return [B[i], B[j], p];
    }
    return [p];
  }
  function cNoContiene(a, b) { var dr = a.r - b.r, dx = b.x - a.x, dy = b.y - a.y; return dr < 0 || dr * dr < dx * dx + dy * dy; }
  function cContieneDebil(a, b) { var dr = a.r - b.r + Math.max(a.r, b.r, 1) * 1e-9, dx = b.x - a.x, dy = b.y - a.y; return dr > 0 && dr * dr > dx * dx + dy * dy; }
  function cContieneTodos(a, B) { for (var i = 0; i < B.length; ++i) if (!cContieneDebil(a, B[i])) return false; return true; }
  function cBase(B) { return B.length === 1 ? { x: B[0].x, y: B[0].y, r: B[0].r } : (B.length === 2 ? cBase2(B[0], B[1]) : cBase3(B[0], B[1], B[2])); }
  function cBase2(a, b) {
    var x21 = b.x - a.x, y21 = b.y - a.y, r21 = b.r - a.r, l = Math.sqrt(x21 * x21 + y21 * y21);
    return { x: (a.x + b.x + x21 / l * r21) / 2, y: (a.y + b.y + y21 / l * r21) / 2, r: (l + a.r + b.r) / 2 };
  }
  function cBase3(a, b, c) {
    var x1 = a.x, y1 = a.y, r1 = a.r, x2 = b.x, y2 = b.y, r2 = b.r, x3 = c.x, y3 = c.y, r3 = c.r,
      a2 = x1 - x2, a3 = x1 - x3, b2 = y1 - y2, b3 = y1 - y3, c2 = r2 - r1, c3 = r3 - r1,
      d1 = x1 * x1 + y1 * y1 - r1 * r1, d2 = d1 - x2 * x2 - y2 * y2 + r2 * r2, d3 = d1 - x3 * x3 - y3 * y3 + r3 * r3,
      ab = a3 * b2 - a2 * b3, xa = (b2 * d3 - b3 * d2) / (ab * 2) - x1, xb = (b3 * c2 - b2 * c3) / ab,
      ya = (a3 * d2 - a2 * d3) / (ab * 2) - y1, yb = (a2 * c3 - a3 * c2) / ab,
      A = xb * xb + yb * yb - 1, Bq = 2 * (r1 + xa * xb + ya * yb), C = xa * xa + ya * ya - r1 * r1,
      r = -(Math.abs(A) > 1e-6 ? (Bq + Math.sqrt(Bq * Bq - 4 * A * C)) / (2 * A) : C / Bq);
    return { x: x1 + xa + xb * r, y: y1 + ya + yb * r, r: r };
  }
  /* Disposición en píxeles: radio de cada elemento ∝ √valor; 3 px entre elementos, 8 px de margen en el grupo y 18 px arriba para su nombre */
  function disponerCirculos(grupos, ancho, alto) {
    var k = 1, res = null;
    for (var vuelta = 0; vuelta < 6; vuelta++) {
      var gs = grupos.map(function (g) {
        var cs = g.hijos.map(function (h) { return { r: Math.sqrt(h.valor) * k + 1.5, n: h }; });
        var rIn = cEmpaquetar(cs);
        var rG = rIn + 8 + 9;
        cs.forEach(function (q) { q.y += 9; q.r -= 1.5; });
        return { r: rG + 6, rG: rG, cs: cs, n: g };
      });
      cEmpaquetar(gs);
      var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      gs.forEach(function (q) { x0 = Math.min(x0, q.x - q.rG); x1 = Math.max(x1, q.x + q.rG); y0 = Math.min(y0, q.y - q.rG); y1 = Math.max(y1, q.y + q.rG); });
      var f = Math.min((ancho - 2) / (x1 - x0), (alto - 2) / (y1 - y0));
      res = { gs: gs, x0: x0, x1: x1, y0: y0, y1: y1, f: f };
      if (Math.abs(f - 1) < 0.01) break;
      k *= f > 1 ? Math.min(f, 1 + (f - 1) * 1.2) : f;
    }
    /* Ajuste final: si aún sobra o falta un poco, se escala todo; luego se centra */
    var e = Math.min(1, res.f), ox = (ancho - (res.x1 - res.x0) * e) / 2 - res.x0 * e, oy = (alto - (res.y1 - res.y0) * e) / 2 - res.y0 * e;
    return res.gs.map(function (q) {
      var cx = q.x * e + ox, cy = q.y * e + oy;
      return { n: q.n, cx: cx, cy: cy, r: q.rG * e, hijos: q.cs.map(function (h) { return { n: h.n, cx: cx + h.x * e, cy: cy + h.y * e, r: h.r * e }; }) };
    });
  }
  R['circulos-anidados'] = function (el, s) {
    var a = s.datos._arbol, raiz = a.raiz, foco = s.datos._foco;
    raiz.hijos.forEach(function (g) {
      var tonos = tonosGrupo(g === foco, g.hijos.length);
      g.hijos.forEach(function (h, k) { h._color = tonos[k]; });
    });
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.querySelector('.eg-lienzo'), function (ancho, alto) {
      var disp = disponerCirculos(raiz.hijos, ancho, alto), items = [];
      disp.forEach(function (g) { items.push({ grupo: true, q: g }); });
      disp.forEach(function (g) { g.hijos.forEach(function (h) { items.push({ q: h }); }); });
      return {
        animation: false,
        tooltip: tooltipNodos(items.map(function (it) { return it.q.n; }), function (n) { return tipNodo(n, s, raiz); }),
        series: [{
          type: 'custom', coordinateSystem: 'none',
          data: items.map(function (it, k) { return { name: it.q.n.nombre, value: it.q.n.valor, _k: k }; }),
          renderItem: function (p) {
            var it = items[p.dataIndex], q = it.q, hijos;
            if (it.grupo) {
              hijos = [{ type: 'circle', shape: { cx: q.cx, cy: q.cy, r: Math.max(0, q.r - 0.75) }, style: { fill: P.neutro100, stroke: P.neutro300, lineWidth: 1.5 } }];
              var cuerda = 2 * Math.sqrt(Math.max(0, q.r * q.r - (q.r - 13) * (q.r - 13))) - 8;
              var txt = recortar(q.n.nombre, cuerda, 600);
              if (txt && q.r >= 24) hijos.push({ type: 'text', silent: true, style: { text: txt, x: q.cx, y: q.cy - q.r + 13, fill: T.leyenda, font: '600 11px ' + FUENTE, align: 'center', verticalAlign: 'middle' } });
              return { type: 'group', children: hijos };
            }
            hijos = [{ type: 'circle', shape: { cx: q.cx, cy: q.cy, r: Math.max(0, q.r) }, style: { fill: q.n._color, stroke: T.fondo, lineWidth: 1.5 } }];
            var v = fmtDato(q.n.valor, s);
            if (q.r >= 9 && medir(v, 600) <= 2 * q.r - 8) hijos.push({ type: 'text', silent: true, style: { text: v, x: q.cx, y: q.cy, fill: textoSobre(q.n._color), font: '600 11px ' + FUENTE, align: 'center', verticalAlign: 'middle' } });
            return { type: 'group', children: hijos };
          }
        }]
      };
    });
  };

  /* Árbol: ramas (raíz a la izquierda), dendrograma y organigrama */
  R.arbol = function (el, s) {
    if (s.variante === 'dendrograma') return dendrograma(el, s);
    if (s.variante === 'organigrama') return organigrama(el, s);
    return ramas(el, s);
  };
  function tipEstructura(n) {
    var h = cabeceraTip(n.ruta || n.nombre);
    if (n.hijos.length) h += filaTip('Dependen', n.hijos.length + (n.hijos.length === 1 ? ' elemento' : ' elementos'));
    return h;
  }
  function enRamaDe(n, foco) { for (var x = foco; x; x = x.padre) if (x === n) return true; return false; }
  function ramas(el, s) {
    var a = s.datos._arbol, raiz = a.raiz, foco = s.datos._foco, prof = a.prof;
    var paso = 30, alto = Math.max(140, a.hojas.length * paso + 30);
    var c = tarjeta(el, s, lienzo(s, alto));
    /* Filas: cada hoja en su fila (en el orden del árbol) y cada grupo a la altura media de sus hijos */
    var fila = 0;
    (function y(n) { if (!n.hijos.length) { n._f = fila++; return; } n.hijos.forEach(y); n._f = (n.hijos[0]._f + n.hijos[n.hijos.length - 1]._f) / 2; })(raiz);
    var todos = [raiz].concat(a.nodos);
    return montarECharts(c.querySelector('.eg-lienzo'), function (ancho, altoL) {
      var y0 = 28, dy = a.hojas.length > 1 ? Math.min(38, (altoL - y0 - 12) / (a.hojas.length - 1)) : 0;
      if (a.hojas.length === 1) y0 = altoL / 2;
      var anchoHoja = Math.min(maxMedida(a.hojas.map(function (h) { return h.nombre; }), foco ? 600 : 400), Math.round(ancho * 0.36));
      var xIni = Math.max(10, Math.min(60, medir(raiz.nombre, 600) / 2 + 2)), xFin = ancho - anchoHoja - 16;
      var col = prof > 0 ? Math.max(30, (xFin - xIni) / prof) : 0;
      function X(n) { return xIni + n.nivel * col; }
      function Y(n) { return y0 + n._f * dy; }
      var els = [];
      todos.forEach(function (n) {
        if (!n.hijos.length) return;
        var xp = X(n), yp = Y(n), xm = xp + col / 2;
        var ys = n.hijos.map(Y);
        els.push(gLinea(xp, yp, xm, yp, P.neutro400, 1.5, 1));
        els.push(gLinea(xm, Math.min(yp, ys[0]), xm, Math.max(yp, ys[ys.length - 1]), P.neutro400, 1.5, 1));
        n.hijos.forEach(function (h) { els.push(gLinea(xm, Y(h), X(h), Y(h), P.neutro400, 1.5, 1)); });
      });
      var nodos = todos.map(function (n) {
        var hoja = !n.hijos.length, esRaiz = n === raiz, dest = foco && (n === foco);
        var color = esRaiz ? P.neutro700 : (hoja ? P.neutro400 : (foco ? P.neutro600 : P.naranja500));
        if (dest || (foco && !esRaiz && enRamaDe(n, foco) && !hoja)) color = P.naranja500;
        if (dest && hoja) color = P.naranja500;
        var r = esRaiz ? 8 : (hoja ? 5 : 7);
        var etq = hoja
          ? { texto: recortar(n.nombre, ancho - X(n) - r - 9, dest ? 600 : 400), x: X(n) + r + 7, y: Y(n), align: 'left', color: dest ? T.texto : T.textoSecundario, peso: dest ? 600 : 400 }
          : { texto: recortar(n.nombre, esRaiz ? xIni * 2 + col * 0.6 : col * 0.95, esRaiz || dest ? 600 : 400), x: X(n), y: Y(n) - r - 9, align: 'center', color: esRaiz || dest ? T.texto : T.leyenda, peso: esRaiz || dest ? 600 : 400 };
        return { n: n, x: X(n), y: Y(n), r: r, color: color, etq: etq };
      });
      return {
        animation: false, graphic: { elements: els },
        tooltip: tooltipNodos(todos, tipEstructura),
        series: [{
          type: 'custom', coordinateSystem: 'none', z: 5,
          data: nodos.map(function (q, k) { return { name: q.n.nombre, value: 0, _k: k }; }),
          renderItem: function (p) {
            var q = nodos[p.dataIndex], e = q.etq;
            var hijos = [{ type: 'circle', shape: { cx: q.x, cy: q.y, r: q.r }, style: { fill: q.color } }];
            if (e.texto) hijos.push({ type: 'text', silent: true, style: { text: e.texto, x: e.x, y: e.y, fill: e.color, font: e.peso + ' 11px ' + FUENTE, align: e.align, verticalAlign: 'middle' } });
            return { type: 'group', children: hijos };
          }
        }]
      };
    });
  }

  /* Organigrama: cajas de arriba abajo con conectores ortogonales; si no cabe, se desplaza en horizontal */
  /* Disposición del organigrama. modo: 'normal'; 'compacto' (cajas al ancho del texto y huecos menores) o 'apilado' (además, los
     elementos finales de cada responsable, en columna debajo de él). Cada caja va centrada sobre sus hijos. */
  var ORG_CAJA = 30, ORG_VSEP = 34;
  function disponerOrganigrama(raiz, todos, modo) {
    var compacto = modo !== 'normal', apilado = modo === 'apilado';
    todos.forEach(function (n) {
      var minimo = compacto ? 0 : (n.nivel === 0 ? 100 : (n.nivel === 1 ? 80 : 56));
      n._w = Math.min(150, Math.max(minimo, medir(n.nombre, 600) + (compacto ? 16 : 22)));
      n._apila = apilado && n !== raiz && n.hijos.length > 0 && n.hijos.every(function (h) { return !h.hijos.length; });
    });
    (function anchoSub(n) {
      if (!n.hijos.length) { n._sw = n._w; return; }
      n.hijos.forEach(anchoSub);
      if (n._apila) { n._sw = Math.max(n._w, 14 + Math.max.apply(null, n.hijos.map(function (h) { return h._w; }))); return; }
      var hojas = n.hijos.every(function (h) { return !h.hijos.length; });
      n._sep = hojas ? (compacto ? 6 : 8) : (compacto ? 12 : 20);
      n._sw = Math.max(n._w, suma(n.hijos.map(function (h) { return h._sw; })) + n._sep * (n.hijos.length - 1));
    })(raiz);
    var fondo = 0;
    (function colocar(n, x, y) {
      n._cx = x + n._sw / 2; n._y = y; fondo = Math.max(fondo, y + ORG_CAJA);
      if (!n.hijos.length) return;
      if (n._apila) {
        var izq = n._cx - n._w / 2;
        if (n._sw > n._w) { izq = x; n._cx = x + n._w / 2; }
        n.hijos.forEach(function (h, k) { h._cx = izq + 14 + h._w / 2; h._y = y + ORG_CAJA + 10 + k * (ORG_CAJA + 6); fondo = Math.max(fondo, h._y + ORG_CAJA); });
        return;
      }
      var dentro = suma(n.hijos.map(function (h) { return h._sw; })) + n._sep * (n.hijos.length - 1), xx = x + (n._sw - dentro) / 2;
      n.hijos.forEach(function (h) { colocar(h, xx, y + ORG_CAJA + ORG_VSEP); xx += h._sw + n._sep; });
    })(raiz, 0, 2);
    return { ancho: raiz._sw, alto: fondo + 2, cajas: todos.map(function (n) { return { w: n._w, cx: n._cx, y: n._y, apila: n._apila }; }) };
  }
  /* Organigrama: cajas de arriba abajo con conectores ortogonales; si no cabe ni apilado, se desplaza en horizontal */
  function organigrama(el, s) {
    var a = s.datos._arbol, raiz = a.raiz, foco = s.datos._foco;
    var CAJA = ORG_CAJA, todos = [raiz].concat(a.nodos);
    todos.forEach(function (n, k) { n._k = k; });
    var modos = ['normal', 'compacto', 'apilado'].map(function (m) { return disponerOrganigrama(raiz, todos, m); });
    var ultimo = modos[2];
    var c = tarjeta(el, s, '<div class="eg-desplaza">' + lienzo(s, modos[0].alto) + '</div>');
    var lz = c.querySelector('.eg-lienzo');
    lz.style.minWidth = Math.ceil(ultimo.ancho) + 4 + 'px';
    return montarECharts(lz, function (ancho) {
      var L = modos.filter(function (m) { return m.ancho + 4 <= ancho; })[0] || ultimo;
      lz.style.height = Math.round(L.alto) + 'px';
      var ox = Math.max(2, (ancho - L.ancho) / 2), els = [];
      function B(n) { return L.cajas[n._k]; }
      function CX(n) { return ox + B(n).cx; }
      function Y(n) { return B(n).y; }
      todos.forEach(function (n) {
        if (!n.hijos.length) return;
        var xp = CX(n), yb = Y(n) + CAJA;
        if (B(n).apila) {
          var xl = CX(n) - B(n).w / 2 + 7, ult = n.hijos[n.hijos.length - 1];
          els.push(gLinea(xl, yb, xl, Y(ult) + CAJA / 2, P.neutro400, 1.5));
          n.hijos.forEach(function (h) { els.push(gLinea(xl, Y(h) + CAJA / 2, CX(h) - B(h).w / 2, Y(h) + CAJA / 2, P.neutro400, 1.5)); });
          return;
        }
        var ym = yb + ORG_VSEP / 2, yh = Y(n.hijos[0]);
        if (n.hijos.length === 1 && Math.abs(CX(n.hijos[0]) - xp) < 1) { els.push(gLinea(xp, yb, xp, yh, P.neutro400, 1.5)); return; }
        els.push(gLinea(xp, yb, xp, ym, P.neutro400, 1.5));
        els.push(gLinea(CX(n.hijos[0]), ym, CX(n.hijos[n.hijos.length - 1]), ym, P.neutro400, 1.5));
        n.hijos.forEach(function (h) { els.push(gLinea(CX(h), ym, CX(h), yh, P.neutro400, 1.5)); });
      });
      return {
        animation: false, graphic: { elements: els },
        tooltip: tooltipNodos(todos, tipEstructura),
        series: [{
          type: 'custom', coordinateSystem: 'none', z: 5,
          data: todos.map(function (n, k) { return { name: n.nombre, value: 0, _k: k }; }),
          renderItem: function (p) {
            var n = todos[p.dataIndex], w = B(n).w, x = CX(n) - w / 2, y = Y(n);
            var fondo = n === foco ? T.actual : (n.nivel === 0 ? P.neutro700 : (n.nivel === 1 ? P.neutro100 : T.fondo));
            var borde = n === foco ? T.actual : (n.nivel === 0 ? P.neutro700 : P.neutro300);
            return { type: 'group', children: [
              { type: 'rect', shape: { x: x + 0.75, y: y + 0.75, width: w - 1.5, height: CAJA - 1.5, r: 6 }, style: { fill: fondo, stroke: borde, lineWidth: 1.5 } },
              { type: 'text', silent: true, style: { text: recortar(n.nombre, w - 12, 600), x: x + w / 2, y: y + CAJA / 2, fill: textoSobre(fondo), font: '600 11px ' + FUENTE, align: 'center', verticalAlign: 'middle' } }
            ] };
          }
        }]
      };
    });
  }

  /* Dendrograma: uniones en codo a su altura, línea de corte y un color por grupo */
  function dendrograma(el, s) {
    var d = s.datos, raiz = d._raizD, hojas = d._hojasD, corte = d._corte;
    if (d._calculado && !esTexto(s.nota)) s.nota = 'Agrupación jerárquica por enlace medio sobre la distancia euclídea' + (d._m > 1 && s.tipificar !== false ? ' de las variables tipificadas' : '') + '; 100 es la distancia de la última unión.';
    /* Grupos: los subárboles que quedan por debajo del corte, de izquierda a derecha */
    var g = 0;
    (function marcar(n, grupo) {
      if (grupo == null && (n.altura < corte || !n.hijos.length)) grupo = g++;
      n._g = grupo;
      n.hijos.forEach(function (h) { marcar(h, grupo); });
    })(raiz, null);
    var COLORES = T.series;
    hojas.forEach(function (h, i) { h._x = i; });
    (function xs(n) { if (!n.hijos.length) return; n.hijos.forEach(xs); n._x = (n.hijos[0]._x + n.hijos[n.hijos.length - 1]._x) / 2; })(raiz);
    var esc0 = d._calculado ? { lo: 0, hi: 100, paso: 50 } : escalaEje(0, raiz.altura, 180, 0, 4, function () { return 30; });
    var maxEsc = esc0.hi, marcas = marcasDe(esc0);
    var anchoEtq = maxMedida(hojas.map(function (h) { return h.nombre; }));
    var c = tarjeta(el, s, lienzo(s));
    return montarECharts(c.querySelector('.eg-lienzo'), function (ancho, alto) {
      var fmtM = formatoEjeFino;
      var izq = maxMedida(marcas.map(fmtM)) + 12, der = 8, arriba = 12;
      var pasoX = (ancho - izq - der) / hojas.length;
      var girar = anchoEtq > pasoX - 4, abajo = girar ? Math.min(anchoEtq, 90) + 12 : 26;
      var H = alto - arriba - abajo, yBase = arriba + H;
      function X(n) { return izq + (n._x + 0.5) * pasoX; }
      function Y(h) { return yBase - h / maxEsc * H; }
      var els = [];
      marcas.forEach(function (m) { els.push(gTexto(fmtM(m), izq - 12, Y(m), { color: T.etiquetaEje, align: 'right' })); });
      function color(n) { return n._g == null ? P.neutro400 : COLORES[n._g % COLORES.length]; }
      (function lineas(n) {
        if (!n.hijos.length) return;
        var yn = Y(n.altura), cn = color(n);
        els.push(gLinea(X(n.hijos[0]), yn, X(n.hijos[n.hijos.length - 1]), yn, cn, 2, 2));
        n.hijos.forEach(function (h) { els.push(gLinea(X(h), Y(h.altura), X(h), yn, cn, 2, 2)); lineas(h); });
      })(raiz);
      var yc = Y(corte);
      els.push({ type: 'line', silent: true, z: 4, shape: { x1: izq - 4, y1: yc, x2: ancho - 2, y2: yc }, style: { stroke: T.actual, lineWidth: 1.5, lineDash: [5, 3] } });
      els.push(gTextoFondo('Corte (' + d._grupos + ' grupos)', ancho - 4, yc - 9, { color: T.actual, peso: 600, align: 'right', z: 6 }));
      hojas.forEach(function (h) {
        var t = girar ? recortar(h.nombre, abajo - 12) : recortar(h.nombre, pasoX + 6);
        if (!t) return;
        var e = gTexto(t, X(h), yBase + 8, { color: T.etiquetaEje, align: girar ? 'right' : 'center', va: girar ? 'middle' : 'top' });
        if (girar) { e.style.x = 0; e.style.y = 0; e.x = X(h); e.y = yBase + 8; e.rotation = Math.PI / 2; }
        els.push(e);
      });
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), { trigger: 'item', formatter: function (p) { var h = hojas[p.dataIndex]; return cabeceraTip(h.nombre) + filaTip('Grupo', String(h._g + 1)); } }),
        series: [{
          type: 'custom', coordinateSystem: 'none', z: 1,
          data: hojas.map(function (h) { return { name: h.nombre, value: 0 }; }),
          renderItem: function (p) { var h = hojas[p.dataIndex]; return { type: 'rect', shape: { x: X(h) - pasoX / 2, y: yBase - 10, width: pasoX, height: abajo + 10 }, style: { fill: 'rgba(0,0,0,0)' } }; }
        }]
      };
    });
  }

  /* Contenedores anidados (HTML): categoría, subcategorías y elementos; el destacado en naranja */
  R.anidados = function (el, s) {
    var d = s.datos, a = d._arbol, raiz = a.raiz, foco = d._foco;
    function caja(n, nivel) {
      var hojas = n.hijos.filter(function (h) { return !h.hijos.length; }), subs = n.hijos.filter(function (h) { return h.hijos.length; });
      return '<section class="eg-an eg-an-' + Math.min(nivel, 2) + '" aria-label="' + esc(n.nombre) + '"><p class="eg-an-t">' + esc(n.nombre) + '</p>' +
        (subs.length ? '<div class="eg-an-subs">' + subs.map(function (h) { return caja(h, nivel + 1); }).join('') + '</div>' : '') +
        (hojas.length ? '<ul class="eg-an-els">' + hojas.map(function (h) {
          return '<li' + (h === foco ? ' class="eg-an-foco"' : '') + ' title="' + esc(h.ruta) + '"><span>' + esc(h.nombre) + '</span></li>';
        }).join('') + '</ul>' : '') + '</section>';
    }
    tarjeta(el, s, d._dibujaRaiz ? caja(raiz, 0) : '<div class="eg-an-raiz">' + raiz.hijos.map(function (h) { return caja(h, 0); }).join('') + '</div>');
    return Promise.resolve();
  };

  /* Tabla jerárquica (HTML): lista indentada con barra por fila; los totales se pliegan */
  function tablaJerarquica(el, s) {
    var d = s.datos, a = d._arbol, raiz = a.raiz, filas = [];
    (function rec(n) { filas.push(n); n.hijos.forEach(rec); })(raiz);
    filas.forEach(function (n, i) { n._fi = i; });
    var max = raiz.valor || 1;
    var titulo = esTexto(s.columna) ? s.columna : (/^[a-záéíóúñ]{3,}/i.test(s.unidad) ? s.unidad.charAt(0).toUpperCase() + s.unidad.slice(1) : 'Valor (' + s.unidad + ')');
    var nivel = Array.isArray(d.niveles) ? d.niveles.join(RUTA) : 'Nivel';
    var flecha = '<svg width="8" height="7" viewBox="0 0 8 7" aria-hidden="true"><path d="M0 0H8L4 7Z" fill="' + P.neutro500 + '"/></svg>';
    var cuerpo = filas.map(function (n) {
      var agr = n.hijos.length > 0, sangria = 8 + 18 * n.nivel;
      var nombre = agr
        ? '<button type="button" class="eg-tj-boton" aria-expanded="true" aria-label="Plegar ' + esc(n.nombre) + '">' + flecha + '</button><b>' + esc(n.nombre) + '</b>'
        : '<span>' + esc(n.nombre) + '</span>';
      return '<tr class="' + (agr ? 'eg-tj-agr' : 'eg-tj-hoja') + '" data-i="' + n._fi + '" data-p="' + (n.padre ? n.padre._fi : -1) + '">' +
        '<td class="eg-tj-nombre" style="padding-left:' + (agr ? sangria : sangria + 14) + 'px">' + nombre + '</td>' +
        '<td class="eg-tj-barra"><span style="width:' + (n.valor / max * 100).toFixed(1) + '%"></span></td>' +
        '<td class="eg-num">' + fmtDato(n.valor, s) + '</td></tr>';
    }).join('');
    var c = tarjeta(el, s, '<div class="eg-tabla-envoltura"><table class="eg-tj"><thead><tr><th scope="col">' + esc(nivel) + '</th><th scope="col"><span class="eg-tj-sr">Barra</span></th><th scope="col" class="eg-num">' + esc(titulo) + '</th></tr></thead><tbody>' + cuerpo + '</tbody></table></div>');
    var tbody = c.querySelector('tbody'), plegados = {};
    tbody.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.eg-tj-boton') : null;
      if (!b) return;
      var tr = b.closest('tr'), i = +tr.getAttribute('data-i'), abierto = !plegados[i];
      plegados[i] = abierto;
      b.setAttribute('aria-expanded', abierto ? 'false' : 'true');
      b.setAttribute('aria-label', (abierto ? 'Desplegar ' : 'Plegar ') + filas[i].nombre);
      var oculto = {};
      Array.prototype.forEach.call(tbody.rows, function (r) {
        var p = +r.getAttribute('data-p'), yo = +r.getAttribute('data-i');
        oculto[yo] = p >= 0 && (oculto[p] || plegados[p]);
        r.hidden = !!oculto[yo];
      });
    });
    return Promise.resolve();
  }

  /* ================================================================== */
  /* Flujo y relaciones: sankey, cuerdas, flujo y red                    */
  /* ================================================================== */
  var NODO_NEUTRO = { fondo: P.neutro100, borde: P.neutro300, texto: P.neutro700 };
  function valorNodo(g, n) { return Math.max(sumaEnlaces(g, n.entra), sumaEnlaces(g, n.sale)); }
  function nombresDe(g, lista, campo) { return lista.map(function (e) { return g.nodos[g.enlaces[e][campo]].nombre; }); }
  function listaCorta(nombres, max) { return nombres.length <= max ? nombres.join(', ') : nombres.slice(0, max).join(', ') + ' y ' + (nombres.length - max) + ' más'; }
  /* Caja con texto centrado (renderItem): fondo, borde de 1,5 px y radio 6 */
  function cajaG(cx, cy, w, h, e, txt, peso, r) {
    return [
      { type: 'rect', shape: { x: cx - w / 2 + 0.75, y: cy - h / 2 + 0.75, width: w - 1.5, height: h - 1.5, r: r == null ? 6 : r }, style: { fill: e.fondo, stroke: e.borde, lineWidth: 1.5 } },
      { type: 'text', silent: true, style: { text: txt, x: cx, y: cy, fill: e.texto, font: (peso || 600) + ' 11px ' + FUENTE, align: 'center', verticalAlign: 'middle' } }
    ];
  }
  /* Flecha con grosor: línea de grosor t y punta proporcional (como la del Flow diagram de Figma) */
  function flechaGruesa(x1, y1, x2, y2, color, t, punta) {
    var a = Math.atan2(y2 - y1, x2 - x1), L = punta ? punta[0] : Math.max(8, t * 1.7), m = punta ? punta[1] : Math.max(4.5, t * 1.1);
    var bx = x2 - L * Math.cos(a), by = y2 - L * Math.sin(a), px = -Math.sin(a) * m, py = Math.cos(a) * m;
    return [
      { type: 'line', shape: { x1: x1, y1: y1, x2: bx + Math.cos(a) * 0.5, y2: by + Math.sin(a) * 0.5 }, style: { stroke: color, lineWidth: t, lineCap: 'butt' } },
      { type: 'polygon', shape: { points: [[x2, y2], [bx + px, by + py], [bx - px, by - py]] }, style: { fill: color } }
    ];
  }
  /* Punto del borde de una caja (centro cx, cy; ancho w, alto h) en la dirección hacia (x, y) */
  function bordeCaja(cx, cy, w, h, x, y, margen) {
    var dx = x - cx, dy = y - cy;
    if (!dx && !dy) return [cx, cy];
    var k = Math.min(dx ? (w / 2 + (margen || 0)) / Math.abs(dx) : Infinity, dy ? (h / 2 + (margen || 0)) / Math.abs(dy) : Infinity);
    return [cx + dx * k, cy + dy * k];
  }
  /* Orden de los nodos dentro de cada columna (baricentro de sus vecinos, unas pasadas en cada sentido) para cruzar menos */
  function ordenarColumnas(g, nivel, ncol) {
    var cols = []; for (var c = 0; c < ncol; c++) cols.push([]);
    g.nodos.forEach(function (n) { cols[nivel[n.i]].push(n.i); });
    var pos = []; function marcar() { cols.forEach(function (col) { col.forEach(function (k, j) { pos[k] = (j + 0.5) / col.length; }); }); }
    marcar();
    function media(lista, campo) { return lista.length ? lista.reduce(function (t, e) { return t + pos[g.enlaces[e][campo]]; }, 0) / lista.length : null; }
    for (var pasada = 0; pasada < 4; pasada++) {
      var ida = pasada % 2 === 0;
      for (var q = 1; q < ncol; q++) {
        var cc = ida ? q : ncol - 1 - q;
        var b = {}; cols[cc].forEach(function (k) { var n = g.nodos[k], m = ida ? media(n.entra, 'o') : media(n.sale, 'd'); b[k] = m == null ? pos[k] : m; });
        cols[cc].sort(function (x, y) { return b[x] - b[y] || x - y; });
        cols[cc].forEach(function (k, j) { pos[k] = (j + 0.5) / cols[cc].length; });
      }
    }
    return cols;
  }
  function tipFlujoNodo(g, n, s) {
    var h = cabeceraTooltip(n.nombre), e = sumaEnlaces(g, n.entra), sa = sumaEnlaces(g, n.sale);
    if (n.entra.length) h += filaTooltip('Entra', fmtU(e, s).texto);
    if (n.sale.length) h += filaTooltip('Sale', fmtU(sa, s).texto);
    return h;
  }
  function tipFlujoEnlace(g, e, s) {
    var o = g.nodos[e.o], sale = sumaEnlaces(g, o.sale);
    return cabeceraTooltip(o.nombre + FLECHA + g.nodos[e.d].nombre) + filaTooltip('Valor', fmtU(e.valor, s).texto) +
      (o.sale.length > 1 && sale ? filaTooltip('De lo que sale de «' + o.nombre + '»', porcentaje(e.valor / sale * 100)) : '');
  }

  R.sankey = function (el, s) {
    if (s.variante === 'aluvial') return aluvial(el, s);
    if (s.variante === 'recorrido') return recorridoFlujo(el, s);
    return sankey(el, s);
  };
  /* Sankey: nodos de 14 px separados 12, enlaces en Neutro 300 y un único camino en Naranja 300 (sus nodos en Naranja 500) */
  function sankey(el, s) {
    var g = s.datos._g, cam = g.camino, enCam = {}, enlCam = {}, ultima = g.columnas - 1;
    cam.nodos.forEach(function (k) { enCam[k] = 1; }); cam.enlaces.forEach(function (k) { enlCam[k] = 1; });
    var etq = g.nodos.map(function (n) { return n.nombre + ' · ' + fmtDato(valorNodo(g, n), s); });
    var porCol = []; g.nivel.forEach(function (c) { porCol[c] = (porCol[c] || 0) + 1; });
    var alto = Math.max(200, Math.max.apply(null, porCol) * 40 + 24);
    var c = tarjeta(el, s, lienzo(s, alto));
    var orden = g.enlaces.filter(function (e) { return !enlCam[e.i]; }).concat(g.enlaces.filter(function (e) { return enlCam[e.i]; }));
    return montarECharts(c.querySelector('.eg-lienzo'), function (w) {
      function ancho(col) { return maxMedida(g.nodos.filter(function (n) { return g.nivel[n.i] === col; }).map(function (n) { return etq[n.i]; }), 600) + 8; }
      var mi = Math.min(Math.round(w * 0.3), ancho(0)), md = Math.min(Math.round(w * 0.3), ancho(ultima));
      var hueco = (w - mi - md - 14 * g.columnas) / Math.max(1, ultima);
      var nodos = g.nodos.map(function (n) {
        var col = g.nivel[n.i], dest = !!enCam[n.i], peso = dest ? 600 : 400, lim = Math.max(10, col === 0 ? mi - 8 : (col === ultima ? md - 8 : hueco - 10));
        /* En las columnas intermedias, si no cabe en una línea, el nombre y el valor en dos */
        var txt = medir(etq[n.i], peso) <= lim || col === 0 || col === ultima ? recortar(etq[n.i], lim, peso) : recortar(n.nombre, lim, peso) + '\n' + fmtDato(valorNodo(g, n), s);
        return { name: n.nombre, depth: col, _k: n.i, itemStyle: { color: dest ? T.actual : P.neutro600 },
          label: { position: col === 0 ? 'left' : 'right', formatter: txt, fontWeight: peso, lineHeight: 13 } };
      });
      return {
        animation: false,
        tooltip: Object.assign(tooltipBase(), { trigger: 'item', formatter: function (p) { return p.dataType === 'edge' ? tipFlujoEnlace(g, g.enlaces[p.data._e], s) : tipFlujoNodo(g, g.nodos[p.data._k], s); } }),
        series: [{
          type: 'sankey', left: mi, right: md, top: 4, bottom: 4, nodeWidth: 14, nodeGap: 12, nodeAlign: 'left', layoutIterations: 0, draggable: false,
          emphasis: { disabled: true }, data: nodos,
          label: Object.assign(estiloTexto(T.texto), { distance: 6 }),
          lineStyle: { curveness: 0.5, opacity: 1 },
          links: orden.map(function (e) { return { source: g.nodos[e.o].nombre, target: g.nodos[e.d].nombre, value: e.valor, _e: e.i, lineStyle: { color: enlCam[e.i] ? P.naranja300 : P.neutro300, opacity: 1 } }; })
        }]
      };
    });
  }

  /* Aluvial: una columna por momento; nodos y cintas con el color de su categoría (cintas un tono más claro, del origen) */
  var TONOS_ALUVIAL = [[P.naranja500, P.naranja300], [P.neutro600, P.neutro400], [P.neutro500, P.neutro300]];
  function aluvial(el, s) {
    var d = s.datos, C = d.categorias, M = d._momentos, tot = d._tot, X = d.cambios, n = M.length, k = C.length;
    var tonos = []; tonos[d._foco] = TONOS_ALUVIAL[0];
    var resto = 1; C.forEach(function (c, j) { if (j !== d._foco) tonos[j] = TONOS_ALUVIAL[resto++]; });
    var clave = function (p, j) { return C[j] + ' · ' + M[p]; }, total = suma(tot[0]);
    var nodos = [], enlaces = [];
    for (var p = 0; p < n; p++) C.forEach(function (c, j) { if (tot[p][j] > 0) nodos.push({ name: clave(p, j), depth: p, _p: p, _j: j, itemStyle: { color: tonos[j][0] } }); });
    var porOrigen = C.map(function () { return []; });
    for (p = 0; p < n - 1; p++) for (var i = 0; i < k; i++) for (var j = 0; j < k; j++) {
      if (X[p][i][j] > 0) porOrigen[i].push({ source: clave(p, i), target: clave(p + 1, j), value: X[p][i][j], _p: p, _i: i, _j: j, lineStyle: { color: tonos[i][1], opacity: 1 } });
    }
    /* La categoría destacada encima del resto */
    C.forEach(function (c, i) { if (i !== d._foco) enlaces = enlaces.concat(porOrigen[i]); }); enlaces = enlaces.concat(porOrigen[d._foco]);
    var alto = Math.max(200, k * 56 + 48);
    var c = tarjeta(el, s, lienzo(s, alto));
    var valores = tot[n - 1].map(function (v) { return fmtDato(v, s); });
    return montarECharts(c.querySelector('.eg-lienzo'), function (w) {
      var mi = Math.min(Math.round(w * 0.3), maxMedida(C) + 8), md = maxMedida(valores, 600) + 8, NW = 16, top = 24;
      var paso = (w - mi - md - NW) / (n - 1), els = [];
      M.forEach(function (m, q) { els.push(gTexto(recortar(m, paso - 4, 600), mi + q * paso + NW / 2, 9, { color: T.texto, peso: 600, align: 'center' })); });
      nodos.forEach(function (x) {
        x.label = x._p === 0 ? { show: true, position: 'left', formatter: recortar(C[x._j], mi - 8), color: T.leyenda }
          : (x._p === n - 1 ? { show: true, position: 'right', formatter: valores[x._j], color: T.texto, fontWeight: 600 } : { show: false });
      });
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (q) {
            var x = q.data;
            if (q.dataType === 'edge') return cabeceraTooltip(C[x._i] + ' (' + M[x._p] + ')' + FLECHA + C[x._j] + ' (' + M[x._p + 1] + ')') + filaTooltip('Valor', fmtU(x.value, s).texto) +
              filaTooltip('De «' + C[x._i] + '» en ' + M[x._p], porcentaje(x.value / tot[x._p][x._i] * 100));
            return cabeceraTooltip(C[x._j] + ' · ' + M[x._p]) + filaTooltip('Valor', fmtU(tot[x._p][x._j], s).texto) + filaTooltip('Sobre el total', porcentaje(tot[x._p][x._j] / suma(tot[x._p]) * 100));
          }
        }),
        series: [{
          type: 'sankey', left: mi, right: md, top: top, bottom: 4, nodeWidth: NW, nodeGap: 12, nodeAlign: 'left', layoutIterations: 0, draggable: false,
          emphasis: { disabled: true }, data: nodos, links: enlaces,
          label: Object.assign(estiloTexto(T.texto), { distance: 6 }), lineStyle: { curveness: 0.5, opacity: 1 }
        }]
      };
    });
  }

  /* Recorrido (Journey flow): pasos en cajas de 46 px, flechas con grosor proporcional al % que continúa (12 px = 100 %) y
     salidas hacia abajo en Neutro 400; el último paso, la conversión, en Naranja 500 */
  function recorridoFlujo(el, s) {
    var d = s.datos, N = d._nombres, V = d.valores, pct = d._pct, n = N.length, salida = esTexto(d.salida) ? d.salida : 'Abandono';
    if (!esTexto(s.nota)) s.nota = 'El grosor de cada flecha es el % de ' + (esTexto(s.nombreCasos) ? s.nombreCasos : 'personas') + ' que continúa (o que sale).';
    var GAP = 34, MIN = 56, alto = 4 + 46 + 48 + 30 + 4;
    var c = tarjeta(el, s, '<div class="eg-desplaza">' + lienzo(s, alto) + '</div>'), lz = c.querySelector('.eg-lienzo');
    lz.style.minWidth = n * MIN + (n - 1) * GAP + 4 + 'px';
    var porc = s.unidad === '%';
    function grosor(p) { return Math.max(1.5, 12 * p / 100); }
    return montarECharts(lz, function (w) {
      var bw = Math.max(MIN, Math.min(104, (w - 4 - (n - 1) * GAP) / n)), ox = Math.max(2, (w - n * bw - (n - 1) * GAP) / 2), y0 = 4, yc = y0 + 23, els = [];
      function X(i) { return ox + i * (bw + GAP) + bw / 2; }
      var items = [];
      for (var i = 0; i < n; i++) {
        items.push({ tipo: 'paso', i: i });
        if (i < n - 1) {
          var x1 = X(i) + bw / 2 + 2, x2 = X(i + 1) - bw / 2 - 2, t = grosor(pct[i + 1]);
          items.push({ tipo: 'sigue', i: i, x1: x1, x2: x2, t: t });
          els.push(gTexto(porcentaje(pct[i + 1], 0), (x1 + x2) / 2, yc - t / 2 - 10, { color: T.texto, peso: 600, align: 'center' }));
          var perdida = pct[i] - pct[i + 1];
          if (perdida > 1e-9) {
            items.push({ tipo: 'sale', i: i, t: grosor(perdida) });
            els.push(gTexto('\u2212' + porcentaje(perdida, 0), X(i) + grosor(perdida) / 2 + 8, y0 + 46 + 21, { color: T.textoSecundario }));
          }
        }
      }
      els.push(gTexto('Convierte', X(n - 1), y0 + 46 + 22, { color: T.textoSecundario, align: 'center' }));
      els.push({ type: 'text', silent: true, z: 20, style: { text: porcentaje(pct[n - 1], 0), x: X(n - 1), y: y0 + 46 + 40, fill: T.texto, font: '600 14px ' + FUENTE, align: 'center', verticalAlign: 'middle' } });
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (p) {
            var q = items[p.dataIndex], i = q.i;
            if (q.tipo === 'paso') return cabeceraTooltip(N[i]) + filaTooltip('Llegan', fmtU(V[i], s).texto) + (i ? filaTooltip('Sobre «' + N[0] + '»', porcentaje(pct[i])) : '') + (i > 1 ? filaTooltip('Sobre «' + N[i - 1] + '»', tasa(V[i - 1] ? V[i] / V[i - 1] * 100 : NaN)) : '');
            if (q.tipo === 'sigue') return cabeceraTooltip(N[i] + FLECHA + N[i + 1]) + filaTooltip('Continúan', fmtU(V[i + 1], s).texto) + filaTooltip('De «' + N[i] + '»', tasa(V[i] ? V[i + 1] / V[i] * 100 : NaN));
            return cabeceraTooltip(N[i] + FLECHA + salida) + filaTooltip('Salen', fmtU(V[i] - V[i + 1], s).texto) + filaTooltip('Sobre «' + N[0] + '»', porcentaje(pct[i] - pct[i + 1])) + filaTooltip('De «' + N[i] + '»', tasa(V[i] ? (V[i] - V[i + 1]) / V[i] * 100 : NaN));
          }
        }),
        series: [{
          type: 'custom', coordinateSystem: 'none', z: 5, data: items.map(function (q) { return { name: N[q.i], value: 0 }; }),
          renderItem: function (p) {
            var q = items[p.dataIndex], i = q.i, x = X(i);
            if (q.tipo === 'sigue') return { type: 'group', children: flechaGruesa(q.x1, yc, q.x2, yc, T.actual, q.t) };
            if (q.tipo === 'sale') return { type: 'group', children: flechaGruesa(x, y0 + 48, x, y0 + 92, T.base, q.t, [8, 4.5]).concat(cajaG(x, y0 + 111, bw, 30, { fondo: T.fondo, borde: P.neutro300, texto: T.textoSecundario }, recortar(salida, bw - 10), 400)) };
            var ult = i === n - 1, e = ult ? { fondo: T.actual, borde: T.actual, texto: P.neutro700 } : NODO_NEUTRO;
            var hijos = cajaG(x, y0 + 16, bw, 46, e, recortar(N[i], bw - 10, 600), 600);
            hijos[0].shape.y = y0 + 0.75; hijos[0].shape.height = 44.5;
            hijos.push({ type: 'text', silent: true, style: { text: porcentaje(pct[i], 0), x: x, y: y0 + 32, fill: ult ? P.neutro700 : T.textoSecundario, font: '400 11px ' + FUENTE, align: 'center', verticalAlign: 'middle' } });
            return { type: 'group', children: hijos };
          }
        }]
      };
    });
  }

  /* Cuerdas (Chord diagram): grupos en el anillo (6 px) y cintas entre pares, 4 px por dentro, con borde blanco de 1 px; solo las
     del grupo destacado en Naranja 300 (encima). Se dibuja a medida (como d3-chord): cada grupo ocupa un arco proporcional a su
     total y, dentro, cada enlace un tramo, en el orden de los grupos del otro extremo. */
  var TONOS_CUERDAS = [P.neutro600, P.neutro500, P.neutro400];
  function arcoCuerdas(n, g, pad) {
    var total = suma(g.nodos.map(function (x) { return x.total; })), util = 2 * Math.PI - pad * n, a = -Math.PI / 2, arcos = [], tramos = {};
    g.nodos.forEach(function (x) {
      var span = x.total / total * util, a0 = a, cur = a0;
      /* Tramos de sus enlaces, ordenados por el grupo del otro extremo empezando por el siguiente en el sentido del reloj */
      var lista = x.entra.concat(x.sale).map(function (e) { var en = g.enlaces[e], otro = en.o === x.i ? en.d : en.o; return { e: e, orden: (otro - x.i + n) % n }; });
      lista.sort(function (p, q) { return p.orden - q.orden; });
      lista.forEach(function (t) { var w = g.enlaces[t.e].valor / x.total * span; tramos[t.e + ':' + x.i] = [cur, cur + w]; cur += w; });
      arcos.push([a0, a0 + span]); a += span + pad;
    });
    return { arcos: arcos, tramos: tramos };
  }
  function pt(cx, cy, r, a) { return (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2); }
  function arcoSVG(cx, cy, r, a0, a1) { return 'A ' + r + ' ' + r + ' 0 ' + (a1 - a0 > Math.PI ? 1 : 0) + ' 1 ' + pt(cx, cy, r, a1); }
  R.cuerdas = function (el, s) {
    var g = s.datos._g, foco = g.foco, k = 0, n = g.nodos.length;
    var colores = g.nodos.map(function (x) { return x.i === foco ? T.actual : TONOS_CUERDAS[k++ % 3]; });
    var leyenda = g.nodos.map(function (x) { return { texto: x.nombre + ' · ' + fmtDato(x.total, s), color: colores[x.i], peso: x.i === foco ? 600 : 400 }; })
      .concat([{ texto: 'Cintas de ' + g.nodos[foco].nombre, color: P.naranja300, peso: 400 }]);
    var alto = Math.max(220, leyenda.length * 26 + 10);
    var c = tarjeta(el, s, '<div class="eg-cuerdas-ley"></div>' + lienzo(s, alto)), lz = c.querySelector('.eg-lienzo'), cajaLey = c.querySelector('.eg-cuerdas-ley');
    var anchoLey = maxMedida(leyenda.map(function (x) { return x.texto; }), 600) + 20;
    var lay = arcoCuerdas(n, g, 2.5 * Math.PI / 180);
    var items = g.enlaces.filter(function (e) { return e.o !== foco && e.d !== foco; }).map(function (e) { return { tipo: 'cinta', k: e.i }; })
      .concat(g.enlaces.filter(function (e) { return e.o === foco || e.d === foco; }).map(function (e) { return { tipo: 'cinta', k: e.i }; }))
      .concat(g.nodos.map(function (x) { return { tipo: 'grupo', k: x.i }; }));
    var etiquetas = g.nodos.map(function (x) { return recortar(x.nombre, 72, 600); });
    return montarECharts(lz, function (w, h) {
      var ext = maxMedida(etiquetas, 600), lateral = w - anchoLey - 16 >= 2 * ext + 184, els = [];
      cajaLey.innerHTML = lateral ? '' : leyendaHTML(leyenda);
      if (lz.offsetHeight !== (lateral ? alto : 220)) lz.style.height = (lateral ? alto : 220) + 'px';
      var ancho = lateral ? w - anchoLey - 16 : w;
      /* Radio: que quepan los nombres alrededor del anillo */
      var r = Math.max(40, Math.min(h / 2 - 22, ancho / 2 - Math.min(ext, ancho * 0.22) - 12)), cx = lateral ? ancho / 2 : w / 2, cy = h / 2;
      g.nodos.forEach(function (x) {
        var am = (lay.arcos[x.i][0] + lay.arcos[x.i][1]) / 2, ca = Math.cos(am), sa = Math.sin(am);
        els.push(gTexto(etiquetas[x.i], cx + (r + 9) * ca, cy + (r + 9) * sa + sa * 4, { color: T.texto, peso: 600, align: Math.abs(ca) < 0.25 ? 'center' : (ca > 0 ? 'left' : 'right') }));
      });
      if (lateral) {
        var x0 = w - anchoLey + 4, y = cy - (leyenda.length - 1) * 13 - 2;
        leyenda.forEach(function (it, j) {
          var yy = y + j * 26 + (j === leyenda.length - 1 ? 4 : 0);
          els.push(gRect(x0, yy - 6, 12, 12, it.color, 2, 20), gTexto(it.texto, x0 + 20, yy, { color: it.peso === 600 ? T.texto : T.leyenda, peso: it.peso }));
        });
      }
      var rc = r - 10;
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item',
          formatter: function (p) {
            var q = items[p.dataIndex];
            if (q.tipo === 'cinta') {
              var e = g.enlaces[q.k], a = g.nodos[e.o], b = g.nodos[e.d];
              return cabeceraTooltip(a.nombre + ' \u2013 ' + b.nombre) + filaTooltip('Valor', fmtU(e.valor, s).texto) +
                filaTooltip('De «' + a.nombre + '»', porcentaje(e.valor / a.total * 100)) + filaTooltip('De «' + b.nombre + '»', porcentaje(e.valor / b.total * 100));
            }
            var x = g.nodos[q.k];
            return cabeceraTooltip(x.nombre) + filaTooltip('Total', fmtU(x.total, s).texto) + notaTooltip('con ' + esc(listaCorta(nombresDe(g, x.sale, 'd').concat(nombresDe(g, x.entra, 'o')), 4)));
          }
        }),
        series: [{
          type: 'custom', coordinateSystem: 'none', z: 5, data: items.map(function () { return { value: 0 }; }),
          renderItem: function (p) {
            var q = items[p.dataIndex], d;
            if (q.tipo === 'grupo') {
              var A = lay.arcos[q.k];
              d = 'M ' + pt(cx, cy, r, A[0]) + ' ' + arcoSVG(cx, cy, r, A[0], A[1]) + ' L ' + pt(cx, cy, r - 6, A[1]) + ' A ' + (r - 6) + ' ' + (r - 6) + ' 0 ' + (A[1] - A[0] > Math.PI ? 1 : 0) + ' 0 ' + pt(cx, cy, r - 6, A[0]) + ' Z';
              return { type: 'path', shape: { pathData: d }, style: { fill: colores[q.k] } };
            }
            var e = g.enlaces[q.k], s1 = lay.tramos[e.i + ':' + e.o], t1 = lay.tramos[e.i + ':' + e.d], dest = e.o === foco || e.d === foco;
            d = 'M ' + pt(cx, cy, rc, s1[0]) + ' ' + arcoSVG(cx, cy, rc, s1[0], s1[1]) + ' Q ' + cx + ' ' + cy + ' ' + pt(cx, cy, rc, t1[0]) + ' ' + arcoSVG(cx, cy, rc, t1[0], t1[1]) + ' Q ' + cx + ' ' + cy + ' ' + pt(cx, cy, rc, s1[0]) + ' Z';
            return { type: 'path', shape: { pathData: d }, style: { fill: dest ? P.naranja300 : P.neutro300, stroke: T.fondo, lineWidth: 1 } };
          }
        }]
      };
    });
  };

  /* Flujo (Flow diagram): entidades en columnas y flechas rectas con grosor proporcional al valor (10 px el mayor); la principal en
     Naranja 500 y el resto en Neutro 400. Las entidades de origen, en Neutro 700. */
  R.flujo = function (el, s) {
    var g = s.datos._g, ncol = g.columnas, cols = ordenarColumnas(g, g.nivel, ncol), max = Math.max.apply(null, g.enlaces.map(function (e) { return e.valor; }));
    var maxK = Math.max.apply(null, cols.map(function (c) { return c.length; })), alto = Math.max(170, maxK * 64 + 12);
    if (!esTexto(s.nota)) s.nota = 'El grosor de cada flecha es proporcional a su valor.';
    var MINW = 64, BH = 40, minimo = ncol * MINW + (ncol - 1) * 44 + 4;
    var c = tarjeta(el, s, '<div class="eg-desplaza">' + lienzo(s, alto) + '</div>'), lz = c.querySelector('.eg-lienzo');
    lz.style.minWidth = minimo + 'px';
    var items = g.nodos.map(function (n) { return { tipo: 'nodo', k: n.i }; }).concat(g.enlaces.map(function (e) { return { tipo: 'enlace', k: e.i }; }));
    items.sort(function (a, b) { return (a.tipo === 'nodo') - (b.tipo === 'nodo') || (a.tipo === 'enlace' && (a.k === g.foco) - (b.k === g.foco)); });
    return montarECharts(lz, function (w, h) {
      var natural = Math.min(120, Math.max(MINW, maxMedida(g.nodos.map(function (n) { return n.nombre; }), 600) + 28));
      var bw = Math.max(MINW, Math.min(natural, (w - 4 - (ncol - 1) * 44) / ncol)), hueco = ncol > 1 ? (w - 4 - ncol * bw) / (ncol - 1) : 0;
      var pos = [];
      cols.forEach(function (col, ci) { col.forEach(function (k, j) { pos[k] = { x: 2 + ci * (bw + hueco) + bw / 2, y: (j + 0.5) * h / col.length }; }); });
      /* Puntos de salida y de llegada repartidos en el lado de la caja, en el orden vertical del otro extremo */
      var sal = [], lle = [];
      g.nodos.forEach(function (n) {
        function repartir(lista, campo, destino) {
          var orden = lista.slice().sort(function (a, b) { return pos[g.enlaces[a][campo]].y - pos[g.enlaces[b][campo]].y; }), m = orden.length, paso = Math.min(12, (BH - 14) / Math.max(1, m - 1));
          orden.forEach(function (e, j) { destino[e] = pos[n.i].y + (j - (m - 1) / 2) * paso; });
        }
        repartir(n.sale, 'd', sal); repartir(n.entra, 'o', lle);
      });
      var els = [], geo = [];
      g.enlaces.forEach(function (e) {
        var a = pos[e.o], b = pos[e.d], x1 = a.x + bw / 2 + 2, y1 = sal[e.i], x2 = b.x - bw / 2 - 3, y2 = lle[e.i], t = Math.max(1.5, 10 * e.valor / max);
        geo[e.i] = { x1: x1, y1: y1, x2: x2, y2: y2, t: t };
        var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1, nx = dy > 0.5 ? -dy / L : dy / L, ny = dy > 0.5 ? dx / L : -dx / L, off = t / 2 + 10;
        var mx = (x1 + x2) / 2 + nx * off, my = (y1 + y2) / 2 + ny * off, txt = fmtDato(e.valor, s), tw = medir(txt, 600);
        if (Math.abs(nx) > 0.2) mx += nx * tw / 2;
        els.push(gTexto(txt, mx, my, { color: T.texto, peso: 600, align: 'center', z: 25 }));
      });
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), { trigger: 'item', formatter: function (p) { var q = items[p.dataIndex]; return q.tipo === 'nodo' ? tipFlujoNodo(g, g.nodos[q.k], s) : tipFlujoEnlace(g, g.enlaces[q.k], s); } }),
        series: [{
          type: 'custom', coordinateSystem: 'none', z: 5, data: items.map(function (q) { return { name: q.tipo === 'nodo' ? g.nodos[q.k].nombre : '', value: 0 }; }),
          renderItem: function (p) {
            var q = items[p.dataIndex];
            if (q.tipo === 'enlace') { var a = geo[q.k]; return { type: 'group', children: flechaGruesa(a.x1, a.y1, a.x2, a.y2, q.k === g.foco ? T.actual : T.base, a.t) }; }
            var n = g.nodos[q.k], origen = !n.entra.length, e = origen ? { fondo: P.neutro700, borde: P.neutro700, texto: P.neutro000 } : NODO_NEUTRO;
            return { type: 'group', children: cajaG(pos[n.i].x, pos[n.i].y, bw, BH, e, recortar(n.nombre, bw - 12, 600), 600) };
          }
        }]
      };
    });
  };

  R.red = function (el, s) {
    if (s.variante === 'bipartita') return redBipartita(el, s);
    if (s.variante === 'radial') return redRadial(el, s);
    if (s.variante === 'dependencias') return redDependencias(el, s);
    return redComunidades(el, s);
  };
  function tipRed(g, n, extra) {
    var vecinos = nombresDe(g, n.sale, 'd').concat(nombresDe(g, n.entra, 'o'));
    return cabeceraTooltip(n.nombre) + (extra || '') + filaTooltip('Conexiones', String(vecinos.length)) + (vecinos.length ? notaTooltip(esc(listaCorta(vecinos, 5))) : '');
  }
  /* Disposición por fuerzas (Fruchterman-Reingold) con semilla fija: cada comunidad empieza en su sector y se atrae hacia su centro */
  function disponerRed(g, w, h) {
    var n = g.nodos.length, C = g.comunidades, azar = azarFijo(n * 7919 + g.enlaces.length * 31), A = w / h;
    var p = g.nodos.map(function (nd) {
      var a = C.length > 1 ? 2 * Math.PI * nd.com / C.length - Math.PI / 2 : 0, rc = C.length > 1 ? 0.32 : 0;
      return { x: Math.cos(a) * rc * A + (azar() - 0.5) * 0.3, y: Math.sin(a) * rc + (azar() - 0.5) * 0.3 };
    });
    var kk = Math.sqrt(A / Math.max(1, n)) * 0.55, temp = 0.12;
    for (var it = 0; it < 360; it++) {
      var f = p.map(function () { return { x: 0, y: 0 }; }), i, j, dx, dy, d2, d;
      for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) {
        dx = p[i].x - p[j].x; dy = p[i].y - p[j].y; d2 = Math.max(1e-6, dx * dx + dy * dy); d = Math.sqrt(d2);
        var rep = kk * kk / d * (g.nodos[i].com === g.nodos[j].com ? 1 : 1.6);
        f[i].x += dx / d * rep; f[i].y += dy / d * rep; f[j].x -= dx / d * rep; f[j].y -= dy / d * rep;
      }
      g.enlaces.forEach(function (e) {
        var a = p[e.o], b = p[e.d], ex = a.x - b.x, ey = a.y - b.y, dd = Math.max(1e-6, Math.sqrt(ex * ex + ey * ey)), at = dd * dd / kk * (g.nodos[e.o].com === g.nodos[e.d].com ? 1 : 0.3);
        f[e.o].x -= ex / dd * at; f[e.o].y -= ey / dd * at; f[e.d].x += ex / dd * at; f[e.d].y += ey / dd * at;
      });
      var cen = C.map(function (c) { var sx = 0, sy = 0; c.nodos.forEach(function (k) { sx += p[k].x; sy += p[k].y; }); return { x: sx / c.nodos.length, y: sy / c.nodos.length }; });
      for (i = 0; i < n; i++) {
        var cc = cen[g.nodos[i].com];
        f[i].x += (cc.x - p[i].x) * 0.6 - p[i].x * 0.15; f[i].y += (cc.y - p[i].y) * 0.6 - p[i].y * 0.15 * A;
        var fl = Math.sqrt(f[i].x * f[i].x + f[i].y * f[i].y) || 1, paso = Math.min(fl, temp);
        p[i].x += f[i].x / fl * paso; p[i].y += f[i].y / fl * paso;
      }
      temp = Math.max(0.004, temp * 0.985);
    }
    return p;
  }
  /* Network graph: tamaño = conexiones (10 a 20 px), color = comunidad; solo se rotula el nodo central de cada comunidad */
  function redComunidades(el, s) {
    var g = s.datos._g, C = g.comunidades;
    if (!esTexto(s.nota)) s.nota = 'El tamaño de cada nodo es su número de conexiones' + (g.calculadas ? '; las comunidades (colores) las calcula el kit por modularidad.' : '.');
    var colorCom = function (k) { return k < 6 ? T.series[k] : P.neutro300; };
    var ley = g.calculadas ? '' : leyendaHTML(C.map(function (c, k) { return { texto: c.nombre, color: colorCom(k) }; }));
    var c = tarjeta(el, s, ley + lienzo(s, 240)), lz = c.querySelector('.eg-lienzo');
    var grados = g.nodos.map(grado), gmin = Math.min.apply(null, grados), gmax = Math.max.apply(null, grados);
    var radio = function (k) { return gmax > gmin ? 5 + 5 * (grados[k] - gmin) / (gmax - gmin) : 6; };
    var rotulados = {}; C.forEach(function (c) { if (c.nodos.length > 1 || C.length === 1) rotulados[c.centro] = 1; });
    var cache = {};
    return montarECharts(lz, function (w, h) {
      var clave = Math.round(w) + 'x' + Math.round(h);
      var p = cache[clave] || (cache[clave] = disponerRed(g, w, h));
      var xs = p.map(function (q) { return q.x; }), ys = p.map(function (q) { return q.y; });
      var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
      var mx = 14 + Math.min(40, maxMedida(Object.keys(rotulados).map(function (k) { return g.nodos[k].nombre; }), 600) / 2), top = 24, bot = 26;
      var pos = p.map(function (q) { return { x: mx + (x1 > x0 ? (q.x - x0) / (x1 - x0) : 0.5) * (w - 2 * mx), y: top + (y1 > y0 ? (q.y - y0) / (y1 - y0) : 0.5) * (h - top - bot) }; });
      var els = [];
      var intra = g.enlaces.filter(function (e) { return g.nodos[e.o].com === g.nodos[e.d].com; }), entre = g.enlaces.filter(function (e) { return g.nodos[e.o].com !== g.nodos[e.d].com; });
      intra.forEach(function (e) { els.push(gLinea(pos[e.o].x, pos[e.o].y, pos[e.d].x, pos[e.d].y, P.neutro300, 1.5, 1)); });
      entre.forEach(function (e) { els.push(gLinea(pos[e.o].x, pos[e.o].y, pos[e.d].x, pos[e.d].y, P.neutro400, 2, 2)); });
      Object.keys(rotulados).forEach(function (k) {
        var q = pos[k], r = radio(k), arriba = q.y - r - 16 >= 0;
        els.push(gTexto(recortar(g.nodos[k].nombre, 110, 600), q.x, arriba ? q.y - r - 9 : q.y + r + 10, { color: T.texto, peso: 600, align: 'center', z: 25 }));
      });
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item', formatter: function (q) {
            var n = g.nodos[q.dataIndex], cm = C[n.com];
            return tipRed(g, n, filaTooltip('Comunidad', esc(cm.nombre || 'de «' + g.nodos[cm.centro].nombre + '»')));
          }
        }),
        series: [{
          type: 'custom', coordinateSystem: 'none', z: 5, data: g.nodos.map(function (n) { return { name: n.nombre, value: 0 }; }),
          renderItem: function (q) { var k = q.dataIndex; return { type: 'circle', shape: { cx: pos[k].x, cy: pos[k].y, r: radio(k) }, style: { fill: colorCom(g.nodos[k].com), stroke: T.fondo, lineWidth: 1.5 } }; }
        }]
      };
    });
  }
  /* Node-link diagram: orígenes a la izquierda y destinos a la derecha; el nodo destacado y sus enlaces en Naranja 500 */
  function redBipartita(el, s) {
    var g = s.datos._g, I = g.izq, D = g.der, foco = g.foco, filas = Math.max(I.length, D.length), cols = s.columnas || ['Origen', 'Destino'];
    var alto = 34 + (filas - 1) * 38 + 16;
    var c = tarjeta(el, s, lienzo(s, alto));
    var conFoco = function (e) { return e.o === foco || e.d === foco; };
    var orden = g.enlaces.filter(function (e) { return !conFoco(e); }).concat(g.enlaces.filter(conFoco));
    return montarECharts(c.querySelector('.eg-lienzo'), function (w) {
      var ancho = function (lista) { return Math.min(Math.round(w * 0.32), maxMedida(lista.map(function (k) { return g.nodos[k].nombre; }), 600)); };
      var xi = ancho(I) + 20, xd = w - ancho(D) - 20, pos = [];
      [[I, xi], [D, xd]].forEach(function (par) { var off = (filas - par[0].length) / 2 * 38; par[0].forEach(function (k, j) { pos[k] = { x: par[1], y: 34 + off + j * 38 }; }); });
      var els = [gTexto(recortar(cols[0], xi * 2 - 8, 600), Math.max(medir(cols[0], 600) / 2, xi), 10, { color: T.texto, peso: 600, align: 'center' }),
        gTexto(recortar(cols[1], (w - xd) * 2 - 8, 600), Math.min(w - medir(cols[1], 600) / 2, xd), 10, { color: T.texto, peso: 600, align: 'center' })];
      orden.forEach(function (e) { var f = conFoco(e); els.push(gLinea(pos[e.o].x, pos[e.o].y, pos[e.d].x, pos[e.d].y, f ? T.actual : P.neutro300, f ? 2.5 : 1.5, f ? 3 : 1)); });
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), { trigger: 'item', formatter: function (q) { return tipRed(g, g.nodos[q.dataIndex]); } }),
        series: [{
          type: 'custom', coordinateSystem: 'none', z: 5, data: g.nodos.map(function (n) { return { name: n.nombre, value: 0 }; }),
          renderItem: function (q) {
            var k = q.dataIndex, f = k === foco, izq = I.indexOf(k) >= 0, x = pos[k].x, y = pos[k].y;
            return { type: 'group', children: [
              { type: 'circle', shape: { cx: x, cy: y, r: f ? 8 : 6 }, style: { fill: f ? T.actual : P.neutro400, stroke: T.fondo, lineWidth: 1.5 } },
              { type: 'text', silent: true, style: { text: recortar(g.nodos[k].nombre, (izq ? xi : w - xd) - 20, f ? 600 : 400), x: izq ? x - 14 : x + 14, y: y, fill: f ? T.texto : T.leyenda, font: (f ? 600 : 400) + ' 11px ' + FUENTE, align: izq ? 'right' : 'left', verticalAlign: 'middle' } }
            ] };
          }
        }]
      };
    });
  }
  /* Relationship graph: la entidad central en Naranja 500 y las relacionadas alrededor (izquierda y derecha, alternando), con la
     relación rotulada sobre el enlace */
  function redRadial(el, s) {
    var g = s.datos._g, ci = g.centro, sat = g.nodos.filter(function (n) { return n.i !== ci; }), m = sat.length;
    var izq = sat.filter(function (n, j) { return j % 2 === 0; }), der = sat.filter(function (n, j) { return j % 2 === 1; }), porLado = Math.max(izq.length, der.length);
    var alto = Math.max(200, porLado * 64 + 24);
    var c = tarjeta(el, s, lienzo(s, alto));
    var relDe = function (n) { var e = g.enlaces[(n.entra.concat(n.sale))[0]]; return e.relacion; };
    return montarECharts(c.querySelector('.eg-lienzo'), function (w, h) {
      var cw = Math.min(Math.round(w * 0.4), Math.max(104, medir(g.nodos[ci].nombre, 600) + 24)), CH = 36, SH = 30;
      var sw = Math.min(Math.round(w * 0.27), Math.max(72, maxMedida(sat.map(function (n) { return n.nombre; }), 600) + 24));
      var cx = w / 2, cy = h / 2, rx = w / 2 - sw / 2 - 2, ry = (h / 2) * 1.22, pos = [];
      pos[ci] = { x: cx, y: cy, w: cw, h: CH };
      [[izq, -1], [der, 1]].forEach(function (par) {
        var lista = par[0], k = lista.length, top = SH / 2 + 4, bot = h - SH / 2 - 4;
        lista.forEach(function (n, j) {
          var y = k === 1 ? cy : top + j * (bot - top) / (k - 1), u = (y - cy) / ry;
          pos[n.i] = { x: cx + par[1] * rx * Math.sqrt(Math.max(0, 1 - u * u)), y: y, w: sw, h: SH };
        });
      });
      var els = [];
      sat.forEach(function (n) {
        var a = pos[ci], b = pos[n.i], p1 = bordeCaja(a.x, a.y, a.w, a.h, b.x, b.y), p2 = bordeCaja(b.x, b.y, b.w, b.h, a.x, a.y);
        els.push(gLinea(a.x, a.y, b.x, b.y, T.base, 1.5, 1));
        var rel = relDe(n);
        /* La relación, a mitad del tramo visible del enlace; si no cabe entre las cajas, solo en el tooltip */
        var L = Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2)), cabe = Math.abs(p2[0] - p1[0]) >= medir(rel || '') + 8 || Math.abs(p2[1] - p1[1]) >= 22;
        if (rel && cabe) els.push(gTextoFondo(recortar(rel, Math.max(30, Math.min(110, L + 20))), (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, { color: T.textoSecundario, align: 'center', z: 22 }));
      });
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item', formatter: function (q) {
            var n = g.nodos[q.dataIndex];
            if (n.i === ci) return cabeceraTooltip(n.nombre) + filaTooltip('Relaciones', String(m));
            return cabeceraTooltip(n.nombre) + (relDe(n) ? filaTooltip('Relación', esc(relDe(n))) : '') + notaTooltip('con «' + esc(g.nodos[ci].nombre) + '»');
          }
        }),
        series: [{
          type: 'custom', coordinateSystem: 'none', z: 5, data: g.nodos.map(function (n) { return { name: n.nombre, value: 0 }; }),
          renderItem: function (q) {
            var k = q.dataIndex, b = pos[k], c0 = k === ci;
            return { type: 'group', children: cajaG(b.x, b.y, b.w, b.h, c0 ? { fondo: T.actual, borde: T.actual, texto: P.neutro700 } : NODO_NEUTRO, recortar(g.nodos[k].nombre, b.w - 12, 600), 600, 8) };
          }
        }]
      };
    });
  }
  /* Dependency graph: tareas en columnas (de izquierda a derecha), dependencias en curva con flecha; la ruta crítica en Naranja 500 y 3 px */
  function redDependencias(el, s) {
    var g = s.datos._g, ncol = g.columnas, cols = ordenarColumnas(g, g.nivel, ncol), cam = g.camino, enCam = {}, enlCam = {};
    cam.nodos.forEach(function (k) { enCam[k] = 1; }); cam.enlaces.forEach(function (k) { enlCam[k] = 1; });
    var maxK = Math.max.apply(null, cols.map(function (c) { return c.length; })), alto = Math.max(160, maxK * 52 + 8), BH = 30, MINW = 52, GAP = 20;
    var ley = leyendaHTML([{ texto: 'Ruta crítica', color: T.actual, forma: 'linea' }, { texto: 'Dependencia', color: T.base, forma: 'linea' }]);
    var c = tarjeta(el, s, ley + '<div class="eg-desplaza">' + lienzo(s, alto) + '</div>'), lz = c.querySelector('.eg-lienzo');
    lz.style.minWidth = ncol * MINW + (ncol - 1) * GAP + 4 + 'px';
    var orden = g.enlaces.filter(function (e) { return !enlCam[e.i]; }).concat(g.enlaces.filter(function (e) { return enlCam[e.i]; }));
    var unidadDur = esTexto(s.unidad) ? s.unidad : '';
    return montarECharts(lz, function (w, h) {
      var natural = Math.min(110, Math.max(64, maxMedida(g.nodos.map(function (n) { return n.nombre; }), 600) + 24));
      var bw = Math.max(MINW, Math.min(natural, (w - 4 - (ncol - 1) * 24) / ncol)), hueco = ncol > 1 ? (w - 4 - ncol * bw) / (ncol - 1) : 0, pos = [];
      cols.forEach(function (col, ci) { col.forEach(function (k, j) { pos[k] = { x: 2 + ci * (bw + hueco) + bw / 2, y: (j + 0.5) * h / col.length }; }); });
      var els = [];
      orden.forEach(function (e) {
        var a = pos[e.o], b = pos[e.d], cr = !!enlCam[e.i], x1 = a.x + bw / 2, x2 = b.x - bw / 2 - 8, xm = (x1 + x2) / 2, col = cr ? T.actual : T.base;
        els.push({ type: 'bezierCurve', silent: true, z: cr ? 3 : 1, shape: { x1: x1, y1: a.y, x2: x2 + 0.5, y2: b.y, cpx1: xm, cpy1: a.y, cpx2: xm, cpy2: b.y }, style: { stroke: col, lineWidth: cr ? 3 : 1.5, fill: null } });
        els.push({ type: 'polygon', silent: true, z: cr ? 3 : 1, shape: { points: [[x2 + 8, b.y], [x2, b.y - 4.5], [x2, b.y + 4.5]] }, style: { fill: col } });
      });
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item', formatter: function (q) {
            var n = g.nodos[q.dataIndex], antes = nombresDe(g, n.entra, 'o');
            return cabeceraTooltip(n.nombre) + (n.duracion != null ? filaTooltip('Duración', formatear(n.duracion, { unidad: unidadDur, decimales: s.decimales }).texto) : '') +
              (antes.length ? filaTooltip('Depende de', esc(listaCorta(antes, 3))) : filaTooltip('Depende de', 'ninguna')) + (enCam[n.i] ? notaTooltip('En la ruta crítica') : '');
          }
        }),
        series: [{
          type: 'custom', coordinateSystem: 'none', z: 5, data: g.nodos.map(function (n) { return { name: n.nombre, value: 0 }; }),
          renderItem: function (q) {
            var k = q.dataIndex, cr = !!enCam[k];
            return { type: 'group', children: cajaG(pos[k].x, pos[k].y, bw, BH, cr ? { fondo: T.actual, borde: T.actual, texto: P.neutro700 } : NODO_NEUTRO, recortar(g.nodos[k].nombre, bw - 12, cr ? 600 : 400), cr ? 600 : 400) };
          }
        }]
      };
    });
  }

  /* ================================================================== */
  /* Familia Geografía                                                    */
  /* ================================================================== */
  /* Contornos: archivos TopoJSON aparte (dist/mapas/), que se cargan solo al dibujar un mapa y se guardan en caché */
  var cacheMapas = {};
  function cargarMapa(nombre) {
    if (cacheMapas[nombre]) return cacheMapas[nombre];
    var base = String(config.mapas || '').replace(/\/?$/, '/'), url = base + 'espana-' + nombre + '.js';
    var almacen = function () { return global.EdelvivesGraficosMapas && global.EdelvivesGraficosMapas[nombre]; };
    /* Se carga como script (vale donde solo se permiten scripts, como los artefactos publicados, y al abrir el HTML con doble clic) */
    cacheMapas[nombre] = new Promise(function (resolver, rechazar) {
      if (almacen()) return resolver(almacen());
      var sc = document.createElement('script');
      sc.src = url; sc.async = true;
      sc.onload = function () { if (almacen()) resolver(almacen()); else rechazar(new Error('el archivo no trae el mapa')); };
      sc.onerror = function () { rechazar(new Error('no responde')); };
      document.head.appendChild(sc);
    }).then(leerTopo).catch(function (e) {
      delete cacheMapas[nombre];
      throw new Error('no se pudo cargar el mapa de ' + nombre + ' (' + url + ': ' + e.message + '). En servidores sin acceso a jsDelivr, copia la carpeta dist/mapas y usa EG.configurar({ mapas: \'https://…/mapas/\' }).');
    });
    return cacheMapas[nombre];
  }
  /* Decodifica el TopoJSON (arcos con deltas cuantizados) en anillos de coordenadas en km */
  function leerTopo(t) {
    var tr = t.transform, arcos = t.arcs.map(function (a) {
      var x = 0, y = 0;
      return a.map(function (p) { x += p[0]; y += p[1]; return [x * tr.scale[0] + tr.translate[0], y * tr.scale[1] + tr.translate[1]]; });
    });
    function anillo(ids) {
      var pts = [];
      ids.forEach(function (i) {
        var a = i < 0 ? arcos[~i].slice().reverse() : arcos[i];
        a.forEach(function (p, k) { if (k > 0 || !pts.length) pts.push(p); });
      });
      return pts;
    }
    var capa = t.objects[Object.keys(t.objects)[0]], zonas = {}, bb = [Infinity, Infinity, -Infinity, -Infinity];
    capa.geometries.forEach(function (gm) {
      var pol = gm.type === 'Polygon' ? [gm.arcs] : (gm.type === 'MultiPolygon' ? gm.arcs : []), anillos = [];
      pol.forEach(function (p) { p.forEach(function (r) { var a = anillo(r); anillos.push(a); a.forEach(function (q) { bb[0] = Math.min(bb[0], q[0]); bb[1] = Math.min(bb[1], q[1]); bb[2] = Math.max(bb[2], q[0]); bb[3] = Math.max(bb[3], q[1]); }); }); });
      zonas[gm.properties.id] = { id: gm.properties.id, anillos: anillos, punto: [gm.properties.px, gm.properties.py] };
    });
    var meta = t.edelvives || {};
    if (meta.recuadro) { bb[0] = Math.min(bb[0], meta.recuadro[0]); bb[1] = Math.min(bb[1], meta.recuadro[1]); bb[2] = Math.max(bb[2], meta.recuadro[2]); bb[3] = Math.max(bb[3], meta.recuadro[3]); }
    return { zonas: zonas, ids: Object.keys(zonas).sort(), bbox: bb, recuadro: meta.recuadro || null, atribucion: meta.atribucion || 'Obra derivada de BDLJE CC-BY 4.0 ign.es', enlace: meta.enlace || 'https://www.ign.es/' };
  }
  /* Encaja el mapa (km, y hacia arriba) en un rectángulo de píxeles */
  function encajarMapa(geo, x, y, w, h) {
    var b = geo.bbox, sc = Math.min(w / (b[2] - b[0]), h / (b[3] - b[1])), ox = x + (w - (b[2] - b[0]) * sc) / 2, oy = y + (h - (b[3] - b[1]) * sc) / 2;
    var f = function (p) { return [ox + (p[0] - b[0]) * sc, oy + (b[3] - p[1]) * sc]; };
    f.sc = sc; f.ancho = (b[2] - b[0]) * sc; f.alto = (b[3] - b[1]) * sc; f.x = ox; f.y = oy;
    return f;
  }
  function trazoZona(z, f) {
    return z.anillos.map(function (a) { return 'M' + a.map(function (p) { var q = f(p); return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L') + 'Z'; }).join('');
  }
  function puntoEnZona(z, p) {
    var dentro = false;
    z.anillos.forEach(function (a) {
      for (var i = 0, j = a.length - 1; i < a.length; j = i++) {
        if ((a[i][1] > p[1]) !== (a[j][1] > p[1]) && p[0] < (a[j][0] - a[i][0]) * (p[1] - a[i][1]) / (a[j][1] - a[i][1]) + a[i][0]) dentro = !dentro;
      }
    });
    return dentro;
  }
  /* Trama de «Sin dato»: rayas Neutro 400 sobre Neutro 100 (nunca blanco) */
  var TRAMA = null;
  function trama() {
    if (TRAMA) return TRAMA;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6"><rect width="6" height="6" fill="' + P.neutro100 + '"/><path d="M-1 1L1 -1M0 6L6 0M5 7L7 5" stroke="' + P.neutro400 + '" stroke-width="1"/></svg>';
    var img = typeof Image !== 'undefined' ? new Image() : null;
    if (img) img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return (TRAMA = img ? { image: img, repeat: 'repeat' } : P.neutro100);
  }
  /* Singular aproximado de «nombreCasos» para «1 punto = 1 centro» (se puede fijar con «nombreCaso») */
  function singular(t) { return /[aeiou][rlndzj]es$/.test(t) ? t.slice(0, -2) : t.replace(/s$/, ''); }
  /* Atribución que exige la licencia del IGN (fórmula de obra derivada), visible al pie de cada mapa y con «ign.es» enlazado */
  function conAtribucion(s, geo) {
    var at = geo.atribucion, a = 'Contornos: ' + at.charAt(0).toLowerCase() + at.slice(1) + '.';
    s.nota = esTexto(s.nota) ? s.nota + ' ' + a : a;
    if (/ign\.es$/.test(at)) s._enlaceNota = { texto: 'ign.es', url: geo.enlace };
  }
  function tituloLeyendaMapa(s, def) {
    if (esTexto(s.leyenda)) return s.leyenda;
    if (def) return def;
    if (!esTexto(s.unidad)) return '';
    return s.unidad.length <= 2 ? 'Valor (' + s.unidad + ')' : s.unidad.charAt(0).toUpperCase() + s.unidad.slice(1);
  }
  function nombreZona(g, k) { return g.nombres[k]; }
  /* Tres tamaños de referencia para las leyendas de símbolos proporcionales (por ejemplo 20, 50 y 90) */
  function tamanosLeyenda(max) {
    var e = Math.pow(10, Math.floor(Math.log(max) / Math.LN10)), v3 = limpio(Math.floor(max / e * 2) / 2 * e);
    if (v3 > max || v3 <= 0) v3 = limpio(Math.floor(max / e) * e);
    var v2 = pasoBonito(v3 / 2), v1 = pasoBonito(v3 / 4.5);
    if (v2 >= v3) v2 = limpio(v3 / 2); if (v1 >= v2) v1 = limpio(v2 / 2);
    return [v1, v2, v3];
  }
  function leyendaFilas(titulo, filas, paso) {
    /* filas: { color, borde, texto, forma ('cuadro' | 'linea' | 'circulo' | 'numero'), grosor, numero } */
    paso = paso || 20;
    var ancho = Math.max(titulo ? medir(titulo, 600) : 0, maxMedida(filas.map(function (f) { return f.texto; })) + (filas.some(function (f) { return f.forma === 'linea'; }) ? 32 : 22));
    return {
      ancho: ancho, alto: (titulo ? 21 : 0) + filas.length * paso - (paso - 14),
      dibujar: function (x, y) {
        var els = [];
        if (titulo) { els.push(gTexto(titulo, x, y + 7, { color: T.texto, peso: 600 })); y += 21; }
        filas.forEach(function (f, i) {
          var yy = y + i * paso + 7;
          if (f.forma === 'linea') { els.push(gLinea(x, yy, x + 24, yy, f.color, f.grosor || 2, 20)); els.push(gTexto(f.texto, x + 32, yy, { color: T.leyenda })); return; }
          if (f.forma === 'circulo') els.push(circuloG(x + 7, yy, f.r || 4.5, f.color, T.fondo, 1.5));
          else if (f.forma === 'numero') { els.push(circuloG(x + 7, yy, 7, P.naranja500)); els.push(gTexto(f.numero, x + 7, yy, { color: T.texto, peso: 600, align: 'center', z: 22 })); }
          else els.push({ type: 'rect', silent: true, z: 20, shape: { x: x + 0.5, y: yy - 6.5, width: 13, height: 13, r: 2 }, style: { fill: f.color, stroke: f.borde || null, lineWidth: f.borde ? 1 : 0 } });
          els.push(gTexto(f.texto, x + 22, yy, { color: T.leyenda }));
        });
        return els;
      }
    };
  }
  function circuloG(cx, cy, r, color, borde, grosor) {
    return { type: 'circle', silent: true, z: 21, shape: { cx: cx, cy: cy, r: r }, style: { fill: color, stroke: borde || null, lineWidth: borde ? grosor : 0 } };
  }
  function filasClases(s, g, conNulos, niveles) {
    var rot = niveles ? NIVELES_MAPA : rotulosClases(g.cortes, g.enteros, s);
    var filas = CLASES_MAPA.map(function (c, k) { return { color: c, borde: k === 0 ? P.neutro300 : null, texto: rot[k] }; });
    if (conNulos) filas.push({ color: trama(), borde: P.neutro300, texto: 'Sin dato' });
    return filas;
  }
  /* Esqueleto común: mapa a la izquierda y leyenda a la derecha (o debajo si no cabe). Cada variante da el relleno de las zonas,
     su tooltip y las marcas que van encima (en píxeles, ya proyectadas) */
  function dibujarMapa(el, s, geo, o) {
    conAtribucion(s, geo);
    var c = tarjeta(el, s, lienzo(s, 220)), lz = c.querySelector('.eg-lienzo'), ids = geo.ids, cache = {};
    var aspecto = (geo.bbox[2] - geo.bbox[0]) / (geo.bbox[3] - geo.bbox[1]);
    return montarECharts(lz, function (w) {
      var ley = o.leyenda, lateral = !ley || w - ley.ancho - 20 >= 220, mapaW = lateral ? w - (ley ? ley.ancho + 20 : 0) : w;
      var mapaH = lateral ? Math.min(260, Math.max(200, Math.min(mapaW / aspecto, 240))) : Math.min(240, mapaW / aspecto);
      var alto = lateral ? Math.max(mapaH, ley ? ley.alto + 8 : 0) : mapaH + 14 + ley.alto;
      if (Math.abs(lz.offsetHeight - alto) > 1) lz.style.height = Math.round(alto) + 'px';
      var f = encajarMapa(geo, 0, lateral ? (alto - mapaH) / 2 : 0, mapaW, mapaH), clave = f.sc.toFixed(4) + ':' + f.x.toFixed(1) + ':' + f.y.toFixed(1);
      if (!cache[clave]) { cache = {}; cache[clave] = {}; ids.forEach(function (id) { cache[clave][id] = trazoZona(geo.zonas[id], f); }); }
      var trazos = cache[clave], els = [];
      if (geo.recuadro) {
        var a = f([geo.recuadro[0], geo.recuadro[3]]), b = f([geo.recuadro[2], geo.recuadro[1]]);
        els.push({ type: 'rect', silent: true, z: 0, shape: { x: Math.round(a[0]) + 0.5, y: Math.round(a[1]) + 0.5, width: Math.round(b[0] - a[0]), height: Math.round(b[1] - a[1]) }, style: { fill: null, stroke: P.neutro300, lineWidth: 1 } });
      }
      if (ley) els = els.concat(lateral ? ley.dibujar(mapaW + 20, (alto - ley.alto) / 2) : ley.dibujar(0, mapaH + 14));
      var marcas = o.marcas ? o.marcas(f, geo) : [];
      var series = [{
        type: 'custom', coordinateSystem: 'none', z: 2, data: ids.map(function () { return 0; }),
        renderItem: function (p) {
          var id = ids[p.dataIndex], r = o.relleno(id);
          return { type: 'path', silent: !r.tooltip, shape: { pathData: trazos[id] }, style: { fill: r.fill, stroke: T.fondo, lineWidth: r.grosor || 1, lineJoin: 'round' } };
        }
      }];
      if (marcas.length) series.push({
        type: 'custom', coordinateSystem: 'none', z: 5, data: marcas.map(function () { return 0; }),
        renderItem: function (p) { var m = marcas[p.dataIndex]; return Object.assign({ silent: !m.tooltip }, m.el); }
      });
      return {
        animation: false, graphic: { elements: els }, series: series,
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item', formatter: function (p) {
            if (p.seriesIndex === 0) { var r = o.relleno(ids[p.dataIndex]); return r.tooltip ? r.tooltip() : ''; }
            var m = marcas[p.dataIndex]; return m && m.tooltip ? m.tooltip() : '';
          }
        })
      };
    });
  }

  R.mapa = function (el, s) {
    var g = s.datos._geo, v = s.variante;
    return cargarMapa(g.mapa).then(function (geo) {
      if (v === 'con-ranking') return mapaRanking(el, s, g, geo);
      return dibujarMapa(el, s, geo, OPCIONES_MAPA[v](s, g, geo));
    });
  };
  function tooltipValor(s, nombre, x, extra) {
    return cabeceraTooltip(nombre) + (esNum(x) ? filaTooltip('Valor', fmtU(x, s).texto) : notaTooltip('Sin dato')) + (extra || '');
  }
  function porZona(g) { var m = {}; (g.ids || []).forEach(function (id, k) { m[id] = k; }); return m; }
  var BASE_MAPA = { fill: P.neutro200 };

  var OPCIONES_MAPA = {
    coropletas: function (s, g) {
      var k = porZona(g);
      return {
        leyenda: leyendaFilas(tituloLeyendaMapa(s, s.leyenda), filasClases(s, g, g.nulos)),
        relleno: function (id) {
          var i = k[id];
          if (i == null) return { fill: g.faltan.indexOf(id) >= 0 ? trama() : P.neutro200 };
          return { fill: g.clases[i] == null ? trama() : CLASES_MAPA[g.clases[i]], tooltip: function () { return tooltipValor(s, nombreZona(g, i), g.valores[i]); } };
        }
      };
    },
    categorias: function (s, g) {
      var k = porZona(g);
      var filas = g.grupos.map(function (n, i) { return { color: T.series[i], borde: i === 5 ? P.neutro300 : null, texto: n }; });
      if (g.cat.some(function (x) { return x < 0; })) filas.push({ color: P.neutro200, borde: P.neutro300, texto: 'Sin asignar' });
      return {
        leyenda: leyendaFilas(esTexto(s.leyenda) ? s.leyenda : '', filas),
        relleno: function (id) {
          var i = k[id];
          if (i == null || g.cat[i] < 0) return { fill: P.neutro200, grosor: 1.5 };
          return { fill: T.series[g.cat[i]], grosor: 1.5, tooltip: function () { return cabeceraTooltip(nombreZona(g, i)) + notaTooltip(esc(g.grupos[g.cat[i]])); } };
        }
      };
    },
    burbujas: function (s, g, geo) { return simbolosMapa(s, g, geo, false); },
    simbolos: function (s, g, geo) { return simbolosMapa(s, g, geo, true); },
    puntos: function (s, g, geo) {
      var pts = g.puntos;
      if (!pts) {
        /* Densidad de puntos: un punto por cada «porPunto» casos, repartidos al azar (semilla fija) dentro de la zona */
        pts = []; g.zonasPts = [];
        g.ids.forEach(function (id, i) {
          var z = geo.zonas[id], n = esNum(g.valores[i]) ? Math.round(g.valores[i] / g.porPunto) : 0, azar = azarFijo(+id * 7919 + 13), bb = [Infinity, Infinity, -Infinity, -Infinity];
          z.anillos.forEach(function (a) { a.forEach(function (p) { bb[0] = Math.min(bb[0], p[0]); bb[1] = Math.min(bb[1], p[1]); bb[2] = Math.max(bb[2], p[0]); bb[3] = Math.max(bb[3], p[1]); }); });
          for (var t = 0, hechos = 0; hechos < n && t < n * 400; t++) {
            var p = [bb[0] + azar() * (bb[2] - bb[0]), bb[1] + azar() * (bb[3] - bb[1])];
            if (puntoEnZona(z, p)) { pts.push(p); g.zonasPts.push(i); hechos++; }
          }
          if (hechos < n) for (; hechos < n; hechos++) { pts.push(z.punto); g.zonasPts.push(i); }
        });
      }
      var casos = nombreCasos(s), uno = esTexto(s.nombreCaso) ? s.nombreCaso : singular(casos);
      var texto = '1 punto = ' + (g.porPunto === 1 ? '1 ' + uno : fmtDato(g.porPunto, s) + ' ' + casos);
      var total = numero(g.total) + ' ' + casos;
      var ley = { ancho: Math.max(medir(texto) + 16, medir(total, 600)), alto: 34, dibujar: function (x, y) { return [circuloG(x + 4, y + 7, 2.4, P.naranja500), gTexto(texto, x + 16, y + 7), gTexto(total, x, y + 27, { color: T.texto, peso: 600 })]; } };
      var k = porZona(g);
      return {
        leyenda: ley,
        relleno: function (id) {
          var i = k[id];
          return i != null && g.valores ? { fill: P.neutro200, tooltip: function () { return cabeceraTooltip(nombreZona(g, i)) + filaTooltip(casos.charAt(0).toUpperCase() + casos.slice(1), esNum(g.valores[i]) ? numero(g.valores[i]) : '—'); } } : BASE_MAPA;
        },
        marcas: function (f) { return pts.map(function (p) { var q = f(p); return { el: { type: 'circle', shape: { cx: q[0], cy: q[1], r: 2.4 }, style: { fill: P.naranja500 } } }; }); }
      };
    },
    rejilla: function (s, g) { return celdasOpciones(s, g, false); },
    hexagonos: function (s, g) { return celdasOpciones(s, g, true); },
    flujos: function (s, g) {
      var max = Math.max.apply(null, g.valores), refs = tamanosLeyenda(max).map(function (x) { return x; }), gro = function (x) { return Math.max(1.5, 6 * x / max); };
      var ley = leyendaFilas(tituloLeyendaMapa(s), refs.map(function (r) { return { forma: 'linea', color: P.naranja500, grosor: gro(r), texto: fmtDato(r, s) }; }), 22);
      return {
        leyenda: ley, relleno: function () { return BASE_MAPA; },
        marcas: function (f) {
          var o = f(g.origen.xy), m = [], orden = g.valores.map(function (x, i) { return i; }).sort(function (a, b) { return g.valores[a] - g.valores[b]; });
          orden.forEach(function (i) {
            var d = f(g.destinos[i].xy), w = gro(g.valores[i]), dx = d[0] - o[0], dy = d[1] - o[1], L = Math.sqrt(dx * dx + dy * dy) || 1;
            var cx = (o[0] + d[0]) / 2 - dy * 0.18, cy = (o[1] + d[1]) / 2 + dx * 0.18;
            /* la flecha acaba antes del punto de destino; la punta sigue la tangente de la curva */
            var tx = d[0] - cx, ty = d[1] - cy, tl = Math.sqrt(tx * tx + ty * ty) || 1, ux = tx / tl, uy = ty / tl, largo = 6 + w * 0.9, ancho = 4 + w * 1.1;
            var px = d[0] - ux * 5, py = d[1] - uy * 5, bx = px - ux * largo, by = py - uy * largo;
            var tip = function () { return cabeceraTooltip((g.origen.nombre || 'Origen') + ' \u2192 ' + (g.destinos[i].nombre || 'Destino ' + (i + 1))) + filaTooltip('Valor', fmtU(g.valores[i], s).texto); };
            m.push({ tooltip: tip, el: { type: 'path', shape: { pathData: 'M' + o[0].toFixed(1) + ' ' + o[1].toFixed(1) + 'Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + bx.toFixed(1) + ' ' + by.toFixed(1) }, style: { fill: null, stroke: P.naranja500, lineWidth: w, lineCap: 'round' } } });
            m.push({ tooltip: tip, el: { type: 'polygon', shape: { points: [[px, py], [bx - uy * ancho / 2, by + ux * ancho / 2], [bx + uy * ancho / 2, by - ux * ancho / 2]] }, style: { fill: P.naranja500 } } });
            m.push({ el: { type: 'circle', shape: { cx: d[0], cy: d[1], r: 3 }, style: { fill: P.neutro700 } } });
            m.push({ el: { type: 'text', style: { text: fmtDato(g.valores[i], s), x: d[0] + (dx >= 0 ? 6 : -6), y: Math.max(7, d[1] - 8), fill: T.texto, font: '600 11px ' + FUENTE, align: dx >= 0 ? 'left' : 'right', verticalAlign: 'middle', stroke: T.fondo, lineWidth: 3 } } });
          });
          m.push({ el: { type: 'circle', shape: { cx: o[0], cy: o[1], r: 6 }, style: { fill: P.neutro700, stroke: T.fondo, lineWidth: 1.5 } }, tooltip: function () { return cabeceraTooltip(g.origen.nombre || 'Origen') + filaTooltip('Total', fmtU(suma(g.valores), s).texto); } });
          m.push({ el: { type: 'text', style: { text: g.origen.nombre || 'Origen', x: o[0] - 6, y: o[1] - 12, fill: T.texto, font: '600 11px ' + FUENTE, align: 'right', verticalAlign: 'middle', stroke: T.fondo, lineWidth: 3 } } });
          return m;
        }
      };
    },
    ruta: function (s, g) {
      var filas = g.paradas.map(function (p, i) { return { forma: 'numero', numero: String(i + 1), texto: p.nombre }; });
      return {
        leyenda: leyendaFilas(esTexto(s.leyenda) ? s.leyenda : '', filas, 22), relleno: function () { return BASE_MAPA; },
        marcas: function (f) {
          var q = g.paradas.map(function (p) { return f(p.xy); }), m = [{ el: { type: 'polyline', shape: { points: q }, style: { fill: null, stroke: P.naranja500, lineWidth: 3, lineJoin: 'round', lineCap: 'round' } } }];
          q.forEach(function (p, i) {
            var tip = function () { return cabeceraTooltip((i + 1) + '. ' + g.paradas[i].nombre) + notaTooltip(i === 0 ? 'Inicio' : (i === q.length - 1 ? 'Final' : 'Parada ' + (i + 1) + ' de ' + q.length)); };
            m.push({ tooltip: tip, el: { type: 'circle', shape: { cx: p[0], cy: p[1], r: 9 }, style: { fill: P.naranja500, stroke: T.fondo, lineWidth: 2 } } });
            m.push({ el: { type: 'text', style: { text: String(i + 1), x: p[0], y: p[1], fill: T.texto, font: '600 11px ' + FUENTE, align: 'center', verticalAlign: 'middle' } } });
          });
          return m;
        }
      };
    },
    conexiones: function (s, g) {
      var foco = g.foco, filas = [];
      if (foco >= 0) filas.push({ forma: 'linea', color: P.naranja500, grosor: 2, texto: g.nodos[foco].nombre });
      filas.push({ forma: 'linea', color: P.neutro400, grosor: 1.5, texto: foco >= 0 ? 'Otras' : 'Conexiones' }, { forma: 'circulo', color: P.neutro600, texto: 'Nodo' });
      return {
        leyenda: leyendaFilas(esTexto(s.leyenda) ? s.leyenda : '', filas, 22), relleno: function () { return BASE_MAPA; },
        marcas: function (f) {
          var m = [], orden = g.enlaces.map(function (e, i) { return i; }).sort(function (a, b) { return (g.enlaces[a].indexOf(foco) >= 0) - (g.enlaces[b].indexOf(foco) >= 0); });
          orden.forEach(function (i) {
            var e = g.enlaces[i], a = f(g.nodos[e[0]].xy), b = f(g.nodos[e[1]].xy), dx = b[0] - a[0], dy = b[1] - a[1], dest = e.indexOf(foco) >= 0;
            m.push({
              tooltip: function () { return cabeceraTooltip(g.nodos[e[0]].nombre + ' \u2013 ' + g.nodos[e[1]].nombre); },
              el: { type: 'path', shape: { pathData: 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'Q' + ((a[0] + b[0]) / 2 - dy * 0.15).toFixed(1) + ' ' + ((a[1] + b[1]) / 2 + dx * 0.15).toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) }, style: { fill: null, stroke: dest ? P.naranja500 : P.neutro400, lineWidth: dest ? 2 : 1.5 } }
            });
          });
          g.nodos.forEach(function (n, i) {
            var p = f(n.xy), es = i === foco;
            m.push({ tooltip: function () { return cabeceraTooltip(n.nombre) + filaTooltip('Conexiones', String(n.grado)); }, el: { type: 'circle', z2: es ? 2 : 1, shape: { cx: p[0], cy: p[1], r: es ? 7 : 4.5 }, style: { fill: es ? P.naranja500 : P.neutro600, stroke: T.fondo, lineWidth: 1.5 } } });
          });
          return m;
        }
      };
    }
  };
  function simbolosMapa(s, g, geo, cuadrados) {
    var vals = g.valores.filter(esNum), max = Math.max.apply(null, vals) || 1, refs = tamanosLeyenda(max), color = function (i) { return cuadrados ? (i === g.foco ? P.naranja500 : P.neutro600) : P.naranja500; };
    function lado(x, dmax) { var d = dmax * Math.sqrt(Math.max(0, x) / max); return cuadrados ? d * 0.8 : d; }
    var dLey = 23, titulo = tituloLeyendaMapa(s);
    var anchoRefs = refs.reduce(function (a, r) { return a + Math.max(lado(r, dLey), medir(fmtDato(r, s))) + 14; }, -14);
    var ley = {
      ancho: Math.max(medir(titulo, 600), anchoRefs), alto: 21 + dLey + 22,
      dibujar: function (x, y) {
        var els = titulo ? [gTexto(titulo, x, y + 7, { color: T.texto, peso: 600 })] : [], xx = x, base = y + 21 + dLey;
        refs.forEach(function (r) {
          var l = lado(r, dLey), col = Math.max(l, medir(fmtDato(r, s))), cx = xx + col / 2;
          els.push(cuadrados ? gRect(cx - l / 2, base - l, l, l, P.neutro600, 0, 20) : circuloG(cx, base - l / 2, l / 2, P.naranja500));
          els.push(gTexto(fmtDato(r, s), cx, base + 14, { align: 'center' }));
          xx += col + 14;
        });
        return els;
      }
    };
    return {
      leyenda: ley, relleno: function () { return BASE_MAPA; },
      marcas: function (f, geoF) {
        var dmax = Math.max(16, Math.min(32, f.ancho * 0.09)), orden = g.ids.map(function (id, i) { return i; }).filter(function (i) { return esNum(g.valores[i]) && g.valores[i] > 0; })
          .sort(function (a, b) { return g.valores[b] - g.valores[a]; }), m = [];
        orden.forEach(function (i, rango) {
          var p = f(geoF.zonas[g.ids[i]].punto), l = lado(g.valores[i], dmax), txt = fmtDato(g.valores[i], s), tip = function () { return tooltipValor(s, nombreZona(g, i), g.valores[i]); };
          m.push({ tooltip: tip, el: cuadrados ? { type: 'rect', shape: { x: p[0] - l / 2, y: p[1] - l / 2, width: l, height: l }, style: { fill: color(i), stroke: T.fondo, lineWidth: 1.5 } }
            : { type: 'circle', shape: { cx: p[0], cy: p[1], r: l / 2 }, style: { fill: color(i), stroke: T.fondo, lineWidth: 1.5 } } });
          if (rango < 6 && medir(txt, 600) + 4 <= l) m.push({ tooltip: tip, el: { type: 'text', style: { text: txt, x: p[0], y: p[1], fill: textoSobre(color(i)), font: '600 11px ' + FUENTE, align: 'center', verticalAlign: 'middle' } } });
        });
        return m;
      }
    };
  }
  function celdasOpciones(s, g, hex) {
    var titulo = esTexto(s.leyenda) ? s.leyenda : (hex ? 'Densidad' : 'Intensidad');
    var unidadCelda = g.conPeso ? s.unidad : nombreCasos(s);
    return {
      leyenda: leyendaFilas(titulo, filasClases(s, g, false, true)), relleno: function () { return BASE_MAPA; },
      marcas: function (f) {
        return g.celdas.map(function (c) {
          var tip = function () {
            return cabeceraTooltip(NIVELES_MAPA[c.clase]) + filaTooltip(unidadCelda.charAt(0).toUpperCase() + unidadCelda.slice(1), g.conPeso ? fmtU(c.v, s).texto : numero(c.v)) +
              notaTooltip((hex ? 'Hexágono de igual área que una celda de ' : 'Celda de ') + numero(g.celda) + ' × ' + numero(g.celda) + ' km · máximo: ' + (g.conPeso ? fmtU(g.max, s).texto : numero(g.max)));
          };
          var p = f([c.x, c.y]);
          if (!hex) { var l = g.celda * f.sc; return { tooltip: tip, el: { type: 'rect', shape: { x: p[0] - l / 2, y: p[1] - l / 2, width: l, height: l }, style: { fill: CLASES_MAPA[c.clase], stroke: T.fondo, lineWidth: Math.min(0.8, l * 0.12) } } }; }
          var r = g.radioHex * f.sc, pts = [];
          for (var k = 0; k < 6; k++) { var an = Math.PI / 6 + k * Math.PI / 3; pts.push([p[0] + r * Math.cos(an), p[1] + r * Math.sin(an)]); }
          return { tooltip: tip, el: { type: 'polygon', shape: { points: pts }, style: { fill: CLASES_MAPA[c.clase], stroke: T.fondo, lineWidth: Math.min(0.8, r * 0.12) } } };
        });
      }
    };
  }
  /* Distribución territorial: el mapa coroplético y el ranking de las primeras zonas con los mismos colores */
  function mapaRanking(el, s, g, geo) {
    conAtribucion(s, geo);
    var c = tarjeta(el, s, lienzo(s, 230)), lz = c.querySelector('.eg-lienzo'), k = porZona(g), cache = {}, ids = geo.ids;
    var orden = g.valores.map(function (x, i) { return i; }).filter(function (i) { return esNum(g.valores[i]); }).sort(function (a, b) { return g.valores[b] - g.valores[a]; }).slice(0, g.nRanking);
    var max = g.valores[orden[0]], titulo = esTexto(s.leyenda) ? s.leyenda : 'Ranking (' + g.nRanking + ' primeros)';
    var nombres = orden.map(function (i) { return recortar(nombreZona(g, i), 100); }), anchoNom = maxMedida(nombres), anchoVal = maxMedida(orden.map(function (i) { return fmtDato(g.valores[i], s); }), 600);
    var aspecto = (geo.bbox[2] - geo.bbox[0]) / (geo.bbox[3] - geo.bbox[1]), nulos = g.nulos;
    return montarECharts(lz, function (w) {
      var barraMax = 56, anchoRk = Math.max(medir(titulo, 600), anchoNom + 8 + barraMax + 6 + anchoVal), altoRk = 21 + orden.length * 22 - 8;
      var lateral = w - anchoRk - 24 >= 150, mapaW = lateral ? w - anchoRk - 24 : w, mapaH = Math.min(lateral ? 200 : 220, mapaW / aspecto);
      var altoMapa = mapaH + 36, alto = lateral ? Math.max(altoMapa, altoRk) : altoMapa + 16 + altoRk;
      if (Math.abs(lz.offsetHeight - alto) > 1) lz.style.height = Math.round(alto) + 'px';
      var f = encajarMapa(geo, 0, 0, mapaW, mapaH), clave = f.sc.toFixed(4);
      if (!cache[clave]) { cache = {}; cache[clave] = {}; ids.forEach(function (id) { cache[clave][id] = trazoZona(geo.zonas[id], f); }); }
      var els = [];
      if (geo.recuadro) { var a = f([geo.recuadro[0], geo.recuadro[3]]), b = f([geo.recuadro[2], geo.recuadro[1]]); els.push({ type: 'rect', silent: true, shape: { x: Math.round(a[0]) + 0.5, y: Math.round(a[1]) + 0.5, width: Math.round(b[0] - a[0]), height: Math.round(b[1] - a[1]) }, style: { fill: null, stroke: P.neutro300, lineWidth: 1 } }); }
      /* Escala «Menos – Más» bajo el mapa, 5 bloques de 26 × 8 */
      var xe = f.x, ye = mapaH + 10;
      CLASES_MAPA.forEach(function (col, j) { els.push(gRect(xe + j * 26, ye, 26, 8, col, 0, 20)); });
      els.push(gTexto('Menos', xe, ye + 19, { color: T.textoSecundario }), gTexto('Más', xe + 130, ye + 19, { color: T.textoSecundario, align: 'right' }));
      if (nulos) { els.push({ type: 'rect', silent: true, z: 20, shape: { x: xe + 146.5, y: ye + 0.5, width: 13, height: 8 }, style: { fill: trama(), stroke: P.neutro300, lineWidth: 1 } }, gTexto('Sin dato', xe + 166, ye + 4)); }
      var x0 = lateral ? mapaW + 24 : 0, y0 = lateral ? Math.max(0, (alto - altoRk) / 2) : altoMapa + 16, items = [];
      els.push(gTexto(titulo, x0, y0 + 7, { color: T.texto, peso: 600 }));
      orden.forEach(function (i, r) {
        var y = y0 + 21 + r * 22, l = Math.max(2, barraMax * g.valores[i] / max);
        els.push(gTexto(nombres[r], x0 + anchoNom, y + 7, { align: 'right' }));
        items.push({ i: i, x: x0 + anchoNom + 8, y: y, w: l });
        els.push(gTexto(fmtDato(g.valores[i], s), x0 + anchoNom + 8 + l + 6, y + 7, { color: T.texto, peso: 600 }));
      });
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), {
          trigger: 'item', formatter: function (p) {
            var i = p.seriesIndex === 0 ? k[ids[p.dataIndex]] : items[p.dataIndex].i;
            return i == null ? '' : tooltipValor(s, nombreZona(g, i), g.valores[i], esNum(g.valores[i]) ? filaTooltip('Clase', rotulosClases(g.cortes, g.enteros, s)[g.clases[i]]) : '');
          }
        }),
        series: [{
          type: 'custom', coordinateSystem: 'none', data: ids.map(function () { return 0; }),
          renderItem: function (p) {
            var id = ids[p.dataIndex], i = k[id];
            return { type: 'path', silent: i == null, shape: { pathData: cache[clave][id] }, style: { fill: i == null ? (g.faltan.indexOf(id) >= 0 ? trama() : P.neutro200) : (g.clases[i] == null ? trama() : CLASES_MAPA[g.clases[i]]), stroke: T.fondo, lineWidth: 1, lineJoin: 'round' } };
          }
        }, {
          type: 'custom', coordinateSystem: 'none', data: items.map(function () { return 0; }),
          renderItem: function (p) { var it = items[p.dataIndex]; return { type: 'rect', shape: { x: it.x, y: it.y, width: it.w, height: 14 }, style: { fill: CLASES_MAPA[g.clases[it.i]] } }; }
        }]
      };
    });
  }

  /* Cartograma de fichas: una ficha igual por comunidad en su posición aproximada, con la abreviatura y el valor */
  R.cartograma = function (el, s) {
    var g = s.datos._geo, k = porZona(g), ids = Object.keys(COMUNIDADES).filter(function (id) { return (id !== '18' && id !== '19') || k[id] != null; });
    var filas = filasClases(s, g, g.nulos), filasG = ids.some(function (id) { return COMUNIDADES[id][4] === 4; }) ? 5 : 4;
    var c = tarjeta(el, s, lienzo(s, 240)), lz = c.querySelector('.eg-lienzo');
    return montarECharts(lz, function (w) {
      var paso = Math.max(36, Math.min(56, Math.floor((w + 4) / 6))), fw = paso - 4, fh = Math.round(fw * 0.8), pasoY = fh + 4 + (fh >= 34 ? 4 : 0);
      var anchoGrid = 6 * paso - 4, x0 = Math.max(0, (w - anchoGrid) / 2);
      /* Leyenda en filas debajo: cada elemento ocupa su texto + 22 px, con 16 px entre ellos */
      var lineas = [[]], xx = 0;
      filas.forEach(function (it) { var an = 22 + medir(it.texto); if (xx > 0 && xx + an > w) { lineas.push([]); xx = 0; } lineas[lineas.length - 1].push({ it: it, x: xx }); xx += an + 16; });
      var altoGrid = filasG * pasoY - 4, alto = altoGrid + 18 + lineas.length * 20 - 6;
      if (Math.abs(lz.offsetHeight - alto) > 1) lz.style.height = Math.round(alto) + 'px';
      var els = [];
      lineas.forEach(function (ln, j) {
        var anchoLn = ln.length ? ln[ln.length - 1].x + 22 + medir(ln[ln.length - 1].it.texto) : 0, dx = Math.max(0, (w - anchoLn) / 2);
        ln.forEach(function (e) {
          var y = altoGrid + 18 + j * 20 + 7;
          els.push({ type: 'rect', silent: true, z: 20, shape: { x: dx + e.x + 0.5, y: y - 6.5, width: 13, height: 13, r: 2 }, style: { fill: e.it.color, stroke: e.it.borde || null, lineWidth: e.it.borde ? 1 : 0 } });
          els.push(gTexto(e.it.texto, dx + e.x + 22, y));
        });
      });
      return {
        animation: false, graphic: { elements: els },
        tooltip: Object.assign(tooltipBase(), { trigger: 'item', formatter: function (p) { var id = ids[p.dataIndex], i = k[id]; return tooltipValor(s, i == null ? COMUNIDADES[id][0] : nombreZona(g, i), i == null ? null : g.valores[i]); } }),
        series: [{
          type: 'custom', coordinateSystem: 'none', data: ids.map(function () { return 0; }),
          renderItem: function (p) {
            var id = ids[p.dataIndex], f = COMUNIDADES[id], i = k[id], cl = i == null ? null : g.clases[i], x = x0 + f[3] * paso, y = f[4] * pasoY;
            var fondo = cl == null ? trama() : CLASES_MAPA[cl], tx = cl == null ? T.textoSecundario : textoSobre(CLASES_MAPA[cl]), val = i == null || !esNum(g.valores[i]) ? '\u2014' : fmtDato(g.valores[i], s) + (s.unidad && s.unidad.length <= 2 ? NBSP + s.unidad : '');
            var hijos = [{ type: 'rect', shape: { x: x, y: y, width: fw, height: fh, r: 6 }, style: { fill: fondo, stroke: cl == null || cl === 0 ? P.neutro300 : null, lineWidth: cl == null || cl === 0 ? 1 : 0 } }];
            if (fh >= 30) {
              hijos.push({ type: 'text', style: { text: f[2], x: x + fw / 2, y: y + fh / 2 - 7, fill: tx, font: '600 11px ' + FUENTE, align: 'center', verticalAlign: 'middle' } });
              if (medir(val) <= fw - 4) hijos.push({ type: 'text', style: { text: val, x: x + fw / 2, y: y + fh / 2 + 8, fill: tx, font: '400 11px ' + FUENTE, align: 'center', verticalAlign: 'middle' } });
            } else hijos.push({ type: 'text', style: { text: f[2], x: x + fw / 2, y: y + fh / 2, fill: tx, font: '600 11px ' + FUENTE, align: 'center', verticalAlign: 'middle' } });
            return { type: 'group', children: hijos };
          }
        }]
      };
    });
  };

  /* ================================================================== */
  /* Patrones de KPI y Objetivos y cumplimiento                          */
  /* ================================================================== */
  function fmtU(v, s, extra) { return formatear(v, Object.assign({ unidad: s.unidad, decimales: s.decimales, abreviar: s.abreviar }, extra || {})); }
  function valorGrande(v, s, clase) {
    var f = fmtU(v, s);
    return '<p class="eg-kpi-valor' + (clase ? ' ' + clase : '') + '">' + f.numero + (f.unidad ? '<span class="eg-kpi-unidad">' + esc(f.unidad) + '</span>' : '') + '</p>';
  }
  function chipEstado(clave, texto, tam) {
    var e = ESTADOS[clave];
    return '<span class="eg-estado eg-estado-' + clave + '">' + icono(e.icono, e.color, tam || 16) + esc(texto || e.texto) + '</span>';
  }
  /* Chip de variación en % (modo neutro por defecto) */
  function chipVariacion(pct, modo, sentidoPositivo, sufijo) {
    var redondeo = Math.round(pct * 10) / 10;
    var sentido = redondeo > 0 ? 'subida' : (redondeo < 0 ? 'bajada' : 'igual');
    var clase = 'eg-chip-' + sentido, ic, color, textoEstado = '';
    if (modo === 'valorado' && sentido !== 'igual') {
      var bueno = (sentido === 'subida') === (sentidoPositivo === 'subir');
      clase = bueno ? 'eg-chip-mejora' : 'eg-chip-empeora';
      ic = sentido; color = bueno ? P.exitoFuerte : P.errorFuerte;
      textoEstado = bueno ? ' · mejora' : ' · empeora';
    } else {
      ic = sentido === 'igual' ? 'sinCambio' : sentido;
      color = sentido === 'subida' ? T.subida : (sentido === 'bajada' ? T.bajada : T.textoSecundario);
    }
    var txt = sufijo != null ? sufijo : (redondeo > 0 ? '+' : '') + porcentaje(redondeo, 1).replace('-', '\u2212');
    return '<span class="eg-chip ' + clase + '">' + icono(ic, color, 22) + esc(txt) + textoEstado + '</span>';
  }
  /* Barra con escala: relleno, marca y rótulos debajo */
  function barraEscala(o) {
    var html = '<div class="eg-escala"><div class="eg-pista eg-pista-kpi">';
    if (o.relleno != null) html += '<div class="eg-barra" style="width:' + Math.max(0, Math.min(100, o.relleno)).toFixed(1) + '%"></div>';
    if (o.discontinua) html += '<div class="eg-tramo" style="left:' + o.discontinua[0].toFixed(1) + '%;width:' + Math.max(0, o.discontinua[1] - o.discontinua[0]).toFixed(1) + '%"></div>';
    (o.marcas || []).forEach(function (m) { html += '<i class="eg-marca" style="left:' + Math.max(0, Math.min(100, m)).toFixed(1) + '%"></i>'; });
    html += '</div>';
    if (o.rotulos) html += '<div class="eg-escala-rotulos">' + o.rotulos.map(function (r) {
      var al = r.ancla === 'inicio' || (!r.ancla && r.pos <= 2) ? 'transform:none' : (r.ancla === 'fin' || (!r.ancla && r.pos >= 98) ? 'transform:translateX(-100%)' : '');
      return '<span style="left:' + Math.max(0, Math.min(100, r.pos)).toFixed(1) + '%;' + al + '"' + (r.fuerte ? ' class="eg-fuerte"' : '') + '>' + esc(r.texto) + '</span>';
    }).join('') + '</div>';
    return html + '</div>';
  }
  /* Recoloca los rótulos de las barras de escala para que no se salgan de la tarjeta ni se pisen (0.9.2) */
  function ajustarEscalas(raiz) {
    [].forEach.call(raiz.querySelectorAll('.eg-escala-rotulos'), function (c) {
      var sp = [].slice.call(c.children), hueco = 8;
      sp.forEach(function (s) { if (s.dataset.orig == null) s.dataset.orig = s.getAttribute('style') || ''; s.setAttribute('style', s.dataset.orig); });
      var cr = c.getBoundingClientRect();
      if (!cr.width) return;
      function caja(s) { var r = s.getBoundingClientRect(); return { izq: r.left - cr.left, der: r.right - cr.left, ancho: r.width }; }
      function fijar(s, izq) { s.style.left = izq + 'px'; s.style.right = 'auto'; s.style.transform = 'none'; }
      sp.forEach(function (s) { var b = caja(s); if (b.der > cr.width) fijar(s, cr.width - b.ancho); else if (b.izq < 0) fijar(s, 0); });
      var o = sp.map(function (s) { return { s: s, b: caja(s) }; }).sort(function (a, b) { return a.b.izq - b.b.izq; });
      for (var i = o.length - 2; i >= 0; i--) if (o[i].b.der + hueco > o[i + 1].b.izq) { fijar(o[i].s, Math.max(0, o[i + 1].b.izq - hueco - o[i].b.ancho)); o[i].b = caja(o[i].s); }
      for (var j = 1; j < o.length; j++) if (o[j - 1].b.der + hueco > o[j].b.izq) { fijar(o[j].s, Math.min(cr.width - o[j].b.ancho, o[j - 1].b.der + hueco)); o[j].b = caja(o[j].s); }
    });
  }
  /* Ajusta los rótulos ahora, al cambiar el tamaño de la tarjeta y cuando carga la fuente */
  function vigilarEscalas(c) {
    if (!c.querySelector('.eg-escala-rotulos')) return Promise.resolve();
    ajustarEscalas(c);
    if (global.ResizeObserver) { new ResizeObserver(function () { ajustarEscalas(c); }).observe(c); }
    return (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { ajustarEscalas(c); });
  }
  function columnaKpi(etiqueta, contenido, clase) { return '<div class="eg-kpi-col' + (clase ? ' ' + clase : '') + '"><span class="eg-secundario">' + esc(etiqueta) + '</span>' + contenido + '</div>'; }

  R.kpi = function (el, s) {
    var cab = valorGrande(s.valor, s), lateral = '', debajo = '', clases = [];
    var pct, b;
    /* Selector de periodo */
    if (s.periodos) {
      var pest = '<div class="eg-pestanas" role="tablist">' + s.periodos.map(function (o, i) {
        return '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-i="' + i + '">' + esc(o.etiqueta) + '</button>';
      }).join('') + '</div>';
      var paneles = s.periodos.map(function (o, i) {
        return '<div class="eg-panel" role="tabpanel"' + (i ? ' hidden' : '') + '><span class="eg-secundario">' + esc(o.periodo) + '</span>' + valorGrande(o.valor, s) +
          (esTexto(o.detalle) ? '<span class="eg-secundario">' + esc(o.detalle) + '</span>' : '') + '</div>';
      }).join('');
      cab = pest + paneles;
    }
    if ((b = s.variacion)) {
      pct = esNum(b.porcentaje) ? b.porcentaje : (b.anterior ? (s.valor - b.anterior) / Math.abs(b.anterior) * 100 : 0);
      var ant = esNum(b.anterior) ? ' (' + fmtU(b.anterior, s).texto + ')' : '';
      debajo += '<div class="eg-fila">' + chipVariacion(pct, b.modo, b.sentidoPositivo) + '<span class="eg-secundario">' + esc(b.referencia) + esc(ant) + '</span></div>';
    }
    if ((b = s.tendencia)) {
      var icT = b.sentido === 'sube' ? 'tendenciaSube' : (b.sentido === 'baja' ? 'tendenciaBaja' : 'sinCambio');
      var colT = b.sentido === 'sube' ? T.subida : (b.sentido === 'baja' ? T.bajada : T.textoSecundario);
      var txtT = esTexto(b.texto) ? b.texto : { sube: 'Al alza', baja: 'A la baja', estable: 'Estable' }[b.sentido];
      lateral = '<div class="eg-lateral eg-tendencia">' + icono(icT, colT, 44) + '<b>' + esc(txtT) + '</b><span class="eg-secundario">' + esc(b.periodo) + '</span></div>';
    }
    if ((b = s.objetivo)) {
      pct = s.valor / b.valor * 100;
      var cumplido = pct >= 100, fo = fmtU(b.valor, s);
      if (b.forma === 'barra') {
        var tope = Math.max(125, Math.ceil(pct / 25) * 25);
        cab = '<div class="eg-kpi-dos">' + columnaKpi('Actual', valorGrande(s.valor, s)) + columnaKpi('Objetivo', valorGrande(b.valor, s, 'eg-kpi-gris')) + '</div>';
        debajo += barraEscala({ relleno: pct / tope * 100, marcas: [100 / tope * 100], rotulos: [{ pos: 0, texto: '0' }, { pos: 100 / tope * 100, texto: '100 %', fuerte: true }, { pos: 100, texto: porcentaje(tope, 0) }] });
      } else if (b.forma === 'logro') {
        var topeL = Math.max(120, Math.ceil(pct / 20) * 20);
        cab = '<div class="eg-logro"><span class="eg-logro-icono' + (cumplido ? '' : ' eg-logro-no') + '">' + icono(cumplido ? 'cumplido' : 'objetivo', cumplido ? P.exitoFuerte : P.neutro600, 36) + '</span><div class="eg-logro-texto">' +
          '<p class="eg-kpi-valor">' + numero(Math.round(pct), 0) + '<span class="eg-kpi-unidad">%</span></p>' +
          (cumplido ? chipEstado('en-objetivo', pct > 100 ? 'Objetivo superado' : 'Objetivo alcanzado') : chipEstado('en-riesgo', 'Objetivo no alcanzado')) +
          '<span class="eg-secundario">de ' + esc(fo.texto) + ' de objetivo</span></div></div>';
        debajo += barraEscala({ relleno: pct / topeL * 100, marcas: [100 / topeL * 100], rotulos: [{ pos: 0, texto: '0' }, { pos: 100 / topeL * 100, texto: '100 %', fuerte: true }, { pos: 100, texto: porcentaje(topeL, 0) }] });
      } else {
        debajo += '<div class="eg-fila"><span class="eg-secundario">Objetivo</span><span class="eg-fuerte">' + fo.texto + '</span></div>' +
          '<div class="eg-fila"><span class="eg-chip eg-chip-neutro">' + (cumplido ? icono('cumplido', T.actual, 16) : icono('objetivo', T.bajada, 16)) + porcentaje(pct, 0) + ' del objetivo</span></div>';
      }
    }
    if ((b = s.anterior)) {
      pct = b.valor ? (s.valor - b.valor) / Math.abs(b.valor) * 100 : 0;
      cab = '<div class="eg-kpi-dos eg-kpi-dividida">' + columnaKpi('Actual', valorGrande(s.valor, s) + '<div class="eg-fila">' + chipVariacion(pct) + '</div>') +
        columnaKpi(b.etiqueta, valorGrande(b.valor, s, 'eg-kpi-gris') + '<span class="eg-secundario">' + esc(b.nota || 'Base de comparación') + '</span>') + '</div>';
    }
    if ((b = s.prevision)) {
      var topeP = Math.max(s.valor, b.valor) * 1.25 || 1;
      cab = '<div class="eg-kpi-dos">' + columnaKpi('Actual', valorGrande(s.valor, s)) + columnaKpi(b.etiqueta || 'Previsión de cierre', valorGrande(b.valor, s, 'eg-kpi-gris')) + '</div>';
      var pr = s.valor / topeP * 100, pp = b.valor / topeP * 100;
      debajo += barraEscala({ relleno: pr, discontinua: pp > pr ? [pr, pp] : null, rotulos: [{ pos: pr, texto: 'Real', fuerte: true, ancla: 'fin' }, { pos: Math.max(pp, pr), texto: 'Previsión', ancla: 'inicio' }] });
      if (!esTexto(s.nota)) s.nota = 'Previsión: ' + b.origen + '.';
    }
    if ((b = s.estado)) {
      debajo += '<div class="eg-fila">' + chipEstado(b.estado, b.texto) + '</div><span class="eg-secundario eg-umbral">Umbral: ' + esc(b.umbral) + '</span>';
    }
    if ((b = s.ranking)) {
      if (b.total <= 20) lateral = '<div class="eg-lateral"><span class="eg-secundario">' + esc(b.etiqueta || 'Posición') + '</span><div class="eg-puntos-rank">' +
        Array.apply(null, Array(b.total)).map(function (x, i) { return '<i' + (i + 1 === b.posicion ? ' class="eg-foco"' : '') + '></i>'; }).join('') + '</div></div>';
      debajo += '<div class="eg-fila eg-rank"><span class="eg-pos">' + b.posicion + '</span><span><b>Puesto ' + b.posicion + ' de ' + b.total + '</b><small class="eg-secundario">' + esc(b.grupo) + '</small></span></div>';
    }
    if ((b = s.comparado)) {
      var M = Math.max(s.valor, b.valor) || 1;
      var fila = function (nombre, v, color, gris) {
        var fc = fmtU(v, s);
        return '<div class="eg-comp"><span class="eg-secundario">' + esc(nombre) + '</span><div class="eg-comp-fila"><span class="eg-comp-valor' + (gris ? ' eg-kpi-gris' : '') + '">' + fc.numero + (fc.unidad ? '<small>' + NBSP + esc(fc.unidad) + '</small>' : '') +
          '</span><span class="eg-comp-pista"><span style="width:' + (v / M * 100).toFixed(1) + '%;background:' + color + '"></span></span></div></div>';
      };
      cab = fila(s.nombre, s.valor, T.actual) + fila(b.nombre, b.valor, T.anterior, true);
      if (!s.contexto && !esTexto(s.nota)) debajo += '<span class="eg-secundario">Misma escala y mismo periodo para ambos.</span>';
    }
    if ((b = s.benchmark)) {
      var dif = s.valor - b.valor;
      var uCorta = s.unidad === '%' ? 'p.\u00A0p.' : s.unidad;
      var Mx = esNum(b.maximo) ? b.maximo : Math.max(s.valor, b.valor) * 1.25;
      var pv = s.valor / Mx * 100, pb = b.valor / Mx * 100;
      var nombreB = b.nombre.charAt(0).toLowerCase() + b.nombre.slice(1);
      debajo += '<div class="eg-fila">' + chipVariacion(dif, null, null, (dif > 0 ? '+' : (dif < 0 ? '\u2212' : '')) + fmtDato(Math.abs(dif), s) + '\u00A0' + uCorta + ' vs. ' + nombreB) + '</div>';
      var propioDelante = pv >= pb;
      var rot = [{ pos: pb, texto: b.nombre + ' ' + fmtDato(b.valor, s), fuerte: true, ancla: propioDelante ? 'fin' : 'inicio' },
                 { pos: pv, texto: (s.nombre || 'Nosotros') + ' ' + fmtDato(s.valor, s), ancla: propioDelante ? 'inicio' : 'fin' }];
      debajo += barraEscala({ relleno: pv, marcas: [pb], rotulos: rot });
      if (!esTexto(s.nota) && esTexto(b.fuente)) s.nota = 'Fuente del benchmark: ' + b.fuente + '.';
    }
    if ((b = s.serie)) {
      var se = b.valores, varTotal = se[0] ? (se[se.length - 1] - se[0]) / Math.abs(se[0]) * 100 : 0;
      lateral = '<div class="eg-lateral eg-spark"><div style="position:relative">' + sparklineSVG(se, T.fondo) + '</div>' +
        '<div class="eg-fila"><span class="eg-secundario">' + esc(b.periodo || s.periodo) + '</span><span class="eg-fuerte">' + (varTotal > 0 ? '+' : '') + porcentaje(Math.round(varTotal), 0) + '</span></div></div>';
    }
    if ((b = s.barras)) {
      var mx = Math.max.apply(null, b.valores) || 1;
      lateral = '<div class="eg-lateral eg-minibarras"><span class="eg-secundario">' + esc(b.periodo) + '</span><div class="eg-mb">' + b.valores.map(function (x, i) {
        return '<span><i style="height:' + Math.max(2, x / mx * 100).toFixed(1) + '%;background:' + (i === b.valores.length - 1 ? T.actual : T.anterior) + '" title="' + esc(fmtU(x, s).texto) + '"></i>' +
          (b.etiquetas ? '<small>' + esc(b.etiquetas[i]) + '</small>' : '') + '</span>';
      }).join('') + '</div></div>';
    }
    if ((b = s.desglose)) {
      var tot = b.valores.reduce(function (a, x) { return a + x; }, 0) || 1;
      debajo += '<div class="eg-desglose"><div class="eg-desglose-barra">' + b.valores.map(function (x, i) {
        return '<span style="flex:' + x + ' 1 0;background:' + T.series[i] + '" title="' + esc(b.categorias[i]) + '"></span>';
      }).join('') + '</div><ul class="eg-leyenda-h">' + b.categorias.map(function (c, i) {
        return '<li><i class="eg-m" style="background:' + T.series[i] + '"></i>' + esc(c) + '&nbsp;<b>' + porcentaje(b.valores[i] / tot * 100, 0) + '</b></li>';
      }).join('') + '</ul></div>';
    }
    if ((b = s.componentes)) {
      var maxC = esNum(b.maximo) ? b.maximo : 100;
      cab = valorGrande(s.valor, s) + '<span class="eg-secundario">sobre ' + numero(maxC, 0) + '</span>';
      lateral = '<div class="eg-lateral eg-componentes">' + b.categorias.map(function (c, i) {
        return '<div><span class="eg-fila"><span class="eg-secundario">' + esc(c) + '</span><b>' + fmtDato(b.valores[i], s) + '</b></span><span class="eg-comp-pista eg-con-pista"><span style="width:' +
          Math.max(0, Math.min(100, b.valores[i] / maxC * 100)).toFixed(1) + '%;background:' + T.actual + '"></span></span></div>';
      }).join('') + '</div>';
    }
    if ((b = s.secundarios)) {
      debajo += '<div class="eg-secundarios" style="grid-template-columns:repeat(' + b.length + ',1fr)">' + b.map(function (x) {
        var f = formatear(x.valor, { unidad: x.unidad || s.unidad, decimales: s.decimales, abreviar: s.abreviar });
        return '<div><span class="eg-secundario">' + esc(x.etiqueta) + '</span><b>' + f.numero + (x.unidad && f.unidad ? '<small>' + NBSP + esc(f.unidad) + '</small>' : '') + '</b></div>';
      }).join('') + '</div>';
    }
    if ((b = s.progreso)) {
      pct = s.valor / b.meta * 100;
      var falta = b.meta - s.valor;
      debajo += '<div class="eg-progreso-kpi"><div class="eg-pista eg-pista-kpi"><div class="eg-barra" style="width:' + Math.min(100, pct).toFixed(1) + '%"></div></div>' +
        '<div class="eg-fila eg-extremos"><span class="eg-secundario">' + porcentaje(pct, 0) + ' de ' + esc(b.etiqueta || 'la meta') + ' (' + fmtU(b.meta, s).texto + ')</span>' +
        '<span class="eg-fuerte">' + (falta > 0 ? 'Faltan ' + fmtU(falta, s).texto : 'Meta alcanzada') + '</span></div></div>';
    }
    if (listaTexto(s.contexto)) debajo += '<p class="eg-contexto">' + s.contexto.slice(0, 2).map(function (t, i) { return '<span class="' + (i ? 'eg-secundario' : '') + '">' + esc(t) + '</span>'; }).join('') + '</p>';
    if (lateral) clases.push('eg-kpi-lado');
    var c = tarjeta(el, s, '<div class="eg-kpi-cabeza"><div class="eg-kpi-principal">' + cab + '</div>' + lateral + '</div>' + debajo, clases.join(' '));
    if (s.periodos) {
      var botones = c.querySelectorAll('.eg-pestanas button'), paneles2 = c.querySelectorAll('.eg-panel');
      Array.prototype.forEach.call(botones, function (bt) {
        bt.addEventListener('click', function () {
          var i = +bt.getAttribute('data-i');
          Array.prototype.forEach.call(botones, function (x, j) { x.setAttribute('aria-selected', String(j === i)); });
          Array.prototype.forEach.call(paneles2, function (p, j) { p.hidden = j !== i; });
        });
      });
    }
    return vigilarEscalas(c);
  };

  R['kpi-rejilla'] = function (el, s) {
    tarjeta(el, s, '<div class="eg-rejilla-mini">' + s.datos.indicadores.map(function (x) {
      var f = formatear(x.valor, { unidad: x.unidad || s.unidad, decimales: s.decimales, abreviar: s.abreviar });
      return '<div class="eg-mini-kpi"><span class="eg-secundario">' + esc(x.nombre) + '</span><b>' + f.numero + (f.unidad ? '<small>' + NBSP + esc(f.unidad) + '</small>' : '') + '</b>' + chipEstado(x.estado, x.texto) + '</div>';
    }).join('') + '</div>');
    return Promise.resolve();
  };

  /* Cumplimiento en % y estado según umbrales (sentido "bajar": menos es mejor) */
  function cumplimiento(x) { return x.sentidoPositivo === 'bajar' ? (x.valor ? x.objetivo / x.valor * 100 : 100) : x.valor / x.objetivo * 100; }
  function estadoPorUmbral(c, u) { return c >= u.objetivo ? 'en-objetivo' : (c >= u.riesgo ? 'en-riesgo' : 'fuera'); }

  R.progreso = function (el, s) {
    var d = s.datos, v = s.variante;
    if (v === 'barras') return progresoBarras(el, s);
    if (v === 'anillo') {
      tarjeta(el, s, '<div class="eg-anillos">' + d.categorias.map(function (cat, i) {
        var pct = d.objetivos ? d.valores[i] / d.objetivos[i] * 100 : d.valores[i];
        var L = 2 * Math.PI * 40, arco = Math.max(0, Math.min(100, pct)) / 100 * L;
        return '<figure><span class="eg-anillo"><svg viewBox="0 0 100 100" role="img" aria-label="' + esc(cat) + ': ' + porcentaje(pct, 0) + '">' +
          '<circle cx="50" cy="50" r="40" fill="none" stroke="' + T.pista + '" stroke-width="12"/>' +
          '<circle cx="50" cy="50" r="40" fill="none" stroke="' + T.actual + '" stroke-width="12" stroke-dasharray="' + arco.toFixed(1) + ' ' + L.toFixed(1) + '" transform="rotate(-90 50 50)"/></svg>' +
          '<b>' + porcentaje(pct, 0) + '</b></span><figcaption>' + esc(cat) + '</figcaption></figure>';
      }).join('') + '</div>');
      return Promise.resolve();
    }
    if (v === 'medidor') {
      var a = function (val) { return Math.PI * (1 - (Math.max(d.minimo, Math.min(d.maximo, val)) - d.minimo) / (d.maximo - d.minimo)); };
      var cx = 120, cy = 112, r = 84;
      var pto = function (ang, rr) { return [cx + rr * Math.cos(ang), cy - rr * Math.sin(ang)]; };
      var arco = function (a0, a1) { var p0 = pto(a0, r), p1 = pto(a1, r); return 'M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + 'A' + r + ' ' + r + ' 0 0 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1); };
      var fv = fmtU(d.valor, s);
      var svg = '<svg viewBox="0 0 240 150" role="img" aria-label="' + esc(s.titulo + ': ' + fv.texto) + '">' +
        '<path d="' + arco(Math.PI, 0) + '" fill="none" stroke="' + T.pista + '" stroke-width="24"/>' +
        '<path d="' + arco(Math.PI, a(d.valor)) + '" fill="none" stroke="' + T.actual + '" stroke-width="24"/>';
      if (esNum(d.objetivo)) {
        var ao = a(d.objetivo), m0 = pto(ao, r - 16), m1 = pto(ao, r + 18), te = pto(ao, r + 22);
        svg += '<line x1="' + m0[0].toFixed(1) + '" y1="' + m0[1].toFixed(1) + '" x2="' + m1[0].toFixed(1) + '" y2="' + m1[1].toFixed(1) + '" stroke="' + T.objetivo + '" stroke-width="2.5"/>' +
          '<text x="' + te[0].toFixed(1) + '" y="' + (te[1] - 2).toFixed(1) + '" text-anchor="' + (ao < Math.PI / 2 ? 'start' : 'end') + '" class="eg-svg-fuerte">Objetivo ' + esc(fmtU(d.objetivo, s).texto) + '</text>';
      }
      svg += '<text x="' + (cx - r) + '" y="' + (cy + 22) + '" text-anchor="middle" class="eg-svg-eje">' + esc(fmtDato(d.minimo, s)) + '</text>' +
        '<text x="' + (cx + r) + '" y="' + (cy + 22) + '" text-anchor="middle" class="eg-svg-eje">' + esc(fmtDato(d.maximo, s)) + '</text>' +
        '<text x="' + cx + '" y="' + (cy - 8) + '" text-anchor="middle" class="eg-svg-valor">' + esc(fv.numero) + (fv.unidad ? '<tspan class="eg-svg-unidad" dx="3">' + esc(fv.unidad) + '</tspan>' : '') + '</text>' +
        (esTexto(d.etiqueta) ? '<text x="' + cx + '" y="' + (cy + 14) + '" text-anchor="middle" class="eg-svg-eje">' + esc(d.etiqueta) + '</text>' : '') + '</svg>';
      tarjeta(el, s, '<div class="eg-medidor">' + svg + '</div>');
      return Promise.resolve();
    }
    if (v === 'ritmo') {
      var pct = d.valor / d.meta * 100, esp = d.esperado / d.meta * 100, falta = d.meta - d.valor;
      var cr = tarjeta(el, s, '<div class="eg-ritmo"><div class="eg-fila"><span class="eg-kpi-valor">' + numero(Math.round(pct), 0) + '<span class="eg-kpi-unidad">%</span></span><span class="eg-secundario">de ' +
        esc(d.etiqueta || 'la meta') + ' (' + esc(fmtU(d.meta, s).texto) + ')</span></div>' +
        barraEscala({ relleno: pct, marcas: [esp], rotulos: [{ pos: esp, texto: 'Esperado hoy ' + porcentaje(esp, 0), fuerte: true }], arriba: true }) +
        '<div class="eg-fila eg-extremos"><span class="eg-fuerte">' + (falta > 0 ? 'Faltan ' + esc(fmtU(falta, s).texto) : 'Meta alcanzada') + '</span>' +
        (esTexto(d.restante) ? '<span class="eg-secundario">' + esc(d.restante) + '</span>' : '') + '</div></div>');
      return vigilarEscalas(cr);
    }
    /* distancia */
    tarjeta(el, s, '<dl class="eg-progreso-lista eg-distancia">' + d.categorias.map(function (cat, i) {
      var pct = Math.min(100, d.valores[i] / d.objetivos[i] * 100), falta = d.objetivos[i] - d.valores[i];
      return '<dt>' + esc(cat) + '</dt><dd><div class="eg-dist" title="' + esc(fmtU(d.valores[i], s).texto + ' de ' + fmtU(d.objetivos[i], s).texto) + '"><span class="eg-dist-real" style="width:' + pct.toFixed(1) + '%"></span>' +
        (pct < 100 ? '<span class="eg-dist-resto" style="width:' + (100 - pct).toFixed(1) + '%"></span>' : '') + '</div></dd>' +
        '<dd class="eg-valor">' + (falta > 0 ? 'Faltan ' + esc(fmtDato(falta, s)) : 'Cumplido') + '</dd>';
    }).join('') + '</dl>');
    return Promise.resolve();
  };

  function tablaIndicadores(el, s) {
    var d = s.datos, u = s.umbrales;
    var filas = d.indicadores.map(function (x) { var c = cumplimiento(x); return { x: x, c: c, e: estadoPorUmbral(c, u) }; });
    var f = function (v, x) { return formatear(v, { unidad: x.unidad || s.unidad, decimales: s.decimales, abreviar: s.abreviar }).texto; };
    var cuerpo;
    if (s.variante === 'scorecard') {
      var corto = { 'en-objetivo': 'OK', 'en-riesgo': 'Riesgo', 'fuera': 'Fuera' };
      cuerpo = '<thead><tr><th scope="col">Indicador</th><th scope="col" class="eg-num">Real</th><th scope="col" class="eg-num">Objetivo</th><th scope="col">Estado</th></tr></thead><tbody>' +
        filas.map(function (r) { return '<tr><td>' + esc(r.x.nombre) + '</td><td class="eg-num eg-fuerte">' + f(r.x.valor, r.x) + '</td><td class="eg-num eg-secundario">' + f(r.x.objetivo, r.x) + '</td><td>' + chipEstado(r.e, corto[r.e], 14) + '</td></tr>'; }).join('') + '</tbody>';
    } else {
      var rangos = { 'en-objetivo': '≥\u00A0' + porcentaje(u.objetivo, 0), 'en-riesgo': porcentaje(u.riesgo, 0) + ' – <\u00A0' + porcentaje(u.objetivo, 0), 'fuera': '<\u00A0' + porcentaje(u.riesgo, 0) };
      cuerpo = '<thead><tr><th scope="col">Estado</th><th scope="col">Umbral de cumplimiento</th><th scope="col" class="eg-num">Indicadores</th></tr></thead><tbody>' +
        ESTADOS_OBJETIVO.map(function (e) {
          var en = filas.filter(function (r) { return r.e === e; });
          return '<tr><td>' + chipEstado(e) + '</td><td>' + rangos[e] + '</td><td class="eg-num eg-celda-lista">' + (en.length ? en.map(function (r) { return '<span>' + esc(r.x.nombre) + ' · <b>' + porcentaje(r.c, 0) + '</b></span>'; }).join('') : '–') + '</td></tr>';
        }).join('') + '</tbody>';
    }
    tarjeta(el, s, '<div class="eg-tabla-envoltura"><table class="eg-tabla">' + cuerpo + '</table></div>');
    return Promise.resolve();
  }

  function pintarError(el, s, errores) {
    var nombre = s && esTexto(s.titulo) ? '«' + s.titulo + '»' : 'el gráfico';
    el.innerHTML = '<section class="eg eg-tarjeta eg-error" role="alert"><header><h3 class="eg-titulo">' + icono('incidencia', P.error, 18) +
      'No se puede dibujar ' + esc(nombre) + '</h3></header><ul>' + errores.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul></section>';
  }

  /* ------------------------------------------------------------------ */
  /* API pública                                                         */
  /* ------------------------------------------------------------------ */
  function render(destino, spec) {
    var el = typeof destino === 'string' ? document.querySelector(destino) : destino;
    if (!el) {
      var m = PREFIJO + 'no existe el elemento destino ' + destino + '.';
      console.error(m);
      return Promise.resolve({ ok: false, errores: [m] });
    }
    asegurarEstilos();
    var v = validar(spec);
    v.avisos.forEach(function (a) { console.warn(PREFIJO + a); });
    if (!v.ok) {
      v.errores.forEach(function (e) { console.error(PREFIJO + e); });
      pintarError(el, v.spec, v.errores);
      return Promise.resolve({ ok: false, errores: v.errores, avisos: v.avisos });
    }
    return asegurarFuente().then(function () { return R[v.spec.tipo](el, v.spec); }).then(function () {
      return { ok: true, errores: [], avisos: v.avisos };
    }).catch(function (e) {
      console.error(PREFIJO + e.message);
      pintarError(el, v.spec, [e.message]);
      return { ok: false, errores: [e.message], avisos: v.avisos };
    });
  }

  function configurar(opc) { Object.keys(opc || {}).forEach(function (k) { config[k] = opc[k]; }); }

  var api = {
    version: VERSION,
    render: render,
    validar: validar,
    formatear: formatear,
    configurar: configurar,
    tipos: TIPOS.slice(),
    alias: copia(ALIAS),
    variantes: copia(VARIANTES),
    estados: Object.keys(ESTADOS),
    tokens: { primitivos: P, semanticos: T, fuente: FUENTE },
    iconos: ICONOS
  };

  if (typeof document !== 'undefined') asegurarEstilos();
  global.EdelvivesGraficos = api;
  if (!global.EG) global.EG = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : this);
