import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { categoryCreateSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);

  const parsed = categoryCreateSchema.partial().safeParse(body);
  if (!parsed.success) return jsonError("Invalid input", 400);

  const category = await prisma.category.update({
    where: { id },
    data: parsed.data,
  });

  return jsonOk({ category });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;

  const { id } = await ctx.params;

  const productsCount = await prisma.product.count({ where: { categoryId: id } });
  if (productsCount > 0) {
    return jsonError("Cannot delete category with products", 409);
  }

  await prisma.category.delete({ where: { id } });
  return jsonOk({});
}
