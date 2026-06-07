import { Pool } from "pg"; // <-- Necesitas instalar 'pg' e importar Pool
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined;
};

// 1. Creas el Pool de conexiones
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// 2. Se lo pasas al adaptador
const adapter = new PrismaPg(pool);

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;