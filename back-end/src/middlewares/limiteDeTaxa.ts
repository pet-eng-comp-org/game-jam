import rateLimit from 'express-rate-limit'

// A API fica na internet, e duas rotas precisam continuar publicas: o login e
// o formulario de inscricao. Sem limite, "publica" significa "ilimitada".
//
// O app.set('trust proxy', 1) do server.ts e o que faz isto contar por IP de
// verdade. Sem ele, o Traefik seria o unico cliente visivel e o limite valeria
// para todo mundo somado — bloquearia a inscricao inteira ao primeiro abuso.

// Login: o alvo de maior valor da aplicacao. Quem entra aqui controla seasons,
// jogos, patrocinadores e ve os inscritos. Cinco tentativas por quinze minutos
// deixa espaco para quem errou a senha e fecha a porta para quem esta chutando.
export const limiteDeLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    // Nao contar quem acertou: quem esta usando o painel normalmente nunca
    // deveria esbarrar nisto.
    skipSuccessfulRequests: true,
    message: { status: 'error', message: 'Tentativas demais. Tente de novo em alguns minutos.' }
})

// Inscricao: uma equipe manda um POST de equipe e um por participante. Uma
// equipe de quatro sao cinco requisicoes, e ainda ha quem repita por erro de
// formulario. Vinte por hora cobre o uso real com folga e ainda impede alguem
// de encher o banco de inscricao falsa — que aqui nao e so lixo, e dado pessoal
// (nome e e-mail) entrando sem ninguem pedir.
export const limiteDeInscricao = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { status: 'error', message: 'Muitas inscricoes deste endereco. Tente de novo mais tarde.' }
})
