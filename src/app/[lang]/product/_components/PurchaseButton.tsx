import type { ProductCopy } from "./types";

export default function PurchaseButton({
  url,
  copy,
}: {
  url: string | null;
  copy: ProductCopy["intro"];
}) {
  const className =
    "inline-flex min-h-13 items-center justify-center rounded-full bg-violet px-7.5 text-ui-button text-white    motion-safe:transition-colors motion-safe:duration-200";

  return url?.startsWith("https://") ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} hover:bg-violet-strong`}
    >
      {copy.purchaseButton}
    </a>
  ) : (
    <button type="button" disabled className={`${className} cursor-default`}>
      {copy.comingSoon}
    </button>
  );
}
