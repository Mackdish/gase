import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAuthCookieName, verifyAuthToken } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(getAuthCookieName())?.value;

  if (!token) {
    redirect("/login?next=/admin");
  }

  try {
    const auth = await verifyAuthToken(token);
    if (auth.role !== "ADMIN") {
      redirect("/");
    }
  } catch {
    redirect("/login?next=/admin");
  }

  return <AdminShell>{children}</AdminShell>;
}
