import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { cartUpdateSchema } from "@/lib/validators";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ productId: string }> }) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return jsonError("Unauthorized", 401);

  const { productId } = await ctx.params;

  const body = await req.json().catch(() => null);
  const parsed = cartUpdateSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid input", 400);

  const cart = await prisma.cart.findUnique({ where: { userId: auth.sub }, select: { id: true } });
  if (!cart) return jsonError("Cart not found", 404);

  const product = await prisma.product.findUnique({ where: { id: productId }, select: { stock: true } });
  if (!product) return jsonError("Product not found", 404);
  if (product.stock < parsed.data.quantity) return jsonError("Insufficient stock", 409);

  const item = await prisma.cartItem.update({
    where: { cartId_productId: { cartId: cart.id, productId } },
    data: { quantity: parsed.data.quantity },
  });

  return jsonOk({ item });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ productId: string }> }) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return jsonError("Unauthorized", 401);

  const { productId } = await ctx.params;

  const cart = await prisma.cart.findUnique({ where: { userId: auth.sub }, select: { id: true } });
  if (!cart) return jsonError("Cart not found", 404);

  await prisma.cartItem.delete({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  return jsonOk({});
}
