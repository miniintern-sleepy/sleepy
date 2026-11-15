import Image from "next/image";

import Reveal from "@/components/ui/Reveal";

import type { ProductCopy } from "./types";

export default function KitSection({ copy }: { copy: ProductCopy["kit"] }) {
  return (
    <section aria-labelledby="product-kit" className="public-wrap product-kit">
      <Reveal className="product-kit-media">
        <Image
          src="/images/product/components.png"
          alt="슬리비 케이스, 귀마개 본체, 충전 케이블, 이어팁과 사용설명서"
          width={720}
          height={480}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="product-kit-photo"
        />
      </Reveal>
      <Reveal className="product-kit-copy">
        <h2 id="product-kit" className="text-kit-heading">
          {copy.title}
        </h2>
        <ul className="mt-10 border-t border-rule">
          {copy.items.map((item) => (
            <li
              key={item}
              className="border-b border-rule py-3.25 text-kit-item last:border-0"
            >
              {item}
            </li>
          ))}
        </ul>
        <dl className="product-kit-metrics">
          {copy.metrics.map((metric) => (
            <div
              key={metric.label}
              className="product-kit-metric flex min-w-0 flex-col-reverse gap-3"
            >
              <dt className="text-ui-label text-muted">{metric.label}</dt>
              <dd className="text-spec-value whitespace-nowrap">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
