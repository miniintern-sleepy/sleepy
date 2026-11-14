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
      className="public-wrap product-guide"
    >
      <Reveal>
        <h2 id="product-guide" className="text-detail-heading">
          {copy.title}
        </h2>
      </Reveal>
      <div className="product-guide-steps">
        {copy.steps.map((step, index) => (
          <Reveal key={step}>
            <figure className="product-hover-card">
              <Image
                src={images[index].src}
                alt={images[index].alt}
                width={416}
                height={300}
                sizes="(max-width:767px) 100vw,33vw"
              />
              <figcaption className="text-guide-caption">{step}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <Reveal className="product-guide-notes">
        {copy.notes.map((note) => (
          <div key={note.title}>
            <h3 className="text-guide-heading whitespace-pre-line">
              {note.title}
            </h3>
            <p className="text-guide-copy whitespace-pre-line text-muted">
              {note.description}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
