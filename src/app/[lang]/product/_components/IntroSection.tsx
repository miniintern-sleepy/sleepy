import Image from "next/image";

import Reveal from "@/components/ui/Reveal";

import PurchaseButton from "./PurchaseButton";
import type { ProductCopy } from "./types";

export default function IntroSection({
  copy,
  purchaseUrl,
}: {
  copy: ProductCopy["intro"];
  purchaseUrl: string | null;
}) {
  return (
    <section aria-labelledby="product-title" className="relative">
      {/* 1024~1440px에서는 시안(1440×860) 비율을 유지하려고 간격을 vw로 줄인다(#39). */}
      <div className="relative mx-auto max-w-360 lg:min-h-[min(59.72vw,53.75rem)] lg:bg-linear-to-r lg:from-product-surface lg:to-product-shade lg:to-[51.39%]">
        <div className="relative px-6 pt-16 md:px-10 lg:px-0 lg:pt-[min(19.72vw,17.75rem)] lg:pl-[min(7.36vw,6.625rem)]">
          <Reveal className="relative z-1">
            <h1
              id="product-title"
              className="text-product-wordmark text-brand lg:ml-[min(2.15vw,1.9375rem)]"
            >
              {copy.title}
            </h1>
            <div className="mt-5 flex w-fit flex-col">
              <p className="text-product-tagline text-fg">{copy.description}</p>
              <div className="mt-10 self-end lg:mt-[min(8.26vw,7.4375rem)]">
                <PurchaseButton url={purchaseUrl} copy={copy} />
              </div>
            </div>
          </Reveal>
        </div>
        <div className="relative mt-8 ml-auto aspect-35/43 w-full max-w-175 lg:absolute lg:top-0 lg:right-0 lg:mt-0 lg:aspect-auto lg:h-full lg:w-[48.61%] lg:max-w-none">
          <Image
            src="/images/product/main1.png"
            alt="슬리비 귀마개와 열린 충전 케이스"
            fill
            sizes="(min-width: 1440px) 700px, (min-width: 1024px) 49vw, 100vw"
            loading="eager"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-17.5 bg-linear-to-b from-product-surface to-product-surface/0 lg:hidden"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-35 bg-linear-to-r from-product-surface to-product-surface/0 md:block lg:from-product-shade lg:to-product-shade/0"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-35 bg-linear-to-l from-product-surface to-product-surface/0 min-[90.0625rem]:block"
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-17.5 bg-linear-to-b from-surface to-surface/0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-25 bg-linear-to-b from-product-surface/0 to-product-surface"
      />
    </section>
  );
}
