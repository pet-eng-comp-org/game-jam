import type { MetadataRoute } from "next";

// As paginas publicas, para o Google achar todas sem depender dos links.
const BASE = "https://gamejam.pet.inf.ufes.br";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/inscricao`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/regras`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/jogos`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/materiais`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/apoio`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/privacidade`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
