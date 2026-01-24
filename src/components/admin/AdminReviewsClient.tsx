"use client";

import { useEffect, useMemo, useState } from "react";
import { ClientPagination } from "@/components/ui/ClientPagination";

type ReviewRow = {
  id: string;
  rating: number;
  comment: string | null;
  isHidden: boolean;
  createdAt: string;
  user: { name: string; email: string };
  product: { name: string; slug: string };
};

export function AdminReviewsClient() {
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/reviews?includeHidden=true", { method: "GET" });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(json?.error ?? "Failed to load reviews");
        return;
      }

      const reviews = json?.data?.reviews ?? [];
      setRows(
        reviews.map((r: any) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment ?? null,
          isHidden: !!r.isHidden,
          createdAt: r.createdAt,
          user: { name: r.user?.name ?? "—", email: r.user?.email ?? "—" },
          product: { name: r.product?.name ?? "—", slug: r.product?.slug ?? "" },
        }))
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const totalPages = Math.max(Math.ceil(rows.length / pageSize), 1);
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page]);

  async function setHidden(id: string, isHidden: boolean) {
    setError(null);
    setBusyId(id);

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden }),
      });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(json?.error ?? "Failed to update review");
        return;
      }

      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, isHidden: json.data.review.isHidden } : r)));
    } finally {
      setBusyId(null);
    }
  }

  async function deleteReview(id: string) {
    const ok = window.confirm("Delete this review? This cannot be undone.");
    if (!ok) return;

    setError(null);
    setBusyId(id);

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(json?.error ?? "Failed to delete review");
        return;
      }

      setRows((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3 dark:border-white/10">
        <div className="text-sm font-semibold">Reviews</div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">{rows.length} total</div>
      </div>

      {error ? <div className="p-4 text-sm text-red-700 dark:text-red-200">{error}</div> : null}

      {loading ? (
        <div className="p-4 text-sm text-zinc-600 dark:text-zinc-400">Loading...</div>
      ) : (
        <div className="divide-y divide-black/5 dark:divide-white/10">
          {pageRows.map((r) => (
            <div key={r.id} className="grid grid-cols-12 gap-3 px-4 py-3 text-sm">
              <div className="col-span-4">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">{r.product.name}</div>
                <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{r.product.slug ? `/products/${r.product.slug}` : ""}</div>
              </div>
              <div className="col-span-3">
                <div className="font-semibold">{r.user.name}</div>
                <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{r.user.email}</div>
              </div>
              <div className="col-span-2 text-xs font-semibold text-orange-600">{"★".repeat(r.rating)}</div>
              <div className="col-span-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={busyId === r.id}
                  onClick={() => setHidden(r.id, !r.isHidden)}
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-black/10 bg-white px-3 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60 dark:border-white/10 dark:bg-black dark:text-zinc-200 dark:hover:bg-white/10"
                >
                  {r.isHidden ? "Unhide" : "Hide"}
                </button>
                <button
                  type="button"
                  disabled={busyId === r.id}
                  onClick={() => deleteReview(r.id)}
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-red-500/30 bg-red-50 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60 dark:bg-red-950/20 dark:text-red-200"
                >
                  Delete
                </button>
              </div>

              {r.comment ? (
                <div className="col-span-12 mt-1 rounded-2xl bg-zinc-50 p-3 text-sm text-zinc-700 dark:bg-black dark:text-zinc-200">
                  {r.comment}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <div className="px-4 pb-4">
        <ClientPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
