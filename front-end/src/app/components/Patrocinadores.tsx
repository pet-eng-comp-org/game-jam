import type { PatrocinadorJson } from "@/models/api";

// A faixa de logos dos patrocinadores, na pagina inicial e em /apoio. Sem
// patrocinador cadastrado, mostra espacos reservados no tamanho de uma logo:
// a organizacao apresenta o Game Jam a empresas e precisa de um lugar no site
// para apontar "e aqui que a sua marca fica". Quando a primeira logo entra pelo
// painel, os espacos somem.
const RESERVADOS = 3;

export default function Patrocinadores({ lista }: { lista: Pick<PatrocinadorJson, "id" | "nome" | "logo">[] }) {

  if (lista.length > 0) {
    return (
      <div className="flex flex-wrap items-center gap-10">
        {lista.map((p) => (
          <img key={p.id} src={p.logo} alt={p.nome} className="h-30 w-auto object-contain" />
        ))}
      </div>
    );
  }

  return (
    <ul className="flex flex-wrap gap-6" aria-label="Espaços para patrocinadores">
      {Array.from({ length: RESERVADOS }, (_, i) => (
        <li
          key={i}
          className="flex h-30 w-full items-center justify-center rounded-lg border-2 border-dashed border-destaque/50 text-lg text-destaque-claro sm:w-60"
        >
          Sua marca aqui
        </li>
      ))}
    </ul>
  );
}
