import Image from "next/image";

import Reveal from "@/components/ui/Reveal";

import type { ProductCopy } from "./types";

const images = [
  {
    src: "/images/product/case-cutout.png",
    alt: "닫힌 슬리비 충전 케이스",
    background: "bg-linear-to-r from-panel to-paper",
    outerEdge: "left-0 bg-linear-to-r",
  },
  {
    src: "/images/product/hand-holding.png",
    alt: "손으로 슬리비 귀마개를 꺼내는 모습",
    background: "",
    outerEdge: "right-0 bg-linear-to-l",
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
          className="text-feature-heading whitespace-pre-line md:text-detail-heading lg:text-detail-heading"
        >
          {copy.title}
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-0 lg:mt-28.75">
        {copy.items.map((item, index) => (
          <Reveal key={item.title}>
            {images[index] && (
              <div
                className={`relative aspect-4/3 ${images[index].background}`}
              >
                <Image
                  src={images[index].src}
                  alt={images[index].alt}
                  fill
                  sizes="(min-width: 1440px) 720px, (min-width: 768px) 50vw, 100vw"
                  className="object-contain"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-linear-to-b from-paper to-paper/0 lg:h-20"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-b from-paper/0 to-paper lg:h-20"
                />
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-y-0 hidden w-35 from-paper to-paper/0 min-[90.0625rem]:block ${images[index].outerEdge}`}
                />
              </div>
            )}
            <div className="mt-8 px-6 md:px-10 lg:mt-15 lg:px-20">
              <h3 className="text-metric-label lg:text-feature-heading">
                {item.title}
              </h3>
              <p className="mt-5 text-product-lead whitespace-pre-line text-muted lg:mt-10.25">
                {item.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
