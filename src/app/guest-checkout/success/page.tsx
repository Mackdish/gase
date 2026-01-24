import Link from "next/link";
import { HeaderServer } from "@/components/site/HeaderServer";

export default async function GuestCheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const sp = await searchParams;
  const orderId = sp.orderId ?? "";

  return (
    <div className="min-h-screen font-sans text-zinc-950 dark:text-zinc-50">
      <HeaderServer />

      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="text-sm font-semibold">Order placed</div>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Your order has been received.
          </div>

          <div className="mt-4 rounded-2xl border border-black/10 bg-zinc-50 p-4 text-sm dark:border-white/10 dark:bg-black">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Order ID</div>
            <div className="mt-1 font-semibold break-all">{orderId || "(missing)"}</div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Continue shopping
            </Link>
            <Link
              href="/cart"
              className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-black dark:text-zinc-100 dark:hover:bg-white/10"
            >
              Back to cart
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
