-- Descricao das playlists DINO e PONG, cadastradas com "Esse e uma playlist".
UPDATE `materiais` SET `descricao` = REPLACE(`descricao`, 'Esse é uma playlist', 'Essa é uma playlist')
WHERE `descricao` LIKE 'Esse é uma playlist%';
