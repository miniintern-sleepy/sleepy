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
      className="relative isolate overflow-hidden text-surface"
    >
      <Image
        src={copy.background}
        alt=""
        fill
        sizes="100vw"
        priority
        className="-z-10 object-cover object-[70%_30%]"
      />
      {/* 왼쪽을 진한 회색으로 덮어 글자가 또렷하고, 오른쪽은 사진이 그대로 보이게 한다. 모바일은 전체를 고르게 덮는다. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-fg/60 md:bg-linear-to-r md:from-fg/85 md:via-fg/50 md:to-fg/0"
      />
      <div className="mx-auto flex min-h-136 max-w-360 flex-col justify-between gap-16 px-6 pt-16 pb-10 md:min-h-160 md:px-10 md:pt-28 md:pb-14 lg:px-20">
        <Reveal>
          <h1
            id="company-title"
            className="text-h2 md:text-tech-heading lg:text-tech-hero"
          >
            {copy.title}
          </h1>
          <p className="mt-5 max-w-120 text-tech-body text-surface/90 md:mt-7 md:text-tech-intro">
            {copy.description}
          </p>
        </Reveal>

        {/* 회사 한눈에 보기. 사진 아래쪽에 가는 선과 함께 놓는다. */}
        <Reveal>
          <dl className="grid max-w-xl grid-cols-3 gap-4 border-t border-surface/40 pt-5 md:gap-6">
            {facts.map(({ value, label }) => (
              <div key={label} className="flex flex-col-reverse">
                <dt className="mt-1 text-body-sm text-surface/80">{label}</dt>
                <dd className="text-h3 md:text-tech-heading">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
