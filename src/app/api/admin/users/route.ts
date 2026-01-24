import { prisma } from "@/lib/prisma";
import { jsonOk } from "@/lib/http";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return jsonOk({ users });
}
