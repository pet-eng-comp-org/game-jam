// A mesma pessoa e o mesmo e-mail, comparado como a collation da coluna no
// MySQL (utf8mb4_unicode_ci): sem maiusculas e sem acentos. Usado na equipe e
// entre equipes, para as duas conferencias darem a mesma resposta.
export const mesmoEmail = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" }) === 0;
