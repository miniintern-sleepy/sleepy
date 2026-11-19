import PageHero from "@/components/ui/PageHero";
import type { Metadata } from "next";
import "./company.css";

import { getCompanyCopy, getUiCopy, pageMetadata } from "@/lib/content";
import { toLocale } from "@/lib/i18n";

import AboutSection from "./_components/AboutSection";
import BeliefsSection from "./_components/BeliefsSection";
import CeoSection from "./_components/CeoSection";
import ContactSection from "./_components/ContactSection";
import EasyTechSection from "./_components/EasyTechSection";
import HistorySection from "./_components/HistorySection";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/company">): Promise<Metadata> {
  return pageMetadata((await params).lang, "company");
}

// 회사 소개 구간으로 검색 사용자가 회사 기본 정보를 바로 확인하게 한다(#90, F-02).
// 섹션: 히어로 → 대표 → 회사 소개 → 지향하는 것 → 기술을 쉬운 말로 → 걸음 → 문의
export default async function CompanyPage({
  params,
}: PageProps<"/[lang]/company">) {
  const lang = toLocale((await params).lang);
  const copy = await getCompanyCopy(lang);

  return (
    <main className="company-page break-keep" id="main">
      {/* 스크립트가 꺼져 있어도 내용은 보이게 한다. */}
      <noscript>
        <style>
          {"[data-reveal],[data-reveal] *{opacity:1;translate:none;scale:none}"}
        </style>
      </noscript>
      <PageHero
        title={copy.intro.title}
        description={copy.intro.description}
        wave="company"
      />
      <CeoSection copy={copy.ceo} ui={getUiCopy(lang)} />
      <AboutSection copy={copy.about} />
      <BeliefsSection copy={copy.beliefs} />
      <EasyTechSection copy={copy.easyTech} lang={lang} />
      <HistorySection copy={copy.history} />
      <ContactSection copy={copy.contact} lang={lang} />
    </main>
  );
}
