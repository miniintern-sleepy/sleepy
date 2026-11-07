export default function PurchaseButton({
  url,
  copy,
}: {
  url: string | null;
  copy: { purchaseButton: string; comingSoon: string };
}) {
  return url?.startsWith("https://") ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="public-purchase"
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
