import Image from "next/image";
import TextLink from "@/components/ui/TextLink";
import type { getHomeCopy } from "@/lib/content";
export default function DayTriptychSection({
  copy,
  lang,
}: {
  copy: Awaited<ReturnType<typeof getHomeCopy>>["day"];
  lang: string;
}) {
  return (
    <section className="home-days">
      <div className="public-wide">
        <figure>
          <Image
            src="/images/home/rest-day.jpg"
            alt="낮의 휴식"
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
          <TextLink href={`/${lang}/company`}>{copy.link}</TextLink>
        </div>
        <figure>
          <Image
            src="/images/home/recovered-74.jpg"
            alt="밤의 잠자리"
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
