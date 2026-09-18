import { type NextRequest } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { jsonError } from "@/lib/http";

export async function requireAdmin(req: NextRequest) {
  const auth = await getAuthFromRequest(req);

  if (!auth) {
    return { auth: null, error: jsonError("Unauthorized", 401) };
  }

  if (auth.role !== "ADMIN") {
    return { auth: null, error: jsonError("Forbidden", 403) };
  }

  return { auth, error: null };
}
