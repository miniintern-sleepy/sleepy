import PageHero from "@/components/ui/PageHero";
import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { getContactCopy, getUiCopy, pageMetadata } from "@/lib/content";
import { toLocale } from "@/lib/i18n";
import type { UiCopy } from "@/content/ko/ui";
import ContactForm from "./_components/ContactForm";
import "./contact.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  return pageMetadata((await params).lang, "contact");
}
async function Form({
  lang,
  email,
  searchParams,
  t,
}: {
  lang: string;
  email: string;
  t: UiCopy["contact"]["form"];
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
      t={t}
    />
  );
}

export default async function ContactPage({
  params,
  searchParams,
}: PageProps<"/[lang]/contact">) {
  const lang = toLocale((await params).lang);
  const ui = getUiCopy(lang);
  const copy = await getContactCopy(lang);
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
                {ui.contact.emailLabel}
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
                {ui.contact.addressLabel}
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
            alt={ui.contact.mapAlt}
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
              <span className="sr-only">{ui.newWindow}</span>
            </a>
          </p>
        </aside>
        <Suspense fallback={<p role="status">{ui.contact.loading}</p>}>
          <Form
            lang={lang}
            email={copy.email}
            searchParams={searchParams}
            t={ui.contact.form}
          />
        </Suspense>
      </section>
    </main>
  );
}
