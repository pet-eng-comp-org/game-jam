import type { Metadata } from "next";
import Layout from "../components/Layout";
import { numeros, patrocinadores, seasonAtual } from "@/lib/conteudo";
import Titulo from "../components/Titulo";
import TituloSecao from "../components/TituloSecao";
import { APOS_TITULO, PAGINA, SECAO, TEXTO } from "../components/estilo";
import { diaEHora, jaPassou } from "@/lib/datas";

export const metadata: Metadata = {
  title: "Patrocinadores",
  description: "Quem apoia o Game Jam, a competição de programação do PET Engenharia de Computação da Ufes, e como apoiar.",
};

const CONTATO = "petengcomp@inf.ufes.br";

export default async function Patrocinadores() {

  const [lista, n, season] = await Promise.all([patrocinadores(), numeros(), seasonAtual()]);
  const proxima = season?.dataEvento && !jaPassou(season.dataEvento) ? season : null;

  // Os numeros vem do banco (GET /numeros): a pagina nao envelhece quando uma
  // edicao termina. Sem a API no build, a secao sai so com o texto.
  const destaques = [
    n?.ultima && { valor: n.ultima.quantasEquipes, rotulo: `equipes na Season ${n.ultima.numero}${n.ultima.ano ? ` (${n.ultima.ano})` : ""}` },
    n?.ultima && { valor: n.ultima.quantasPessoas, rotulo: "pessoas inscritas nessa edição" },
    n?.ultima && n.ultima.deFora > 0 && { valor: n.ultima.deFora, rotulo: "delas de fora da Ufes: Ifes, outras faculdades e escolas de ensino médio" },
    n && n.edicoes > 0 && { valor: n.edicoes, rotulo: n.edicoes === 1 ? "edição" : "edições, desde 2021" },
  ].filter(Boolean) as { valor: number; rotulo: string }[];

  const assunto = encodeURIComponent(`Patrocínio do Game Jam${season ? ` Season ${season.numero}` : ""}`);

  return (

    <Layout>

      <div className={PAGINA}>

        <Titulo valor="patrocinadores" />

        {lista.length > 0 ? (
          <div className="mt-14 flex flex-wrap items-center gap-10">
            {lista.map((p) => (
              <img
                key={p.id}
                src={p.logo}
                alt={p.nome}
                className="h-30 w-auto object-contain"
              />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-lg">Os patrocinadores desta edição serão divulgados em breve.</p>
        )}

        <section className={SECAO}>
          <TituloSecao valor="Seja patrocinador" />
          <p className={`${APOS_TITULO} ${TEXTO}`}>
            O Game Jam é organizado pelos estudantes do PET Engenharia de Computação da Ufes,
            é gratuito e aberto a qualquer pessoa. Em um único dia, cada equipe resolve um
            desafio de programação revelado na hora, com tempo contado.
            {proxima && ` A Season ${proxima.numero} acontece ${diaEHora(proxima.dataEvento!, true)}${proxima.local ? `, no ${proxima.local}` : ""}.`}
          </p>

          {destaques.length > 0 && (
            <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {destaques.map((d) => (
                <div key={d.rotulo} className="flex flex-col-reverse justify-end">
                  <dt className="mt-1 max-w-[32ch] text-base leading-snug">{d.rotulo}</dt>
                  <dd className="font-secao text-8xl leading-[0.75] md:text-9xl text-destaque">{d.valor}</dd>
                </div>
              ))}
            </dl>
          )}

          <p className={`mt-10 ${TEXTO}`}>
            A marca de quem apoia aparece nesta página, que todo mundo que se inscreve
            visita. Para conversar sobre formas de apoio, escreva para{" "}
            <a href={`mailto:${CONTATO}?subject=${assunto}`} className="text-destaque underline">{CONTATO}</a>.
          </p>
        </section>
      </div>
    </Layout>
  );
}
