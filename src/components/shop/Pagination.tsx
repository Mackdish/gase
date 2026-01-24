import Link from "next/link";

export function Pagination({
  basePath,
  page,
  pageSize,
  total,
  query,
}: {
  basePath: string;
  page: number;
  pageSize: number;
  total: number;
  query: Record<string, string | undefined>;
}) {
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  function makeUrl(nextPage: number) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v) sp.set(k, v);
    }
    if (nextPage > 1) sp.set("page", String(nextPage));
    return `${basePath}${sp.toString() ? `?${sp.toString()}` : ""}`;
  }

  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={makeUrl(Math.max(page - 1, 1))}
          className={`inline-flex h-10 items-center justify-center rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/10 ${
            page <= 1 ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Prev
        </Link>
        <Link
          href={makeUrl(Math.min(page + 1, totalPages))}
          className={`inline-flex h-10 items-center justify-center rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/10 ${
            page >= totalPages ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
