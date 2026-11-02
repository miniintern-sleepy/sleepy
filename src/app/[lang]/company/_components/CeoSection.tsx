import Image from "next/image";

import Reveal from "@/components/ui/Reveal";
import type { getCompanyCopy } from "@/lib/content";

type Copy = Awaited<ReturnType<typeof getCompanyCopy>>["ceo"];

export default function CeoSection({ copy }: { copy: Copy }) {
  return (
    <section
      aria-label="대표 소개"
      className="mx-auto max-w-360 px-6 pb-16 md:px-10 md:pb-24 lg:px-20 lg:pb-28"
    >
      <div className="grid gap-8 md:grid-cols-[16rem_1fr] md:gap-9 lg:grid-cols-[21.25rem_1fr] lg:gap-15">
        {/* 대표 사진이 없으면 사진 칸을 숨긴다(F-02). */}
        {copy.photo && (
          <Reveal>
            <Image
              src={copy.photo}
              alt={copy.photoAlt}
              width={659}
              height={700}
              sizes="(min-width: 1024px) 340px, (min-width: 768px) 256px, 100vw"
              className="aspect-square w-full rounded-3xl object-cover"
            />
          </Reveal>
        )}
        <Reveal className="md:col-start-2">
          <h2 className="text-h3 text-fg">{copy.name}</h2>
          <p className="mt-3 text-body text-fg-muted">{copy.role}</p>
          <div className="mt-7 flex max-w-180 flex-col gap-4 text-body-lg text-fg">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
