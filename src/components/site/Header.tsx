import Link from "next/link";

type HeaderProps = {
  cartCount?: number;
};

export function Header({ cartCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/60">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              JOOUST STORE
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Deals you want
            </div>
          </div>
        </Link>

        <div className="hidden flex-1 items-center gap-2 md:flex">
          <div className="w-36">
            <select
              className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-zinc-700 outline-none transition focus:border-orange-500/60 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200"
              defaultValue="all"
              aria-label="Category"
            >
              <option value="all">All</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
            </select>
          </div>

          <div className="relative flex-1">
            <input
              className="h-10 w-full rounded-xl border border-black/10 bg-white px-4 pr-12 text-sm text-zinc-800 outline-none transition focus:border-orange-500/60 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100"
              placeholder="Search products, brands and categories"
              aria-label="Search"
            />
            <button
              type="button"
              className="absolute right-1 top-1 inline-flex h-8 w-10 items-center justify-center rounded-lg bg-zinc-950 text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              aria-label="Search"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16.5 16.5 21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/admin"
            className="hidden rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10 sm:inline-flex"
          >
            Admin
          </Link>

          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-zinc-900 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/10"
            aria-label="Cart"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6h15l-1.5 8.25a2 2 0 0 1-1.97 1.65H8.25a2 2 0 0 1-1.98-1.67L4.5 3H2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                fill="currentColor"
              />
            </svg>
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-3 md:hidden">
        <div className="flex gap-2">
          <div className="w-28">
            <select
              className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-zinc-700 outline-none transition focus:border-orange-500/60 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200"
              defaultValue="all"
              aria-label="Category"
            >
              <option value="all">All</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
            </select>
          </div>
          <div className="relative flex-1">
            <input
              className="h-10 w-full rounded-xl border border-black/10 bg-white px-4 pr-12 text-sm text-zinc-800 outline-none transition focus:border-orange-500/60 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100"
              placeholder="Search products"
              aria-label="Search"
            />
            <button
              type="button"
              className="absolute right-1 top-1 inline-flex h-8 w-10 items-center justify-center rounded-lg bg-zinc-950 text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              aria-label="Search"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16.5 16.5 21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
