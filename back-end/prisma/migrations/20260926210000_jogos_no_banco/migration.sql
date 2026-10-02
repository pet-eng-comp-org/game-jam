-- Os jogos das seasons passadas moravam no codigo da pagina /jogos (a tabela
-- estava vazia). Eles passam para o banco, editaveis pelo painel.
ALTER TABLE `jogos` ADD COLUMN `equipe` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `ordem` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `integrantes` TEXT NULL,
    MODIFY `nome` VARCHAR(191) NULL,
    MODIFY `descricao` TEXT NOT NULL;

-- Seasons 1 e 2 (2022 e 2023) nao existiam no banco; a 3 existe em producao.
-- Criadas so se faltarem, sem capa: nenhuma e a atual.
INSERT INTO `seasons` (`id`, `numero`, `capa`, `numParticipantesPorEquipe`, `atual`, `createdAt`, `updatedAt`)
  SELECT UUID(), '1', '', '3', false, NOW(3), NOW(3) FROM DUAL
  WHERE NOT EXISTS (SELECT 1 FROM `seasons` WHERE `numero` = '1');
INSERT INTO `seasons` (`id`, `numero`, `capa`, `numParticipantesPorEquipe`, `atual`, `createdAt`, `updatedAt`)
  SELECT UUID(), '2', '', '3', false, NOW(3), NOW(3) FROM DUAL
  WHERE NOT EXISTS (SELECT 1 FROM `seasons` WHERE `numero` = '2');
INSERT INTO `seasons` (`id`, `numero`, `capa`, `numParticipantesPorEquipe`, `atual`, `createdAt`, `updatedAt`)
  SELECT UUID(), '3', '', '3', false, NOW(3), NOW(3) FROM DUAL
  WHERE NOT EXISTS (SELECT 1 FROM `seasons` WHERE `numero` = '3');

-- Os jogos. Um jogo ja cadastrado com o mesmo link nao e inserido de novo.
--
-- Historico, que estava nos comentarios da pagina:
-- * Todos sao servidos pela VM, em /arquivo/<jogo>/ no dominio da API. Os de
--   2023 estavam so no GitLab, em repositorio privado; os da season 3 em
--   projetos avulsos da Vercel.
-- * As capas sao captura da tela inicial de cada jogo: nao havia capa em lugar
--   nenhum. Ficam no front-end, em public/jogos/.
-- * A season 2 e a edicao de 2023. Isso veio de quem organiza o evento, nao
--   do codigo nem do banco.
-- * O nome da equipe vai sem o prefixo "Equipe", que era invencao da pagina
--   antiga (a pagina ja escreve "por X").
-- * Dino, Pong e Flappy Bird sao do PET, nao de participante: nao entram em
--   season nenhuma e continuam em /arquivo/ como material de estudo.
-- * A Lenda de Gabe e Flutter com CanvasKit; o CanvasKit foi trazido para
--   dentro do jogo e ele pinta em 4s. Parecia quebrado porque o primeiro
--   quadro demorava mais de 20s baixando do CDN.
-- * Glob Fights the King: "HTML" sao as iniciais dos quatro, achadas na tela
--   de creditos do jogo.
-- * Fire Escape: equipe BigCapys (Figma da Season 3); integrantes da tela
--   inicial do jogo.
-- * Separados pelo Tempo: a equipe se chama mesmo "void 0" (banco de 2024,
--   campo games.team); integrantes dos creditos do jogo.
-- * Tower of Echoes: nome no banner.png do repositorio petgamejam-gustavo.
INSERT INTO `jogos` (`id`, `nome`, `equipe`, `integrantes`, `descricao`, `capa`, `link`, `ordem`, `seasonId`, `createdAt`, `updatedAt`)
  SELECT UUID(), 'A Lenda de Gabe', 'Gabriel Rezende', NULL, 'Um morador pacífico, que nunca machucou nem mesmo um inseto, acorda para viver apenas mais um dia em sua pacata vila… Ou será que não?', '/jogos/a-lenda-de-gabe.jpg', 'https://apigamejam.pet.inf.ufes.br/arquivo/a-lenda-de-gabe/', 0, s.`id`, NOW(3), NOW(3)
  FROM `seasons` s WHERE s.`numero` = '1'
    AND NOT EXISTS (SELECT 1 FROM `jogos` WHERE `link` = 'https://apigamejam.pet.inf.ufes.br/arquivo/a-lenda-de-gabe/')
  ORDER BY s.`createdAt` LIMIT 1;
INSERT INTO `jogos` (`id`, `nome`, `equipe`, `integrantes`, `descricao`, `capa`, `link`, `ordem`, `seasonId`, `createdAt`, `updatedAt`)
  SELECT UUID(), 'Glob Fights the King', 'HTML', 'Henrique
Thiago
Mayke
Luiza', 'Jogo de plataforma que narra a jornada de um slime chamado Glob, que busca resgatar seu raro item das mãos do rei slime.', '/jogos/glob-fights-the-king.jpg', 'https://apigamejam.pet.inf.ufes.br/arquivo/glob-fights-the-king/', 1, s.`id`, NOW(3), NOW(3)
  FROM `seasons` s WHERE s.`numero` = '1'
    AND NOT EXISTS (SELECT 1 FROM `jogos` WHERE `link` = 'https://apigamejam.pet.inf.ufes.br/arquivo/glob-fights-the-king/')
  ORDER BY s.`createdAt` LIMIT 1;
INSERT INTO `jogos` (`id`, `nome`, `equipe`, `integrantes`, `descricao`, `capa`, `link`, `ordem`, `seasonId`, `createdAt`, `updatedAt`)
  SELECT UUID(), 'Fire Escape', 'BigCapys', 'Gabriel Braga Ladislau
Nilo Garcia Monteiro
Gabriel Gomes Lima', 'Fire Escape é um jogo em que você não pode ficar parado! O prédio está ruindo, e para fugir você deve correr e evitar obstáculos, tentando chegar o mais longe possível.', '/jogos/fire-scape.jpg', 'https://apigamejam.pet.inf.ufes.br/arquivo/fire-scape/', 0, s.`id`, NOW(3), NOW(3)
  FROM `seasons` s WHERE s.`numero` = '2'
    AND NOT EXISTS (SELECT 1 FROM `jogos` WHERE `link` = 'https://apigamejam.pet.inf.ufes.br/arquivo/fire-scape/')
  ORDER BY s.`createdAt` LIMIT 1;
INSERT INTO `jogos` (`id`, `nome`, `equipe`, `integrantes`, `descricao`, `capa`, `link`, `ordem`, `seasonId`, `createdAt`, `updatedAt`)
  SELECT UUID(), 'GRVTY', 'Gamepiece', NULL, 'Nera é uma garota esperançosa e corre destemida pelo mundo ordinário e sem cor. Um mundo com dois lados opostos, em que a vida é refletida como um espelho e a própria gravidade perdeu seu sentido. O que será que ela busca?', '/jogos/grvty.jpg', 'https://apigamejam.pet.inf.ufes.br/arquivo/grvty/', 1, s.`id`, NOW(3), NOW(3)
  FROM `seasons` s WHERE s.`numero` = '2'
    AND NOT EXISTS (SELECT 1 FROM `jogos` WHERE `link` = 'https://apigamejam.pet.inf.ufes.br/arquivo/grvty/')
  ORDER BY s.`createdAt` LIMIT 1;
INSERT INTO `jogos` (`id`, `nome`, `equipe`, `integrantes`, `descricao`, `capa`, `link`, `ordem`, `seasonId`, `createdAt`, `updatedAt`)
  SELECT UUID(), 'Asteroide', 'Geladeira Electrolux 382L', NULL, 'Jogo onde você batalha com inimigos e desvia de asteroides.', '/jogos/asteroide.jpg', 'https://apigamejam.pet.inf.ufes.br/arquivo/asteroide/', 2, s.`id`, NOW(3), NOW(3)
  FROM `seasons` s WHERE s.`numero` = '2'
    AND NOT EXISTS (SELECT 1 FROM `jogos` WHERE `link` = 'https://apigamejam.pet.inf.ufes.br/arquivo/asteroide/')
  ORDER BY s.`createdAt` LIMIT 1;
INSERT INTO `jogos` (`id`, `nome`, `equipe`, `integrantes`, `descricao`, `capa`, `link`, `ordem`, `seasonId`, `createdAt`, `updatedAt`)
  SELECT UUID(), 'Separados pelo Tempo', 'void 0', 'Gustavo Nicoletti
Rafael Ferraço
Michael Gabriel', 'Você ficou até tarde jogando Minecraft com seus amigos e acabou acordando em cima da hora para seu primeiro encontro com sua webnamorada. Agora você precisa correr para chegar a tempo!', '/jogos/separados-pelo-tempo.jpg', 'https://apigamejam.pet.inf.ufes.br/arquivo/separados-pelo-tempo/', 3, s.`id`, NOW(3), NOW(3)
  FROM `seasons` s WHERE s.`numero` = '2'
    AND NOT EXISTS (SELECT 1 FROM `jogos` WHERE `link` = 'https://apigamejam.pet.inf.ufes.br/arquivo/separados-pelo-tempo/')
  ORDER BY s.`createdAt` LIMIT 1;
INSERT INTO `jogos` (`id`, `nome`, `equipe`, `integrantes`, `descricao`, `capa`, `link`, `ordem`, `seasonId`, `createdAt`, `updatedAt`)
  SELECT UUID(), 'Tarantella', 'Playgramadores', NULL, 'Há muito tempo era dito que, se você fosse picado por uma tarântula, a única forma de se curar era dançando a Tarantella, uma dança italiana bem animada. Nosso amigo Francesco foi picado por uma! Ajude ele a não parar de se mexer nesse jogo de ritmo e obtenha a maior pontuação possível.', '/jogos/tarantella.jpg', 'https://apigamejam.pet.inf.ufes.br/arquivo/tarantella/', 4, s.`id`, NOW(3), NOW(3)
  FROM `seasons` s WHERE s.`numero` = '2'
    AND NOT EXISTS (SELECT 1 FROM `jogos` WHERE `link` = 'https://apigamejam.pet.inf.ufes.br/arquivo/tarantella/')
  ORDER BY s.`createdAt` LIMIT 1;
INSERT INTO `jogos` (`id`, `nome`, `equipe`, `integrantes`, `descricao`, `capa`, `link`, `ordem`, `seasonId`, `createdAt`, `updatedAt`)
  SELECT UUID(), 'Capybara Airways', 'Capivarinhas', 'André Luiz Siqueira
Arthur Manelli Riva Souza
Daniela Souza Pimentel', 'Uma capivara aviadora pilota seu biplano vermelho pelos céus. Voe sem parar, desvie do que vier pela frente e colete o máximo de moedas antes que o tempo acabe.', '/jogos/capivarinhas.jpg', 'https://apigamejam.pet.inf.ufes.br/arquivo/capybara-airways/', 0, s.`id`, NOW(3), NOW(3)
  FROM `seasons` s WHERE s.`numero` = '3'
    AND NOT EXISTS (SELECT 1 FROM `jogos` WHERE `link` = 'https://apigamejam.pet.inf.ufes.br/arquivo/capybara-airways/')
  ORDER BY s.`createdAt` LIMIT 1;
INSERT INTO `jogos` (`id`, `nome`, `equipe`, `integrantes`, `descricao`, `capa`, `link`, `ordem`, `seasonId`, `createdAt`, `updatedAt`)
  SELECT UUID(), 'Calouro', 'Gaga Games', 'Letícia Rodrigues
Daniel Siqueira
Arthur Maciel', 'Um calouro precisa passar de ano. Corra, pule e ataque pelas plataformas, junte moedas e sobreviva com suas três vidas — no fim, resta descobrir se o veredito é aprovado ou reprovado.', '/jogos/gaga-games.jpg', 'https://apigamejam.pet.inf.ufes.br/arquivo/gaga-games/', 1, s.`id`, NOW(3), NOW(3)
  FROM `seasons` s WHERE s.`numero` = '3'
    AND NOT EXISTS (SELECT 1 FROM `jogos` WHERE `link` = 'https://apigamejam.pet.inf.ufes.br/arquivo/gaga-games/')
  ORDER BY s.`createdAt` LIMIT 1;
INSERT INTO `jogos` (`id`, `nome`, `equipe`, `integrantes`, `descricao`, `capa`, `link`, `ordem`, `seasonId`, `createdAt`, `updatedAt`)
  SELECT UUID(), 'Tower of Echoes', 'Animal', 'Gustavo
Tarcio
Marcos', 'Sob a chuva de uma floresta de outono, um guerreiro avança de espada em punho. Corra, use o dash e ataque sem parar para atravessar o caminho e derrotar a Sombra e o Guardião que o aguardam.', '/jogos/animal.jpg', 'https://apigamejam.pet.inf.ufes.br/arquivo/equipe-animal/', 2, s.`id`, NOW(3), NOW(3)
  FROM `seasons` s WHERE s.`numero` = '3'
    AND NOT EXISTS (SELECT 1 FROM `jogos` WHERE `link` = 'https://apigamejam.pet.inf.ufes.br/arquivo/equipe-animal/')
  ORDER BY s.`createdAt` LIMIT 1;
