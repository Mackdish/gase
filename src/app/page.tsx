import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-zinc-950 dark:bg-black dark:text-white">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold">
            JOOUST STORE
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/products"
              className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10"
            >
              Shop
            </Link>
            <Link
              href="/login"
              className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="max-w-2xl">
          <div className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
            JOOUST STORE
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
            Your campus online store.
          </h1>
          <p className="mt-5 max-w-xl text-base text-zinc-600 dark:text-zinc-400">
            Browse products, discover deals, and shop online.
          </p>
          <Link
            href="/products"
            className="mt-7 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-black"
          >
            Browse products
          </Link>
        </div>
      </section>
    </main>
  );
}
