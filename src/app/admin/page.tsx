export default function AdminHomePage() {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Manage products, categories, orders and users.
          </p>
        </div>

        <div className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
          Admin-only area
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <a
          href="/admin/orders"
          className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-950"
        >
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Manage</div>
          <div className="mt-1 text-sm font-semibold">Orders</div>
        </a>
        <a
          href="/admin/products"
          className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-950"
        >
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Manage</div>
          <div className="mt-1 text-sm font-semibold">Products</div>
        </a>
        <a
          href="/admin/categories"
          className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-950"
        >
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Manage</div>
          <div className="mt-1 text-sm font-semibold">Categories</div>
        </a>
        <a
          href="/admin/users"
          className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-950"
        >
          <div className="text-xs text-zinc-500 dark:text-zinc-400">View</div>
          <div className="mt-1 text-sm font-semibold">Users</div>
        </a>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Products", value: "—" },
          { label: "Orders", value: "—" },
          { label: "Users", value: "—" },
          { label: "Revenue", value: "—" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950"
          >
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {kpi.label}
            </div>
            <div className="mt-2 text-xl font-semibold text-zinc-950 dark:text-zinc-100">
              {kpi.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
