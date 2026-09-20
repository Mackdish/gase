export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { HeaderServer } from "@/components/site/HeaderServer";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ReviewForm } from "@/components/reviews/ReviewForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      images: true,
      price: true,
      discount: true,
    },
  });

  if (!product) {
    return {
      title: "Product not found | JOOUST STORE",
    };
  }

  const title = `${product.name} | JOOUST STORE`;
  const description = product.description ?? "Shop now on JOOUST STORE.";
  const imageUrl = product.images ?? "https://placehold.co/1200x630/png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

function formatMoneyCents(amountCents: number) {
  const amount = amountCents / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = (await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        where: ({ isHidden: false } as any),
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true } } },
      },
    },
  })) as any;

  if (!product) {
    return (
      <div className="min-h-screen">
        <HeaderServer />
        <main className="mx-auto w-full max-w-6xl px-4 py-10">
          <div className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
            Product not found.
          </div>
        </main>
      </div>
    );
  }

  const imageUrl = product.images ?? "https://placehold.co/900x900/png";
  const hasDiscount = product.discount > 0;
  const discounted = hasDiscount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum: number, r: (typeof product.reviews)[number]) => sum + r.rating, 0) /
      product.reviews.length
      : 0;

  return (
    <div className="min-h-screen font-sans text-zinc-950 dark:text-zinc-50">
      <HeaderServer />

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/products"
            className="text-sm font-semibold text-orange-600 transition hover:text-orange-700"
          >
            ← Back to products
          </Link>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Category: {product.category.name}
          </div>
        </div>

        <div className="mt-4 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {hasDiscount ? (
                <div className="absolute left-3 top-3 rounded-full bg-orange-500 px-2 py-1 text-xs font-semibold text-white">
                  -{product.discount}%
                </div>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-6">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <div className="font-semibold text-orange-600">
                {avgRating > 0 ? avgRating.toFixed(1) : "—"}
              </div>
              <div className="text-orange-600">
                {avgRating > 0 ? "★".repeat(Math.round(avgRating)) : "★★★★★"}
              </div>
              <div className="text-zinc-500 dark:text-zinc-400">
                ({product.reviews.length} reviews)
              </div>
            </div>

            <div className="mt-3 flex items-end gap-3">
              <div className="text-2xl font-semibold">{formatMoneyCents(discounted)}</div>
              {hasDiscount ? (
                <div className="text-sm text-zinc-500 line-through dark:text-zinc-400">
                  {formatMoneyCents(product.price)}
                </div>
              ) : null}
            </div>

            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {product.brand ? <>Brand: <span className="font-semibold">{product.brand}</span></> : null}
            </div>

            <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
              {product.description ?? "No description yet."}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <AddToCartButton productId={product.id} />
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Stock: {product.stock}
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
              <div className="text-sm font-semibold">Reviews</div>
              {product.reviews.length === 0 ? (
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  No reviews yet.
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  {product.reviews.map((r: (typeof product.reviews)[number]) => (
                    <div key={r.id} className="rounded-2xl border border-black/10 bg-zinc-50 p-4 dark:border-white/10 dark:bg-black">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                          {r.user.name}
                        </div>
                        <div className="text-xs font-semibold text-orange-600">
                          {"★".repeat(r.rating)}
                        </div>
                      </div>
                      {r.comment ? (
                        <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
                          {r.comment}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4">
              <ReviewForm productId={product.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
