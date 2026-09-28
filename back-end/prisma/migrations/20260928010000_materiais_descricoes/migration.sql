-- Descricoes dos videos de Materiais dizendo o que tem em cada um (tirado dos
-- episodios das playlists e dos capitulos dos workshops no YouTube). So troca
-- o texto antigo ("Esse/Essa e ..."): o que a organizacao ja editou no painel fica.
UPDATE `materiais` SET `descricao` = 'Série de 9 vídeos que recria o jogo do dinossauro do Google Chrome em Phaser3, da preparação do ambiente às cenas de menu, jogo, pausa e fim de jogo.'
WHERE `link` LIKE '%PLBRp1mw2RYL-po0yrH1U7mvryBU5r966c%' AND `descricao` LIKE 'Ess_ é %';

UPDATE `materiais` SET `descricao` = 'Série de 4 vídeos que monta o Pong em Phaser3: arquivo principal, tela de título, cena do jogo e tela de fim.'
WHERE `link` LIKE '%PLBRp1mw2RYL9pivUXLv1vLRO1I_M42LoY%' AND `descricao` LIKE 'Ess_ é %';

UPDATE `materiais` SET `descricao` = 'Primeira parte do workshop da Season 2 (56 min): um jogo de nave feito do zero, com controle, aceleração, tiros, pontos e animação.'
WHERE `link` LIKE '%7g_ZZuTunZg%' AND `descricao` LIKE 'Ess_ é %';

UPDATE `materiais` SET `descricao` = 'Segunda parte (40 min): o mesmo jogo ganha inimigos que surgem em posições aleatórias e animação de morte.'
WHERE `link` LIKE '%3DX80kw70Rc%' AND `descricao` LIKE 'Ess_ é %';
