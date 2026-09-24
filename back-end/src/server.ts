// Carrega o .env em desenvolvimento. Em producao nao existe arquivo .env dentro
// da imagem e as variaveis vem do ambiente do container, entao isto e inerte la.
import 'dotenv/config'

import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'

import { router } from './routes'
import { TAMANHO_MAXIMO_MB } from './config/multer'

const app = express()

// A API roda atras do Traefik, que termina o TLS e repassa em HTTP. Sem isto o
// req.protocol devolve 'http', e a URL do logo do patrocinador vira conteudo
// misto numa pagina servida em https.
app.set('trust proxy', 1)
app.use(express.json())

// Cabecalhos de seguranca. crossOriginResourcePolicy fica em cross-origin
// porque /files serve as imagens dos patrocinadores para o site, que esta em
// outro dominio — o padrao same-origin bloquearia.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

// cors() sem argumento aceita QUALQUER origem: qualquer site conseguia chamar
// esta API pelo navegador de um visitante. A lista vem do ambiente para o
// dominio poder mudar sem tocar no codigo; o padrao cobre o site em producao e
// o desenvolvimento local.
const ORIGENS = (process.env.CORS_ORIGENS ??
    'https://gamejam.pet.inf.ufes.br,https://game-jam.pet.inf.ufes.br,http://localhost:3000'
).split(',').map(o => o.trim()).filter(Boolean)

app.use(cors({
    // Sem origin (curl, app nativo, mesma origem) passa: CORS protege o
    // navegador de terceiros, nao substitui autenticacao.
    origin: (origin, cb) => cb(null, !origin || ORIGENS.includes(origin)),
    credentials: true
}))

app.use(router)

// Os arquivos daqui foram enviados por gente, e sao servidos da mesma origem da
// API. O nosniff impede o navegador de adivinhar o tipo e tratar como HTML algo
// que entrou antes do filtro de tipo existir.
app.use(
    '/files',
    express.static(path.resolve(__dirname, '..', 'tmp'), {
        setHeaders: (res) => res.setHeader('X-Content-Type-Options', 'nosniff')
    })
)

app.use((err: Error, req: Request, res: Response, next: NextFunction): any => {

    if(err instanceof Error){

        // O multer devolve MulterError com mensagem em ingles ("File too large").
        // Quem le isso e o organizador subindo uma capa pelo painel.
        if(err.constructor.name === 'MulterError'){
            const codigo = (err as Error & { code?: string }).code

            return res.status(400).json({
                error: codigo === 'LIMIT_FILE_SIZE'
                    ? `Arquivo muito grande. O limite e ${TAMANHO_MAXIMO_MB} MB.`
                    : 'Envio invalido.'
            })
        }

        // Erro vindo do banco nao pode ser devolvido cru: a mensagem carrega o
        // caminho do arquivo, o trecho da query, o nome das colunas ou o endereco
        // do servidor. Fica no log e o cliente recebe uma mensagem generica. Desde
        // o Prisma 7 ele chega tambem como erro do adapter (DriverAdapterError) ou
        // do proprio driver mariadb (SqlError).
        const nome = err.constructor.name
        if(nome.startsWith('PrismaClient') || nome === 'DriverAdapterError' || nome === 'SqlError'){
            console.error(err)

            return res.status(500).json({
                status: 'error',
                message: 'Internal server error.'
            })
        }

        // Erro lancado pelos services e mensagem de validacao, feita para o cliente ler.
        return res.status(400).json({
            error: err.message
        })
    }

    return res.status(500).json({
        status: 'error',
        message: 'Internal server error.'
    })
})

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => console.log('Server Online!'))