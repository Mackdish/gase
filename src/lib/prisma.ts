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

  return new PrismaClient({
    adapter: new PrismaD1(env.DB),
  });
}

// Reuse one client in the Worker isolate. This avoids constructing a client during
// build-time/module evaluation when the D1 binding is not available yet.
export const prisma = globalThis.prisma ?? createPrismaClient();

if (!globalThis.prisma) {
  globalThis.prisma = prisma;
}
