import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { productCreateSchema } from "@/lib/validators";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return jsonOk({ products });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = productCreateSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid input", 400);

  const exists = await prisma.product.findFirst({
    where: { OR: [{ slug: parsed.data.slug }] },
    select: { id: true },
  });
  if (exists) return jsonError("Product slug already exists", 409);

  const product = await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      price: parsed.data.price,
      discount: parsed.data.discount ?? 0,
      stock: parsed.data.stock ?? 0,
      brand: parsed.data.brand,
      images: parsed.data.images,
      isFlashSale: parsed.data.isFlashSale ?? false,
      categoryId: parsed.data.categoryId,
    },
  });

  return jsonOk({ product }, 201);
}
