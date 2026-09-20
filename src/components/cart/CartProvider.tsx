"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clearGuestCart, guestCartCount, readGuestCart, writeGuestCart, type GuestCart } from "@/lib/cartStorage";

type CartContextValue = {
  cartCount: number;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

async function fetchDbCartCount(): Promise<number> {
  const res = await fetch("/api/cart", { method: "GET" });
  if (!res.ok) throw new Error("Could not load cart");
  const json = (await res.json().catch(() => null)) as any;
  const items = json?.data?.cart?.items;
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum: number, it: any) => sum + (Number(it.quantity) || 0), 0);
}

async function getLoggedIn(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/me", { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [authed, setAuthed] = useState(false);

  const refresh = useCallback(async () => {
    const logged = await getLoggedIn();
    setAuthed(logged);

    if (logged) {
      try {
        setCartCount(await fetchDbCartCount());
      } catch {
        setCartCount(0);
      }
      return;
    }

    setCartCount(guestCartCount(readGuestCart()));
  }, []);

  const syncGuestToDb = useCallback(async () => {
    const guest = readGuestCart();
    const entries = Object.entries(guest).filter(([, qty]) => Number(qty) > 0);
    if (entries.length === 0) return;

    const remaining: GuestCart = {};

    for (const [productId, qty] of entries) {
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity: qty }),
        });
        if (!res.ok) {
          remaining[productId] = qty;
        }
      } catch {
        remaining[productId] = qty;
      }
    }

    writeGuestCart(remaining);
    if (Object.keys(remaining).length === 0) clearGuestCart();
  }, []);

  const addItem = useCallback(async (productId: string, quantity = 1) => {
    if (await getLoggedIn()) {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) throw new Error(json?.error ?? "Could not add item");
      await refresh();
      return;
    }

    const guest = readGuestCart();
    guest[productId] = (guest[productId] ?? 0) + quantity;
    writeGuestCart(guest);
    setCartCount(guestCartCount(guest));
  }, [refresh]);

  useEffect(() => {
    void refresh();

    async function onAuthChanged() {
      if (await getLoggedIn()) await syncGuestToDb();
      await refresh();
    }

    function onCartUpdated() {
      void refresh();
    }

    window.addEventListener("gas-shop-auth-changed", onAuthChanged);
    window.addEventListener("gas-shop-cart-updated", onCartUpdated);

    return () => {
      window.removeEventListener("gas-shop-auth-changed", onAuthChanged);
      window.removeEventListener("gas-shop-cart-updated", onCartUpdated);
    };
  }, [refresh, syncGuestToDb]);

  const value = useMemo<CartContextValue>(
    () => ({ cartCount, isAuthenticated: authed, refresh, addItem }),
    [cartCount, authed, refresh, addItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
