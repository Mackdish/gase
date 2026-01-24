import { prisma } from "@/lib/prisma";
import { jsonOk } from "@/lib/http";

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { select: { quantity: true } },
    },
  });

  return jsonOk({ orders });
}
