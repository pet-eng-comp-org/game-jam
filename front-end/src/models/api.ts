// O formato das respostas da API, para os modelos nao lerem o JSON como `any`.

export interface SeasonJson {
    id: string
    numero: string
    capa: string
    numParticipantesPorEquipe: string
    atual: boolean
    inscricoesAbertas: boolean
}

export interface JogoJson {
    id: string
    nome: string
    capa: string
    descricao: string
    link: string
}

export interface SeasonComJogosJson extends SeasonJson {
    jogos: JogoJson[]
}

export interface MaterialJson {
    id: string
    nome: string
    descricao: string
    link: string
}

export interface PatrocinadorJson {
    id: string
    nome: string
    logo: string
}

export interface UsuarioJson {
    id: string
    username: string
}
