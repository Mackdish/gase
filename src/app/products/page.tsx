export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeaderServer } from "@/components/site/HeaderServer";
import { ProductCard } from "@/components/shop/ProductCard";
import { Pagination } from "@/components/shop/Pagination";
import { ProductsPriceFilter } from "@/components/shop/ProductsPriceFilter";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const category = typeof sp.category === "string" ? sp.category.trim() : "";
  const minPrice = typeof sp.minPrice === "string" ? sp.minPrice.trim() : "";
  const maxPrice = typeof sp.maxPrice === "string" ? sp.maxPrice.trim() : "";

  const page = Math.max(parseInt(typeof sp.page === "string" ? sp.page : "1", 10) || 1, 1);
  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  const where = {
    AND: [
      q
        ? {
          OR: [
            { name: { contains: q } },
            { brand: { contains: q } },
          ],
        }
        : {},
      category
        ? {
          category: {
            slug: category,
          },
        }
        : {},
      minPrice
        ? {
          price: {
            gte: Math.max(parseInt(minPrice, 10) || 0, 0),
          },
        }
        : {},
      maxPrice
        ? {
          price: {
            lte: Math.max(parseInt(maxPrice, 10) || 0, 0),
          },
        }
        : {},
    ],
  };

  let items: any[] = [];
  let total = 0;

  try {
    [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: [{ isFlashSale: "desc" }, { createdAt: "desc" }],
        skip,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);
  } catch (error) {
    console.error("Products page database query failed:", error);
  }

  return (
    <div className="min-h-screen font-sans text-zinc-950 dark:text-zinc-50">
      <HeaderServer />

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Products</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {q ? (
                <>Results for <span className="font-semibold">{q}</span></>
              ) : (
                "Browse popular items"
              )}
              {category ? (
                <>
                  {" "}in <span className="font-semibold">{category}</span>
                </>
              ) : null}
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-white/10"
          >
            Back to home
          </Link>
        </div>

        <ProductsPriceFilter
          q={q || undefined}
          category={category || undefined}
          initialMinPrice={minPrice || undefined}
          initialMaxPrice={maxPrice || undefined}
        />

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-black/10 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400">
            No products found.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((p: (typeof items)[number]) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  discount: p.discount,
                  imageUrl: p.images ?? "https://placehold.co/600x600/png",
                  isFlashSale: p.isFlashSale,
                }}
                href={`/products/${p.slug}`}
              />
            ))}
          </div>
        )}

        <Pagination
          basePath="/products"
          page={page}
          pageSize={pageSize}
          total={total}
          query={{
            q: q || undefined,
            category: category || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
          }}
        />
      </main>
    </div>
  );
}
