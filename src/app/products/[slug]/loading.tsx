export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="h-5 w-32 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
      <div className="mt-4 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="aspect-square animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/10" />
        </div>
        <div className="space-y-3 lg:col-span-6">
          <div className="h-7 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
          <div className="h-24 w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}
