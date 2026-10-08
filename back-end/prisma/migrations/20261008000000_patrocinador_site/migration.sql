-- Site do patrocinador: a logo no site publico passa a levar ate ele. Opcional,
-- entao as linhas que existem ficam como estao.
ALTER TABLE `patrocinadores` ADD COLUMN `site` VARCHAR(191) NULL;
