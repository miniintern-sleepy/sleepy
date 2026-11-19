import ButtonLink from "./ButtonLink";

export default function ContactBanner({
  lang,
  copy,
  href = `/${lang}/contact`,
  className,
}: {
  lang: string;
  copy: { title: string; description: string; button: string };
  // 들어온 화면에 따라 문의 유형을 미리 고를 때 쓴다(회사 소개 → general).
  href?: string;
  className?: string;
}) {
  return (
    <section
      className={
        className
          ? `public-contact-banner ${className}`
          : "public-contact-banner"
      }
    >
      <div className="public-wide">
        <h2 className="text-cta-heading">{copy.title}</h2>
        <p className="text-copy text-muted">{copy.description}</p>
        <ButtonLink href={href} variant="primary">
          {copy.button}
        </ButtonLink>
      </div>
    </section>
  );
}
