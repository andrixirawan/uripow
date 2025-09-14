import { PrismaClient } from "@/generated/prisma";
import { getDatabaseUrl, config } from "./env";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Create Prisma client dengan database URL yang tepat
export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    // Log queries di development
    log: config.env.isDevelopment ? ["query", "error", "warn"] : ["error"],
  });

// Prevent multiple instances di development
if (config.env.isDevelopment) {
  globalForPrisma.prisma = db;
}
