import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminOrdersClient, type AdminOrderRow } from "@/components/admin/AdminOrdersClient";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { quantity: true } },
    },
  });

  const rows: AdminOrderRow[] = orders.map((o: (typeof orders)[number]) => ({
    id: o.id,
    status: o.status,
    total: o.total,
    createdAt: o.createdAt.toISOString(),
    user: o.user,
    itemsCount: o.items.reduce((sum: number, it: (typeof o.items)[number]) => sum + it.quantity, 0),
    mobileNumber: o.mobileNumber,
    hostelName: o.hostelName,
    doorNumber: o.doorNumber,
  }));

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Orders
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Update order statuses (pending, shipped, delivered, canceled).
          </p>
        </div>

        <Link
          href="/admin"
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-white/10"
        >
          Back
        </Link>
      </div>

      <AdminOrdersClient initialOrders={rows} />
    </div>
  );
}
