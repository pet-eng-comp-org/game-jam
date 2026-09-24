#!/bin/sh
# Compila e sobe o front como a imagem de producao roda: o servidor
# "standalone" do Next, com public/ e .next/static copiados ao lado (ver o
# Dockerfile). Chamado pelo Playwright (webServer em playwright.config.ts).
set -e
cd "$(dirname "$0")/.."

# Pasta propria (next.config.ts le NEXT_DIST_DIR): o build de teste tem a API
# de teste assada e nao pode ocupar o .next de quem roda o site na maquina.
export NEXT_DIST_DIR=.next-e2e
D="$NEXT_DIST_DIR/standalone"

npm run build
cp -r public "$D/"
cp -r "$NEXT_DIST_DIR/static" "$D/$NEXT_DIST_DIR/"

cd "$D"
exec node server.js
