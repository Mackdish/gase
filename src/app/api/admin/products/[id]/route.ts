import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { productCreateSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);

  const parsed = productCreateSchema.partial().safeParse(body);
  if (!parsed.success) return jsonError("Invalid input", 400);

  if (parsed.data.slug) {
    const conflict = await prisma.product.findFirst({
      where: { slug: parsed.data.slug, NOT: { id } },
      select: { id: true },
    });
    if (conflict) return jsonError("Product slug already exists", 409);
  }

  const product = await prisma.product.update({
    where: { id },
    data: parsed.data,
  });

  return jsonOk({ product });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;

  const { id } = await ctx.params;

  const orderItemsCount = await prisma.orderItem.count({ where: { productId: id } });
  if (orderItemsCount > 0) {
    return jsonError("Cannot delete a product that exists in orders", 409);
  }

  await prisma.product.delete({ where: { id } });
  return jsonOk({});
}
