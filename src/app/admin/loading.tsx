export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl gap-6">
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 px-4 py-6 lg:block">
        <div className="h-40 animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/10" />
      </aside>
      <div className="min-w-0 flex-1 px-4 py-8">
        <div className="h-7 w-48 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-2xl bg-zinc-200 dark:bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
