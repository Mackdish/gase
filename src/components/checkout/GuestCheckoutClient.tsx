"use client";

import { useEffect, useState } from "react";
import { clearGuestCart, readGuestCart } from "@/lib/cartStorage";

export function GuestCheckoutClient() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [hostelName, setHostelName] = useState("");
  const [doorNumber, setDoorNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [ready, setReady] = useState(false);
  const [hasItems, setHasItems] = useState(false);

  useEffect(() => {
    const cart = readGuestCart();
    setHasItems(Object.values(cart).some((q) => (q ?? 0) > 0));
    setReady(true);
  }, []);

  async function placeGuestOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cart = readGuestCart();
    const items = Object.entries(cart)
      .filter(([, qty]) => qty && qty > 0)
      .map(([productId, qty]) => ({ productId, quantity: qty }));

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/guest-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber,
          hostelName,
          doorNumber,
          items,
        }),
      });

      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok || !json?.ok) {
        setError(json?.error ?? "Checkout failed");
        return;
      }

      clearGuestCart();
      window.dispatchEvent(new Event("gas-shop-cart-updated"));
      window.location.href = `/guest-checkout/success?orderId=${encodeURIComponent(json.data.order.id)}`;
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
        Loading...
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
        Your cart is empty. Please add items first.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="text-sm font-semibold">Customer Details</div>

          <form className="mt-4 grid gap-4" onSubmit={placeGuestOrder}>
            <div className="grid gap-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Mobile number</label>
              <input
                className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-orange-500/60 dark:border-white/10 dark:bg-black dark:text-zinc-50"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="e.g. 07XXXXXXXX"
                inputMode="tel"
                required
              />
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Hostel name</label>
              <input
                className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-orange-500/60 dark:border-white/10 dark:bg-black dark:text-zinc-50"
                value={hostelName}
                onChange={(e) => setHostelName(e.target.value)}
                placeholder="e.g. Block A"
                required
              />
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Door number</label>
              <input
                className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-orange-500/60 dark:border-white/10 dark:bg-black dark:text-zinc-50"
                value={doorNumber}
                onChange={(e) => setDoorNumber(e.target.value)}
                placeholder="e.g. 12"
                required
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {loading ? "Placing order..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="rounded-3xl border border-black/10 bg-white p-5 text-sm text-zinc-700 shadow-sm dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
          <div className="font-semibold mb-2">Delivery & Payment</div>
          <div className="space-y-2">
            <div>Your order will be delivered to the hostel and door number you provide.</div>
            <div className="rounded-2xl border border-green-500/20 bg-green-50 px-3 py-2 text-green-700 dark:border-green-500/30 dark:bg-green-950/20 dark:text-green-200">
              <div className="font-semibold text-xs">Cash on Delivery</div>
              <div className="text-xs">Payment will be collected upon delivery. All payments are strictly on till.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
