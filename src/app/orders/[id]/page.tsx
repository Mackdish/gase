export const dynamic = "force-dynamic";

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

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get(getAuthCookieName())?.value;
  if (!token) redirect("/login");

  let userId: string;
  try {
    const auth = await verifyAuthToken(token);
    userId = auth.sub;
  } catch {
    redirect("/login");
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order || order.userId !== userId) {
    return (
      <div className="min-h-screen">
        <HeaderServer />
        <main className="mx-auto w-full max-w-6xl px-4 py-10">
          <div className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
            Order not found.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-zinc-950 dark:text-zinc-50">
      <HeaderServer />

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/orders" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
            ← Back to orders
          </Link>
          <div className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-700 dark:text-orange-300">
            {order.status}
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">Order #{order.id.slice(-6)}</div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Placed: {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="text-sm font-semibold">Total: {formatMoneyCents(order.total)}</div>
          </div>

          <div className="mt-5 grid gap-3">
            {order.items.map((it: (typeof order.items)[number]) => (
              <div
                key={it.id}
                className="rounded-2xl border border-black/10 bg-zinc-50 p-4 dark:border-white/10 dark:bg-black"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold">{it.product.name}</div>
                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Qty: {it.quantity}
                    </div>
                  </div>
                  <div className="text-sm font-semibold">{formatMoneyCents(it.price)}</div>
                </div>
                <div className="mt-2 text-xs">
                  <Link href={`/products/${it.product.slug}`} className="font-semibold text-orange-600 hover:text-orange-700">
                    View product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
