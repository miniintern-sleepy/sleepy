import ExternalLinks from "@/components/ui/ExternalLinks";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import type { UiCopy } from "@/content/ko/ui";
import type { getTechnologyCopy } from "@/lib/content";
type Copy = Awaited<ReturnType<typeof getTechnologyCopy>>["clinical"];
export default function ClinicalSection({
  copy,
  ui,
}: {
  copy: Copy;
  ui: UiCopy;
}) {
  return (
    <section className="tech-clinical public-wrap">
      <Reveal className="tech-research-photo">
        <Image
          src="/images/technology/research.png"
          alt={ui.technology.clinicalAlt}
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
                className={`text-study-state ${item.status === copy.publishedStatus ? "text-violet" : "text-muted"}`}
              >
                {item.status}
              </span>
            </li>
          ))}
        </ul>
        <ExternalLinks
          className="tech-research-more"
          links={[{ label: copy.moreLabel, href: copy.moreHref }]}
          newWindow={ui.newWindow}
        />
      </Reveal>
    </section>
  );
}
