import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen font-sans text-zinc-950 dark:text-zinc-50">
      <main className="mx-auto w-full max-w-2xl px-4 py-16">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="text-xl font-semibold tracking-tight">Page not found</div>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            The page you’re looking for doesn’t exist.
          </div>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Go home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
