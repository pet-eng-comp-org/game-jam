# API do PET Game Jam

Back-end do Game Jam do PET Engenharia de Computação da Ufes: temporadas,
inscrição de equipes, jogos publicados, patrocinadores e materiais de apoio.

| | |
|---|---|
| API em produção | <https://apigamejam.pet.inf.ufes.br> |
| Site que consome | <https://gamejam.pet.inf.ufes.br> (o `frontend/` deste repositório) |
| Imagem | `ghcr.io/petengcomp/gamejam-backend` |

## Como é feito

Express 5 com TypeScript, Prisma 7 sobre MySQL 9.7 (pelo adapter do mariadb, em
`src/prisma/adapter.ts`). O código de `src/` compila para
`dist/` e o container executa `node dist/server.js`.

O upload de imagens (capa de temporada, capa de jogo, logo de patrocinador) usa
multer e grava em `tmp/`, que é o mesmo diretório servido em `/files`. Em
produção esse diretório é o volume `vol-imgs-tmp` — os arquivos **não** ficam
dentro da imagem nem do repositório.

A API roda atrás do Traefik, que termina o TLS. Por isso o `server.ts` liga o
`trust proxy`: sem ele o `req.protocol` devolveria `http` e as URLs de imagem
sairiam em conteúdo misto numa página servida em `https`.

## Rodando local

Requer Node 24 e um MySQL acessível.

```bash
cp .env.example .env     # preencha os valores
npm install
npx prisma migrate deploy
npm run dev
```

Sobe em <http://localhost:3333>.

O `docker-compose.yml` da raiz é só para desenvolvimento — ele constrói a imagem
localmente e sobe MySQL e phpMyAdmin junto. **Não** é o compose de produção, que
vive no Portainer da VM do PET.

### Variáveis

| variável | para quê |
|---|---|
| `DATABASE_URL` | string de conexão do Prisma, no formato `mysql://usuario:senha@host:porta/banco` |
| `JWT_SECRET` | assina e valida os tokens de sessão |
| `PORT` | porta do servidor; sem ela, 3333 |

As demais (`DB_*`, `PHP_MY_ADMIN_PORT`) só existem para o compose de
desenvolvimento.

## Autenticação

Rotas de escrita exigem `Authorization: Bearer <token>`, e o token vem de
`POST /sessao`. Leitura de patrocinadores, materiais e da temporada atual é
pública, porque o site exibe isso para quem não tem login.

A inscrição de equipe (`POST /equipe`) também é pública de propósito: o
participante se inscreve antes de existir qualquer conta. Quem barra é o
controller, que só aceita se a temporada atual estiver com inscrições abertas.

## Rotas

```
POST   /sessao                     login, devolve o token
GET    /eu                         dados do usuário logado

POST   /users                      cria usuário          (autenticado)
GET    /users                      lista                 (autenticado)
PUT    /users                      troca a senha         (autenticado)
DELETE /users                                            (autenticado)

GET    /seasons/atual              temporada em cartaz
GET    /seasonsComJogos            temporadas com os jogos de cada uma
GET    /seasons                                          (autenticado)
POST   /seasons                    cria, com upload de capa (autenticado)
PUT    /seasons                    edita datas, local, linguagens, regulamento (autenticado)
PUT    /seasons/atual              define a temporada atual (autenticado)
DELETE /seasons                                          (autenticado)

POST   /jogos                      cria, com upload de capa (autenticado)
PUT    /jogos                      edita os textos       (autenticado)
DELETE /jogos                                            (autenticado)

GET    /patrocinador               lista
POST   /patrocinador               cria, com upload do logo (autenticado)
DELETE /patrocinador/remove                              (autenticado)

GET    /material                   lista
POST   /material                   cria                  (autenticado)
PUT    /material                   edita                 (autenticado)
DELETE /material                                         (autenticado)

POST   /inscricao                  equipe e participantes, numa transação
GET    /equipes                    inscritos da temporada, com e-mail (autenticado)
PUT    /equipe/aprovada            aprova ou desaprova   (autenticado)
DELETE /equipe                                           (autenticado)

GET    /files/:arquivo             imagens enviadas
```

## Testes

`test/api.test.js` sobe a API compilada contra um MySQL de verdade, com o schema
aplicado pelas migrations, e confere por HTTP o que não pode quebrar em
silêncio: toda rota do painel exige login válido, as rotas públicas não trazem
equipe nem participante, CORS só libera o site, erro do banco não vaza detalhe,
a inscrição respeita abertura e limite por equipe, e o login bloqueia força
bruta.

```bash
DATABASE_URL_TESTE=mysql://root:senha@127.0.0.1:3306/game_jam_teste npm test
```

**O banco indicado é apagado e recriado** a cada execução (o nome precisa conter
`teste`). Rota nova do painel entra na lista `PROTEGIDAS` do teste.

## Publicação

Todo push no `main` que toca `back-end/` dispara `publica-back-end.yml`: roda
os testes, constrói a imagem, publica no GHCR (`sha-<commit>` e `latest`) e
grava o digest novo no `docker-compose.prod.yml` da raiz. O Portainer acompanha
esse arquivo e aplica em até 5 minutos. **Teste falhou, nada é publicado nem
implantado.** Para voltar uma versão, `git revert` no commit `deploy:`.
