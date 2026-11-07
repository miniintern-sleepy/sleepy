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
  searchParams,
}: {
  lang: string;
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
      <header className="public-page-heading public-wrap">
        <h1 className="text-page-title">{copy.title}</h1>
        <p className="text-copy-intro text-muted">{copy.description}</p>
      </header>
      <section className="public-wrap contact-layout">
        <aside className="contact-intro">
          <h2 className="text-form-aside">{copy.guideTitle}</h2>
          <p>{copy.guide}</p>
          <p>
            이메일
            <br />
            <a href={`mailto:${copy.email}`}>{copy.email}</a>
          </p>
          <p>
            주소
            <br />
            {copy.address}
          </p>
          <p>{copy.beforeVisit}</p>
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
          <Form lang={lang} searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
