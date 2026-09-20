import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeaderServer } from "@/components/site/HeaderServer";
import { ProductCard } from "@/components/shop/ProductCard";

type HomeProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount: number;
  images: string | null;
  isFlashSale: boolean;
};

export default async function Home() {
  let categories: { id: string; name: string; slug: string }[] = [];
  let flashDeals: HomeProduct[] = [];
  let recommended: HomeProduct[] = [];

  try {
    [categories, flashDeals, recommended] = await Promise.all([
      prisma.category.findMany({
        select: { id: true, name: true, slug: true },
        orderBy: { name: "asc" },
        take: 6,
      }),
      prisma.product.findMany({
        where: { isFlashSale: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.product.findMany({
        orderBy: [{ createdAt: "desc" }],
        take: 12,
      }),
    ]);
  } catch (error) {
    console.error("Home page database query failed:", error);
  }

  return (
    <div className="min-h-screen font-sans text-zinc-950 dark:text-zinc-50">
      <HeaderServer />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <section className="grid gap-4 lg:grid-cols-12">
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-200 p-6 text-zinc-950 shadow-sm dark:border-white/10 lg:col-span-8">
            <div className="max-w-md">
              <div className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-semibold">Today’s Deals</div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Big savings on trending essentials</h1>
              <p className="mt-2 text-sm text-zinc-800/90">Browse flash sales, discover new brands, and checkout fast.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/products" className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800">Shop now</Link>
                <Link href="/products?category=electronics" className="inline-flex h-10 items-center justify-center rounded-xl border border-black/15 bg-white/80 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-white">Explore categories</Link>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-56 w-56 rounded-full bg-white/25 blur-2xl" />
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950 lg:col-span-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Hot Categories</div>
              <Link href="/products" className="text-xs font-semibold text-orange-600 transition hover:text-orange-700">View all</Link>
            </div>
            <div className="mt-4 grid gap-2">
              {categories.map((c) => (
                <Link key={c.id} href={`/products?category=${c.slug}`} className="group flex items-center justify-between rounded-2xl border border-black/10 bg-zinc-50 px-4 py-3 text-left transition hover:bg-zinc-100 dark:border-white/10 dark:bg-black dark:hover:bg-white/5">
                  <div>
                    <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">{c.name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Tap to browse</div>
                  </div>
                  <div className="text-zinc-400 transition group-hover:translate-x-0.5 dark:text-zinc-500">→</div>
                </Link>
              ))}
              {categories.length === 0 ? <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-xs text-zinc-500 dark:bg-black dark:text-zinc-400">Categories will appear here soon.</div> : null}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Flash Deals</h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Limited time offers. Grab them before they’re gone.</p>
            </div>
            <Link href="/products" className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-white/10">See all deals</Link>
          </div>
          {flashDeals.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-black/10 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400">No flash deals are available yet.</div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {flashDeals.map((p) => <ProductCard key={p.id} href={`/products/${p.slug}`} product={{ id:p.id,name:p.name,price:p.price,discount:p.discount,imageUrl:p.images ?? "https://placehold.co/600x600/png",isFlashSale:p.isFlashSale }} />)}
            </div>
          )}
        </section>

        <section className="mt-10">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Recommended</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Popular picks, refreshed daily.</p>
          </div>
          {recommended.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-black/10 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400">Products will appear here once the store is stocked.</div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {recommended.map((p) => <ProductCard key={p.id} href={`/products/${p.slug}`} product={{ id:p.id,name:p.name,price:p.price,discount:p.discount,imageUrl:p.images ?? "https://placehold.co/600x600/png",isFlashSale:p.isFlashSale }} />)}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
