import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { HeaderClient } from "./HeaderClient";

export async function HeaderServer() {
  const categories = await prisma.category.findMany({
    select: { slug: true, name: true },
    orderBy: { name: "asc" },
  });

  const preferredOrder = ["gas", "electrical-equipments", "furnitures"];
  const preferredIndex = new Map(preferredOrder.map((slug, idx) => [slug, idx] as const));
  categories.sort((a, b) => {
    const ai = preferredIndex.get(a.slug);
    const bi = preferredIndex.get(b.slug);
    if (ai !== undefined && bi !== undefined) return ai - bi;
    if (ai !== undefined) return -1;
    if (bi !== undefined) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <Suspense fallback={<div className="h-[104px] border-b border-black/5 dark:border-white/10" />}>
      <HeaderClient categories={categories} />
    </Suspense>
  );
}
