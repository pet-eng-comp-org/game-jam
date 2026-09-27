// Pede ao servidor do Next para refazer as paginas publicas depois de uma
// alteracao no painel. Falha aqui nao desfaz nada: no pior caso, o site mostra
// a mudanca em ate 5 minutos.
export async function revalidaSite() {
  try {
    await fetch("/api/revalida", { method: "POST" });
  } catch {
    // sem efeito
  }
}
