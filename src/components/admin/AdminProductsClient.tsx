"use client";

import { useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ClientPagination } from "@/components/ui/ClientPagination";

type Category = { id: string; name: string };

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount: number;
  stock: number;
  isFlashSale: boolean;
  categoryId: string;
  categoryName: string;
  imageUrl?: string;
};

export function AdminProductsClient({ categories }: { categories: Category[] }) {
  const [rows, setRows] = useState<ProductRow[]>([]);
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
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [stock, setStock] = useState(0);
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", { method: "GET" });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(json?.error ?? "Failed to load products");
        return;
      }
      const products = json?.data?.products ?? [];
      const mapped: ProductRow[] = products.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        discount: p.discount,
        stock: p.stock,
        isFlashSale: p.isFlashSale,
        categoryId: p.categoryId,
        categoryName: p.category?.name ?? "",
        imageUrl: Array.isArray(p.images) ? p.images[0] : undefined,
      }));
      setRows(mapped);
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
    setPrice(0);
    setDiscount(0);
    setStock(0);
    setBrand("");
    setCategoryId(categories[0]?.id ?? "");
    setIsFlashSale(false);
    setImageUrl("");
    setImageFile(null);
  }

  async function uploadIfNeeded() {
    if (!imageFile) return null;

    const fd = new FormData();
    fd.append("file", imageFile);

    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = (await res.json().catch(() => null)) as any;
    if (!res.ok) throw new Error(json?.error ?? "Upload failed");
    return json?.data?.url as string;
  }

  async function submit() {
    setError(null);
    setSaving(true);

    try {
      const uploaded = await uploadIfNeeded();
      const img = uploaded ?? (imageUrl.trim() ? imageUrl.trim() : "https://placehold.co/600x600/png");

      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        price: Number(price),
        discount: Number(discount),
        stock: Number(stock),
        brand: brand.trim() || undefined,
        images: [img],
        isFlashSale,
        categoryId,
      };

      const endpoint = mode === "create" ? "/api/admin/products" : `/api/admin/products/${editingId}`;
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
    } catch (e: any) {
      setError(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(p: ProductRow) {
    setMode("edit");
    setEditingId(p.id);
    setName(p.name);
    setSlug(p.slug);
    setPrice(p.price);
    setDiscount(p.discount);
    setStock(p.stock);
    setBrand("");
    setCategoryId(p.categoryId);
    setIsFlashSale(p.isFlashSale);
    setImageUrl(p.imageUrl ?? "");
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function requestDelete(id: string) {
    setConfirmId(id);
    setConfirmOpen(true);
  }

  async function doDelete() {
    if (!confirmId) return;
    setError(null);

    const res = await fetch(`/api/admin/products/${confirmId}`, { method: "DELETE" });
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
        title="Delete product?"
        description="This action cannot be undone."
        confirmText="Delete"
        onConfirm={doDelete}
        onClose={() => setConfirmOpen(false)}
      />

      <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold">
            {mode === "create" ? "Add product" : "Edit product"}
          </div>
          {mode === "edit" ? (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700"
            >
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
          <div>
            <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Price (cents)</div>
            <input type="number" className="mt-1 h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </div>
          <div>
            <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Discount (%)</div>
            <input type="number" className="mt-1 h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
          </div>
          <div>
            <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Stock</div>
            <input type="number" className="mt-1 h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
          </div>
          <div>
            <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Category</div>
            <select className="mt-1 h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Image</div>
            <div className="mt-1 grid gap-2 sm:grid-cols-2">
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black" />
              <input placeholder="or paste URL" className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <input type="checkbox" checked={isFlashSale} onChange={(e) => setIsFlashSale(e.target.checked)} />
                Flash sale
              </label>
            </div>
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
          <div className="text-sm font-semibold">Products</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">{rows.length} total</div>
        </div>

        {loading ? (
          <div className="p-4 text-sm text-zinc-600 dark:text-zinc-400">Loading...</div>
        ) : (
          <div className="divide-y divide-black/5 dark:divide-white/10">
            {pageRows.map((p) => (
              <div key={p.id} className="grid grid-cols-12 gap-3 px-4 py-3 text-sm">
                <div className="col-span-5">
                  <div className="font-semibold">{p.name}</div>
                  <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">/{p.slug}</div>
                </div>
                <div className="col-span-3 text-xs text-zinc-600 dark:text-zinc-400">
                  {p.categoryName}
                </div>
                <div className="col-span-2 font-semibold">{p.price}</div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => startEdit(p)} className="text-xs font-semibold text-orange-600 hover:text-orange-700">Edit</button>
                  <button type="button" onClick={() => requestDelete(p.id)} className="text-xs font-semibold text-red-600 hover:text-red-700">Delete</button>
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
