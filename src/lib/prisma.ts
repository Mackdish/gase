import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { env } from "cloudflare:workers";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  if (!env.DB) {
    throw new Error("Cloudflare D1 binding DB is not configured.");
  }

  const adapter = new PrismaD1(env.DB);
  return new PrismaClient({ adapter });
}

export const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
