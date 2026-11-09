import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import type { getTechnologyCopy } from "@/lib/content";
type Copy = Awaited<ReturnType<typeof getTechnologyCopy>>["intro"];
export default function IntroSection({ copy }: { copy: Copy }) {
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
              <small className="text-spectrum-english text-muted">
                {item.english}
              </small>
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
              alt="슬리비 이어폰"
              width={154}
              sizes="(min-width: 1441px) 10.7vw, 154px"
              height={154}
              className="tech-spectrum-buds"
            />
            <Image
              src="/images/technology/case.png"
              alt="슬리비 케이스"
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
