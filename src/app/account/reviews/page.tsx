import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthCookieName, verifyAuthToken } from "@/lib/auth";
import { HeaderServer } from "@/components/site/HeaderServer";

export default async function MyReviewsPage() {
  const token = (await cookies()).get(getAuthCookieName())?.value;
  if (!token) redirect("/login");

  let userId: string;
  try {
    const auth = await verifyAuthToken(token);
    userId = auth.sub;
  } catch {
    redirect("/login");
  }

  const reviews = await prisma.review.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { product: { select: { name: true, slug: true } } },
  });

  return (
    <div className="min-h-screen font-sans text-zinc-950 dark:text-zinc-50">
      <HeaderServer />

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/account" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
            ← Back to dashboard
          </Link>
          <Link href="/products" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
            Shop
          </Link>
        </div>

        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="text-sm font-semibold">My Reviews</div>

          {reviews.length === 0 ? (
            <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">No reviews yet.</div>
          ) : (
            <div className="mt-4 grid gap-3">
              {reviews.map((r: (typeof reviews)[number]) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-black/10 bg-zinc-50 p-4 dark:border-white/10 dark:bg-black"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold">{r.product.name}</div>
                      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {"★".repeat(r.rating)}
                      </div>
                    </div>
                    <Link
                      href={`/products/${r.product.slug}`}
                      className="text-xs font-semibold text-orange-600 hover:text-orange-700"
                    >
                      View product
                    </Link>
                  </div>
                  {r.comment ? (
                    <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">{r.comment}</div>
                  ) : null}
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
            Tip: You can add or update your review from a product details page.
          </div>
        </div>
      </main>
    </div>
  );
}
