// Cookie da sessao do painel. httpOnly: so o servidor do Next le (as chamadas
// do painel passam por app/api/painel). Dura o mesmo que o token da API.
export const COOKIE_SESSAO = "sessao";
export const DURACAO_SESSAO_S = 60 * 60 * 24;
