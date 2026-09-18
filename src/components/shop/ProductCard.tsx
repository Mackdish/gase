import Image from "next/image";
import Link from "next/link";
import type React from "react";

export type ProductCardData = {
  id: string;
  name: string;
  price: number;
  discount: number;
  imageUrl: string;
  brand?: string;
  isFlashSale?: boolean;
};

function formatMoneyCents(amountCents: number) {
  const amount = amountCents / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function ProductCard({
  product,
  href,
}: {
  product: ProductCardData;
  href?: string;
}) {
  const hasDiscount = product.discount > 0;
  const discounted = hasDiscount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  const Wrapper: React.ElementType = href ? Link : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group block overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-950"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />
        {hasDiscount ? (
          <div className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-1 text-xs font-semibold text-white">
            -{product.discount}%
          </div>
        ) : null}
        {product.isFlashSale ? (
          <div className="absolute right-2 top-2 rounded-full bg-zinc-950/90 px-2 py-1 text-xs font-semibold text-white dark:bg-white/90 dark:text-zinc-950">
            Flash
          </div>
        ) : null}
      </div>

      <div className="space-y-2 p-3">
        <div className="line-clamp-2 text-sm font-medium text-zinc-950 dark:text-zinc-100">
          {product.name}
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="space-y-0.5">
            <div className="text-base font-semibold text-zinc-950 dark:text-zinc-100">
              {formatMoneyCents(discounted)}
            </div>
            {hasDiscount ? (
              <div className="text-xs text-zinc-500 line-through dark:text-zinc-400">
                {formatMoneyCents(product.price)}
              </div>
            ) : null}
          </div>

          <span className="inline-flex h-9 items-center justify-center rounded-xl bg-zinc-950 px-3 text-xs font-semibold text-white transition group-hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:group-hover:bg-zinc-200">
            View
          </span>
        </div>
      </div>
    </Wrapper>
  );
}
