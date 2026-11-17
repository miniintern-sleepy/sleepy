"use client";

import { track } from "@/lib/analytics";

export default function PurchaseButton({
  url,
  copy,
  location = "home",
  newWindow = " (새 창)",
}: {
  url: string | null;
  copy: { purchaseButton: string; comingSoon: string };
  location?: string;
  newWindow?: string;
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
      <span className="sr-only">{newWindow}</span>
    </a>
  ) : (
    <button type="button" disabled className="public-purchase">
      {copy.comingSoon}
    </button>
  );
}
