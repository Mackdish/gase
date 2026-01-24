"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

type CategoryOption = { slug: string; name: string };

type HeaderClientProps = {
  categories: CategoryOption[];
  initialCartCount?: number;
};

export function HeaderClient({ categories, initialCartCount = 0 }: HeaderClientProps) {
  const { cartCount, isAuthenticated } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQ = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "all";

  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  void initialCartCount;

  useEffect(() => {
    setQ(initialQ);
    setCategory(initialCategory);
  }, [initialQ, initialCategory]);

  useEffect(() => {
    void router.prefetch("/products");
    void router.prefetch("/account");
    void router.prefetch("/admin");
    void router.prefetch("/cart");
    void router.prefetch("/login");
    void router.prefetch("/register");
    void router.prefetch("/");
  }, [router]);

  useEffect(() => {
    if (!mobileOpen) return;
    void router.prefetch("/products");
    void router.prefetch("/account");
    void router.prefetch("/admin");
    void router.prefetch("/cart");
    void router.prefetch("/login");
    void router.prefetch("/register");
    void router.prefetch("/");
  }, [mobileOpen, router]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
      });
    }
  };

  // cartCount is provided by CartProvider

  const categoryOptions = useMemo(() => [{ slug: "all", name: "All" }, ...categories], [categories]);

  function goToProducts(nextQ: string, nextCategory: string) {
    const sp = new URLSearchParams();
    if (nextQ.trim()) sp.set("q", nextQ.trim());
    if (nextCategory && nextCategory !== "all") sp.set("category", nextCategory);
    router.push(`/products${sp.toString() ? `?${sp.toString()}` : ""}`);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    goToProducts(q, category);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/60">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-zinc-900 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/10 md:hidden"
          aria-label="Menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              JOOUST STORE
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Deals you want</div>
          </div>
        </Link>

        <form onSubmit={onSubmit} className="hidden flex-1 items-center gap-2 md:flex">
          <div className="w-40">
            <select
              className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-zinc-700 outline-none transition focus:border-orange-500/60 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Category"
            >
              {categoryOptions.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1">
            <input
              className="h-10 w-full rounded-xl border border-black/10 bg-white px-4 pr-12 text-sm text-zinc-800 outline-none transition focus:border-orange-500/60 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100"
              placeholder="Search products, brands and categories"
              aria-label="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-1 top-1 inline-flex h-8 w-10 items-center justify-center rounded-lg bg-zinc-950 text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16.5 16.5 21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/products"
            className="hidden rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10 sm:inline-flex"
          >
            Shop
          </Link>

          <Link
            href="/account"
            className="hidden rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10 sm:inline-flex"
          >
            Account
          </Link>

          <Link
            href="/admin"
            className="hidden rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10 sm:inline-flex"
          >
            Admin
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-zinc-900 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/10"
            aria-label="Cart"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 6h15l-1.5 8.25a2 2 0 0 1-1.97 1.65H8.25a2 2 0 0 1-1.98-1.67L4.5 3H2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                fill="currentColor"
              />
            </svg>
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      {mobileOpen ? (
        <div className="mx-auto w-full max-w-6xl px-4 pb-3 md:hidden">
          <div className="rounded-2xl border border-black/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-950">
            <div className="grid gap-2">
              <div className="grid grid-cols-4 gap-2">
                <Link
                  href="/products"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-black dark:text-zinc-200 dark:hover:bg-white/10"
                >
                  Shop
                </Link>
                {isAuthenticated ? (
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-black dark:text-zinc-200 dark:hover:bg-white/10"
                  >
                    Account
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-black dark:text-zinc-200 dark:hover:bg-white/10"
                  >
                    Sign in / Sign up
                  </Link>
                )}
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-black dark:text-zinc-200 dark:hover:bg-white/10"
                >
                  Admin
                </Link>
                {isInstallable ? (
                  <button
                    onClick={() => {
                      handleInstallClick();
                      setMobileOpen(false);
                    }}
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-black dark:text-zinc-200 dark:hover:bg-white/10"
                  >
                    Install App
                  </button>
                ) : (
                  <div className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-zinc-400 dark:border-white/10 dark:bg-black dark:text-zinc-600">
                    Install App
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Categories</div>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => goToProducts("", c.slug)}
                      className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-black dark:text-zinc-200 dark:hover:bg-white/10"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mx-auto w-full max-w-6xl px-4 pb-3 md:hidden">
        <div className="flex gap-2">
          <div className="w-28">
            <select
              className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-zinc-700 outline-none transition focus:border-orange-500/60 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Category"
            >
              {categoryOptions.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative flex-1">
            <input
              className="h-10 w-full rounded-xl border border-black/10 bg-white px-4 pr-12 text-sm text-zinc-800 outline-none transition focus:border-orange-500/60 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100"
              placeholder="Search products"
              aria-label="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-1 top-1 inline-flex h-8 w-10 items-center justify-center rounded-lg bg-zinc-950 text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16.5 16.5 21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </header>
  );
}
