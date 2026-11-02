import Image from "next/image";

import Reveal from "@/components/ui/Reveal";
import type { getHomeCopy } from "@/lib/content";

type Copy = Awaited<ReturnType<typeof getHomeCopy>>["scenes"];

// 제품 화면에서 쓰는 장면 사진을 같은 순서로 다시 쓴다.
const images = ["scene-bedtime.png", "scene-break.png", "scene-nap.png"];

export default function ScenesSection({ copy }: { copy: Copy }) {
  return (
    <section
      aria-labelledby="home-scenes"
      className="mx-auto max-w-360 px-6 pb-16 md:px-10 md:pb-24 lg:px-20 lg:pb-28"
    >
      <Reveal>
        <h2 id="home-scenes" className="text-h3 text-fg md:text-h2">
          {copy.title}
        </h2>
      </Reveal>
      <ul className="mt-9 grid gap-6 md:mt-14 md:grid-cols-3 md:gap-8">
        {copy.items.map((item, index) => (
          <li key={item.title}>
            <Reveal>
              <article className="overflow-hidden rounded-3xl bg-surface-muted hover:shadow-lg motion-safe:transition-[translate,box-shadow] motion-safe:duration-200 motion-safe:hover:-translate-y-1.5">
                <Image
                  src={`/images/product/${images[index]}`}
                  alt=""
                  width={572}
                  height={254}
                  sizes="(min-width: 1440px) 416px, (min-width: 768px) 32vw, 100vw"
                  className="aspect-572/254 w-full object-cover"
                />
                <div className="p-7">
                  <h3 className="text-title text-fg">{item.title}</h3>
                  <p className="mt-2 text-body-sm text-fg-muted">
                    {item.description}
                  </p>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
