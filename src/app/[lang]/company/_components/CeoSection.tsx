import Image from "next/image";

import Reveal from "@/components/ui/Reveal";
import type { getCompanyCopy } from "@/lib/content";

type Copy = Awaited<ReturnType<typeof getCompanyCopy>>["ceo"];

export default function CeoSection({ copy }: { copy: Copy }) {
  return (
    <section
      aria-label="대표 소개"
      className="mx-auto max-w-360 px-6 py-16 md:px-10 md:py-24 lg:px-20 lg:py-32"
    >
      <div
        className={`grid items-center gap-10 ${
          copy.photo
            ? "md:grid-cols-[20rem_1fr] md:gap-12 lg:grid-cols-[minmax(0,34rem)_1fr] lg:gap-24"
            : ""
        }`}
      >
        {/* 대표 사진이 없으면 사진 칸을 숨긴다(F-02). */}
        {copy.photo && (
          <Reveal>
            <Image
              src={copy.photo}
              alt={copy.photoAlt}
              width={659}
              height={700}
              sizes="(min-width: 1024px) 544px, (min-width: 768px) 320px, 100vw"
              className="aspect-square w-full object-cover object-top"
            />
          </Reveal>
        )}
        <Reveal>
          <p className="text-eyebrow text-brand">CEO</p>
          <h2 className="mt-3 text-h2 text-brand-deep md:text-tech-heading">
            {copy.name}
          </h2>
          <p className="mt-3 text-tech-body text-fg-muted">{copy.role}</p>
          {/* 기술 화면의 세로선 모티프를 따라 가는 보라 선을 옆에 둔다. */}
          <blockquote className="mt-8 max-w-160 border-l-2 border-brand pl-6 text-tech-subtitle text-brand-deep md:mt-10 lg:text-tech-clinical-title">
            {copy.quote}
          </blockquote>
          <div className="mt-8 flex max-w-160 flex-col gap-4 text-tech-body text-fg-muted">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
