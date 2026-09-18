import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonOk } from "@/lib/http";
import { requireAdmin } from "@/lib/admin";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;
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
