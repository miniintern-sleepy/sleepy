import Image from "next/image";
import ButtonLink from "@/components/ui/ButtonLink";
import type { UiCopy } from "@/content/ko/ui";
import type { getHomeCopy } from "@/lib/content";
export default function DayTriptychSection({
  copy,
  lang,
  ui,
}: {
  copy: Awaited<ReturnType<typeof getHomeCopy>>["day"];
  lang: string;
  ui: UiCopy["home"];
}) {
  return (
    <section className="home-days">
      <div className="public-wide">
        <figure>
          <Image
            src="/images/home/rest-day.jpg"
            alt={ui.dayAlt}
            width={768}
            height={1024}
            sizes="(max-width:760px) 50vw,33vw"
          />
          <figcaption className="text-day-caption text-muted">
            {copy.day}
          </figcaption>
        </figure>
        <div className="home-day-center">
          <h2 className="text-day-heading whitespace-pre-line">{copy.title}</h2>
          <ButtonLink href={`/${lang}/technology`}>{copy.link}</ButtonLink>
        </div>
        <figure>
          <Image
            src="/images/home/recovered-74.jpg"
            alt={ui.nightAlt}
            width={910}
            height={607}
            sizes="(max-width:760px) 50vw,33vw"
          />
          <figcaption className="text-day-caption text-muted">
            {copy.night}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
