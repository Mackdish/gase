import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { reviewUpsertSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const parsed = reviewUpsertSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid input", 400);

  const { productId, rating, comment } = parsed.data;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) return jsonError("Product not found", 404);

  const review = await prisma.review.upsert({
    where: {
      userId_productId: {
        userId: auth.sub,
        productId,
      },
    },
    update: {
      rating,
      comment,
    },
    create: {
      userId: auth.sub,
      productId,
      rating,
      comment,
    },
    include: {
      user: { select: { id: true, name: true } },
    },
  });

  return jsonOk({ review }, 201);
}
