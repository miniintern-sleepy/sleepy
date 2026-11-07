import Image from "next/image";

import Reveal from "@/components/ui/Reveal";

import type { ProductCopy } from "./types";

const images = [
  {
    src: "/images/product/step-01.png",
    alt: "귀마개가 담긴 열린 슬리비 케이스",
  },
  {
    src: "/images/product/step-02.png",
    alt: "손으로 케이스에서 꺼낸 슬리비 귀마개",
  },
  {
    src: "/images/product/step-03.png",
    alt: "귓바퀴 안쪽에 밀착해 착용한 슬리비",
  },
];

export default function HowToUseSection({
  copy,
}: {
  copy: ProductCopy["howToUse"];
}) {
  return (
    <section
      id="how-to-use"
      aria-labelledby="product-guide"
      className="relative mx-auto max-w-360 scroll-mt-8 px-6 py-16 md:px-10 lg:px-20 lg:pt-22.5 lg:pb-39"
    >
      <Reveal>
        <h2
          id="product-guide"
          className="text-feature-heading md:text-detail-heading lg:text-detail-heading"
        >
          {copy.title}
        </h2>
      </Reveal>
      <div className="mt-10.25 grid gap-8 md:grid-cols-3 md:gap-4">
        {copy.steps.map((step, index) => (
          <Reveal key={step}>
            <figure className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-1">
              {images[index] && (
                <Image
                  src={images[index].src}
                  alt={images[index].alt}
                  width={416}
                  height={300}
                  sizes="(min-width: 1440px) 416px, (min-width: 768px) 32vw, 100vw"
                  className="aspect-[416/300] w-full object-cover"
                />
              )}
              <figcaption className="mt-5 text-guide-caption">
                {step}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-9.5 grid gap-8 border-t border-rule pt-7.5 md:grid-cols-3 md:gap-4">
        {copy.notes.map((note) => (
          <div key={note.title}>
            <h3 className="text-patent-item">{note.title}</h3>
            <p className="mt-2 text-helper whitespace-pre-line text-muted">
              {note.description}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
