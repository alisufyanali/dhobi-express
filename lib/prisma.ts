import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function client() {
  // The schema names DIRECT_URL; fall back so a Neon or single-URL setup still starts
  process.env.DIRECT_URL ||= process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!globalForPrisma.prisma) globalForPrisma.prisma = new PrismaClient();
  return globalForPrisma.prisma;
}

/**
 * Created on first use, so demo mode (no DATABASE_URL) never loads the Prisma engine.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_t, prop) {
    const c = client();
    const v = Reflect.get(c, prop, c);
    return typeof v === "function" ? v.bind(c) : v;
  },
});
