-- Segunda metade da retirada do CPF: a coluna estava vazia desde a
-- migracao 20261019000000_sem_cpf, e a API que ainda a usava saiu de vez.
ALTER TABLE `participantes` DROP COLUMN `cpf`;
