import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import PurchaseButton from "@/components/ui/PurchaseButton";
import type { ProductCopy } from "./types";
export default function IntroSection({
  copy,
  purchaseUrl,
}: {
  copy: ProductCopy["intro"];
  purchaseUrl: string | null;
}) {
  return (
    <section className="product-intro">
      <div className="product-intro-inner">
        <div
          className="product-watermark text-product-watermark"
          aria-hidden="true"
        >
          Sleeby
        </div>
        <div
          className="product-wordmark text-product-wordmark"
          aria-hidden="true"
        >
          Sleeby
        </div>
        <div className="product-halftone" aria-hidden="true" />
        <div className="product-objects" aria-hidden="true">
          <div className="product-buds">
            <div className="product-crop product-buds-crop">
              <Image
                src="/images/product/earbuds-cutout.png"
                alt=""
                width={1800}
                height={2000}
                className="product-crop-image"
                sizes="(max-width:760px) 140vw,75vw"
                loading="eager"
              />
            </div>
          </div>
          <div className="product-case">
            <div className="product-crop product-case-crop">
              <Image
                src="/images/product/case-cutout.png"
                alt=""
                width={1440}
                height={1080}
                className="product-crop-image"
                sizes="(max-width:760px) 100vw,55vw"
                loading="eager"
              />
            </div>
          </div>
        </div>
        <Reveal className="product-hero-copy">
          <h1 className="text-product-intro-title whitespace-pre-line">
            {copy.title}
          </h1>
          <p className="text-product-hero-copy text-muted">
            {copy.description}
          </p>
          <div className="product-intro-actions">
            <PurchaseButton url={purchaseUrl} copy={copy} />
            <a href="#how-to-use" className="text-product-hero-link">
              {copy.guideButton}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </Reveal>
        <nav className="product-section-links" aria-label="제품 구간">
          <a href="#product-features">슬리비의 특징</a>
          <a href="#how-to-use">꺼내서, 꽂으면 끝</a>
          <a href="#product-moments">일상 속의 슬리비</a>
        </nav>
      </div>
    </section>
  );
}
