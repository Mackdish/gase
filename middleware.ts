import { NextResponse, type NextRequest } from "next/server";
import { getAuthFromRequest } from "./src/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!isAdminRoute && !isAdminApi) {
    return NextResponse.next();
  }

  const auth = await getAuthFromRequest(req);

  if (!auth) {
    if (isAdminApi) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("reason", "login");
    return NextResponse.redirect(url);
  }

  if (auth.role !== "ADMIN") {
    if (isAdminApi) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("reason", "forbidden");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
