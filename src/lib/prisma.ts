import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { env } from "cloudflare:workers";

const clients = new WeakMap<object, PrismaClient>();

function getPrismaClient() {
  const db = env.DB;

  if (!db) {
    throw new Error("Cloudflare D1 binding DB is not configured.");
  }

  const key = db as unknown as object;
  const existing = clients.get(key);
  if (existing) {
    return existing;
  }

  const client = new PrismaClient({
    adapter: new PrismaD1(db),
  });

  clients.set(key, client);
  return client;
}

/**
 * Keep client creation lazy because Cloudflare bindings are only available
 * during a Worker request. The cache is keyed by the actual D1 binding object
 * so a client can never accidentally be reused with a different database.
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
