import Image from "next/image";
import type { ReactNode } from "react";

import type { getTechnologyCopy } from "@/lib/content";

import Reveal from "@/components/ui/Reveal";

type Copy = Awaited<ReturnType<typeof getTechnologyCopy>>["principles"];

// 피그마 "소리 막대" 20개의 위치와 크기다. 뒤 막대와 그 위에 겹친 보라 막대로 나뉜다.
const backBars = [
  [0, 90, 180],
  [44, 15, 331],
  [88, 51, 259],
  [132, 72, 216],
  [176, 105, 151],
  [220, 33, 295],
  [264, 0, 360],
  [308, 33, 295],
  [352, 105, 151],
  [396, 72, 216],
  [440, 51, 259],
  [484, 15, 331],
  [528, 90, 180],
];
const frontBars = [
  [132, 126, 108],
  [176, 142, 76],
  [220, 106, 148],
  [264, 90, 180],
  [308, 106, 148],
  [352, 142, 76],
  [396, 126, 108],
];

function Waveform() {
  const bar = (
    [x, y, height]: number[],
    fill: string,
    key: string,
  ): ReactNode => (
    <rect
      key={key}
      x={x}
      y={y}
      width={20}
      height={height}
      rx={10}
      style={{ transitionDelay: `${Math.abs(x - 264) / 2}ms` }}
      className={`origin-center transition-transform duration-700 ease-out transform-fill motion-safe:scale-y-50 motion-safe:group-data-[visible=true]:scale-y-100 print:scale-y-100 ${fill}`}
    />
  );

  return (
    <svg
      viewBox="0 0 548 360"
      aria-hidden="true"
      className="mx-auto h-auto w-full max-w-137 min-[90rem]:ml-1.5"
    >
      {backBars.map((item) =>
        bar(item, "fill-tech-spectrum-start", `back-${item[0]}`),
      )}
      {frontBars.map((item) => bar(item, "fill-brand", `front-${item[0]}`))}
    </svg>
  );
}

function Text({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <>
      <h2 className="text-h2 text-brand-deep lg:text-tech-heading">{title}</h2>
      <div className="mt-5 flex flex-col gap-3 text-tech-body text-fg">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </>
  );
}

function Dot() {
  return (
    <span
      aria-hidden="true"
      className="absolute top-16.5 left-1/2 hidden size-5 -translate-x-1/2 rounded-full bg-brand lg:block"
    />
  );
}

const rowClassName =
  "relative px-6 py-10 md:px-10 lg:grid lg:grid-cols-2 lg:gap-x-20 lg:py-0 lg:pt-12.5 min-[90rem]:gap-x-35 min-[90rem]:px-25";

export default function PrinciplesSection({ copy }: { copy: Copy }) {
  return (
    <div className="relative mx-auto max-w-360">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 hidden w-0.5 -translate-x-1/2 bg-brand lg:block"
      />

      <section className={`${rowClassName} lg:min-h-180`}>
        <Dot />
        <Reveal>
          <Text {...copy.binaural} />
        </Reveal>
        <Reveal className="mt-8 lg:mt-10">
          <Image
            src="/images/technology/binaural.png"
            alt="왼쪽 귀에 208Hz, 오른쪽 귀에 200Hz를 들려주면 8Hz 양이성 음향이 생기는 원리 도식"
            width={550}
            height={295}
            sizes="(min-width: 1440px) 550px, (min-width: 1024px) 45vw, 100vw"
            className="h-auto w-full"
          />
          <p className="mt-3.75 text-tech-note text-fg-muted">
            {copy.binaural.note}
          </p>
        </Reveal>
      </section>

      <section className={`${rowClassName} lg:min-h-115`}>
        <Dot />
        <Reveal className="lg:col-start-2 lg:row-start-1">
          <Text {...copy.entrainment} />
        </Reveal>
        {/* 피그마처럼 파형의 위아래가 섹션 경계를 조금 넘어간다. */}
        <Reveal className="mt-8 lg:col-start-1 lg:row-start-1 lg:-mt-22.5">
          <Waveform />
        </Reveal>
      </section>

      <section className={`${rowClassName} lg:min-h-125`}>
        <Dot />
        <Reveal>
          <Text {...copy.sleep} />
        </Reveal>
        <Reveal className="mt-8 lg:mt-2.5">
          <div className="overflow-hidden rounded-3xl">
            <Image
              src="/images/technology/sleep.png"
              alt="이어폰을 끼고 침대에서 잠든 사람"
              width={550}
              height={367}
              sizes="(min-width: 1440px) 550px, (min-width: 1024px) 45vw, 100vw"
              className="h-auto w-full transition-transform duration-500 ease-out motion-safe:hover:scale-102"
            />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
