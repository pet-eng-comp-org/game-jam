import { linkGoogleAgenda } from "@/lib/agenda"
import { DIAS } from "@/lib/edicao"

// "Salvar no Google Agenda: Dia 1 · Dia 2 · Dia 3 · outros calendários". Um
// link por dia porque o do Google so leva um evento, e a pessoa pode ir num
// dia so; o .ics leva os tres, para o iPhone e o resto.
const LINK = "whitespace-nowrap text-destaque underline underline-offset-4"

export default function SalvarNaAgenda({ className }: { className?: string }) {
  return (
    <p className={`text-base text-destaque-claro ${className ?? ""}`}>
      Salvar no Google Agenda:{" "}
      {DIAS.map((d) => (
        <span key={d.numero}>
          <a href={linkGoogleAgenda(d)} target="_blank" rel="noopener noreferrer" className={LINK}>
            Dia {d.numero}
          </a>
          <span aria-hidden> · </span>
        </span>
      ))}
      <a href="/agenda.ics" download className={LINK}>
        outros calendários
      </a>
    </p>
  )
}
