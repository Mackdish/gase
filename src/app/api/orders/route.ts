import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return jsonError("Unauthorized", 401);

  const orders = await prisma.order.findMany({
    where: { userId: auth.sub },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      subtotal: true,
      total: true,
      createdAt: true,
      items: { select: { quantity: true } },
    },
  });

  return jsonOk({ orders });
}
