"use client";

import { useEffect, useMemo, useState } from "react";
import { ClientPagination } from "@/components/ui/ClientPagination";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  createdAt: string;
};

export function AdminUsersClient() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/users", { method: "GET" });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(json?.error ?? "Failed to load users");
        return;
      }
      const users = json?.data?.users ?? [];
      setRows(
        users.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt,
        }))
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const totalPages = Math.max(Math.ceil(rows.length / pageSize), 1);
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page]);

  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3 dark:border-white/10">
        <div className="text-sm font-semibold">Users</div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">{rows.length} total</div>
      </div>

      {error ? (
        <div className="p-4 text-sm text-red-700 dark:text-red-200">{error}</div>
      ) : null}

      {loading ? (
        <div className="p-4 text-sm text-zinc-600 dark:text-zinc-400">Loading...</div>
      ) : (
        <div className="divide-y divide-black/5 dark:divide-white/10">
          {pageRows.map((u) => (
            <div key={u.id} className="grid grid-cols-12 gap-3 px-4 py-3 text-sm">
              <div className="col-span-4">
                <div className="font-semibold">{u.name}</div>
                <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{u.email}</div>
              </div>
              <div className="col-span-4 text-xs text-zinc-600 dark:text-zinc-400">
                Joined: {new Date(u.createdAt).toLocaleDateString()}
              </div>
              <div className="col-span-4 flex items-center justify-end">
                <div className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-700 dark:text-orange-300">
                  {u.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="px-4 pb-4">
        <ClientPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
