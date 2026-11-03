import type { ProductCopy } from "./types";

export default function PurchaseButton({
  url,
  copy,
}: {
  url: string | null;
  copy: ProductCopy["intro"];
}) {
  const className =
    "inline-flex min-h-13 min-w-35 items-center justify-center rounded-full bg-product-button px-7.5 text-button text-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand motion-safe:transition-colors motion-safe:duration-200";

  return url?.startsWith("https://") ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} hover:bg-brand-deep`}
    >
      {copy.purchaseButton}
    </a>
  ) : (
    <button type="button" disabled className={`${className} cursor-default`}>
      {copy.comingSoon}
    </button>
  );
}
