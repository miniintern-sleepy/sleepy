import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import type { getTechnologyCopy } from "@/lib/content";
type Copy = Awaited<ReturnType<typeof getTechnologyCopy>>["intro"];
export default function IntroSection({ copy }: { copy: Copy }) {
  return (
    <section className="tech-intro public-wrap">
      <header className="text-center">
        <h1 className="text-science-title">{copy.title}</h1>
        <p className="tech-subtitle text-science-subtitle text-violet">
          {copy.subtitle}
        </p>
        <p className="tech-description text-science-intro">
          {copy.description}
        </p>
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
              width={220}
              height={220}
              className="tech-spectrum-buds"
            />
            <Image
              src="/images/technology/case.png"
              alt="슬리비 케이스"
              width={300}
              height={300}
              className="tech-spectrum-case"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
