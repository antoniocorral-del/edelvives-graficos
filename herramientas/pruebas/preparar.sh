#!/bin/sh
# Prepara el banco de pruebas (por defecto en /home/claude/test, el entorno de Claude sin acceso a CDN).
# Uso: sh herramientas/pruebas/preparar.sh [carpeta]   (desde la raíz del repositorio)
# Con otra carpeta (por ejemplo, .banco en el Mac), los scripts se copian con las rutas
# /home/claude/test y /home/claude/kit cambiadas por la carpeta y por la raíz del repositorio.
set -e
RAIZ=$(pwd)
DESTINO=${1:-/home/claude/test}
mkdir -p "$DESTINO" && DESTINO=$(cd "$DESTINO" && pwd) && cd "$DESTINO"
[ -f package.json ] || echo '{ "name": "banco-pruebas", "private": true }' > package.json
npm install echarts@6.1.0 @fontsource/titillium-web@5 @fontsource/barlow@5 --silent
for w in 400 600 700; do cat node_modules/@fontsource/titillium-web/$w.css; done | sed 's#\./files/#/node_modules/@fontsource/titillium-web/files/#g' > fuente.css
for w in 400 500 600; do cat node_modules/@fontsource/barlow/$w.css; done | sed 's#\./files/#/node_modules/@fontsource/barlow/files/#g' > barlow.css
cp "$RAIZ"/herramientas/pruebas/harness*.html .
for f in "$RAIZ"/herramientas/pruebas/*.py "$RAIZ"/herramientas/pruebas/*.js; do
  sed -e "s#/home/claude/test#$DESTINO#g" -e "s#/home/claude/kit#$RAIZ#g" "$f" > "$(basename "$f")"
done
mkdir -p vp && ln -sfn "$DESTINO"/node_modules vp/node_modules && cp fuente.css barlow.css vp/
ln -sfn "$RAIZ"/dist/mapas mapas && ln -sfn "$RAIZ"/dist/mapas vp/mapas
# vp/index.html: la vista previa con el kit del repositorio y los recursos locales (para vp.py)
cp "$RAIZ"/dist/edelvives-graficos.js vp/kit.js
sed 's#<script src="dist/edelvives-graficos.js"></script>#<link rel="stylesheet" href="fuente.css" data-eg-fuente><script src="kit.js"></script><script>EG.configurar({ echarts: ["/node_modules/echarts/dist/echarts.min.js"], fuente: "fuente.css", barlow: "barlow.css", mapas: "/mapas/" });</script>#' "$RAIZ"/vista-previa.html > vp/index.html
echo "Listo en $DESTINO. Ejemplos: python3 shot.py <kit.js> /node_modules/echarts/dist/echarts.min.js /<specs.json> salida.png '&ancho=400px&cols=3'"
