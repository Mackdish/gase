import Link from "next/link";
import { HeaderServer } from "@/components/site/HeaderServer";
import { GuestCheckoutClient } from "@/components/checkout/GuestCheckoutClient";

export default function GuestCheckoutPage() {
  return (
    <div className="min-h-screen font-sans text-zinc-950 dark:text-zinc-50">
      <HeaderServer />

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/cart" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
            ← Back to cart
          </Link>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Guest checkout</div>
        </div>

        <div className="mt-4">
          <GuestCheckoutClient />
        </div>
      </main>
    </div>
  );
}
