"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen font-sans text-zinc-950 dark:text-zinc-50">
      <main className="mx-auto w-full max-w-2xl px-4 py-16">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="text-xl font-semibold tracking-tight">Something went wrong</div>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Please try again. If the problem persists, contact support.
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-black dark:text-zinc-200 dark:hover:bg-white/10"
            >
              Go home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
