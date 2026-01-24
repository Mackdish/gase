import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthCookieName, verifyAuthToken } from "@/lib/auth";
import { HeaderServer } from "@/components/site/HeaderServer";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

function formatMoneyCents(amountCents: number) {
  const amount = amountCents / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default async function CheckoutPage() {
  const token = (await cookies()).get(getAuthCookieName())?.value;
  if (!token) redirect("/cart");

  let userId: string;
  try {
    const auth = await verifyAuthToken(token);
    userId = auth.sub;
  } catch {
    redirect("/cart");
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  const items = cart?.items ?? [];
  if (items.length === 0) {
    redirect("/cart");
  }

  const subtotal = items.reduce((sum: number, it: (typeof items)[number]) => {
    const unit = it.product.discount > 0
      ? Math.round(it.product.price * (1 - it.product.discount / 100))
      : it.product.price;
    return sum + unit * it.quantity;
  }, 0);

  return (
    <div className="min-h-screen font-sans text-zinc-950 dark:text-zinc-50">
      <HeaderServer />

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/cart" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
            ← Back to cart
          </Link>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Mock payment</div>
        </div>

        <div className="mt-4 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
              <div className="text-sm font-semibold">Order Summary</div>
              <div className="mt-4 space-y-3">
                {items.map((it: (typeof items)[number]) => (
                  <div key={it.id} className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold">{it.product.name}</div>
                      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Qty: {it.quantity}</div>
                    </div>
                    <div className="text-sm font-semibold">{formatMoneyCents(it.product.price)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-black/10 pt-4 text-sm dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-zinc-600 dark:text-zinc-400">Subtotal</div>
                  <div className="font-semibold">{formatMoneyCents(subtotal)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <CheckoutClient subtotalCents={subtotal} />
          </div>
        </div>
      </main>
    </div>
  );
}
