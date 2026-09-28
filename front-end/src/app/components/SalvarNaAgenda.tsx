import { linkGoogleAgenda, type EventoAgenda } from "@/lib/agenda"

// "Salvar na agenda: Google Agenda · outros calendários". Dois links porque o
// app do Android nao importa .ics, e o iPhone nao usa o Google Agenda.
export default function SalvarNaAgenda({ evento, className }: { evento: EventoAgenda; className?: string }) {
  return (
    <p className={`text-base text-destaque-claro ${className ?? ""}`}>
      Salvar na agenda:{" "}
      <a href={linkGoogleAgenda(evento)} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap text-destaque underline underline-offset-4">
        Google Agenda
      </a>
      <span aria-hidden> · </span>
      <a href="/agenda.ics" download className="whitespace-nowrap text-destaque underline underline-offset-4">
        outros calendários
      </a>
    </p>
  )
}
