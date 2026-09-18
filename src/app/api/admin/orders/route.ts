import { prisma } from "@/lib/prisma";
import { jsonOk } from "@/lib/http";
import { requireAdmin } from "@/lib/admin";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { select: { quantity: true } },
    },
  });

  return jsonOk({ orders });
}
