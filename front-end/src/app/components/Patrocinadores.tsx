import type { PatrocinadorJson } from "@/models/api";

// A faixa de logos dos patrocinadores, na pagina inicial e em /patrocinadores.
// Quem chama decide o que mostrar sem patrocinador: a inicial esconde a secao e
// a pagina diz que serao divulgados em breve. Os espacos "Sua marca aqui" ficam
// na apresentacao a empresas, nao no site publico (decisao de 07/10/2026).
//
// Cada logo num cartao claro do mesmo tamanho: o fundo do site e azul escuro e
// a maioria das logos de empresa e feita para fundo branco; no azul, sumiriam.
// Com site cadastrado, a logo leva ate ele (rel="sponsored", como pede o
// Google para link de patrocinio).
const CARTAO = "flex h-28 w-full items-center justify-center rounded-lg bg-white p-4 sm:w-56";

export default function Patrocinadores({ lista }: { lista: Pick<PatrocinadorJson, "id" | "nome" | "logo" | "site">[] }) {

  return (
    <ul className="flex flex-wrap gap-6">
      {lista.map((p) => {
        const logo = <img src={p.logo} alt={p.nome} className="max-h-full max-w-full object-contain" />;
        return (
          <li key={p.id} className="w-full sm:w-auto">
            {p.site ? (
              <a
                href={p.site}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className={`${CARTAO} transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-destaque`}
              >
                {logo}
                <span className="sr-only"> (abre o site em outra aba)</span>
              </a>
            ) : (
              <div className={CARTAO}>{logo}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
