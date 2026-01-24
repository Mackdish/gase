"use client";

import { useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ClientPagination } from "@/components/ui/ClientPagination";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
};

export function AdminCategoriesClient() {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", { method: "GET" });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(json?.error ?? "Failed to load categories");
        return;
      }
      const categories = json?.data?.categories ?? [];
      setRows(categories.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })));
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

  function resetForm() {
    setMode("create");
    setEditingId(null);
    setName("");
    setSlug("");
  }

  async function submit() {
    setError(null);
    setSaving(true);
    try {
      const payload = { name: name.trim(), slug: slug.trim() };
      const endpoint = mode === "create" ? "/api/admin/categories" : `/api/admin/categories/${editingId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(json?.error ?? "Save failed");
        return;
      }

      resetForm();
      await load();
    } finally {
      setSaving(false);
    }
  }

  function startEdit(c: CategoryRow) {
    setMode("edit");
    setEditingId(c.id);
    setName(c.name);
    setSlug(c.slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function requestDelete(id: string) {
    setConfirmId(id);
    setConfirmOpen(true);
  }

  async function doDelete() {
    if (!confirmId) return;

    const res = await fetch(`/api/admin/categories/${confirmId}`, { method: "DELETE" });
    const json = (await res.json().catch(() => null)) as any;
    if (!res.ok) {
      setError(json?.error ?? "Delete failed");
      return;
    }

    setConfirmOpen(false);
    setConfirmId(null);
    await load();
  }

  return (
    <div className="mt-6">
      <ConfirmDialog
        open={confirmOpen}
        title="Delete category?"
        description="This action cannot be undone."
        confirmText="Delete"
        onConfirm={doDelete}
        onClose={() => setConfirmOpen(false)}
      />

      <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold">{mode === "create" ? "Add category" : "Edit category"}</div>
          {mode === "edit" ? (
            <button type="button" onClick={resetForm} className="text-xs font-semibold text-orange-600 hover:text-orange-700">
              Cancel edit
            </button>
          ) : null}
        </div>

        {error ? (
          <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Name</div>
            <input className="mt-1 h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Slug</div>
            <input className="mt-1 h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={submit}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {saving ? "Saving..." : mode === "create" ? "Create" : "Save"}
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3 dark:border-white/10">
          <div className="text-sm font-semibold">Categories</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">{rows.length} total</div>
        </div>

        {loading ? (
          <div className="p-4 text-sm text-zinc-600 dark:text-zinc-400">Loading...</div>
        ) : (
          <div className="divide-y divide-black/5 dark:divide-white/10">
            {pageRows.map((c) => (
              <div key={c.id} className="grid grid-cols-12 gap-3 px-4 py-3 text-sm">
                <div className="col-span-5">
                  <div className="font-semibold">{c.name}</div>
                  <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{c.slug}</div>
                </div>
                <div className="col-span-7 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => startEdit(c)} className="text-xs font-semibold text-orange-600 hover:text-orange-700">Edit</button>
                  <button type="button" onClick={() => requestDelete(c.id)} className="text-xs font-semibold text-red-600 hover:text-red-700">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="px-4 pb-4">
          <ClientPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
