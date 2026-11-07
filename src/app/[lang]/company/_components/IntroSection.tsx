import Image from "next/image";

import Reveal from "@/components/ui/Reveal";
import type { getCompanyCopy } from "@/lib/content";

type Copy = Awaited<ReturnType<typeof getCompanyCopy>>["intro"];
type Fact = { value: string; label: string };

export default function IntroSection({
  copy,
  facts,
}: {
  copy: Copy;
  facts: Fact[];
}) {
  return (
    <section
      aria-labelledby="company-title"
      className="relative isolate overflow-hidden text-white"
    >
      <Image
        src={copy.background}
        alt=""
        fill
        sizes="100vw"
        priority
        className="-z-10 object-cover object-[70%_30%]"
      />
      {/* 사진의 밝은 부분에서도 본문 대비를 확보한다(#54). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-photo-scrim md:bg-linear-to-r md:from-ink/85 md:via-ink/70 md:to-ink/70"
      />
      <div className="company-hero-inner flex min-h-136 flex-col justify-between gap-16 pt-16 pb-10 md:min-h-160 md:pt-28 md:pb-14">
        <Reveal>
          <h1
            id="company-title"
            className="text-page-title whitespace-pre-line"
          >
            {copy.title}
          </h1>
          <p className="mt-5 max-w-120 text-copy-large text-white md:mt-7 md:text-science-intro">
            {copy.description}
          </p>
        </Reveal>

        {/* 회사 한눈에 보기. 사진 아래쪽에 가는 선과 함께 놓는다. */}
        <Reveal>
          <dl className="grid max-w-xl grid-cols-3 gap-4 border-t border-paper/40 pt-5 md:gap-6">
            {facts.map(({ value, label }) => (
              <div key={label} className="flex flex-col-reverse">
                <dt className="mt-1 text-helper text-white">{label}</dt>
                <dd className="text-form-aside md:text-detail-heading">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
