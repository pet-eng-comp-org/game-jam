// Medidas comuns das paginas publicas, para todas seguirem o mesmo sistema.

// Largura e margens: no celular 24px de cada lado (antes cada pagina tinha a
// sua, de 3,5% a 10%); no desktop, os 80% do mockup.
export const PAGINA = "mx-auto w-full max-w-[1154px] px-6 pb-24 pt-14 md:w-[80%] md:px-0 md:pt-[98px]"

// Texto corrido: 18px, entrelinha 1,625 e no maximo ~70 caracteres por linha
// (a faixa confortavel de leitura e 60 a 80). Antes a linha chegava a 130
// caracteres no desktop, e a entrelinha variava de 1,2 a 2,0 entre paginas.
export const TEXTO = "max-w-[68ch] text-lg leading-relaxed"

// Distancia entre secoes, uma so (antes: 97, 100, 106, 130 e 139px).
export const SECAO = "mt-20 md:mt-24"

// Do titulo da secao ao conteudo.
export const APOS_TITULO = "mt-5"

// Listas de itens (topicos): mesmo texto, com respiro entre os itens.
export const LISTA = `${TEXTO} list-disc space-y-2 pl-6 marker:text-destaque`
