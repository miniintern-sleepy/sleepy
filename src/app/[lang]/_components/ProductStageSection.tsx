import Image from "next/image";
import PurchaseButton from "@/components/ui/PurchaseButton";
import ButtonLink from "@/components/ui/ButtonLink";
import type { UiCopy } from "@/content/ko/ui";
import type { getHomeCopy, getProductCopy } from "@/lib/content";
export default function ProductStageSection({
  copy,
  lang,
  purchaseUrl,
  purchaseCopy,
  ui,
}: {
  copy: Awaited<ReturnType<typeof getHomeCopy>>["product"];
  lang: string;
  purchaseUrl: string | null;
  purchaseCopy: Awaited<ReturnType<typeof getProductCopy>>["intro"];
  ui: Pick<UiCopy, "home" | "newWindow">;
}) {
  return (
    <section className="home-product home-section">
      <div className="public-wide home-product-grid">
        <div>
          <h2 className="text-stage-heading whitespace-pre-line">
            {copy.title}
          </h2>
          <p className="text-copy text-muted">{copy.description}</p>
          <div className="home-product-actions">
            <ButtonLink href={`/${lang}/product`} variant="primary">
              {copy.link}
            </ButtonLink>
            <PurchaseButton
              url={purchaseUrl}
              copy={purchaseCopy}
              newWindow={ui.newWindow}
            />
          </div>
        </div>
        <Image
          src="/images/home/benefit-standalone.webp"
          alt={ui.home.productAlt}
          width={1200}
          height={800}
          className="home-stage-photo"
          sizes="(max-width:760px) 100vw,50vw"
        />
      </div>
    </section>
  );
}
