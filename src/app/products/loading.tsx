export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="h-6 w-40 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950"
          >
            <div className="aspect-square animate-pulse bg-zinc-200 dark:bg-white/10" />
            <div className="space-y-2 p-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
