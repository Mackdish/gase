import { type NextRequest } from "next/server";
import { getAuthCookieName } from "@/lib/auth";
import { jsonOk } from "@/lib/http";

export async function POST(req: NextRequest) {
  const res = jsonOk({});
  res.cookies.set({
    name: getAuthCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(req.url).protocol === "https:",
    path: "/",
    maxAge: 0,
  });
  return res;
}
