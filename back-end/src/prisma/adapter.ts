import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Monta o adapter do banco a partir da DATABASE_URL (mysql://usuario:senha@host:porta/banco).
// Usado pela API e pelos scripts de teste, para os dois conectarem do mesmo jeito.
export function adapterDoBanco(url: string | undefined) {
  // Falha ja na subida, com a causa certa, em vez de subir e quebrar na
  // primeira consulta com "error parsing connection string".
  if (!url) throw new Error("DATABASE_URL nao definida");

  const u = new URL(url);
  return new PrismaMariaDb({
    host: u.hostname,
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.slice(1),
    // O MySQL 9 autentica com caching_sha2_password. Sem TLS, a primeira conexao
    // depois de o MySQL reiniciar (cache vazio) precisa da chave publica do
    // servidor; sem esta opcao ela e recusada e a API fica sem banco ate ser
    // reiniciada. O banco so e alcancavel pela rede interna da stack.
    allowPublicKeyRetrieval: true,
  });
}
