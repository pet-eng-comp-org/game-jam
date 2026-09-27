import { Router } from "express";
import multer from "multer";
import uploadConfig from './config/multer'

import { CriaUserController } from "./controllers/user/CriaUserController";
import { LogaUserController } from "./controllers/user/LogaUserController";
import { DetalhesUserController } from "./controllers/user/DetalhesUserController";
import { ObtemUsersController } from "./controllers/user/ObtemUsersController";
import { limiteDeLogin, limiteDeInscricao } from './middlewares/limiteDeTaxa'
import { exigeCredenciais } from './middlewares/exigeCredenciais'
import { estaAutenticado } from "./middlewares/estaAutenticado";
import { DeleteUserController } from "./controllers/user/DeleteUserController";
import { AlteraSenhaUserController } from "./controllers/user/AlteraSenhaUserController";

import { CriaSeasonController } from "./controllers/season/CriaSeasonController";
import { AtualSeasonController } from "./controllers/season/AtualSeasonController";
import { DeletaSeasonController } from "./controllers/season/DeletaSeasonController";
import { ObtemAtualSeasonController } from "./controllers/season/ObtemAtualSeasonController";
import { ObtemSeasonsController } from "./controllers/season/ObtemSeasonsController";
import { ObtemSeasonsComJogosController } from "./controllers/season/ObtemSeasonsComJogosController";
import { ApagaCpfsSeasonController } from "./controllers/season/ApagaCpfsSeasonController";
import { EditaSeasonController } from "./controllers/season/EditaSeasonController";

import { CriaJogoController } from "./controllers/jogo/CriaJogoController";
import { EditaJogoController } from "./controllers/jogo/EditaJogoController";
import { DeletaJogoController } from "./controllers/jogo/DeletaJogoController";
import { CriaPatrocinadorController } from "./controllers/patrocinador/CriaPatrocinadorController";
import { DeletaPatrocinadorController } from "./controllers/patrocinador/DeletaPatrocinadorController";
import { CriaMaterialController } from "./controllers/material/CriaMaterialController";
import { DeletaMaterialController } from "./controllers/material/DeletaMaterialController";
import { ObtemMateriaisController } from "./controllers/material/ObtemMateriaisController";
import { ObtemPatrocinadoresController } from "./controllers/patrocinador/ObtemPatrocinadorController";

import { CriaInscricaoController } from "./controllers/inscricao/CriaInscricaoController";
import { ObtemEquipesController, DeletaEquipeController, AprovaEquipeController } from "./controllers/equipe/EquipeController";

const router = Router()
const upload = multer(uploadConfig.upload("./tmp"))


// -- ROUTES USER --
router.post('/users', estaAutenticado, new CriaUserController().handle)
router.post('/sessao', exigeCredenciais, limiteDeLogin, new LogaUserController().handle)
router.get('/eu', estaAutenticado,  new DetalhesUserController().handle)
router.get('/users', estaAutenticado,  new ObtemUsersController().handle)
router.delete('/users', estaAutenticado, new DeleteUserController().handle)
router.put('/users', estaAutenticado, new AlteraSenhaUserController().handle)

// -- ROUTES SEASON --
router.post('/seasons', estaAutenticado, upload.single('file'), new CriaSeasonController().handle)
router.delete('/seasons', estaAutenticado, new DeletaSeasonController().handle)
router.get('/seasons', estaAutenticado, new ObtemSeasonsController().handle)
router.get('/seasonsComJogos', new ObtemSeasonsComJogosController().handle)
router.put('/seasons/atual', estaAutenticado, new AtualSeasonController().handle)
router.get('/seasons/atual', new ObtemAtualSeasonController().handle)
router.put('/seasons', estaAutenticado, new EditaSeasonController().handle)
router.put('/seasons/apagaCpfs', estaAutenticado, new ApagaCpfsSeasonController().handle)

// -- ROUTES JOGO --
router.post('/jogos', estaAutenticado, upload.single('file'), new CriaJogoController().handle)
router.delete('/jogos', estaAutenticado, new DeletaJogoController().handle)
router.put('/jogos', estaAutenticado, new EditaJogoController().handle)

// -- ROUTES PATROCINADOR --
// O GET fica publico porque o site exibe os patrocinadores. Criar e apagar exige login.
router.post('/patrocinador', estaAutenticado, upload.single('logo'), new CriaPatrocinadorController().handle)
router.delete('/patrocinador/remove', estaAutenticado, new DeletaPatrocinadorController().handle)
router.get('/patrocinador', new ObtemPatrocinadoresController().handle)

// -- ROUTES MATERIAIS --
// Mesmo criterio do patrocinador: leitura publica, escrita autenticada.
router.post('/material', estaAutenticado, new CriaMaterialController().handle)
router.delete('/material', estaAutenticado, new DeletaMaterialController().handle)
router.get('/material', new ObtemMateriaisController().handle)

// -- INSCRICAO --
// Publica de proposito: o participante se inscreve antes de existir login. A
// equipe e todos os participantes chegam juntos e sao gravados numa transacao.
// A guarda esta no controller, que exige temporada atual com inscricoes abertas.
router.post('/inscricao', limiteDeInscricao, new CriaInscricaoController().handle)

// -- EQUIPES (painel) --
// Os inscritos, com CPF: so com login.
router.get('/equipes', estaAutenticado, new ObtemEquipesController().handle)
router.delete('/equipe', estaAutenticado, new DeletaEquipeController().handle)
router.put('/equipe/aprovada', estaAutenticado, new AprovaEquipeController().handle)

export { router }
