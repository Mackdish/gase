import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonOk } from "@/lib/http";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const includeHidden = searchParams.get("includeHidden") === "true";

  const reviews = await prisma.review.findMany({
    where: includeHidden ? {} : { isHidden: false },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, name: true, slug: true } },
    },
  });

  return jsonOk({ reviews });
}
