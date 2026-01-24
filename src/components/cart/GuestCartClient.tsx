"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { readGuestCart, type GuestCart, writeGuestCart } from "@/lib/cartStorage";

type ProductLite = {
  id: string;
  slug: string;
  name: string;
  price: number;
  discount: number;
  stock: number;
};

type GuestCartItem = {
  product: ProductLite;
  quantity: number;
};

function formatMoneyCents(amountCents: number) {
  const amount = amountCents / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function GuestCartClient() {
  const [items, setItems] = useState<GuestCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    setLoading(true);

    try {
      const cart = readGuestCart();
      const ids = Object.keys(cart).filter((id) => (cart[id] ?? 0) > 0);

      if (ids.length === 0) {
        setItems([]);
        return;
      }

      const res = await fetch(`/api/products/by-ids?ids=${encodeURIComponent(ids.join(","))}`);
      const json = (await res.json().catch(() => null)) as any;

      if (!res.ok || !json?.ok) {
        setError(json?.error ?? "Could not load cart items");
        return;
      }

      const products: ProductLite[] = Array.isArray(json.data?.items) ? json.data.items : [];

      const mapped: GuestCartItem[] = products
        .map((p) => ({ product: p, quantity: cart[p.id] ?? 0 }))
        .filter((it) => it.quantity > 0);

      // Clean up cart: remove products that no longer exist
      const newCart: GuestCart = {};
      for (const p of products) {
        if ((cart[p.id] ?? 0) > 0) {
          newCart[p.id] = cart[p.id];
        }
      }
      writeGuestCart(newCart);

      setItems(mapped);

      // Notify cart count update
      window.dispatchEvent(new Event("gas-shop-cart-updated"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();

    function onCartUpdated() {
      load();
    }

    window.addEventListener("gas-shop-cart-updated", onCartUpdated);
    return () => window.removeEventListener("gas-shop-cart-updated", onCartUpdated);
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const unit = it.product.discount > 0 ? Math.round(it.product.price * (1 - it.product.discount / 100)) : it.product.price;
      return sum + unit * it.quantity;
    }, 0);
  }, [items]);

  function updateQuantity(productId: string, nextQty: number) {
    const qty = Math.max(1, Math.min(99, nextQty));
    const cart: GuestCart = readGuestCart();
    cart[productId] = qty;
    writeGuestCart(cart);
    window.dispatchEvent(new Event("gas-shop-cart-updated"));
  }

  function remove(productId: string) {
    const cart: GuestCart = readGuestCart();
    delete cart[productId];
    writeGuestCart(cart);
    window.dispatchEvent(new Event("gas-shop-cart-updated"));
  }

  if (loading) {
    return (
      <div className="mt-8 rounded-3xl border border-black/10 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400">
        Loading cart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-50 p-6 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-200">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-3xl border border-black/10 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-12">
      <div className="space-y-3 lg:col-span-8">
        {items.map((it) => {
          const canDecrease = it.quantity > 1;
          const canIncrease = it.quantity < Math.min(99, it.product.stock);

          return (
            <div
              key={it.product.id}
              className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">{it.product.name}</div>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Stock: {it.product.stock}</div>
                </div>

                <div className="text-sm font-semibold">{formatMoneyCents(it.product.price)}</div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!canDecrease}
                    onClick={() => updateQuantity(it.product.id, it.quantity - 1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/10"
                  >
                    −
                  </button>
                  <div className="min-w-10 text-center text-sm font-semibold">{it.quantity}</div>
                  <button
                    type="button"
                    disabled={!canIncrease}
                    onClick={() => updateQuantity(it.product.id, it.quantity + 1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/10"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    className="text-xs font-semibold text-orange-600 transition hover:text-orange-700"
                    href={`/products/${it.product.slug}`}
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(it.product.id)}
                    className="text-xs font-semibold text-zinc-700 transition hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="lg:col-span-4">
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="text-sm font-semibold">Summary</div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <div className="text-zinc-600 dark:text-zinc-400">Subtotal</div>
            <div className="font-semibold">{formatMoneyCents(subtotal)}</div>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/guest-checkout";
            }}
            className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Checkout (mock)
          </button>
          <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            You may be asked to sign in before placing the order.
          </div>
        </div>
      </div>
    </div>
  );
}
