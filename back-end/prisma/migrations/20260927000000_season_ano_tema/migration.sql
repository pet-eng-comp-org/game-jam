-- Ano e tema de cada edicao, para /jogos contar de onde vem cada jogo. A
-- Season 4 e a primeira no formato de competicao de um dia; nas anteriores,
-- cada equipe criava um jogo sobre um tema.
ALTER TABLE `seasons` ADD COLUMN `ano` VARCHAR(4) NULL,
    ADD COLUMN `tema` VARCHAR(191) NULL;

-- Season 2: edicao de 2023, tema "Nao pare de mexer" (pagina da Season 2 no
-- Notion do PET; bate com os jogos: Tarantella, Fire Escape).
UPDATE `seasons` SET `ano` = '2023', `tema` = 'Não pare de mexer'
  WHERE `numero` = '2' AND `ano` IS NULL AND `tema` IS NULL;

-- Season 3: tema "Plataformas" (confirmado pela organizacao; era o titulo da
-- pagina de regras do site), competicao de 15/10 a 05/11/2025, pelas mesmas
-- regras.
UPDATE `seasons` SET `ano` = '2025', `tema` = 'Plataformas'
  WHERE `numero` = '3' AND `ano` IS NULL AND `tema` IS NULL;

-- Season 1: tema "O ambiente muda voce" (confirmado pela organizacao). O ano
-- fica em branco: nao ha registro dele.
UPDATE `seasons` SET `tema` = 'O ambiente muda você'
  WHERE `numero` = '1' AND `tema` IS NULL;
