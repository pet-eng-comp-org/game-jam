# Fixada por digest, e nao pela tag node:24, porque a tag troca de conteudo sem
# aviso: duas construcoes da mesma revisao do codigo podiam gerar imagens
# diferentes. Quem traz o digest novo quando a base recebe correcao e o
# Dependabot, configurado em .github/dependabot.yml.
#
# node:24 e o LTS ativo (Krypton). O 22 esta em manutencao e o 26, que o
# Dependabot ofereceu, ainda nao e LTS — API em producao nao anda na linha
# Current.
FROM node:24@sha256:64af3819f9275802414d7cdc38c27e9d82bd564dec4d4da87d008255d36c63b4

WORKDIR /app

# Os manifestos e o schema vem antes do resto do codigo para o Docker poder
# reaproveitar a camada de dependencias: enquanto eles nao mudam, editar src/
# nao refaz a instalacao. O prisma/ precisa estar aqui porque a instalacao do
# @prisma/client executa o prisma generate, que le o schema.
COPY package.json package-lock.json ./
COPY prisma ./prisma

# npm ci instala exatamente as versoes do package-lock. O npm install podia
# resolver versoes diferentes das travadas, e a imagem deixava de corresponder
# ao que esta no repositorio.
RUN npm ci

COPY . .

RUN npm run build

# O Express usa esta variavel para nao devolver stack trace ao cliente.
ENV NODE_ENV=production

EXPOSE 3333

# O arranque passa pelo entrada.sh, que aplica as migracoes antes de servir.
CMD ["./entrada.sh"]
