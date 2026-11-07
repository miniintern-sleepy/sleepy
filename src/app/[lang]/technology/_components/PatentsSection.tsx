import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import type { getTechnologyCopy } from "@/lib/content";
type Copy = Awaited<ReturnType<typeof getTechnologyCopy>>["patents"];
export default function PatentsSection({ copy }: { copy: Copy }) {
  return (
    <section className="tech-patents">
      <div className="public-wrap tech-patents-grid">
        <Reveal>
          <h2 className="text-patent-heading whitespace-pre-line text-violet-strong">
            {copy.title}
          </h2>
          <dl className="tech-patent-stats">
            {copy.stats.map((item) => (
              <div key={item.label}>
                <dt className="text-patent-key">{item.label}</dt>
                <dd>
                  <span className="text-patent-number text-violet">
                    {item.count}
                  </span>
                  <span className="tech-patent-unit text-patent-unit text-muted">
                    {item.unit}
                  </span>
                  <small className="text-patent-note text-muted">
                    {item.note}
                  </small>
                </dd>
              </div>
            ))}
          </dl>
          <ul className="tech-patent-list">
            {copy.items.map((item) => (
              <li key={item.title}>
                <span className="text-patent-item whitespace-pre-line">
                  {item.title}
                </span>
                <span className="text-study-state text-violet">
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal>
          <Image
            src="/images/technology/certificates.png"
            alt="특허와 상표 등록증 5장"
            width={560}
            height={640}
            sizes="(max-width:560px) 100vw,560px"
            className="mx-auto h-auto w-full max-w-140"
          />
        </Reveal>
      </div>
    </section>
  );
}
