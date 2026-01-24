import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const isHidden = body?.isHidden;

  if (typeof isHidden !== "boolean") {
    return jsonError("Invalid input", 400);
  }

  const review = await prisma.review.update({
    where: { id },
    data: { isHidden },
    select: { id: true, isHidden: true },
  });

  return jsonOk({ review });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await prisma.review.delete({ where: { id } });
  return jsonOk({ ok: true });
}