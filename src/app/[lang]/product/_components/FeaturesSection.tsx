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
      className="product-features public-wrap"
      aria-labelledby="product-features"
    >
      <Reveal>
        <h2
          id="product-features"
          className="text-detail-heading whitespace-pre-line"
        >
          {copy.title}
        </h2>
      </Reveal>
      <div className="product-feature-pair">
        {copy.items.map((item, index) => (
          <Reveal key={item.title}>
            <article>
              <div className="product-feature-photo">
                <Image
                  src={images[index].src}
                  alt={images[index].alt}
                  fill
                  sizes="(max-width:767px) 100vw,50vw"
                  className="object-contain"
                />
              </div>
              <div className="product-feature-copy">
                <h3 className="text-feature-heading">{item.title}</h3>
                <p className="text-copy-large whitespace-pre-line text-muted">
                  {item.description}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
