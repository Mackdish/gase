import { prisma } from "@/lib/prisma";
import { jsonOk } from "@/lib/http";
import { requireAdmin } from "@/lib/admin";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return jsonOk({ users });
}
