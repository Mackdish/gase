"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

type AddToCartButtonProps = {
  productId: string;
  quantity?: number;
  variant?: "primary" | "secondary";
};

export function AddToCartButton({ productId, quantity = 1, variant = "primary" }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add() {
    setError(null);
    setLoading(true);

    try {
      await addItem(productId, quantity);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  const base =
    variant === "primary"
      ? "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
      : "border border-black/10 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/10";

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={loading}
        onClick={add}
        className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition disabled:opacity-60 ${base}`}
      >
        {loading ? "Adding..." : "Add to cart"}
      </button>
      {error ? (
        <div className="text-xs text-red-600 dark:text-red-300">{error}</div>
      ) : null}
    </div>
  );
}
