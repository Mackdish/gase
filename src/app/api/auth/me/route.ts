import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return jsonError("Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { id: auth.sub },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) return jsonError("Unauthorized", 401);

  return jsonOk({ user });
}
