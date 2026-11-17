import Image from "next/image";
import ExternalLink from "@/components/ui/ExternalLink";
import type { UiCopy } from "@/content/ko/ui";
import type { getTechnologyCopy } from "@/lib/content";

type Copy = Awaited<ReturnType<typeof getTechnologyCopy>>["video"];
export default function VideoSection({ copy, ui }: { copy: Copy; ui: UiCopy }) {
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
      <div className="tech-video-grid mobile-swipe">
        {copy.items.map((item) => (
          <ExternalLink
            key={item.href}
            href={item.href}
            className="tech-video-card"
            newWindow={ui.newWindow}
          >
            <div className="tech-video-thumbnail">
              <Image
                src={item.image}
                alt=""
                width={640}
                height={480}
                sizes="(max-width:760px) 100vw, 50vw"
              />
              <span className="tech-video-play" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                  focusable="false"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
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
