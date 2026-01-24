"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export function ProductsPriceFilter({
  q,
  category,
  initialMinPrice,
  initialMaxPrice,
}: {
  q?: string;
  category?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
}) {
  const router = useRouter();
  const [minPrice, setMinPrice] = useState(initialMinPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice ?? "");

  const hasChanges = useMemo(() => {
    return (initialMinPrice ?? "") !== minPrice || (initialMaxPrice ?? "") !== maxPrice;
  }, [initialMinPrice, initialMaxPrice, minPrice, maxPrice]);

  function navigate(nextMin: string, nextMax: string) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (category) sp.set("category", category);
    if (nextMin.trim()) sp.set("minPrice", nextMin.trim());
    if (nextMax.trim()) sp.set("maxPrice", nextMax.trim());
    router.push(`/products${sp.toString() ? `?${sp.toString()}` : ""}`);
  }

  return (
    <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950">
      <div className="text-sm font-semibold">Filter</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <label className="block">
          <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Min price (cents)</div>
          <input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            inputMode="numeric"
            className="mt-2 h-10 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-orange-500/60 dark:border-white/10 dark:bg-black dark:text-zinc-100"
            placeholder="0"
          />
        </label>

        <label className="block">
          <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Max price (cents)</div>
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            inputMode="numeric"
            className="mt-2 h-10 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-orange-500/60 dark:border-white/10 dark:bg-black dark:text-zinc-100"
            placeholder="100000"
          />
        </label>

        <div className="flex items-end gap-2">
          <button
            type="button"
            disabled={!hasChanges}
            onClick={() => navigate(minPrice, maxPrice)}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Apply
          </button>
          <button
            type="button"
            disabled={!minPrice && !maxPrice}
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
              navigate("", "");
            }}
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60 dark:border-white/10 dark:bg-black dark:text-zinc-200 dark:hover:bg-white/10"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
