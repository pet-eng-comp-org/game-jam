-- Onde a competicao acontece, editavel no painel. Aparece no Inicio e nas
-- Regras, e entra na marcacao de evento que o Google le.
ALTER TABLE `seasons` ADD COLUMN `local` VARCHAR(191) NULL;

-- Season 4: no CT 9 da Ufes (confirmado pela organizacao).
UPDATE `seasons` SET `local` = 'CT 9 da Ufes' WHERE `numero` = '4' AND `local` IS NULL;
