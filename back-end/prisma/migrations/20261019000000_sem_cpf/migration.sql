-- O CPF deixou de ser pedido na inscricao (recomendacao do tutor, 19/10/2026).
-- Apaga os CPFs guardados, mas a coluna fica ate o deploy seguinte: se a API
-- voltar para a imagem anterior, que ainda le e grava cpf, ela continua de pe.
UPDATE `participantes` SET `cpf` = NULL;
