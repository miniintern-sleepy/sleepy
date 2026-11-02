import Image from "next/image";
import Link from "next/link";

import Reveal from "@/components/ui/Reveal";

import "./AlgorithmSection.css";
import type { ProductCopy } from "./types";

const waves = [
  "size-60 opacity-55",
  "size-87.5 opacity-50",
  "size-115 opacity-45",
  "size-142.5 opacity-40",
  "size-170 opacity-35",
  "size-197.5 opacity-30",
  "size-225 opacity-25",
  "size-252.5 opacity-20",
];

export default function AlgorithmSection({
  copy,
  lang,
}: {
  copy: ProductCopy["algorithm"];
  lang: string;
}) {
  return (
    <section aria-labelledby="product-algorithm" data-product-algorithm>
      <div className="relative mx-auto max-w-360 px-6 pt-16 md:px-10 lg:min-h-180 lg:px-20 lg:pt-50">
        <Reveal className="relative z-1">
          <h2
            id="product-algorithm"
            className="text-product-feature whitespace-pre-line md:text-tech-heading lg:text-product-heading"
          >
            {copy.title}
          </h2>
          <p className="mt-5.5 text-tech-body whitespace-pre-line text-fg-muted">
            {copy.description}
          </p>
          <Link
            href={`/${lang}/technology`}
            className="mt-7.5 inline-flex min-h-11 items-center text-tech-label underline underline-offset-4 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand motion-safe:transition-colors"
          >
            {copy.link}
          </Link>
        </Reveal>
        <div
          aria-hidden="true"
          className="pointer-events-none relative h-112 md:h-140 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2"
        >
          <div className="absolute top-1/2 left-1/2 size-252.5 -translate-x-1/2 -translate-y-1/2 scale-60 md:scale-80 lg:-ml-10 lg:scale-100">
            <div
              data-product-algorithm-glow
              className="absolute top-1/2 left-1/2 size-180 -translate-x-1/2 -translate-y-1/2 rounded-full"
            />
            {waves.map((wave) => (
              <div
                key={wave}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand ${wave}`}
              />
            ))}
            <Image
              src="/images/product/earbuds-cutout.png"
              alt=""
              width={900}
              height={1000}
              sizes="900px"
              className="absolute top-1.25 left-1.25 h-250 w-225 max-w-none object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
