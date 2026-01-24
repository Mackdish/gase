"use client";

import { useState } from "react";

function formatMoneyCents(amountCents: number) {
  const amount = amountCents / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function CheckoutClient({ subtotalCents }: { subtotalCents: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function placeOrder() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const json = (await res.json().catch(() => null)) as any;

      if (res.status === 401) {
        window.location.href = "/cart";
        return;
      }

      if (!res.ok) {
        setError(json?.error ?? "Checkout failed");
        return;
      }

      window.dispatchEvent(new Event("gas-shop-cart-updated"));
      window.location.href = `/orders/${json.data.order.id}`;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
      <div className="text-sm font-semibold">Payment Method</div>
      <div className="mt-3 rounded-2xl border border-green-500/20 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-950/20 dark:text-green-200">
        <div className="font-semibold">Cash on Delivery</div>
        <div className="text-xs">Payment will be collected upon delivery. All payments are strictly on till.</div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-zinc-600 dark:text-zinc-400">Total</div>
        <div className="font-semibold">{formatMoneyCents(subtotalCents)}</div>
      </div>

      {error ? (
        <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <button
        type="button"
        disabled={loading}
        onClick={placeOrder}
        className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}
