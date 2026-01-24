import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthCookieName, verifyAuthToken } from "@/lib/auth";
import { HeaderServer } from "@/components/site/HeaderServer";

function formatMoneyCents(amountCents: number) {
  const amount = amountCents / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default async function OrdersPage() {
  const token = (await cookies()).get(getAuthCookieName())?.value;
  if (!token) redirect("/login");

  let userId: string;
  try {
    const auth = await verifyAuthToken(token);
    userId = auth.sub;
  } catch {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
    },
  });

  return (
    <div className="min-h-screen font-sans text-zinc-950 dark:text-zinc-50">
      <HeaderServer />

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Your Orders</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Track status and view details.
            </p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
            Continue shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-black/10 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400">
            No orders yet.
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {orders.map((o: (typeof orders)[number]) => (
              <Link
                key={o.id}
                href={`/orders/${o.id}`}
                className="block rounded-3xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-950"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">Order #{o.id.slice(-6)}</div>
                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {new Date(o.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-700 dark:text-orange-300">
                      {o.status}
                    </div>
                    <div className="text-sm font-semibold">{formatMoneyCents(o.total)}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                  Items: {o.items.reduce((sum: number, it: (typeof o.items)[number]) => sum + it.quantity, 0)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
