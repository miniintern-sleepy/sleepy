import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import type { UiCopy } from "@/content/ko/ui";
import type { getTechnologyCopy } from "@/lib/content";
type Copy = Awaited<ReturnType<typeof getTechnologyCopy>>["intro"];
export default function IntroSection({
  copy,
  ui,
}: {
  copy: Copy;
  ui: UiCopy["technology"];
}) {
  return (
    <section className="tech-intro public-wrap">
      <header className="text-center">
        <h2 className="text-detail-heading text-violet-strong">{copy.title}</h2>
        <p className="tech-subtitle text-copy-large text-violet">
          {copy.subtitle}
        </p>
        <p className="tech-description text-copy-large">{copy.description}</p>
      </header>
      <Reveal className="tech-spectrum">
        <ul>
          {copy.spectrum.map((item) => (
            <li key={item.label}>
              <span className="text-spectrum-label">{item.label}</span>
              {/* 영어 화면은 이름이 이미 영어라 보조 영어 표기를 비워 둔다. */}
              {item.english && (
                <small className="text-spectrum-english text-muted">
                  {item.english}
                </small>
              )}
            </li>
          ))}
        </ul>
        <div
          className="tech-spectrum-bar motion-safe:scale-x-0 motion-safe:group-data-[visible=true]:scale-x-100"
          aria-hidden="true"
        />
        <div className="tech-spectrum-product">
          <div className="tech-spectrum-device">
            <p className="text-device-word text-violet">{copy.productName}</p>
            <Image
              src="/images/technology/buds.png"
              alt={ui.earbudAlt}
              width={154}
              sizes="(min-width: 1441px) 10.7vw, 154px"
              height={154}
              className="tech-spectrum-buds"
            />
            <Image
              src="/images/technology/case.png"
              alt={ui.caseAlt}
              width={210}
              sizes="(min-width: 1441px) 14.6vw, 210px"
              height={210}
              className="tech-spectrum-case"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
