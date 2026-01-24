import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const idsRaw = searchParams.get("ids")?.trim();

  if (!idsRaw) {
    return jsonOk({ items: [] as any[] });
  }

  const ids = idsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (ids.length === 0) {
    return jsonOk({ items: [] as any[] });
  }

  if (ids.length > 50) {
    return jsonError("Too many ids", 400);
  }

  const items = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      discount: true,
      stock: true,
    },
  });

  return jsonOk({ items });
}
