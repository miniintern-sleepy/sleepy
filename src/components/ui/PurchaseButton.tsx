"use client";

import { track } from "@/lib/analytics";

export default function PurchaseButton({
  url,
  copy,
  location = "home",
}: {
  url: string | null;
  copy: { purchaseButton: string; comingSoon: string };
  location?: string;
}) {
  return url?.startsWith("https://") ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="public-purchase"
      onClick={() => track("purchase_click", { location })}
    >
      {copy.purchaseButton}
      <span className="sr-only"> (새 창)</span>
    </a>
  ) : (
    <button type="button" disabled className="public-purchase">
      {copy.comingSoon}
    </button>
  );
}
