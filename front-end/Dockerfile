# Mesma base e mesmo digest do backend, de proposito: uma versao de Node so na
# stack inteira, e uma atualizacao so quando o Dependabot trouxer digest novo.
# node:24 e o LTS ativo.
ARG NODE_IMAGE=node:24@sha256:14078204b6bb268c107ceff6d3c43f45a888105e5c2b18b14c32b3409d93a1b0

# ---------- dependencias ----------
# Estagio separado para o Docker reaproveitar a camada: enquanto package.json e
# package-lock.json nao mudam, editar src/ nao refaz a instalacao.
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# npm ci instala exatamente o que esta travado no lock. O npm install poderia
# resolver versoes diferentes, e a imagem deixaria de corresponder ao repo.
RUN npm ci

# ---------- build ----------
FROM ${NODE_IMAGE} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ATENCAO: variavel com prefixo NEXT_PUBLIC_ e assada no build, nao lida em
# execucao. Definir isto no compose NAO tem efeito nenhum — o valor precisa
# entrar aqui, no build. Consequencia: a imagem fica atrelada ao ambiente, e
# apontar para outra API exige reconstruir, nao reiniciar.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Carimbo de versao. Na Vercel o Next le VERCEL_GIT_COMMIT_SHA sozinho; aqui o
# valor vem do workflow. Sem ele a pagina diz "desconhecida", que ja avisa que a
# imagem foi construida fora da esteira.
ARG COMMIT
ENV COMMIT=${COMMIT}

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- execucao ----------
FROM ${NODE_IMAGE} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# O standalone nao inclui public/ nem .next/static — os dois vem a mao, senao
# o site sobe sem imagem e sem CSS, que e uma falha silenciosa: responde 200 e
# aparece quebrado.
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Usuario nao-root que ja vem na imagem do Node. Nao ha motivo para este
# processo ser root: ele so le arquivos e escuta uma porta alta.
USER node

# HOSTNAME=0.0.0.0 e obrigatorio em container: o padrao do servidor standalone
# e escutar so em localhost, e ai o Traefik nao alcanca.
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

CMD ["node", "server.js"]
