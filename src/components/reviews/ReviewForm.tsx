"use client";

import { useState } from "react";

export function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submit() {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment: comment.trim() || null }),
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(json?.error ?? "Could not submit review");
        return;
      }

      setSuccess("Review saved.");
      window.location.reload();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
      <div className="text-sm font-semibold">Leave a review</div>

      <div className="mt-3">
        <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Rating</div>
        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const v = i + 1;
            const filled = v <= rating;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setRating(v)}
                className={`text-lg transition ${filled ? "text-orange-500" : "text-zinc-300 dark:text-zinc-700"}`}
                aria-label={`Rate ${v}`}
              >
                ★
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Comment</div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-2 h-24 w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-orange-500/60 dark:border-white/10 dark:bg-black dark:text-zinc-100"
          placeholder="Share your experience (optional)"
        />
      </div>

      {error ? (
        <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-3 rounded-2xl border border-green-500/20 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-950/20 dark:text-green-200">
          {success}
        </div>
      ) : null}

      <button
        type="button"
        disabled={loading}
        onClick={submit}
        className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        {loading ? "Submitting..." : "Submit review"}
      </button>
    </div>
  );
}
