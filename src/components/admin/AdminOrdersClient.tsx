"use client";

import { useState } from "react";

export type AdminOrderRow = {
  id: string;
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELED";
  total: number;
  createdAt: string;
  user: { name: string; email: string } | null;
  itemsCount: number;
  mobileNumber?: string | null;
  hostelName?: string | null;
  doorNumber?: string | null;
};

function formatMoneyCents(amountCents: number) {
  const amount = amountCents / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function AdminOrdersClient({ initialOrders }: { initialOrders: AdminOrderRow[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function updateStatus(id: string, status: AdminOrderRow["status"]) {
    setError(null);
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(json?.error ?? "Failed to update status");
        return;
      }

      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: json.data.order.status } : o)));
    } finally {
      setBusyId(null);
    }
  }

  async function refreshOrders() {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders");
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(json?.error ?? "Failed to refresh orders");
        return;
      }
      const rows: AdminOrderRow[] = json.data.orders.map((o: any) => ({
        id: o.id,
        status: o.status,
        total: o.total,
        createdAt: o.createdAt,
        user: o.user,
        itemsCount: o.items.reduce((sum: number, it: any) => sum + it.quantity, 0),
        mobileNumber: o.mobileNumber,
        hostelName: o.hostelName,
        doorNumber: o.doorNumber,
      }));
      setOrders(rows);
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div className="mt-6">
      {error ? (
        <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mb-4 flex justify-end">
        <button
          onClick={refreshOrders}
          disabled={refreshing}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-white/10"
        >
          {refreshing ? "Refreshing..." : "Refresh Orders"}
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <div className="grid grid-cols-14 gap-3 border-b border-black/10 px-4 py-3 text-xs font-semibold text-zinc-500 dark:border-white/10 dark:text-zinc-400">
          <div className="col-span-3">Order</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-3">Delivery</div>
          <div className="col-span-2">Items</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-2">Status</div>
        </div>

        <div className="divide-y divide-black/5 dark:divide-white/10">
          {orders.map((o) => (
            <div key={o.id} className="grid grid-cols-14 gap-3 px-4 py-3 text-sm">
              <div className="col-span-3">
                <div className="font-semibold">#{o.id.slice(-6)}</div>
                <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="col-span-2">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">{o.user ? o.user.name : "Guest"}</div>
                <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{o.user ? o.user.email : "N/A"}</div>
              </div>
              <div className="col-span-3">
                <div className="text-xs text-zinc-700 dark:text-zinc-200">
                  {o.mobileNumber && <div>📞 {o.mobileNumber}</div>}
                  {o.hostelName && <div>🏠 {o.hostelName}</div>}
                  {o.doorNumber && <div>🚪 {o.doorNumber}</div>}
                </div>
              </div>
              <div className="col-span-2 text-zinc-700 dark:text-zinc-200">{o.itemsCount}</div>
              <div className="col-span-2 font-semibold">{formatMoneyCents(o.total)}</div>
              <div className="col-span-2">
                <select
                  className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-xs font-semibold text-zinc-700 outline-none transition focus:border-orange-500/60 disabled:opacity-60 dark:border-white/10 dark:bg-black dark:text-zinc-200"
                  value={o.status}
                  disabled={busyId === o.id}
                  onChange={(e) => updateStatus(o.id, e.target.value as AdminOrderRow["status"])}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELED">CANCELED</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
