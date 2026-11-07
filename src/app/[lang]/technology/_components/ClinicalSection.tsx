import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import type { getTechnologyCopy } from "@/lib/content";
type Copy = Awaited<ReturnType<typeof getTechnologyCopy>>["clinical"];
export default function ClinicalSection({ copy }: { copy: Copy }) {
  return (
    <section className="tech-clinical public-wrap">
      <Reveal className="tech-research-photo">
        <Image
          src="/images/technology/research.png"
          alt="수술실에서 의료진이 환자의 마취를 돕는 연구 현장"
          width={540}
          height={700}
          sizes="(max-width:1023px) 100vw,40vw"
          className="tech-hover-image h-auto w-full"
        />
      </Reveal>
      <Reveal className="tech-clinical-copy">
        <h2 className="text-research-heading text-violet-strong">
          {copy.title}
        </h2>
        <div className="tech-clinical-metric">
          <p className="text-metric-label whitespace-pre-line text-muted">
            {copy.metric.label}
          </p>
          <p className="text-metric-number text-violet">{copy.metric.value}</p>
        </div>
        <ul className="tech-studies">
          {copy.studies.map((item) => (
            <li key={item.title}>
              <span className="text-study-title">{item.title}</span>
              <span
                className={`text-study-state ${item.status === "발표" ? "text-violet" : "text-muted"}`}
              >
                {item.status}
              </span>
            </li>
          ))}
        </ul>
        <p className="tech-research-more text-research-more">
          {copy.moreLabel}
        </p>
      </Reveal>
    </section>
  );
}
