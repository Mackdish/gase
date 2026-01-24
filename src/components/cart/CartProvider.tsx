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
  if (!res.ok) return 0;
  const json = (await res.json().catch(() => null)) as any;
  const items = json?.data?.cart?.items;
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum: number, it: any) => sum + (it.quantity ?? 0), 0);
}

async function isLoggedIn(): Promise<boolean> {
  const res = await fetch("/api/auth/me", { method: "GET" });
  return res.ok;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [authed, setAuthed] = useState(false);

  const refresh = useCallback(async () => {
    const logged = await isLoggedIn();
    setAuthed(logged);

    if (logged) {
      setCartCount(await fetchDbCartCount());
      return;
    }

    const guest = readGuestCart();
    setCartCount(guestCartCount(guest));
  }, []);

  async function syncGuestToDb() {
    const guest = readGuestCart();
    const entries = Object.entries(guest).filter(([, qty]) => qty && qty > 0);
    if (entries.length === 0) return;

    for (const [productId, qty] of entries) {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: qty }),
      }).catch(() => null);
    }

    clearGuestCart();
  }

  const addItem = useCallback(async (productId: string, quantity = 1) => {
    if (await isLoggedIn()) {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      await refresh();
      return;
    }

    const guest: GuestCart = readGuestCart();
    guest[productId] = (guest[productId] ?? 0) + quantity;
    writeGuestCart(guest);
    setCartCount(guestCartCount(guest));
  }, [refresh]);

  useEffect(() => {
    refresh();

    async function onAuthChanged() {
      const logged = await isLoggedIn();
      setAuthed(logged);
      if (logged) {
        await syncGuestToDb();
      }
      await refresh();
    }

    function onCartUpdated() {
      refresh();
    }

    window.addEventListener("gas-shop-auth-changed", onAuthChanged);
    window.addEventListener("gas-shop-cart-updated", onCartUpdated);

    return () => {
      window.removeEventListener("gas-shop-auth-changed", onAuthChanged);
      window.removeEventListener("gas-shop-cart-updated", onCartUpdated);
    };
  }, [refresh]);

  const value = useMemo<CartContextValue>(
    () => ({
      cartCount,
      isAuthenticated: authed,
      refresh,
      addItem,
    }),
    [cartCount, authed, refresh, addItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
