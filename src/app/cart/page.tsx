import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthCookieName, verifyAuthToken } from "@/lib/auth";
import { HeaderServer } from "@/components/site/HeaderServer";
import { CartClient } from "@/components/cart/CartClient";
import { GuestCartClient } from "@/components/cart/GuestCartClient";

export default async function CartPage() {
  const token = (await cookies()).get(getAuthCookieName())?.value;
  let items: any[] = [];
  let authenticated = false;

  if (token) {
    try {
      const auth = await verifyAuthToken(token);
      authenticated = true;
      const cart = await prisma.cart.findUnique({
        where: { userId: auth.sub },
        include: {
          items: {
            include: { product: true },
            orderBy: { updatedAt: "desc" },
          },
        },
      });
      items = cart?.items ?? [];
    } catch {
      authenticated = false;
      items = [];
    }
  }

  return (
    <div className="min-h-screen font-sans text-zinc-950 dark:text-zinc-50">
      <HeaderServer />

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Your Cart</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Review items before checkout.
            </p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
            Continue shopping
          </Link>
        </div>

        {authenticated ? (
          <CartClient
            initialItems={items.map((it: (typeof items)[number]) => ({
              id: it.id,
              quantity: it.quantity,
              product: {
                id: it.product.id,
                slug: it.product.slug,
                name: it.product.name,
                price: it.product.price,
                discount: it.product.discount,
                stock: it.product.stock,
              },
            }))}
          />
        ) : (
          <GuestCartClient />
        )}
      </main>
    </div>
  );
}
