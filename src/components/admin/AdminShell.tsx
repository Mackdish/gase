"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

function activeFromPath(pathname: string) {
  if (pathname === "/admin") return "dashboard";
  if (pathname.startsWith("/admin/orders")) return "orders";
  if (pathname.startsWith("/admin/products")) return "products";
  if (pathname.startsWith("/admin/categories")) return "categories";
  if (pathname.startsWith("/admin/reviews")) return "reviews";
  if (pathname.startsWith("/admin/users")) return "users";
  return "dashboard";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = activeFromPath(pathname);

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-6">
      <AdminSidebar active={active} />
      <div className="min-w-0 flex-1 px-4 py-8">{children}</div>
    </div>
  );
}
