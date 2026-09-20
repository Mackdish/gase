import bcrypt from "bcryptjs";
import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthCookieName, signAuthToken } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { loginSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid input", 400);
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true, passwordHash: true, name: true },
  });

  if (!user) {
    return jsonError("Invalid email or password", 401);
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return jsonError("Invalid email or password", 401);
  }

  const token = await signAuthToken({ sub: user.id, email: user.email, role: user.role });

  const res = jsonOk({
    user: { id: user.id, email: user.email, role: user.role, name: user.name },
  });

  res.cookies.set({
    name: getAuthCookieName(),
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(req.url).protocol === "https:",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
