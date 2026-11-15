import Reveal from "@/components/ui/Reveal";
import type { getCompanyCopy } from "@/lib/content";
type Copy = Awaited<ReturnType<typeof getCompanyCopy>>["about"];
export default function AboutSection({ copy }: { copy: Copy }) {
  return (
    <section
      className="public-wrap company-about"
      aria-labelledby="company-about-title"
    >
      <div className="company-about-grid">
        <Reveal>
          <p className="text-study-state font-ui-medium text-violet">
            {copy.kicker}
          </p>
          <h2
            id="company-about-title"
            className="company-about-title text-form-aside whitespace-pre-line text-ink md:text-stage-heading"
          >
            {copy.title}
          </h2>
          <div className="company-about-paragraphs text-study-title text-muted">
            {copy.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <dl className="company-about-table">
            {copy.rows.map((row) => (
              <div key={row.label}>
                <dt className="text-study-state font-ui-medium text-muted">
                  {row.label}
                </dt>
                <dd className="text-study-title text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
