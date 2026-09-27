// Conteudo das paginas publicas, buscado no SERVIDOR do Next (nao no navegador):
// a pagina ja sai pronta, com o texto, e fica em cache por 5 minutos. Se a API
// cair, a pagina continua com a ultima versao boa; se nunca houve versao boa
// (o build do CI, sem API), sai o texto de "em breve" e a proxima visita tenta
// de novo. Salvar no painel refaz na hora (app/api/revalida).
import "server-only";
import type { JogoJson, MaterialJson, PatrocinadorJson, SeasonComJogosJson, SeasonJson } from "@/models/api";

export const TAG_CONTEUDO = "conteudo";

// API_URL_INTERNA e lida em execucao: na VM, o nome da API na rede do Docker.
// Fora dela (desenvolvimento, e2e), o mesmo endereco que o navegador usa.
const base = () => process.env.API_URL_INTERNA || process.env.NEXT_PUBLIC_API_URL;

async function busca<T>(caminho: string): Promise<T | null> {
  try {
    const r = await fetch(`${base()}${caminho}`, { next: { revalidate: 300, tags: [TAG_CONTEUDO] } });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

export const seasonAtual = () => busca<SeasonJson | null>("/seasons/atual");
export const materiais = async () => (await busca<MaterialJson[]>("/material")) ?? [];
// A API monta o endereco do logo com o host que recebeu a requisicao. Buscado
// pela rede interna, ele sairia "http://game-jam-api:3333/...", que o navegador
// do visitante nao alcanca: troca pelo endereco publico.
export const patrocinadores = async () =>
  ((await busca<PatrocinadorJson[]>("/patrocinador")) ?? []).map((p) => {
    const interno = process.env.API_URL_INTERNA;
    const publico = process.env.NEXT_PUBLIC_API_URL;
    return interno && publico && p.logo.startsWith(interno) ? { ...p, logo: publico + p.logo.slice(interno.length) } : p;
  });
export const seasonsComJogos = async () => (await busca<SeasonComJogosJson[]>("/seasonsComJogos")) ?? [];
export type { JogoJson };

const fuso = "America/Sao_Paulo";

// "15 de novembro de 2026", no fuso de Vitoria.
export function dataPorExtenso(iso: string | null | undefined) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: fuso });
}

// "10/10/2026 às 09:00".
export function dataEHora(iso: string | null | undefined) {
  if (!iso) return null;
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR", { timeZone: fuso })} às ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: fuso })}`;
}

export function listaDeLinguagens(texto: string | null | undefined) {
  const lista = (texto ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  return lista.length ? lista.join(", ") : null;
}

// Miniatura de um link do YouTube, ou null se nao for video. Video comum sai
// direto do endereco; playlist (DINO, PONG) nao tem miniatura por endereco,
// entao vem do oEmbed publico do YouTube, em cache por um dia.
export async function miniaturaDoYoutube(link: string): Promise<string | null> {
  const video = link.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/);
  if (video) return `https://img.youtube.com/vi/${video[1]}/hqdefault.jpg`;
  if (!/youtube\.com\/playlist\?list=/.test(link)) return null;
  try {
    const r = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(link)}`, { next: { revalidate: 86400 } });
    if (!r.ok) return null;
    const dados = (await r.json()) as { thumbnail_url?: string };
    return dados.thumbnail_url ?? null;
  } catch {
    return null;
  }
}
