import type { Metadata } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import Titulo from "../components/Titulo";
import TituloSecao from "../components/TituloSecao";
import { LISTA, PAGINA, TEXTO } from "../components/estilo";

export const metadata: Metadata = { title: "Privacidade" };

const EMAIL = "petengcomp@inf.ufes.br";

// Aviso de privacidade da inscricao (LGPD): o que se coleta, para que, quem
// ve, por quanto tempo e como pedir exclusao. Cada frase aqui corresponde ao
// que o sistema faz de fato; mudou o formulario ou o painel, muda aqui.
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
        <ul className={LISTA}>
          <li><strong>Nome da equipe</strong> e, de cada participante, <strong>nome</strong> e <strong>e-mail</strong>: para organizar o evento e falar com a equipe.</li>
          <li><strong>Curso, se estuda na Ufes e a instituição de ensino</strong>: para saber quem participa e de onde.</li>
          <li><strong>Gênero</strong>: para acompanhar a diversidade de quem participa. Dá para responder &quot;Prefiro não informar&quot;.</li>
        </ul>

        <TituloSecao valor="Quem vê" className="mb-4 mt-14" />
        <p className={TEXTO}>
          Só a organização do Game Jam, pelo painel do site, que exige login. Nenhum dado de
          participante aparece nas páginas públicas. Os dados não são vendidos nem
          entregues a mais ninguém.
        </p>

        <TituloSecao valor="Onde e por quanto tempo" className="mb-4 mt-14" />
        <p className={TEXTO}>
          Os dados ficam num servidor do PET, na Ufes, guardados para a organização e o
          histórico das edições, até que você peça a exclusão.
        </p>

        <TituloSecao valor="E-mails" className="mb-4 mt-14" />
        <p className={TEXTO}>
          Depois da inscrição, a equipe recebe um e-mail de confirmação. O e-mail também pode
          ser usado para avisos sobre a edição em que você se inscreveu.
        </p>

        <TituloSecao valor="Seus direitos" className="mb-4 mt-14" />
        <p className={TEXTO}>
          Você pode pedir para ver, corrigir ou apagar os seus dados a qualquer momento,
          escrevendo para{" "}
          <a href={`mailto:${EMAIL}`} className="text-destaque underline">{EMAIL}</a>. Quem
          tem menos de 18 anos deve se inscrever com o conhecimento de um responsável.
        </p>

        <p className={`mt-14 ${TEXTO}`}>
          <Link href="/inscricao" className="text-destaque underline">Voltar para a inscrição</Link>
        </p>
      </div>
    </Layout>
  );
}
