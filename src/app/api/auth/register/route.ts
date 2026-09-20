import bcrypt from "bcryptjs";
import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthCookieName, signAuthToken } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { registerSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid input", 400);
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return jsonError("Email already in use", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "CUSTOMER",
    },
    select: { id: true, email: true, role: true, name: true },
  });

  const token = await signAuthToken({ sub: user.id, email: user.email, role: user.role });

  const res = jsonOk({ user }, 201);

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
