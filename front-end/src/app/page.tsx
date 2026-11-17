import Link from "next/link";
import Layout from "./components/Layout";
import TituloSecao from "./components/TituloSecao";
import { APOS_TITULO, PAGINA, SECAO, TEXTO } from "./components/estilo";
import Contagem from "./components/Contagem";
import CasaDosFantasmas from "./components/CasaDosFantasmas";
import JogoNaPagina from "./components/JogoNaPagina";
import SalvarNaAgenda from "./components/SalvarNaAgenda";
import EventoParaBusca from "./components/EventoParaBusca";
import IconePixel from "./components/IconePixel";
import FaixaPatrocinadores from "./components/Patrocinadores";
import { patrocinadores } from "@/lib/conteudo";
import { jaPassou } from "@/lib/datas";
import { DIAS, EMAILS, FIM, INICIO, linguagensPorExtenso, LOCAL, NOME, quando } from "@/lib/edicao";

export default async function Home() {

  const apoio = await patrocinadores();
  const comecou = jaPassou(INICIO);

  return (

    <Layout>
      <EventoParaBusca />

      <div className={PAGINA}>

        {/* Abertura: quem chega sabe na hora que e o Game Jam 26, quanto falta,
            quando e onde. A inscricao fica no botao da barra, sempre visivel. */}
        <section className="text-center">
          <h1 className="text-balance font-secao text-5xl uppercase leading-none text-destaque md:text-7xl">
            {comecou ? NOME : `O ${NOME} começa em`}
          </h1>
          {/* O que e, antes de rolar: sem esta linha, a primeira tela do celular
              so tinha o titulo, a contagem e a data. */}
          <p className="mt-4 text-balance text-xl text-destaque-claro">
            Campeonato de Mortal Kombat e workshop de programação de tanques
          </p>
          <div className="mt-8">
            {/* No primeiro dia, a porta abre e os fantasmas saem. A pagina e
                gerada de novo a cada poucos minutos, entao a abertura acompanha. */}
            <CasaDosFantasmas aberta={comecou}>
              <Contagem inicio={INICIO} fim={FIM} nome={NOME} aviso={`O ${NOME} começa na ${quando(DIAS[0])}, às 14h.`} />
            </CasaDosFantasmas>
          </div>
          {/* Quando e onde, como informacao do evento. Tocar no local abre o
              mapa: quem vem de fora nao sabe onde fica o CT. A sala muda de um
              dia para o outro, entao vai logo abaixo. */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-lg">
            <span className="flex items-center gap-2">
              <IconePixel qual="calendario" className="h-4 w-4 text-destaque" />
              1 a 3 de dezembro, a partir das 14h
            </span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${LOCAL}, Vitória - ES`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 underline decoration-destaque/50 underline-offset-4 hover:text-destaque"
            >
              <IconePixel qual="local" className="h-[18px] w-[14px] text-destaque" />
              {LOCAL}
            </a>
          </div>
          <p className="mt-2 text-base text-destaque-claro">
            Sala do PET no Dia 1, Lab 4 no Dia 2 e Lab 2 no Dia 3.
          </p>
          {!jaPassou(FIM) && <SalvarNaAgenda className="mt-4 text-sm md:text-base" />}
        </section>

        {/* Aqui fica o convite; a programacao de cada dia, com horario e sala,
            e da pagina Regras. */}
        <section className={SECAO}>
          <TituloSecao valor="O que é o Game Jam" />
          <p className={`${APOS_TITULO} ${TEXTO}`}>
            São três dias de evento do PET Engenharia de Computação da Ufes. No Dia 1 tem
            campeonato de Mortal Kombat, com chaveamento decidido na hora. Nos Dias 2 e 3 tem
            o workshop de programação: cada pessoa programa um tanque para cumprir os desafios
            das fases de treino e vê na tela como ele reage a cada envio. A participação é
            voluntária e não há premiação.
          </p>
          {/* Sem este aviso, os jogos das outras edicoes (em /jogos) pareciam o
              que se faz no evento. */}
          <p className={`mt-4 ${TEXTO}`}>
            Nas três primeiras edições, o Game Jam era uma maratona de algumas semanas em que
            cada equipe criava um jogo do zero, sobre um tema. Os jogos criados nessas edições
            estão em{" "}
            <Link href="/jogos" className="text-destaque underline">Jogos</Link>.
          </p>
        </section>

        <section className={SECAO}>
          <TituloSecao valor="Como participar" />
          <p className={`${APOS_TITULO} ${TEXTO}`}>
            Não precisa levar nada: usamos os computadores das salas. A inscrição é por
            pessoa: para garantir seu lugar, escreva para {EMAILS[0]} ou {EMAILS[1]} até a
            véspera do dia em que você vai, com seu nome e os dias. Quem aparecer no dia sem
            avisar participa se houver computador livre.
          </p>
          <p className={`mt-4 ${TEXTO}`}>
            No workshop, basta saber o básico de programação em {linguagensPorExtenso()}. O
            evento é gratuito e aberto ao público, de dentro ou de fora da Ufes.
          </p>
          <p className={`mt-4 ${TEXTO}`}>
            A programação de cada dia e as linguagens estão nas{" "}
            <Link href="/regras" className="text-destaque underline">Regras</Link>.
          </p>
          {/* A acao da secao: a pagina de inscricao abre o e-mail pronto e mostra
              os enderecos para copiar. */}
          <Link href="/inscricao"
            className="mt-8 inline-block rounded-full bg-destaque px-7 py-4 text-lg font-bold text-barra transition-opacity hover:opacity-90">
            Inscreva-se
          </Link>
        </section>

        {/* O labirinto com GAME JAM nas paredes, como o Google fez com o nome
            dele no Doodle dos 30 anos do Pac-Man. Fica depois do que importa
            (data, inscricao), para nao disputar com isso. */}
        <section className={SECAO}>
          <TituloSecao valor={`Enquanto o ${NOME} não começa`} />
          <p className={`${APOS_TITULO} ${TEXTO}`}>
            Uma partida de Pac-Man no labirinto do Game Jam. No computador, use as setas ou
            WASD; no celular, deslize o dedo ou toque para onde quer ir.
          </p>
          <div className="mt-8">
            <JogoNaPagina />
          </div>
        </section>

        {/* As marcas dos patrocinadores, no fim da pagina: a secao so aparece
            quando ha patrocinador cadastrado. */}
        {apoio.length > 0 && (
          <section className={SECAO}>
            <TituloSecao valor="Patrocinadores" />
            <div className="mt-8">
              <FaixaPatrocinadores lista={apoio} />
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
