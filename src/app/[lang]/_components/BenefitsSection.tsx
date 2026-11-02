import Image from "next/image";

import Reveal from "@/components/ui/Reveal";
import type { getHomeCopy } from "@/lib/content";

type Copy = Awaited<ReturnType<typeof getHomeCopy>>["benefits"];

// 카드 순서와 맞는 사진이다. 첫 카드는 크게 강조한다. position은 사진이 잘릴 때 보여 줄 부분이다.
const photos = [
  { src: "benefit-standalone.webp", position: "object-center" },
  { src: "benefit-light.webp", position: "object-center" },
  { src: "benefit-comfort.webp", position: "object-center" },
  { src: "benefit-research.webp", position: "object-top" },
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
          // 가로로 넓은 카드는 사진을 옆에 두어 사진이 너무 커지지 않게 한다.
          const isWide = index === 3;
          const photo = photos[index];
          return (
            <li key={item.title} className={`flex ${itemClassNames[index]}`}>
              <Reveal className="w-full">
                <article
                  className={`flex h-full flex-col rounded-3xl p-4 hover:shadow-lg motion-safe:transition-[translate,box-shadow] motion-safe:duration-200 motion-safe:hover:-translate-y-1.5 md:p-5 ${
                    isFeature
                      ? "bg-brand text-surface"
                      : "bg-surface-muted text-fg"
                  } ${isWide ? "md:flex-row md:items-center md:gap-4" : ""}`}
                >
                  <div
                    className={`relative w-full overflow-hidden rounded-2xl bg-surface-image ${
                      isFeature
                        ? "aspect-4/3 lg:aspect-auto lg:min-h-72 lg:flex-1"
                        : "aspect-4/3"
                    } ${isWide ? "md:aspect-square md:w-44 md:shrink-0" : ""}`}
                  >
                    <Image
                      src={`/images/home/${photo.src}`}
                      alt={item.imageAlt}
                      fill
                      sizes={
                        isFeature
                          ? "(min-width: 1024px) 560px, (min-width: 768px) 90vw, 100vw"
                          : "(min-width: 1024px) 280px, (min-width: 768px) 45vw, 100vw"
                      }
                      className={`object-cover ${photo.position}`}
                    />
                  </div>
                  <div
                    className={isFeature ? "px-2 pt-6 pb-3" : "px-2 pt-5 pb-3"}
                  >
                    <h3
                      className={
                        isFeature ? "text-h3 md:text-h2" : "text-title"
                      }
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
                  </div>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
