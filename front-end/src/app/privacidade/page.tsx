import type { Metadata } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import Titulo from "../components/Titulo";
import TituloSecao from "../components/TituloSecao";
import { PAGINA, TEXTO } from "../components/estilo";
import { EMAILS, NOME } from "@/lib/edicao";

export const metadata: Metadata = {
  title: "Privacidade",
  description: "O que o Game Jam faz com os dados da inscrição: o que pedimos, quem vê e como pedir a exclusão.",
};

// Aviso de privacidade da inscricao (LGPD): o que se coleta, para que, quem
// ve, por quanto tempo e como pedir exclusao. Cada frase aqui corresponde ao
// que o sistema faz de fato; mudou a inscricao ou o painel, muda aqui.
export default function Privacidade() {
  return (
    <Layout>
      <div className={PAGINA}>
        <Titulo valor="privacidade" />

        <p className={`mt-6 ${TEXTO}`}>
          O Game Jam é organizado pelo PET Engenharia de Computação da Ufes, que é quem
          cuida dos dados da inscrição. Esta página explica o que pedimos e por quê.
        </p>

        <TituloSecao valor="O que pedimos" className="mb-4 mt-14" />
        <p className={TEXTO}>
          No {NOME}, a inscrição é por e-mail: pedimos o seu <strong>nome</strong> e os{" "}
          <strong>dias</strong> em que você vai, para organizar os computadores de cada sala.
          Junto vem o seu <strong>endereço de e-mail</strong>, que usamos para responder e
          para avisos sobre o evento.
        </p>

        <TituloSecao valor="Quem vê" className="mb-4 mt-14" />
        <p className={TEXTO}>
          Só a organização do Game Jam, que lê os e-mails de inscrição nas caixas{" "}
          {EMAILS[0]} e {EMAILS[1]}. Nenhum dado de participante aparece nas páginas
          públicas. Os dados não são vendidos nem entregues a mais ninguém.
        </p>

        <TituloSecao valor="Quem se inscreveu pelo formulário" className="mb-4 mt-14" />
        <p className={TEXTO}>
          Antes da inscrição por e-mail, o site tinha um formulário. Quem se inscreveu por
          ele nos passou o nome da equipe e, de cada participante, nome, e-mail, curso, se
          estuda na Ufes, a instituição de ensino e, se quis, o gênero. Esses dados ficam
          num servidor do PET, na Ufes, e só a organização os vê, pelo painel do site, que
          exige login. Guardamos para a organização e o histórico das edições, até que você
          peça a exclusão.
        </p>

        <TituloSecao valor="Seus direitos" className="mb-4 mt-14" />
        <p className={TEXTO}>
          Você pode pedir para ver, corrigir ou apagar os seus dados a qualquer momento,
          escrevendo para{" "}
          <a href={`mailto:${EMAILS[1]}`} className="text-destaque underline">{EMAILS[1]}</a>. Quem
          tem menos de 18 anos deve se inscrever com o conhecimento de um responsável.
        </p>

        <p className={`mt-14 ${TEXTO}`}>
          <Link href="/inscricao" className="text-destaque underline">Como se inscrever</Link>
        </p>
      </div>
    </Layout>
  );
}
