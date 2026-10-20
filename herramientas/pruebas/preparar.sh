#!/bin/sh
# Prepara el banco de pruebas en /home/claude/test (entorno de Claude sin acceso a CDN).
# Uso: sh herramientas/pruebas/preparar.sh   (desde la raíz del repositorio)
set -e
RAIZ=$(pwd)
mkdir -p /home/claude/test && cd /home/claude/test
[ -f package.json ] || npm init -y >/dev/null
npm install echarts@6.1.0 @fontsource/titillium-web@5 --silent
for w in 400 600 700; do cat node_modules/@fontsource/titillium-web/$w.css; done | sed 's#\./files/#/node_modules/@fontsource/titillium-web/files/#g' > fuente.css
cp "$RAIZ"/herramientas/pruebas/harness.html "$RAIZ"/herramientas/pruebas/*.py "$RAIZ"/herramientas/pruebas/*.js .
mkdir -p vp && ln -sfn /home/claude/test/node_modules vp/node_modules && cp fuente.css vp/
ln -sfn "$RAIZ"/dist/mapas mapas && ln -sfn "$RAIZ"/dist/mapas vp/mapas
echo "Listo. Ejemplos: python3 shot.py <kit.js> /node_modules/echarts/dist/echarts.min.js /<specs.json> salida.png '&ancho=400px&cols=3'"
