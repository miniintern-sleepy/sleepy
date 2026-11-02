import Image from "next/image";

import Reveal from "@/components/ui/Reveal";

import type { ProductCopy } from "./types";

const images = [
  { src: "/images/product/case-cutout.png", alt: "닫힌 슬리비 충전 케이스" },
  {
    src: "/images/product/hand-holding.png",
    alt: "손으로 슬리비 귀마개를 꺼내는 모습",
  },
];

export default function FeaturesSection({
  copy,
}: {
  copy: ProductCopy["features"];
}) {
  return (
    <section
      aria-labelledby="product-features"
      className="mx-auto max-w-360 py-16 lg:pt-19.25 lg:pb-20"
    >
      <Reveal className="px-6 md:px-10 lg:px-20">
        <h2
          id="product-features"
          className="text-product-feature whitespace-pre-line md:text-tech-heading lg:text-product-heading"
        >
          {copy.title}
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-0 lg:mt-28.75">
        {copy.items.map((item, index) => (
          <Reveal key={item.title}>
            {images[index] && (
              <div className="relative aspect-4/3">
                <Image
                  src={images[index].src}
                  alt={images[index].alt}
                  fill
                  sizes="(min-width: 1440px) 720px, (min-width: 768px) 50vw, 100vw"
                  className="object-contain"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-linear-to-b from-product-surface via-product-surface/0 via-25% to-product-surface"
                />
              </div>
            )}
            <div className="mt-8 px-6 md:px-10 lg:mt-15 lg:px-20">
              <h3 className="text-tech-spectrum lg:text-product-feature">
                {item.title}
              </h3>
              <p className="mt-5 text-product-body whitespace-pre-line text-fg-muted lg:mt-10.25">
                {item.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
