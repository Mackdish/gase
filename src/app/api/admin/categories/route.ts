import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { categoryCreateSchema } from "@/lib/validators";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return jsonOk({ categories });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = categoryCreateSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid input", 400);

  const { name, slug } = parsed.data;

  const exists = await prisma.category.findFirst({
    where: { OR: [{ name }, { slug }] },
    select: { id: true },
  });

  if (exists) return jsonError("Category already exists", 409);

  const category = await prisma.category.create({
    data: { name, slug },
  });

  return jsonOk({ category }, 201);
}
