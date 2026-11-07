import Image from "next/image";

import Reveal from "@/components/ui/Reveal";
import type { ProductSpec } from "@/types/content";

import type { ProductCopy } from "./types";

const metricLabels = [
  "귀마개 무게",
  "충전 케이스 무게",
  "소비전력",
  "무상 A/S",
];

export default function KitSection({
  copy,
  specs,
}: {
  copy: ProductCopy["kit"];
  specs: ProductSpec[];
}) {
  const metrics = metricLabels.flatMap((label) => {
    const spec = specs.find((item) => item.label === label);
    return spec ? [spec] : [];
  });

  return (
    <section aria-labelledby="product-kit" className="public-wrap product-kit">
      <Reveal>
        <Image
          src="/images/product/components.png"
          alt="슬리비 케이스, 귀마개 본체, 충전 케이블, 이어팁과 사용설명서"
          width={720}
          height={480}
          sizes="(min-width: 1440px) 720px, (min-width: 768px) 50vw, 100vw"
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
        {metrics.length > 0 && (
          <dl className="mt-15 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {metrics.map((spec) => (
              <div
                key={spec.id}
                className="flex min-w-0 flex-col-reverse gap-3"
              >
                <dt className="text-ui-label text-muted">{spec.label}</dt>
                <dd className="text-spec-value wrap-anywhere whitespace-pre-line">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Reveal>
    </section>
  );
}
