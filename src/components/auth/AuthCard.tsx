"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Mode = "login" | "register";

type AuthCardProps = {
  mode: Mode;
};

export function AuthCard({ mode }: AuthCardProps) {
  const title = mode === "login" ? "Welcome back" : "Create your account";
  const subtitle =
    mode === "login"
      ? "Sign in to continue to JOOUST STORE"
      : "Join JOOUST STORE to start shopping";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = useMemo(() => {
    if (!email || !password) return false;
    if (mode === "register" && name.trim().length < 2) return false;
    return true;
  }, [email, password, name, mode]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "login"
            ? { email, password }
            : { name: name.trim(), email, password }
        ),
      });

      const json = (await res.json().catch(() => null)) as
        | { ok: true; data: { user: { role: "ADMIN" | "CUSTOMER" } } }
        | { ok: false; error: string }
        | null;

      if (!res.ok || !json || json.ok === false) {
        setError(json && "error" in json ? json.error : "Something went wrong");
        return;
      }

      window.dispatchEvent(new Event("gas-shop-auth-changed"));

      const role = json.data.user.role;
      if (role === "ADMIN") {
        window.location.href = "/admin";
        return;
      }

      const sp = new URLSearchParams(window.location.search);
      const next = sp.get("next");
      if (next && next.startsWith("/") && !next.startsWith("/admin")) {
        window.location.href = next;
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <div>
          <div className="text-xs font-semibold text-orange-600">JOOUST STORE</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {title}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {subtitle}
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {mode === "register" ? (
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Full name
              </label>
              <input
                className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-orange-500/60 dark:border-white/10 dark:bg-black dark:text-zinc-50"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>
          ) : null}

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-orange-500/60 dark:border-white/10 dark:bg-black dark:text-zinc-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <input
              className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-orange-500/60 dark:border-white/10 dark:bg-black dark:text-zinc-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-200">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>

          <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            {mode === "login" ? (
              <>
                Don’t have an account?{" "}
                <Link className="font-semibold text-orange-600" href="/register">
                  Create one
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link className="font-semibold text-orange-600" href="/login">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </form>
      </div>

      <div className="mt-4 rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs text-zinc-600 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-300">
        Seeded accounts:
        <div className="mt-1">
          Admin: admin@gas-shop.local / Admin123!
        </div>
        <div>Customer: customer@gas-shop.local / Customer123!</div>
      </div>
    </div>
  );
}
