import { getAuthCookieName } from "@/lib/auth";
import { jsonOk } from "@/lib/http";

export async function POST() {
  const res = jsonOk({});
  res.cookies.set({
    name: getAuthCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
