import type { MetadataRoute } from "next";

// O Google le isto antes de tudo: pode indexar o site, menos o painel e as
// rotas internas, e o mapa das paginas esta em /sitemap.xml.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/login", "/api/"] },
    sitemap: "https://gamejam.pet.inf.ufes.br/sitemap.xml",
  };
}
