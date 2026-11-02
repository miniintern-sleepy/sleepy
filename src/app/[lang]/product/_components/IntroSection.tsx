import Image from "next/image";
import Link from "next/link";

import Reveal from "@/components/ui/Reveal";

import PurchaseButton from "./PurchaseButton";
import type { ProductCopy } from "./types";

import "./IntroSection.css";

export default function IntroSection({
  copy,
  purchaseUrl,
}: {
  copy: ProductCopy["intro"];
  purchaseUrl: string | null;
}) {
  return (
    <section
      aria-labelledby="product-title"
      className="relative isolate mx-auto max-w-360 lg:min-h-180"
    >
      <div
        aria-hidden="true"
        data-product-hero-glow
        className="pointer-events-none absolute top-24 -left-20 -z-10 size-160 rounded-full"
      />
      <div className="relative mx-auto max-w-360 px-6 pt-16 md:px-10 lg:px-20 lg:pt-50">
        <Reveal className="relative z-1">
          <h1
            id="product-title"
            className="text-product-feature whitespace-pre-line md:text-tech-heading lg:text-product-hero"
          >
            {copy.title}
          </h1>
          <p className="mt-5 text-tech-body text-fg-muted">
            {copy.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <PurchaseButton url={purchaseUrl} copy={copy} />
            <Link
              href="#how-to-use"
              className="inline-flex min-h-11 items-center text-tech-label underline underline-offset-4 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand motion-safe:transition-colors"
            >
              {copy.guideButton}
            </Link>
          </div>
        </Reveal>
      </div>
      <div className="relative mt-8 ml-auto aspect-[35/36] w-full max-w-175 lg:absolute lg:top-0 lg:right-0 lg:-z-10 lg:mt-0 lg:h-180">
        <Image
          src="/images/product/main1.png"
          alt="슬리비 귀마개와 열린 충전 케이스"
          fill
          sizes="(min-width: 1024px) 700px, 100vw"
          loading="eager"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-product-surface from-0% via-product-surface/0 via-25% to-product-surface/0"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-product-surface to-product-surface/0"
        />
      </div>
    </section>
  );
}
