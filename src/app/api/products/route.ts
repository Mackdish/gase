import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonOk } from "@/lib/http";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const category = searchParams.get("category")?.trim();
  const minPrice = searchParams.get("minPrice")?.trim();
  const maxPrice = searchParams.get("maxPrice")?.trim();

  const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(searchParams.get("pageSize") ?? "12", 10) || 12, 1), 50);
  const skip = (page - 1) * pageSize;

  const where = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { brand: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {},
      category
        ? {
            category: {
              slug: category,
            },
          }
        : {},
      minPrice
        ? {
            price: {
              gte: Math.max(parseInt(minPrice, 10) || 0, 0),
            },
          }
        : {},
      maxPrice
        ? {
            price: {
              lte: Math.max(parseInt(maxPrice, 10) || 0, 0),
            },
          }
        : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: [{ isFlashSale: "desc" }, { createdAt: "desc" }],
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return jsonOk({
    page,
    pageSize,
    total,
    items,
  });
}
