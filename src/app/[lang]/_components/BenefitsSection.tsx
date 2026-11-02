import Image from "next/image";

import Reveal from "@/components/ui/Reveal";
import type { getHomeCopy } from "@/lib/content";

type Copy = Awaited<ReturnType<typeof getHomeCopy>>["benefits"];

// 카드 순서와 맞는 아이콘이다. 첫 카드는 크게 강조한다.
const icons = [
  { src: "icon-standalone.jpg", width: 160, height: 130 },
  { src: "icon-light.jpg", width: 160, height: 130 },
  { src: "icon-comfort.jpg", width: 160, height: 130 },
  { src: "icon-research.jpg", width: 160, height: 120 },
];

const itemClassNames = ["md:col-span-2 lg:row-span-2", "", "", "md:col-span-2"];

export default function BenefitsSection({ copy }: { copy: Copy }) {
  return (
    <section
      aria-labelledby="home-benefits"
      className="mx-auto max-w-360 px-6 py-16 md:px-10 md:py-24 lg:px-20 lg:py-28"
    >
      <Reveal>
        <h2 id="home-benefits" className="text-h3 text-fg md:text-h2">
          {copy.title}
        </h2>
      </Reveal>
      <ul className="mt-9 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {copy.items.map((item, index) => {
          const isFeature = index === 0;
          const icon = icons[index];
          return (
            <li key={item.title} className={`flex ${itemClassNames[index]}`}>
              <Reveal className="w-full">
                <article
                  className={`flex h-full flex-col rounded-3xl p-7 hover:shadow-lg motion-safe:transition-[translate,box-shadow] motion-safe:duration-200 motion-safe:hover:-translate-y-1.5 ${
                    isFeature
                      ? "min-h-60 bg-brand p-8 text-surface md:p-10 lg:min-h-96"
                      : "min-h-48 bg-surface-muted text-fg"
                  }`}
                >
                  <span
                    className={`grid place-items-center overflow-hidden rounded-2xl ${
                      isFeature
                        ? "h-21 w-24 bg-surface"
                        : "h-16 w-18 bg-surface"
                    }`}
                  >
                    <Image
                      src={`/images/home/${icon.src}`}
                      alt=""
                      width={icon.width}
                      height={icon.height}
                      className={`object-cover mix-blend-multiply ${
                        isFeature ? "h-16.5 w-20" : "h-13 w-16"
                      }`}
                    />
                  </span>
                  <h3
                    className={`mt-6 ${
                      isFeature ? "text-h3 md:text-h2 lg:mt-auto" : "text-title"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`mt-2.5 ${
                      isFeature
                        ? "text-body text-surface"
                        : "text-body-sm text-fg-muted"
                    }`}
                  >
                    {item.description}
                  </p>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
