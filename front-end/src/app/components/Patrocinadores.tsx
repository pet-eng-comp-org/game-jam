import type { PatrocinadorJson } from "@/models/api";

// A faixa de logos dos patrocinadores, na pagina inicial e em /apoio. Quem
// chama decide o que mostrar sem patrocinador: a inicial esconde a secao e
// /apoio diz que serao divulgados em breve. Os espacos "Sua marca aqui" ficam
// na apresentacao a empresas, nao no site publico (decisao de 07/10/2026).
export default function Patrocinadores({ lista }: { lista: Pick<PatrocinadorJson, "id" | "nome" | "logo">[] }) {

  return (
    <div className="flex flex-wrap items-center gap-10">
      {lista.map((p) => (
        <img key={p.id} src={p.logo} alt={p.nome} className="h-30 w-auto max-w-full object-contain" />
      ))}
    </div>
  );
}
