import Link from "next/link";
import { AdminReviewsClient } from "@/components/admin/AdminReviewsClient";

export default async function AdminReviewsPage() {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Reviews
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Moderate customer reviews (hide/unhide or delete).
          </p>
        </div>

        <Link
          href="/admin"
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-white/10"
        >
          Back
        </Link>
      </div>

      <AdminReviewsClient />
    </div>
  );
}
