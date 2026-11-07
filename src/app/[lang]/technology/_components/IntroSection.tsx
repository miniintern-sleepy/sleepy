import Image from "next/image";

import type { getTechnologyCopy } from "@/lib/content";

import Reveal from "@/components/ui/Reveal";

type Copy = Awaited<ReturnType<typeof getTechnologyCopy>>["intro"];

// 피그마에서 막대(너비 1280) 기준으로 잰 라벨 중심 위치다. 양 끝 라벨은 막대 끝에 맞춘다.
const spectrumPositions = [
  "left-0 items-start",
  "left-[27.27%] -translate-x-1/2 items-center",
  "left-[42.97%] -translate-x-1/2 items-center",
  "right-0 items-end",
];

export default function IntroSection({ copy }: { copy: Copy }) {
  return (
    <section className="mx-auto max-w-360 px-6 pt-16 md:min-h-225 md:px-10 md:pt-22.5 min-[90rem]:px-20">
      <div className="text-center">
        <h1 className="text-detail-heading text-ink md:text-science-title">
          {copy.title}
        </h1>
        <p className="mt-1.75 text-science-intro text-violet md:text-science-subtitle">
          {copy.subtitle}
        </p>
        <p className="mx-auto mt-6 max-w-215 text-copy-large text-ink md:text-science-intro">
          {copy.description}
        </p>
      </div>

      <Reveal className="mt-14 md:mt-24.5">
        <ul className="relative h-16 md:h-18">
          {copy.spectrum.map(({ label, english }, index) => (
            <li
              key={label}
              className={`absolute top-0 flex flex-col ${spectrumPositions[index]}`}
            >
              <span className="text-copy-intro font-ui-medium text-ink md:text-metric-label">
                {label}
              </span>
              <span className="text-micro font-ui-regular whitespace-nowrap text-muted md:mt-1 md:text-micro">
                {english}
              </span>
            </li>
          ))}
        </ul>
        <div className="h-12 origin-left bg-linear-to-r from-panel via-halftone to-violet transition-transform delay-200 duration-1000 ease-out motion-safe:scale-x-0 motion-safe:group-data-[visible=true]:scale-x-100 md:h-18 print:scale-x-100" />

        <div className="flex flex-col items-center md:ml-15 md:flex-row md:items-start">
          {/* 두 이미지는 투명 여백이 커서 피그마처럼 겹쳐 놓고, 글자는 그 위에 얹는다. */}
          <div className="relative -mt-6 h-55 w-75 shrink-0 md:-mt-11 md:h-81">
            <p className="absolute top-14.5 left-1/2 z-10 -translate-x-1/2 text-device-word text-violet">
              {copy.productName}
            </p>
            <Image
              src="/images/technology/buds.png"
              alt="슬리비 이어폰"
              width={220}
              height={220}
              className="absolute top-0 left-10"
            />
            <Image
              src="/images/technology/case.png"
              alt="슬리비 케이스"
              width={300}
              height={300}
              className="absolute top-5 left-0"
            />
          </div>
          <div className="text-center md:mt-3.5 md:-ml-0.5 md:text-left">
            <p className="text-metric-label text-ink">{copy.category}</p>
            <p className="mt-1 text-meta text-muted">{copy.categoryEnglish}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
