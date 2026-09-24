# Site do PET Game Jam

Front-end do Game Jam do PET Engenharia de Computação da UFES: divulgação do
evento, regras, materiais de apoio, inscrição das equipes, vitrine dos jogos e o
painel da organização.

| | |
|---|---|
| Produção | <https://gamejam.pet.inf.ufes.br> |
| API | <https://apigamejam.pet.inf.ufes.br> (o `backend/` deste repositório) |
| Hospedagem | container na VM do PET (stack `game-jam` no Portainer) |

## Como é feito

Next.js 16 com App Router, React 19, TypeScript e Tailwind 4. Os dados vêm todos
da API — não há banco nem rota de servidor própria aqui.

## Rodando local

```bash
cp .env.example .env.local     # preencha o endereço da API
npm install
npm run dev
```

Sobe em <http://localhost:3000>. Apontar o `NEXT_PUBLIC_API_URL` para a API de
produção funciona para ver as telas, mas qualquer escrita vai bater no banco de
verdade — para mexer, suba a API local.

| script | o que faz |
|---|---|
| `npm run dev` | desenvolvimento |
| `npm run build` | build de produção |
| `npm run lint` | eslint sobre `src/` |

## Páginas

```
/               capa do evento
/regras         regulamento da edição
/materiais      links de apoio para os participantes
/apoio          patrocinadores
/inscricao      formulário de inscrição da equipe
/jogos          jogos das edições anteriores
/login          entrada da organização
/admin          painel: temporadas, jogos, patrocinadores, materiais, usuários
```

## Publicação

O deploy é automático: o que entra no `main` vai para produção. O workflow
`publica-front-end.yml` roda os testes (`npm test` e o e2e de `e2e/`), constrói a
imagem, grava o digest no `docker-compose.prod.yml` e o Portainer aplica em até 5
minutos. Reverter é `git revert` no commit `deploy:`.

Antes de abrir o pull request, nesta pasta: `npm run lint`, `npm test` e
`npm run e2e` (precisa de um MySQL; ver `e2e/ambiente.mjs`).
