# PET Game Jam

Site e API do Game Jam do PET Engenharia de Computação da Ufes — o torneio de
programação de jogos organizado pelo grupo.

| | endereço | onde roda |
|---|---|---|
| Site | <https://gamejam.pet.inf.ufes.br> | container na VM do PET, atrás do Traefik |
| API | <https://apigamejam.pet.inf.ufes.br> | container na VM do PET, atrás do Traefik |

```
front-end/   Next.js 16, React 19, Tailwind 4 — site público e painel da organização
back-end/    Express 5, Prisma 7, MySQL 9.7 — API REST e os uploads de imagem
```

Cada diretório tem o próprio README com como rodar, variáveis de ambiente e
detalhes: [`front-end/README.md`](front-end/README.md) e
[`back-end/README.md`](back-end/README.md).

## Publicação

**Publicar não é implantar.** O push no `main` que toca `back-end/` publica a
imagem, e o CI abre um **PR de deploy** com o digest novo. É mesclar esse PR que
coloca a versão em produção — se ele ficar parado, a imagem existe e ninguém
está usando.

O site é automático: o que entra no `main` vai para produção. O
`confere-versao-no-ar` avisa se não for, e a página publica no HTML qual commit
está no ar.
