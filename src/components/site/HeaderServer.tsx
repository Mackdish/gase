import { Suspense } from "react";
import { env } from "cloudflare:workers";
import { HeaderClient } from "./HeaderClient";

type CategoryOption = { slug: string; name: string };

export async function HeaderServer() {
  let categories: CategoryOption[] = [];

  try {
    if (env.DB) {
      const result = await env.DB.prepare(
        'SELECT "slug", "name" FROM "Category" ORDER BY "name" ASC LIMIT 20'
      ).all<CategoryOption>();
      categories = result.results ?? [];
    }
  } catch (error) {
    console.error("Header category query failed:", error);
  }

  return (
    <Suspense
      fallback={
        <div className="h-[104px] border-b border-black/5 dark:border-white/10" />
      }
    >
      <HeaderClient categories={categories} />
    </Suspense>
  );
}
