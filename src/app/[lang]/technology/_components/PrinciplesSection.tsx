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
      className={`origin-center transition-transform duration-(--motion-reveal) ease-out transform-fill motion-safe:scale-y-50 motion-safe:group-data-[visible=true]:scale-y-100 print:scale-y-100 ${fill}`}
    />
  );

  return (
    <svg
      viewBox="0 0 548 360"
      aria-hidden="true"
      className="mx-auto h-auto w-full max-w-137 min-[90rem]:ml-1.5"
    >
      {backBars.map((item) => bar(item, "fill-wave-back", `back-${item[0]}`))}
      {frontBars.map((item) => bar(item, "fill-violet", `front-${item[0]}`))}
    </svg>
  );
}

function Text({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <>
      <h2 className="text-detail-heading">{title}</h2>
      {paragraphs.map((p) => (
        <p key={p} className="text-copy-large">
          {p}
        </p>
      ))}
    </>
  );
}
export default function PrinciplesSection({ copy }: { copy: Copy }) {
  return (
    <div className="tech-principles public-wrap" id="principle">
      <section className="tech-principle tech-binaural">
        <span className="tech-dot" aria-hidden="true" />
        <Reveal className="tech-principle-copy">
          <Text {...copy.binaural} />
        </Reveal>
        <Reveal className="tech-visual">
          <Image
            src="/images/technology/binaural.png"
            alt="왼쪽 귀에 208Hz, 오른쪽 귀에 200Hz를 들려주면 8Hz 양이성 음향이 생기는 원리 도식"
            width={550}
            height={295}
            sizes="(max-width:1023px) 100vw,50vw"
            className="h-auto w-full"
          />
          <p className="tech-note text-science-note text-muted">
            {copy.binaural.note}
          </p>
        </Reveal>
      </section>
      <section className="tech-principle tech-entrainment">
        <span className="tech-dot" aria-hidden="true" />
        <Reveal className="tech-principle-copy">
          <Text {...copy.entrainment} />
        </Reveal>
        <Reveal className="tech-visual">
          <Waveform />
        </Reveal>
      </section>
      <section className="tech-principle tech-sleep">
        <span className="tech-dot" aria-hidden="true" />
        <Reveal className="tech-principle-copy">
          <Text {...copy.sleep} />
        </Reveal>
        <Reveal className="tech-visual tech-sleep-photo">
          <Image
            src="/images/technology/sleep.png"
            alt="이어폰을 끼고 침대에서 잠든 사람"
            width={550}
            height={367}
            sizes="(max-width:1023px) 100vw,50vw"
            className="tech-hover-image h-auto w-full"
          />
        </Reveal>
      </section>
    </div>
  );
}
