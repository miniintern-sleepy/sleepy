import Reveal from "@/components/ui/Reveal";
import TextLink from "@/components/ui/TextLink";
import type { getCompanyCopy } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

type Copy = Awaited<ReturnType<typeof getCompanyCopy>>["easyTech"];

export default function EasyTechSection({
  copy,
  lang,
}: {
  copy: Copy;
  lang: Locale;
}) {
  return (
    <section
      aria-labelledby="company-tech"
      className="public-wrap company-easy-tech"
    >
      <Reveal>
        <h2
          id="company-tech"
          className="text-form-aside md:text-detail-heading"
        >
          {copy.title}
        </h2>
        <p className="mt-8 text-study-title whitespace-pre-line text-muted">
          {copy.description}
        </p>
        <TextLink href={`/${lang}/technology`} className="mt-8">
          {copy.link}
        </TextLink>
      </Reveal>
      <Reveal>
        <div
          className="company-tech-diagram"
          role="img"
          aria-label={`${copy.left}와 ${copy.right}에 ${copy.caption}가 전달되어 ${copy.center.replace("\n", " ")}가 만들어집니다`}
        >
          <div className="company-tech-desktop" aria-hidden="true">
            <span className="company-tech-connector company-tech-line company-tech-line-left" />
            <div className="company-tech-ear company-tech-desktop-ear text-study-state">
              {copy.left}
            </div>
            <div className="company-tech-center company-tech-desktop-center text-copy-large font-ui-medium whitespace-pre-line text-violet-strong">
              <span className="company-tech-pulse" />
              {copy.center}
            </div>
            <div className="company-tech-ear company-tech-desktop-ear text-study-state">
              {copy.right}
            </div>
            <p className="company-tech-caption text-helper text-muted">
              {copy.caption}
            </p>
          </div>
          <div className="company-tech-mobile" aria-hidden="true">
            {[copy.left, copy.right].map((label) => (
              <div key={label} className="company-tech-ear">
                <span className="company-tech-ear-circle text-ui-label">
                  {label}
                </span>
                <span className="mt-3 block text-micro text-muted">
                  {copy.caption}
                </span>
              </div>
            ))}
            <div className="company-tech-center company-tech-center-circle text-ui-label whitespace-pre-line">
              <span className="company-tech-pulse" />
              {copy.center}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
