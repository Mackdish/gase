import Link from "next/link";
import { HeaderServer } from "@/components/site/HeaderServer";

export default async function Home() {
  return (
    <div className="min-h-screen font-sans text-zinc-950 dark:text-zinc-50">
      <HeaderServer />

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <section className="grid gap-4 lg:grid-cols-12">
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-200 p-6 text-zinc-950 shadow-sm dark:border-white/10 lg:col-span-8">
            <div className="max-w-md">
              <div className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-semibold">
                JOOUST STORE
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Shop essentials at JOOUST STORE
              </h1>
              <p className="mt-2 text-sm text-zinc-800/90">
                Browse products, discover deals, and checkout fast.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/products"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Shop now
                </Link>
                <Link
                  href="/products"
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-black/15 bg-white/80 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-white"
                >
                  Explore products
                </Link>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-56 w-56 rounded-full bg-white/25 blur-2xl" />
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950 lg:col-span-4">
            <div className="text-sm font-semibold">Store categories</div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Product categories will appear here once the store catalog is connected.
            </p>
            <Link
              href="/products"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-xl border border-black/10 bg-zinc-50 px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:border-white/10 dark:bg-black dark:text-zinc-200 dark:hover:bg-white/5"
            >
              Browse catalog
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
            <div className="text-sm font-semibold">Flash Deals</div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              New offers will appear here.
            </p>
          </div>
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
            <div className="text-sm font-semibold">Easy checkout</div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Add products to your cart and checkout securely.
            </p>
          </div>
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
            <div className="text-sm font-semibold">JOOUST STORE</div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Your campus-focused online store.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
