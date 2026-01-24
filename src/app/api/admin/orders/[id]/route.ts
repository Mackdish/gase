import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { orderStatusUpdateSchema } from "@/lib/validators";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = orderStatusUpdateSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid input", 400);

  const order = await prisma.order.update({
    where: { id },
    data: { status: parsed.data.status },
    select: { id: true, status: true },
  });

  return jsonOk({ order });
}
