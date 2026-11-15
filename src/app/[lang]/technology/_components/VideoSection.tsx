import Image from "next/image";
import ExternalLink from "@/components/ui/ExternalLink";
import type { getTechnologyCopy } from "@/lib/content";

type Copy = Awaited<ReturnType<typeof getTechnologyCopy>>["video"];
export default function VideoSection({ copy }: { copy: Copy }) {
  return (
    <section
      className="tech-video public-wrap"
      aria-labelledby="tech-video-title"
    >
      <h2
        id="tech-video-title"
        className="text-patent-heading text-violet-strong"
      >
        {copy.title}
      </h2>
      <div className="tech-video-grid">
        {copy.items.map((item) => (
          <ExternalLink
            key={item.href}
            href={item.href}
            className="tech-video-card"
          >
            <div className="tech-video-thumbnail">
              <Image
                src={item.image}
                alt=""
                width={480}
                height={360}
                sizes="(max-width:760px) 100vw, 50vw"
              />
              <span className="tech-video-play" aria-hidden="true">
                ▶
              </span>
            </div>
            <p className="text-meta font-ui-medium text-violet">{item.label}</p>
            <h3 className="text-latest-title">{item.title}</h3>
            <p className="text-meta text-muted">
              YouTube <span aria-hidden="true">↗</span>
            </p>
          </ExternalLink>
        ))}
      </div>
    </section>
  );
}
