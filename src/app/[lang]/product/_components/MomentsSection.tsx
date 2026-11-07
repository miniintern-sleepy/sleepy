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
      className="product-moments public-wrap"
      aria-labelledby="product-moments"
    >
      <Reveal className="product-moments-heading">
        <h2
          id="product-moments"
          className="text-detail-heading whitespace-pre-line"
        >
          {copy.title}
        </h2>
        <p className="text-copy-large whitespace-pre-line text-muted">
          {copy.description}
        </p>
      </Reveal>
      <div className="product-moments-photos">
        {copy.labels.map((label, index) => (
          <Reveal key={label}>
            <figure className="product-hover-card">
              <Image
                src={`/images/product/${images[index]}`}
                alt={label}
                width={416}
                height={185}
                sizes="(max-width:767px) 100vw,33vw"
              />
              <figcaption className="text-scene-caption">{label}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
