import Image from "next/image";
import TextLink from "@/components/ui/TextLink";
import type { getHomeCopy, getCompanyCopy } from "@/lib/content";
export default function FounderStorySection({
  copy,
  company,
  lang,
}: {
  copy: Awaited<ReturnType<typeof getHomeCopy>>["founder"];
  company: Awaited<ReturnType<typeof getCompanyCopy>>;
  lang: string;
}) {
  return (
    <section className="home-founder">
      <div className="public-wide">
        <blockquote className="home-founder-quote text-founder-quote">
          {company.ceo.quote}
        </blockquote>
        <div className="home-founder-detail">
          <Image
            src={company.ceo.photo}
            alt={company.ceo.photoAlt}
            width={659}
            height={700}
            className="home-founder-photo"
            sizes="(min-width: 1441px) 15.97vw, (max-width:520px) 105px,(max-width:760px) 150px,230px"
          />
          <div>
            <h2 className="text-founder-name">
              {company.ceo.name}
              <span className="ml-3 text-meta text-muted">CEO</span>
            </h2>
            <p className="home-founder-role text-meta text-muted">
              {copy.role}
            </p>
            {copy.paragraphs.map((p) => (
              <p
                key={p}
                className="home-founder-description text-copy text-muted"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
        <div className="home-founder-context">
          <h2 className="text-context-heading whitespace-pre-line">
            {copy.title}
          </h2>
          <div>
            <p className="text-helper text-muted">{copy.description}</p>
            <TextLink href={`/${lang}/company`}>{copy.link}</TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
