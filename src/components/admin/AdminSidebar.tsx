import Link from "next/link";

export function AdminSidebar({
  active,
}: {
  active?: "dashboard" | "orders" | "products" | "categories" | "users" | "reviews";
}) {
  const linkBase =
    "flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-semibold transition";

  const activeCls = "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950";
  const idleCls =
    "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10";

  function cls(key: NonNullable<typeof active>) {
    return `${linkBase} ${active === key ? activeCls : idleCls}`;
  }

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 px-4 py-6 lg:block">
      <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <div className="text-xs font-semibold text-orange-600">JOOUST STORE</div>
        <div className="mt-1 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Admin
        </div>

        <nav className="mt-4 grid gap-1">
          <Link href="/admin" className={cls("dashboard")}>Dashboard</Link>
          <Link href="/admin/orders" className={cls("orders")}>Orders</Link>
          <Link href="/admin/products" className={cls("products")}>Products</Link>
          <Link href="/admin/categories" className={cls("categories")}>Categories</Link>
          <Link href="/admin/reviews" className={cls("reviews")}>Reviews</Link>
          <Link href="/admin/users" className={cls("users")}>Users</Link>
        </nav>

        <form action="/api/auth/logout" method="post" className="mt-4">
          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center rounded-2xl border border-black/10 bg-white text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-black dark:text-zinc-100 dark:hover:bg-white/10"
          >
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
