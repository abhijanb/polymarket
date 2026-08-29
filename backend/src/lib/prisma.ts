import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 requires adapter for PostgreSQL
// DATABASE_URL is loaded via Bun (.env) and via dotenv for prisma CLI
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// Prevent multiple instances during `bun --hot` reload
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
