"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    discount: number;
    stock: number;
  };
};

function formatMoneyCents(amountCents: number) {
  const amount = amountCents / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function CartClient({ initialItems }: { initialItems: CartItem[] }) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const unit = it.product.discount > 0
        ? Math.round(it.product.price * (1 - it.product.discount / 100))
        : it.product.price;
      return sum + unit * it.quantity;
    }, 0);
  }, [items]);

  async function updateQty(productId: string, quantity: number) {
    setError(null);
    setBusyId(productId);
    try {
      const res = await fetch(`/api/cart/items/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(json?.error ?? "Could not update quantity");
        return;
      }

      setItems((prev) =>
        prev.map((it) =>
          it.product.id === productId ? { ...it, quantity: json.data.item.quantity } : it
        )
      );
      window.dispatchEvent(new Event("gas-shop-cart-updated"));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(productId: string) {
    setError(null);
    setBusyId(productId);
    try {
      const res = await fetch(`/api/cart/items/${productId}`, { method: "DELETE" });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(json?.error ?? "Could not remove item");
        return;
      }
      setItems((prev) => prev.filter((it) => it.product.id !== productId));
      window.dispatchEvent(new Event("gas-shop-cart-updated"));
    } finally {
      setBusyId(null);
    }
  }

  async function checkout() {
    setError(null);
    setCheckoutLoading(true);
    try {
      window.location.href = "/checkout";
    } finally {
      setCheckoutLoading(false);
    }
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
          const disabled = busyId === it.product.id || checkoutLoading;
          return (
            <div
              key={it.id}
              className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">{it.product.name}</div>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Stock: {it.product.stock}
                  </div>
                </div>

                <div className="text-sm font-semibold">
                  {formatMoneyCents(it.product.price)}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={disabled || it.quantity <= 1}
                    onClick={() => updateQty(it.product.id, it.quantity - 1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/10"
                  >
                    −
                  </button>
                  <div className="min-w-10 text-center text-sm font-semibold">
                    {it.quantity}
                  </div>
                  <button
                    type="button"
                    disabled={disabled || it.quantity >= Math.min(99, it.product.stock)}
                    onClick={() => updateQty(it.product.id, it.quantity + 1)}
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
                    disabled={disabled}
                    onClick={() => remove(it.product.id)}
                    className="text-xs font-semibold text-zinc-700 transition hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-200 dark:hover:text-white"
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
          {error ? (
            <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-200">
              {error}
            </div>
          ) : null}
          <button
            type="button"
            disabled={checkoutLoading}
            onClick={checkout}
            className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {checkoutLoading ? "Processing..." : "Checkout (mock)"}
          </button>
          <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Creates an order and clears your cart.
          </div>
        </div>
      </div>
    </div>
  );
}
