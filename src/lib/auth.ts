import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

export type JwtRole = "ADMIN" | "CUSTOMER";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: JwtRole;
};

const COOKIE_NAME = "gas_shop_token";
const JWT_ALG = "HS256";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export function getAuthCookieName() {
  return COOKIE_NAME;
}

export async function signAuthToken(payload: AuthTokenPayload) {
  return await new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: JWT_ALG })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret(), {
    algorithms: [JWT_ALG],
  });

  const sub = typeof payload.sub === "string" ? payload.sub : undefined;
  const email = typeof payload.email === "string" ? payload.email : undefined;
  const role = payload.role === "ADMIN" || payload.role === "CUSTOMER" ? payload.role : undefined;

  if (!sub || !email || !role) {
    throw new Error("Invalid token payload");
  }

  return { sub, email, role } satisfies AuthTokenPayload;
}

export async function getAuthFromRequest(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}
