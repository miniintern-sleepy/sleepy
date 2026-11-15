import PageHero from "@/components/ui/PageHero";
import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import ContactBanner from "@/components/ui/ContactBanner";
import TextLink from "@/components/ui/TextLink";
import { getCompanyCopy, getFaqCopy, getFaqs } from "@/lib/content";
import FaqSearch from "./_components/FaqSearch";
import "./faq.css";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description: "슬리피 · 비약물적 수면 기술과 디지털 귀마개 슬리비 · FAQ",
};
async function Questions({ contact }: { contact: ReactNode }) {
  const [items, copy] = await Promise.all([getFaqs(), getFaqCopy()]);
  return <FaqSearch items={items} copy={copy} contact={contact} />;
}
export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const [{ lang }, copy, company] = await Promise.all([
    params,
    getFaqCopy(),
    getCompanyCopy(),
  ]);
  return (
    <main className="public-page" id="main">
      <PageHero title={copy.title} description={copy.description} wave="faq" />
      <section className="public-wrap public-list-section">
        <Suspense fallback={<p role="status">질문을 불러오는 중입니다.</p>}>
          <Questions
            contact={
              <aside className="faq-contact">
                <p className="text-helper whitespace-pre-line text-muted">
                  {copy.contact}
                </p>
                <TextLink href={`/${lang}/contact`}>문의하기</TextLink>
              </aside>
            }
          />
        </Suspense>
      </section>
      <ContactBanner lang={lang} copy={company.contact} />
    </main>
  );
}
