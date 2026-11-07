import Image from "next/image";

import Reveal from "@/components/ui/Reveal";

import type { ProductCopy } from "./types";

const images = ["scene-bedtime.png", "scene-nap.png", "scene-break.png"];

export default function MomentsSection({
  copy,
}: {
  copy: ProductCopy["moments"];
}) {
  return (
    <section
      aria-labelledby="product-moments"
      className="relative mx-auto max-w-360 px-6 py-16 md:px-10 lg:px-20 lg:pt-10 lg:pb-26"
    >
      <Reveal className="grid gap-6 lg:grid-cols-[720fr_560fr] lg:gap-0">
        <h2
          id="product-moments"
          className="text-feature-heading whitespace-pre-line lg:text-detail-heading"
        >
          {copy.title}
        </h2>
        <p className="text-product-lead whitespace-pre-line text-muted lg:pt-1.5">
          {copy.description}
        </p>
      </Reveal>
      <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-4 lg:mt-12.5">
        {copy.labels.map((label, index) => (
          <Reveal key={label}>
            <figure className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-1">
              {images[index] && (
                <Image
                  src={`/images/product/${images[index]}`}
                  alt={label}
                  width={416}
                  height={185}
                  sizes="(min-width: 1440px) 416px, (min-width: 768px) 32vw, 100vw"
                  className="aspect-[416/185] w-full object-cover"
                />
              )}
              <figcaption className="mt-3.75 text-study-title">
                {label}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
