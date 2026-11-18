import PageHero from "@/components/ui/PageHero";
import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import ContactBanner from "@/components/ui/ContactBanner";
import ButtonLink from "@/components/ui/ButtonLink";
import {
  getCompanyCopy,
  getFaqCopy,
  getFaqs,
  getUiCopy,
  pageMetadata,
} from "@/lib/content";
import { toLocale, type Locale } from "@/lib/i18n";
import FaqSearch from "./_components/FaqSearch";
import "./faq.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/faq">): Promise<Metadata> {
  return pageMetadata((await params).lang, "faq", "faqSection");
}
async function Questions({
  lang,
  contact,
}: {
  lang: Locale;
  contact: ReactNode;
}) {
  const [items, copy] = await Promise.all([getFaqs(), getFaqCopy(lang)]);
  return (
    <FaqSearch
      items={items}
      copy={copy}
      ui={getUiCopy(lang).faq}
      contact={contact}
    />
  );
}
export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const lang = toLocale((await params).lang);
  const ui = getUiCopy(lang);
  const [copy, company] = await Promise.all([
    getFaqCopy(lang),
    getCompanyCopy(lang),
  ]);
  return (
    <main className="public-page" id="main">
      <PageHero title={copy.title} description={copy.description} wave="faq" />
      <section className="public-wrap public-list-section">
        <Suspense fallback={<p role="status">{ui.faq.loading}</p>}>
          <Questions
            lang={lang}
            contact={
              <aside className="faq-contact">
                <p className="text-helper whitespace-pre-line text-muted">
                  {copy.contact}
                </p>
                <ButtonLink href={`/${lang}/contact`} size="small">
                  {ui.header.contact}
                </ButtonLink>
              </aside>
            }
          />
        </Suspense>
      </section>
      <ContactBanner lang={lang} copy={company.contact} />
    </main>
  );
}
