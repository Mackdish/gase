export type GuestCart = Record<string, number>;

const STORAGE_KEY = "gas-shop-cart";

export function readGuestCart(): GuestCart {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as GuestCart;
  } catch {
    return {};
  }
}

export function writeGuestCart(cart: GuestCart) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // ignore
  }
}

export function clearGuestCart() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function guestCartCount(cart: GuestCart) {
  return Object.values(cart).reduce((sum, qty) => sum + (qty ?? 0), 0);
}
