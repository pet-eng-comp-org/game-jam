import { DIAS, FIM, INICIO, LOCAL, NOME } from "@/lib/edicao"

// Marcacao de evento (schema.org) que o Google le para mostrar o Game Jam em
// destaque na busca, com data e local.
const BASE = "https://gamejam.pet.inf.ufes.br"

// Endereco do campus de Goiabeiras, onde fica o CT.
const UFES = {
  "@type": "PostalAddress",
  streetAddress: "Av. Fernando Ferrari, 514, Goiabeiras",
  addressLocality: "Vitória",
  addressRegion: "ES",
  postalCode: "29075-910",
  addressCountry: "BR",
}

const LUGAR = { "@type": "Place", name: LOCAL, address: UFES }
const ORGANIZADOR = { "@type": "Organization", name: "PET Engenharia de Computação da Ufes", url: "https://pet.inf.ufes.br" }

// Depois do evento, a inscricao aparece como encerrada.
export default function EventoParaBusca({ acabou }: { acabou: boolean }) {
  const dados = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `PET ${NOME}`,
    description: "Três dias de evento do PET Engenharia de Computação da Ufes: campeonato de Super Smash Bros. Ultimate e workshop de programação de tanques.",
    startDate: INICIO,
    endDate: FIM,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    location: LUGAR,
    image: [`${BASE}/og.png`],
    url: BASE,
    organizer: ORGANIZADOR,
    // Cada dia tambem como evento, com a sala dele.
    subEvent: DIAS.map((d) => ({
      "@type": "Event",
      name: `${NOME} · Dia ${d.numero}: ${d.atividade}`,
      startDate: d.inicio,
      ...(!d.fimEstimado && { endDate: d.fim }),
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: { ...LUGAR, name: `${d.sala}, ${LOCAL}` },
      organizer: ORGANIZADOR,
    })),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
      url: `${BASE}/inscricao`,
      availability: acabou ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, "\\u003c") }} />
}
