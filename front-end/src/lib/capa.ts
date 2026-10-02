// Endereco da capa de um jogo. As enviadas pelo painel ficam na API, em
// /files/<arquivo>; as dos jogos antigos sao imagens do proprio site
// ("/jogos/x.jpg") e vao como estao.
export function capaDoJogo(capa: string) {
  if (capa.startsWith("/") || /^https?:\/\//.test(capa)) return capa;
  return `${process.env.NEXT_PUBLIC_API_URL}/files/${capa}`;
}

// Os integrantes ficam no banco um por linha.
export function listaDeIntegrantes(texto: string | null | undefined) {
  return (texto ?? "").split("\n").map((p) => p.trim()).filter(Boolean);
}
