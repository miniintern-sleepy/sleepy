import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import type { ProductCopy } from "./types";
const rings = [240, 350, 460, 570, 680, 790, 900, 1010];
export default function AlgorithmSection({
  copy,
  lang,
}: {
  copy: ProductCopy["algorithm"];
  lang: string;
}) {
  return (
    <section className="product-algorithm" aria-labelledby="product-algorithm">
      <div className="public-wrap product-algorithm-inner">
        <Reveal className="product-algorithm-copy">
          <h2
            id="product-algorithm"
            className="text-detail-heading whitespace-pre-line"
          >
            {copy.title}
          </h2>
          <p className="text-copy-large whitespace-pre-line text-muted">
            {copy.description}
          </p>
          <Link href={`/${lang}/technology`} className="text-algorithm-link">
            {copy.link}
          </Link>
        </Reveal>
        <div className="product-algorithm-visual" aria-hidden="true">
          <div className="product-orbits">
            <div className="product-orbit-glow" />
            {rings.map((size, index) => (
              <div
                key={size}
                className="product-orbit-ring"
                style={{
                  width: size,
                  height: size,
                  opacity: 0.55 - index * 0.05,
                }}
              />
            ))}
            <Image
              src="/images/product/earbuds-cutout.png"
              alt=""
              width={900}
              height={1000}
              sizes="900px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
