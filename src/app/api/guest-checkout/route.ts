import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { guestCheckoutSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = guestCheckoutSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid input", 400);

  const { mobileNumber, hostelName, doorNumber, items } = parsed.data;

  try {
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
      select: { id: true, name: true, price: true, discount: true, stock: true },
    });

    const byId = new Map(products.map((p) => [p.id, p] as const));

    for (const it of items) {
      const p = byId.get(it.productId);
      if (!p) return jsonError("Product not found", 404);
      if (p.stock < it.quantity) {
        return jsonError(`Insufficient stock for ${p.name}`, 409);
      }
    }

    const subtotal = items.reduce((sum, it) => {
      const p = byId.get(it.productId)!;
      const unit = p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
      return sum + unit * it.quantity;
    }, 0);

    // D1 does not provide transaction semantics through Prisma's adapter.
    const order = await prisma.order.create({
      data: {
        status: "PENDING",
        subtotal,
        total: subtotal,
        mobileNumber,
        hostelName,
        doorNumber,
        userId: null,
        items: {
          create: items.map((it) => {
            const p = byId.get(it.productId)!;
            const unit = p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
            return { productId: it.productId, quantity: it.quantity, price: unit };
          }),
        },
      },
      select: { id: true },
    });

    for (const it of items) {
      await prisma.product.update({
        where: { id: it.productId },
        data: { stock: { decrement: it.quantity } },
      });
    }

    return jsonOk({ order }, 201);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Checkout failed";
    return jsonError(msg, 400);
  }
}

export async function GET() {
  return jsonError("Method not allowed", 405);
}
