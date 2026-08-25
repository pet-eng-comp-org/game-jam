"use client"

import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import Titulo from "../components/Titulo"
import { Season } from "@/models/Season"

interface Jogo {
  // Opcional de proposito: so o Capybara Airways tem nome proprio conhecido —
  // veio da tela inicial do jogo. Dos outros dois so se sabe a equipe, e
  // inventar titulo seria pior do que nao ter.
  nome?: string
  equipe: string
  participantes: string[]
  // Descricao do jogo, como no mockup. Nem todos tem: onde falta, a coluna
  // mostra os participantes.
  descricao?: string
  link: string
  capa: string
}

interface Temporada {
  numero: string
  jogos: Jogo[]
}

// Os jogos ficam aqui, e nao vem da API, porque a tabela `jogos` esta vazia:
// /seasonsComJogos devolve a season 3 e a season 4 sem nenhum jogo.
//
// TODOS sao servidos pela VM, em /arquivo/<jogo>/. Os tres da season 3 moravam
// em projetos avulsos da Vercel, na conta pessoal do PET; agora estao no mesmo
// lugar que os de 2023, sob o dominio do proprio PET.
//
// As capas sao captura da tela inicial de cada jogo. Nao havia capa em lugar
// nenhum: nem no banco, nem nos repositorios.
//
// Os de 2023 estavam so no GitLab, em repositorio privado e sem lugar onde
// jogar. Agora estao publicados na VM, em /arquivo/<jogo>/ no dominio da API.
// Testei os onze do grupo com navegador: dez rodam. A Lenda de Gabe ficou de
// fora — e Flutter web de build antiga, inicializa e nao desenha nada.
//
// A Lenda de Gabe RODA. Eu tinha dado ele como quebrado duas vezes, e o erro
// era meu: e Flutter com CanvasKit, e eu esperava 15s pelo primeiro quadro
// quando ele precisava de mais de 20 — a maior parte gasta baixando o CanvasKit
// de um CDN. O CanvasKit foi trazido para dentro do jogo (pasta canvaskit/) e
// agora ele pinta em 4s, sem depender do unpkg continuar publicando a versao
// 0.18.1.
//
// O nome da equipe vai SEM o prefixo "Equipe" — ele era invencao da pagina
// antiga. No banco elas estao registradas como "Animal" e "Gaga games", e a
// pagina ja escreve "por X" antes, entao o prefixo repetia a ideia.
//
// SuperPETs e o jogo do PROPRIO PET, e nao de participante — por isso o credito
// vai no lugar do nome da equipe. Ele pertence a season 1 assim mesmo.
//
// Dino, Pong e Flappy Bird tambem sao do PET e por isso NAO aparecem em season
// nenhuma. Continuam servidos em /arquivo/ — a pagina de Materiais vai usa-los
// como exemplo de aprendizado, que e o papel deles.
//
// A edicao de 2023 e a season 2. Isso nao esta em lugar nenhum do codigo nem
// do banco, que so conhece a 3 e a 4 — veio de quem organiza o evento.
const temporadas: Temporada[] = [
  {
    numero: "1",
    jogos: [
      {
        nome: "A Lenda de Gabe",
        equipe: "Gabriel Rezende",
        participantes: [],
        descricao: "Um morador pacífico, que nunca machucou nem mesmo um inseto, acorda para viver apenas mais um dia em sua pacata vila… Ou será que não?",
        link: "https://apigamejam.pet.inf.ufes.br/arquivo/a-lenda-de-gabe/",
        capa: "/jogos/a-lenda-de-gabe.jpg",
      },
      {
        nome: "Glob Fights the King",
        // "HTML" sao as iniciais dos quatro: Henrique, Thiago, Mayke e Luiza.
        // Achado na tela de creditos do proprio jogo.
        equipe: "HTML",
        participantes: [],
        descricao: "Jogo de plataforma que narra a jornada de um slime chamado Glob, que busca resgatar seu raro item das mãos do rei slime.",
        link: "https://apigamejam.pet.inf.ufes.br/arquivo/glob-fights-the-king/",
        capa: "/jogos/glob-fights-the-king.jpg",
      },
    ],
  },
  {
    numero: "2",
    jogos: [
      {
        nome: "Fire Escape",
        // A equipe e BigCapys (Figma da Season 3). A tela inicial do jogo
        // credita Gabriel Braga Ladislau, Nilo Garcia Monteiro e Gabriel Gomes
        // Lima — os integrantes.
        equipe: "BigCapys",
        participantes: [],
        descricao: "Fire Escape é um jogo em que você não pode ficar parado! O prédio está ruindo, e para fugir você deve correr e evitar obstáculos, tentando chegar o mais longe possível.",
        link: "https://apigamejam.pet.inf.ufes.br/arquivo/fire-scape/",
        capa: "/jogos/fire-scape.jpg",
      },
      {
        nome: "GRVTY",
        equipe: "Gamepiece",
        participantes: [],
        descricao: "Nera é uma garota esperançosa e corre destemida pelo mundo ordinário e sem cor. Um mundo com dois lados opostos, em que a vida é refletida como um espelho e a própria gravidade perdeu seu sentido. O que será que ela busca?",
        link: "https://apigamejam.pet.inf.ufes.br/arquivo/grvty/",
        capa: "/jogos/grvty.jpg",
      },
      {
        nome: "Asteroide",
        equipe: "Geladeira Electrolux 382L",
        participantes: [],
        descricao: "Jogo onde você batalha com inimigos e desvia de asteroides.",
        link: "https://apigamejam.pet.inf.ufes.br/arquivo/asteroide/",
        capa: "/jogos/asteroide.jpg",
      },
      {
        nome: "Separados pelo Tempo",
        // A equipe se chama "void 0" — confirmado no banco de 2024, campo
        // games.team. Eu tinha inferido que era bug de JavaScript e creditado
        // os integrantes (Gustavo Nicoletti, Rafael Ferraço, Michael Gabriel,
        // dos creditos do jogo); o nome de equipe e este mesmo.
        equipe: "void 0",
        participantes: [],
        descricao: "Você ficou até tarde jogando Minecraft com seus amigos e acabou acordando em cima da hora para seu primeiro encontro com sua webnamorada. Agora você precisa correr para chegar a tempo!",
        link: "https://apigamejam.pet.inf.ufes.br/arquivo/separados-pelo-tempo/",
        capa: "/jogos/separados-pelo-tempo.jpg",
      },
      {
        nome: "Tarantella",
        equipe: "Playgramadores",
        participantes: [],
        descricao: "Há muito tempo era dito que, se você fosse picado por uma tarântula, a única forma de se curar era dançando a Tarantella, uma dança italiana bem animada. Nosso amigo Francesco foi picado por uma! Ajude ele a não parar de se mexer nesse jogo de ritmo e obtenha a maior pontuação possível.",
        link: "https://apigamejam.pet.inf.ufes.br/arquivo/tarantella/",
        capa: "/jogos/tarantella.jpg",
      },
    ],
  },
  {
    numero: "3",
    jogos: [
      {
        nome: "Capybara Airways",
        equipe: "Capivarinhas",
        participantes: ["André Luiz Siqueira", "Arthur Manelli Riva Souza", "Daniela Souza Pimentel"],
        descricao: "Uma capivara aviadora pilota seu biplano vermelho pelos céus. Voe sem parar, desvie do que vier pela frente e colete o máximo de moedas antes que o tempo acabe.",
        link: "https://apigamejam.pet.inf.ufes.br/arquivo/capybara-airways/",
        capa: "/jogos/capivarinhas.jpg",
      },
      {
        nome: "Calouro",
        equipe: "Gaga Games",
        participantes: ["Letícia Rodrigues", "Daniel Siqueira", "Arthur Maciel"],
        descricao: "Um calouro precisa passar de ano. Corra, pule e ataque pelas plataformas, junte moedas e sobreviva com suas três vidas — no fim, resta descobrir se o veredito é aprovado ou reprovado.",
        link: "https://apigamejam.pet.inf.ufes.br/arquivo/gaga-games/",
        capa: "/jogos/gaga-games.jpg",
      },
      {
        nome: "Tower of Echoes",
        // Nome no banner.png do repositorio petgamejam-gustavo.
        equipe: "Animal",
        participantes: ["Gustavo", "Tarcio", "Marcos"],
        descricao: "Sob a chuva de uma floresta de outono, um guerreiro avança de espada em punho. Corra, use o dash e ataque sem parar para atravessar o caminho e derrotar a Sombra e o Guardião que o aguardam.",
        link: "https://apigamejam.pet.inf.ufes.br/arquivo/equipe-animal/",
        capa: "/jogos/animal.jpg",
      },
    ],
  },
]

export default function Jogos() {

  const [seasonAtual, setSeasonAtual] = useState<Season>()
  // Um CONJUNTO, e nao uma season so: da para deixar varias abertas ao mesmo
  // tempo e comparar edicoes sem ficar fechando uma para ver a outra. Todas
  // comecam fechadas — quem chega escolhe, que e o que o titulo pede.
  const [abertas, setAbertas] = useState<Set<string>>(new Set())

  function alterna(numero: string) {

    setAbertas((atual) => {

      // Copia antes de mexer: mutar o Set existente nao troca a referencia e o
      // React nao redesenha.
      const proximo = new Set(atual)
      proximo.has(numero) ? proximo.delete(numero) : proximo.add(numero)
      return proximo
    })
  }

  async function obtemSeasonAtual() {
    const res = await Season.obtemAtual()
    setSeasonAtual(res)
  }

  useEffect(() => {
    obtemSeasonAtual()
  }, [])

  return (

    <Layout season={seasonAtual}>

      <div className="mx-auto w-[93%] max-w-[1340px] pt-24 pb-10">

        <div className="pl-[93px]">
          <Titulo valor="SELECIONE UMA OPÇÃO:" />
        </div>

        <div className="mt-12">
          {temporadas.map((t) => {

            const estaAberta = abertas.has(t.numero)

            return (
              <div key={t.numero} className="border-b border-destaque-claro">

                <h2>
                  <button
                    type="button"
                    onClick={() => alterna(t.numero)}
                    aria-expanded={estaAberta}
                    aria-controls={`season-${t.numero}`}
                    className="flex w-full items-center pt-[13px] pb-0 pl-[121px] text-left font-secao text-4xl uppercase leading-none text-destaque transition-opacity hover:opacity-80 md:text-5xl"
                  >
                    <span className="md:w-[129px]">Season {t.numero}</span>
                    <span aria-hidden className={`flex w-[26px] shrink-0 items-center justify-center leading-[0] ${estaAberta ? "-translate-y-[2px]" : "-translate-y-[4.5px]"}`}>
                    <svg
                      viewBox="13.3 11.51 15.04 25.99"
                      className={`h-[26px] w-[15px] transition-transform duration-200 ${estaAberta ? "rotate-90" : ""}`}
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M27.7372 25.9513L16.1875 37.501L13.3005 34.6141L23.4068 24.5078L13.3005 14.4016L16.1875 11.5146L27.7372 23.0644C28.1199 23.4472 28.3349 23.9664 28.3349 24.5078C28.3349 25.0492 28.1199 25.5684 27.7372 25.9513Z"
                        fill="currentColor"
                      />
                    </svg>
                    </span>
                  </button>
                </h2>

                {estaAberta && (
                  <ul id={`season-${t.numero}`} className="flex flex-col gap-[70px] pb-14 pt-[68px] pl-[101px]">
                    {t.jogos.map((j) => (
                      <li key={j.link} className="grid gap-[72px] md:grid-cols-[538px_528px] md:items-start">

                        <a
                          href={j.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block rounded-xl outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-destaque"
                        >
                          {/* O link e so a capa. O alt diz o que ele FAZ, e nao
                              o que a imagem mostra: quem usa leitor de tela
                              ouve "Jogar X", que e a acao. */}
                          <img
                            src={j.capa}
                            alt={`Jogar ${j.nome ?? j.equipe}`}
                            className="w-full rounded-xl border border-destaque-claro/20 transition duration-200 group-hover:border-destaque group-hover:brightness-110 md:h-[421px] md:object-cover"
                            loading="lazy"
                          />
                        </a>

                        <div className="md:pt-[66px]">
                          <h3 className="text-2xl font-bold text-destaque md:text-[34px] md:leading-[42px]">{j.nome ?? j.equipe}</h3>
                          {j.nome && j.equipe && <p className="mt-[6px] font-bold md:text-[29px] md:leading-[35px]">por {j.equipe}</p>}
                          {j.descricao
                            ? <p className="mt-[32px] text-base md:text-[29px] md:leading-[35px]">{j.descricao}</p>
                            : j.participantes.length > 0 && <p className="mt-[32px] text-base md:text-[29px] md:leading-[35px]">{j.participantes.join(" · ")}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
