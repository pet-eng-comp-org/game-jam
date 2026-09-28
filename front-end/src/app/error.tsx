"use client";

import Link from "next/link";
import Personagem from "./components/Personagem";
import { TEXTO } from "./components/estilo";

// Erro ao montar uma pagina (a API fora do ar, por exemplo). Componente de
// cliente, como o Next exige, e por isso sem a barra e o rodape: eles buscam
// os patrocinadores no servidor. O detalhe do erro fica no log do servidor;
// aqui so o que a pessoa pode fazer.
export default function Erro({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-fundo px-6 text-center">
      <Personagem qual="vermelho" className="h-16 w-16 md:h-20 md:w-20" />
      <h1 className="mt-8 text-balance font-secao text-5xl uppercase leading-none text-destaque md:text-7xl">
        Não deu para abrir a página
      </h1>
      <p className={`mt-6 ${TEXTO}`}>
        O site teve um problema para carregar agora. Tente de novo em alguns instantes.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-full bg-destaque px-8 py-3 text-lg font-bold text-barra transition-opacity hover:opacity-90"
        >
          Tentar de novo
        </button>
        <Link href="/" className="text-lg text-destaque underline underline-offset-4">
          Ir para o início
        </Link>
      </div>
    </main>
  );
}
