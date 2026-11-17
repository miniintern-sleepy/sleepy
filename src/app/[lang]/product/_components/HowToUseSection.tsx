import Image from "next/image";

import Reveal from "@/components/ui/Reveal";
import ProductPhotoStrip from "./ProductPhotoStrip";

import type { ProductCopy } from "./types";

import type { UiCopy } from "@/content/ko/ui";

const images = [
  "/images/product/step-01.png",
  "/images/product/step-02.png",
  "/images/product/step-03.png",
];

export default function HowToUseSection({
  copy,
  ui,
}: {
  copy: ProductCopy["howToUse"];
  ui: UiCopy["product"];
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
      <ProductPhotoStrip className="product-guide-steps" label={ui.howToLabel}>
        {copy.steps.map((step, index) => (
          <Reveal key={step}>
            <figure className="product-hover-card">
              <Image
                src={images[index]}
                alt={ui.howToAlts[index]}
                width={416}
                height={300}
                sizes="(max-width:767px) 100vw,33vw"
              />
              <figcaption className="text-guide-caption">{step}</figcaption>
            </figure>
          </Reveal>
        ))}
      </ProductPhotoStrip>
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
