#!/bin/sh
# Aplica as migracoes pendentes antes de subir a API.
#
# Sem isto, o script migrate-build existia no package.json e ninguem o chamava:
# uma mudanca no schema.prisma entrava na imagem mas nunca chegava ao banco. O
# build passava, o container subia, e a API so quebrava na primeira consulta a
# uma coluna que nao existia — em producao, sem nenhum sinal antes.
#
# O prisma generate NAO entra aqui: ele ja roda na construcao da imagem, pelo
# postinstall do package.json durante o npm ci.
set -e

npx prisma migrate deploy

# exec substitui o shell pelo node, em vez de deixa-lo como filho. Assim o
# processo que recebe o SIGTERM do "docker stop" e o proprio node, que consegue
# encerrar as conexoes; antes o sinal parava no npm e o container so morria no
# SIGKILL, dez segundos depois.
exec node dist/server.js
