import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;

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

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;

  const { id } = await ctx.params;
  await prisma.review.delete({ where: { id } });
  return jsonOk({ ok: true });
}