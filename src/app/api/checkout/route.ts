import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import type { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return jsonError("Unauthorized", 401);

  const userId = auth.sub;

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    for (const it of cart.items) {
      if (it.product.stock < it.quantity) {
        throw new Error(`Insufficient stock for ${it.product.name}`);
      }
    }

    const subtotal = cart.items.reduce((sum: number, it: (typeof cart.items)[number]) => {
      const unit = it.product.discount > 0
        ? Math.round(it.product.price * (1 - it.product.discount / 100))
        : it.product.price;
      return sum + unit * it.quantity;
    }, 0);

    const order = await tx.order.create({
      data: {
        userId,
        status: "PENDING",
        subtotal,
        total: subtotal,
        items: {
          create: cart.items.map((it: (typeof cart.items)[number]) => {
            const unit = it.product.discount > 0
              ? Math.round(it.product.price * (1 - it.product.discount / 100))
              : it.product.price;
            return {
              productId: it.productId,
              quantity: it.quantity,
              price: unit,
            };
          }),
        },
      },
      select: { id: true },
    });

    for (const it of cart.items) {
      await tx.product.update({
        where: { id: it.productId },
        data: { stock: { decrement: it.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  });

  return jsonOk({ order: result }, 201);
}

export async function GET() {
  return jsonError("Method not allowed", 405);
}
