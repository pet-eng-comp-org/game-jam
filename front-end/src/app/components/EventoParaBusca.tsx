import type { SeasonJson } from "@/models/api"

// Marcacao de evento (schema.org) que o Google le para mostrar a competicao
// em destaque na busca, com data e local. So existe com data definida.
const BASE = "https://gamejam.pet.inf.ufes.br"

// Endereco do campus de Goiabeiras, onde fica o CT. So entra quando o local
// cita a Ufes: se um dia o evento for em outro lugar, melhor sem endereco do
// que com o errado.
const UFES = {
  "@type": "PostalAddress",
  streetAddress: "Av. Fernando Ferrari, 514, Goiabeiras",
  addressLocality: "Vitória",
  addressRegion: "ES",
  postalCode: "29075-910",
  addressCountry: "BR",
}

export default function EventoParaBusca({ season }: { season: SeasonJson | null }) {
  if (!season?.dataEvento) return null

  const dados = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `PET Game Jam · Season ${season.numero}`,
    description: "Competição de programação em equipes, em um único dia, organizada pelo PET Engenharia de Computação da Ufes.",
    startDate: season.dataEvento,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    ...(season.local && {
      location: {
        "@type": "Place",
        name: season.local,
        ...(/ufes/i.test(season.local) && { address: UFES }),
      },
    }),
    image: [`${BASE}/og.png`],
    url: BASE,
    organizer: { "@type": "Organization", name: "PET Engenharia de Computação da Ufes", url: "https://pet.inf.ufes.br" },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
      url: `${BASE}/inscricao`,
      // Antes de abrir e "em pre-venda", nao "esgotado".
      availability: {
        abertas: "https://schema.org/InStock",
        antes: "https://schema.org/PreOrder",
        encerradas: "https://schema.org/SoldOut",
        "sem-data": "https://schema.org/PreOrder",
      }[season.situacaoInscricoes],
      ...(season.inscricoesAbrem && { validFrom: season.inscricoesAbrem }),
    },
  }

  // O local vem do painel: "<" escapado para o texto nunca fechar o script.
  const json = JSON.stringify(dados).replace(/</g, "\\u003c")
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
