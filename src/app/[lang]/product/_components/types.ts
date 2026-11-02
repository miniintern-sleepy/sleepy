import type { getProductCopy } from "@/lib/content";

export type ProductCopy = Awaited<ReturnType<typeof getProductCopy>>;
