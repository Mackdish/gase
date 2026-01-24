import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { guestCheckoutSchema } from "@/lib/validators";
import type { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = guestCheckoutSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid input", 400);

  const { mobileNumber, hostelName, doorNumber, items } = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const products = await tx.product.findMany({
        where: { id: { in: items.map((i) => i.productId) } },
        select: { id: true, name: true, price: true, discount: true, stock: true },
      });

      const byId = new Map(products.map((p) => [p.id, p] as const));

      for (const it of items) {
        const p = byId.get(it.productId);
        if (!p) throw new Error("Product not found");
        if (p.stock < it.quantity) throw new Error(`Insufficient stock for ${p.name}`);
      }

      const subtotal = items.reduce((sum, it) => {
        const p = byId.get(it.productId)!;
        const unit = p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
        return sum + unit * it.quantity;
      }, 0);

      const orderData: any = {
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
            return {
              productId: it.productId,
              quantity: it.quantity,
              price: unit,
            };
          }),
        },
      };

      const order = await tx.order.create({
        data: orderData,
        select: { id: true },
      });

      for (const it of items) {
        await tx.product.update({
          where: { id: it.productId },
          data: { stock: { decrement: it.quantity } },
        });
      }

      return order;
    });

    return jsonOk({ order: result }, 201);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Checkout failed";
    return jsonError(msg, 400);
  }
}

export async function GET() {
  return jsonError("Method not allowed", 405);
}
