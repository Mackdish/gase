import { Suspense } from "react";
import { HeaderClient } from "./HeaderClient";

export async function HeaderServer() {
  // Keep the initial storefront render independent of D1. Categories are
  // loaded by the products experience after the Worker is running, so a
  // database/binding problem can never prevent the homepage shell from rendering.
  return (
    <Suspense
      fallback={
        <div className="h-[104px] border-b border-black/5 dark:border-white/10" />
      }
    >
      <HeaderClient categories={[]} />
    </Suspense>
  );
}
