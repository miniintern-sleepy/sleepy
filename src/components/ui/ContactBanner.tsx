import TextLink from "./TextLink";

export default function ContactBanner({
  lang,
  copy,
}: {
  lang: string;
  copy: { title: string; description: string; button: string };
}) {
  return (
    <section className="public-contact-banner">
      <div className="public-wide">
        <h2 className="text-cta-heading">{copy.title}</h2>
        <p className="text-copy text-muted">{copy.description}</p>
        <TextLink href={`/${lang}/contact`}>{copy.button}</TextLink>
      </div>
    </section>
  );
}
