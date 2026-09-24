import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Desde o Prisma 7 o client fala com o banco por um driver adapter, e nao mais
// por um binario proprio. O mariadb serve ao MySQL e aceita a mesma
// DATABASE_URL (mysql://...) de sempre.
const prismaClient = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL ?? ""),
});

export default prismaClient
