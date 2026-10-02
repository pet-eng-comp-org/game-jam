import { PrismaClient } from "@prisma/client";
import { adapterDoBanco } from "./adapter";

// Desde o Prisma 7 o client fala com o banco por um driver adapter, e nao mais
// por um binario proprio. Ver adapter.ts.
const prismaClient = new PrismaClient({ adapter: adapterDoBanco(process.env.DATABASE_URL) });

export default prismaClient
