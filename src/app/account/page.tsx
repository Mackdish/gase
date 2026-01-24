import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthCookieName, verifyAuthToken } from "@/lib/auth";
import { HeaderServer } from "@/components/site/HeaderServer";

export default async function AccountHomePage() {
  const token = (await cookies()).get(getAuthCookieName())?.value;
  if (!token) redirect("/login");

  let userId: string;
  try {
    const auth = await verifyAuthToken(token);
    userId = auth.sub;
  } catch {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) redirect("/login");

  const recentOrders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, status: true, total: true, createdAt: true },
  });

  return (
    <div className="min-h-screen font-sans text-zinc-950 dark:text-zinc-50">
      <HeaderServer />

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Customer Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Manage your profile, orders and reviews.
            </p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
            Continue shopping
          </Link>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
              <div className="text-sm font-semibold">Profile</div>
              <div className="mt-3 space-y-2 text-sm">
                <div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Name</div>
                  <div className="font-semibold">{user.name}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Email</div>
                  <div className="font-semibold">{user.email}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Joined</div>
                  <div className="font-semibold">{new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <Link
                href="/orders"
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/10"
              >
                View order history
              </Link>
              <Link
                href="/account/reviews"
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/10"
              >
                My reviews
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Recent orders</div>
                <Link href="/orders" className="text-xs font-semibold text-orange-600 hover:text-orange-700">
                  See all
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">No orders yet.</div>
              ) : (
                <div className="mt-4 grid gap-3">
                  {recentOrders.map((o: (typeof recentOrders)[number]) => (
                    <Link
                      key={o.id}
                      href={`/orders/${o.id}`}
                      className="block rounded-2xl border border-black/10 bg-zinc-50 px-4 py-3 transition hover:bg-zinc-100 dark:border-white/10 dark:bg-black dark:hover:bg-white/5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold">Order #{o.id.slice(-6)}</div>
                        <div className="text-xs font-semibold text-orange-600">{o.status}</div>
                      </div>
                      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {new Date(o.createdAt).toLocaleString()}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
