import type { Metadata } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import Titulo from "../components/Titulo";
import TituloSecao from "../components/TituloSecao";

export const metadata: Metadata = { title: "Privacidade · PET Game Jam" };

const LISTA = "list-disc space-y-3 pl-[24px] text-lg leading-8";
const PARAGRAFO = "text-lg leading-8";
const EMAIL = "petengcomp@inf.ufes.br";

// Aviso de privacidade da inscricao (LGPD): o que se coleta, para que, quem
// ve, por quanto tempo e como pedir exclusao. Cada frase aqui corresponde ao
// que o sistema faz de fato; mudou o formulario ou o painel, muda aqui.
export default function Privacidade() {
  return (
    <Layout>
      <div className="mx-auto w-[80%] max-w-[1154px] pt-[98px] pb-24">
        <Titulo valor="PRIVACIDADE" />

        <p className={`mt-[30px] ${PARAGRAFO}`}>
          O Game Jam é organizado pelo PET Engenharia de Computação da Ufes, que é quem
          cuida dos dados da inscrição. Esta página explica o que pedimos e por quê.
        </p>

        <TituloSecao valor="O que pedimos" className="mt-[35px] mb-[13px]" />
        <ul className={LISTA}>
          <li><strong>Nome da equipe</strong> e, de cada participante, <strong>nome</strong> e <strong>e-mail</strong>: para organizar o evento e falar com a equipe.</li>
          <li><strong>CPF</strong>: só para emitir o certificado de participação, feito pela Pró-Reitoria de Extensão (Proex) da Ufes.</li>
          <li><strong>Curso, se estuda na Ufes e a instituição de ensino</strong>: para saber quem participa e de onde.</li>
          <li><strong>Gênero</strong>: para acompanhar a diversidade de quem participa. Dá para responder &quot;Prefiro não informar&quot;.</li>
        </ul>

        <TituloSecao valor="Quem vê" className="mt-[35px] mb-[13px]" />
        <p className={PARAGRAFO}>
          Só a organização do Game Jam, pelo painel do site, que exige login. Nenhum dado de
          participante aparece nas páginas públicas. Para o certificado, nome e CPF são
          repassados à Proex. Os dados não são vendidos nem entregues a mais ninguém.
        </p>

        <TituloSecao valor="Onde e por quanto tempo" className="mt-[35px] mb-[13px]" />
        <p className={PARAGRAFO}>
          Os dados ficam num servidor do PET, na Ufes. O <strong>CPF é apagado</strong> depois
          que os certificados da edição são emitidos. Os demais dados ficam guardados para a
          organização e o histórico das edições, até que você peça a exclusão.
        </p>

        <TituloSecao valor="E-mails" className="mt-[35px] mb-[13px]" />
        <p className={PARAGRAFO}>
          Depois da inscrição, a equipe recebe um e-mail de confirmação. O e-mail também pode
          ser usado para avisos sobre a edição em que você se inscreveu.
        </p>

        <TituloSecao valor="Seus direitos" className="mt-[35px] mb-[13px]" />
        <p className={PARAGRAFO}>
          Você pode pedir para ver, corrigir ou apagar os seus dados a qualquer momento,
          escrevendo para{" "}
          <a href={`mailto:${EMAIL}`} className="text-destaque underline">{EMAIL}</a>. Quem
          tem menos de 18 anos deve se inscrever com o conhecimento de um responsável.
        </p>

        <p className={`mt-[35px] ${PARAGRAFO}`}>
          <Link href="/inscricao" className="text-destaque underline">Voltar para a inscrição</Link>
        </p>
      </div>
    </Layout>
  );
}
