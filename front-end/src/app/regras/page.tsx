import type { Metadata } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import Titulo from "../components/Titulo";
import TituloSecao from "../components/TituloSecao";
import { LISTA, PAGINA, SECAO, TEXTO } from "../components/estilo";
import { DIAS, EMAILS, horario, linguagensPorExtenso, LOCAL, NOME, quando, salasPorDia } from "@/lib/edicao";

export const metadata: Metadata = {
  title: "Regras",
  description: "A programação dos três dias do Game Jam 26, com horário e sala, a inscrição por e-mail e as linguagens do workshop.",
};

const SECAO_REGRAS = `${SECAO} mb-5`;
const LINK = "text-destaque underline";

// A programacao e as regras do Game Jam 26 vem de src/lib/edicao.ts (dias,
// salas, e-mails) e do documento do Bernardo de 12/11/2026 (o resto do texto).
export default function Regras() {
  return (
    <Layout>

      <div className={PAGINA}>

        <Titulo valor="regras" />

        <p className={`mt-10 ${TEXTO}`}>
          O {NOME} tem três dias, todos no {LOCAL}. A participação é voluntária e não há
          premiação.
        </p>

        {/* "formato" e o endereco que a pagina Jogos usa ("veja como funciona"). */}
        <TituloSecao id="formato" valor="Programação" className={`${SECAO_REGRAS} scroll-mt-24`} />
        <ul className="grid gap-4 sm:grid-cols-3">
          {DIAS.map((d) => (
            <li key={d.numero} className="rounded-2xl border border-white/10 bg-barra p-5">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-destaque-claro/80">Dia {d.numero}</p>
              <p className="mt-1 text-lg font-bold text-destaque first-letter:uppercase">{quando(d)}</p>
              <p className="mt-3 text-lg font-bold">{d.atividade}</p>
              <p className="mt-2 text-base text-destaque-claro first-letter:uppercase">{horario(d)}</p>
              <p className="text-base text-destaque-claro">{d.sala}</p>
              {d.detalhe && <p className="mt-2 text-base text-destaque-claro">{d.detalhe}</p>}
            </li>
          ))}
        </ul>

        <TituloSecao valor="O workshop de programação de tanques" className={SECAO_REGRAS} />
        <ul className={LISTA}>
          <li>Cada pessoa programa o próprio tanque para cumprir os desafios das fases de treino, em blocos de movimento, mira e sobrevivência.</li>
          <li>Você ganha um balão por fase cumprida e recebe uma dica em cada tentativa.</li>
          <li>Depois de cada envio, a tela mostra como o seu tanque reagiu.</li>
          <li>Você programa em {linguagensPorExtenso()}; basta saber o básico.</li>
          <li>Não precisa levar nada: o workshop usa os computadores do laboratório, que muda de um dia para o outro ({salasPorDia(DIAS.filter((d) => d.sala.startsWith("Lab")))}).</li>
        </ul>

        <TituloSecao valor="Inscrição" className={SECAO_REGRAS} />
        <ul className={LISTA}>
          <li>
            A inscrição é por pessoa e só por e-mail, até a véspera do dia em que você vai,
            com o seu nome e os dias.{" "}
            <Link href="/inscricao" className={LINK}>Como se inscrever</Link>.
          </li>
          <li>Quem aparecer sem avisar participa se houver computador livre.</li>
        </ul>

        <TituloSecao valor="Quem pode participar" className={SECAO_REGRAS} />
        <p className={TEXTO}>
          Pode participar qualquer pessoa, de dentro ou de fora da Ufes. Quem tem menos de 18
          anos se inscreve com o conhecimento de um responsável.
        </p>

        <TituloSecao valor="Dúvidas" className={SECAO_REGRAS} />
        <p className={TEXTO}>
          Escreva para{" "}
          <a href={`mailto:${EMAILS[0]}`} className={LINK}>{EMAILS[0]}</a> ou{" "}
          <a href={`mailto:${EMAILS[1]}`} className={LINK}>{EMAILS[1]}</a>, ou fale com o PET
          pelo Instagram{" "}
          <a href="https://www.instagram.com/petengcomp/" target="_blank" rel="noopener noreferrer" className={LINK}>
            @petengcomp
          </a>.
        </p>
      </div>
    </Layout>
  );
}
