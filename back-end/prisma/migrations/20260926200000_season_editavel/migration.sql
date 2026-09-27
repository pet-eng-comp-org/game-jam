-- Dados da edicao passam para o banco (antes ficavam no codigo do site), e as
-- inscricoes passam a abrir e fechar por data. O liga/desliga manual sai: ele
-- ficou ligado por esquecimento de uma edicao para a outra. Uma season sem as
-- duas datas fica com as inscricoes fechadas.
ALTER TABLE `seasons` DROP COLUMN `inscricoesAbertas`,
    ADD COLUMN `dataEvento` DATETIME(3) NULL,
    ADD COLUMN `inscricoesAbrem` DATETIME(3) NULL,
    ADD COLUMN `inscricoesFecham` DATETIME(3) NULL,
    ADD COLUMN `linguagens` VARCHAR(191) NULL,
    ADD COLUMN `regulamento` TEXT NULL;
