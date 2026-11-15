import PageHero from "@/components/ui/PageHero";
import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { getContactCopy } from "@/lib/content";
import ContactForm from "./_components/ContactForm";
import "./contact.css";

export const metadata: Metadata = {
  title: "문의하기",
  description: "슬리피 · 비약물적 수면 기술과 디지털 귀마개 슬리비 · 문의하기",
};
async function Form({
  lang,
  email,
  searchParams,
}: {
  lang: string;
  email: string;
  searchParams: PageProps<"/[lang]/contact">["searchParams"];
}) {
  const query = await searchParams;
  const initialType = query.type === "product" ? "product" : "general";
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const enabled = Boolean(
    siteKey &&
    process.env.TURNSTILE_SECRET_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
  return (
    <ContactForm
      initialType={initialType}
      key={initialType}
      lang={lang}
      email={email}
      siteKey={siteKey}
      enabled={enabled}
    />
  );
}

export default async function ContactPage({
  params,
  searchParams,
}: PageProps<"/[lang]/contact">) {
  const [{ lang }, copy] = await Promise.all([params, getContactCopy()]);
  return (
    <main className="public-page" id="main">
      <PageHero
        title={copy.title}
        description={copy.description}
        wave="contact"
      />
      <section className="public-wrap contact-layout">
        <aside className="contact-intro">
          <h2 className="text-form-title">{copy.guideTitle}</h2>
          <p>{copy.guide}</p>
          <dl className="contact-info">
            <div>
              <dt>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                이메일
              </dt>
              <dd>
                <a href={`mailto:${copy.email}`}>{copy.email}</a>
              </dd>
            </div>
            <div>
              <dt>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
                주소
              </dt>
              <dd>
                {copy.address}
                <br />
                {copy.beforeVisit}
              </dd>
            </div>
          </dl>
          <Image
            src="/images/contact/map.jpg"
            alt="서울 성북구 화랑로 211 주변 지도"
            width={400}
            height={280}
            className="contact-map"
            sizes="(max-width:760px) 100vw, 400px"
          />
          <p className="contact-map-credit">
            ©{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenStreetMap contributors
              <span className="sr-only"> (새 창)</span>
            </a>
          </p>
        </aside>
        <Suspense
          fallback={<p role="status">문의 화면을 준비하고 있습니다.</p>}
        >
          <Form lang={lang} email={copy.email} searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
