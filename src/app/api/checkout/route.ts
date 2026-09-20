import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return jsonError("Unauthorized", 401);

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: auth.sub },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return jsonError("Cart is empty", 400);
    }

    for (const it of cart.items) {
      if (it.product.stock < it.quantity) {
        return jsonError(`Insufficient stock for ${it.product.name}`, 409);
      }
    }

    const subtotal = cart.items.reduce((sum, it) => {
      const unit = it.product.discount > 0
        ? Math.round(it.product.price * (1 - it.product.discount / 100))
        : it.product.price;
      return sum + unit * it.quantity;
    }, 0);

    // D1 does not provide transaction semantics through Prisma's adapter.
    const order = await prisma.order.create({
      data: {
        userId: auth.sub,
        status: "PENDING",
        subtotal,
        total: subtotal,
        items: {
          create: cart.items.map((it) => {
            const unit = it.product.discount > 0
              ? Math.round(it.product.price * (1 - it.product.discount / 100))
              : it.product.price;
            return { productId: it.productId, quantity: it.quantity, price: unit };
          }),
        },
      },
      select: { id: true },
    });

    for (const it of cart.items) {
      await prisma.product.update({
        where: { id: it.productId },
        data: { stock: { decrement: it.quantity } },
      });
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return jsonOk({ order }, 201);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Checkout failed";
    return jsonError(msg, 400);
  }
}

export async function GET() {
  return jsonError("Method not allowed", 405);
}
