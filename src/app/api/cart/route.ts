import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { cartAddSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return jsonError("Unauthorized", 401);

  const cart = await prisma.cart.findUnique({
    where: { userId: auth.sub },
    include: {
      items: {
        include: { product: true },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  return jsonOk({ cart: cart ?? { items: [] } });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const parsed = cartAddSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid input", 400);

  const { productId, quantity } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true, stock: true } });
  if (!product) return jsonError("Product not found", 404);
  if (product.stock < quantity) return jsonError("Insufficient stock", 409);

  const cart = await prisma.cart.upsert({
    where: { userId: auth.sub },
    update: {},
    create: { userId: auth.sub },
    select: { id: true },
  });

  const item = await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: { increment: quantity } },
    create: { cartId: cart.id, productId, quantity },
  });

  return jsonOk({ item }, 201);
}
