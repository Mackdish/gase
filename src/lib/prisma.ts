import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { env } from "cloudflare:workers";

declare global {
  var prisma: PrismaClient | undefined;
}

let client: PrismaClient | undefined;

function createPrismaClient() {
  if (!env.DB) {
    throw new Error("Cloudflare D1 binding DB is not configured.");
  }

  return new PrismaClient({
    adapter: new PrismaD1(env.DB),
  });
}

function getPrismaClient() {
  if (globalThis.prisma) {
    return globalThis.prisma;
  }

  if (!client) {
    client = createPrismaClient();
  }

  globalThis.prisma = client;
  return client;
}

/**
 * Cloudflare bindings are request-scoped and are not guaranteed to exist while
 * modules are being evaluated. Keep Prisma lazy so importing this module cannot
 * crash the RSC render before the Worker request has established its bindings.
 *
 * The proxy preserves the existing `prisma.user.findMany()` style used
 * throughout the application while creating the real Prisma client only when
 * the first database operation is accessed.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const realClient = getPrismaClient();
    const value = Reflect.get(realClient, property);

    if (typeof value === "function") {
      return value.bind(realClient);
    }

    return value;
  },
});
