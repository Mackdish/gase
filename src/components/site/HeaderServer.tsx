import { Suspense } from "react";
import { env } from "cloudflare:workers";
import { HeaderClient } from "./HeaderClient";

type CategoryRow = {
  slug: string;
  name: string;
};

export async function HeaderServer() {
  let categories: CategoryRow[] = [];

  try {
    const result = await env.DB.prepare(
      "SELECT slug, name FROM Category ORDER BY name ASC"
    ).all<CategoryRow>();

    categories = result.results ?? [];
  } catch (error) {
    console.error("Header category query failed:", error);
  }

  const preferredOrder = ["gas", "electrical-equipments", "furnitures"];
  const preferredIndex = new Map(
    preferredOrder.map((slug, idx) => [slug, idx] as const)
  );

  categories.sort((a, b) => {
    const ai = preferredIndex.get(a.slug);
    const bi = preferredIndex.get(b.slug);
    if (ai !== undefined && bi !== undefined) return ai - bi;
    if (ai !== undefined) return -1;
    if (bi !== undefined) return 1;
    return a.name.localeCompare(b.name);
  });

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
