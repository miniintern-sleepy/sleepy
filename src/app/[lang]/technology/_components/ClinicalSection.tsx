import Image from "next/image";

import type { getTechnologyCopy } from "@/lib/content";

import Reveal from "@/components/ui/Reveal";

type Copy = Awaited<ReturnType<typeof getTechnologyCopy>>["clinical"];

export default function ClinicalSection({ copy }: { copy: Copy }) {
  return (
    <section className="mx-auto max-w-360 px-6 pb-10 md:px-10 lg:grid lg:grid-cols-[3fr_4fr] lg:gap-x-15 min-[90rem]:pr-20">
      <Reveal>
        <div className="overflow-hidden rounded-4xl">
          <Image
            src="/images/technology/research.png"
            alt="수술실에서 의료진이 환자의 마취를 돕는 연구 현장"
            width={540}
            height={700}
            sizes="(min-width: 1440px) 540px, (min-width: 1024px) 40vw, 100vw"
            className="h-auto w-full transition-transform duration-500 ease-out motion-safe:hover:scale-102"
          />
        </div>
      </Reveal>

      <Reveal className="mt-8 lg:mt-9">
        <h2 className="text-research-heading text-ink">{copy.title}</h2>
        <div className="mt-8 flex flex-wrap items-center gap-x-4.5 gap-y-2 lg:mt-10.75 lg:ml-32">
          <p className="text-metric-label whitespace-pre-line text-muted">
            {copy.metric.label}
          </p>
          <p className="text-page-title text-violet md:text-metric-number">
            {copy.metric.value}
          </p>
        </div>

        <ul className="mt-10 border-b border-rule lg:mt-15.25">
          {copy.studies.map(({ title, status }) => (
            <li
              key={title}
              className="flex items-center justify-between gap-4 border-t border-rule pt-3.5 pb-3.25"
            >
              <span className="text-study-title text-ink">{title}</span>
              <span
                className={`shrink-0 text-study-state ${status === "발표" ? "text-violet" : "text-muted"}`}
              >
                {status}
              </span>
            </li>
          ))}
        </ul>
        {/* 연결할 자료가 아직 없어 링크가 아닌 글자로 둔다. */}
        <p className="mt-5.5 text-text-link text-ink">{copy.moreLabel}</p>
      </Reveal>
    </section>
  );
}
