import PageHero from "@/components/ui/PageHero";
import type { Metadata } from "next";
import "./company.css";

import { getCompanyCopy } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

import AboutSection from "./_components/AboutSection";
import BeliefsSection from "./_components/BeliefsSection";
import CeoSection from "./_components/CeoSection";
import ContactSection from "./_components/ContactSection";
import EasyTechSection from "./_components/EasyTechSection";
import HistorySection from "./_components/HistorySection";

export const metadata: Metadata = {
  title: "회사 소개",
  description: "슬리피 · 비약물적 수면 기술과 디지털 귀마개 슬리비 · 회사 소개",
};

// 회사 소개 구간으로 검색 사용자가 회사 기본 정보를 바로 확인하게 한다(#90, F-02).
// 섹션: 히어로 → 대표 → 회사 소개 → 지향하는 것 → 기술을 쉬운 말로 → 걸음 → 문의
export default async function CompanyPage({
  params,
}: PageProps<"/[lang]/company">) {
  const [copy, { lang }] = await Promise.all([getCompanyCopy(), params]);
  if (!isLocale(lang)) return null;

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
      <CeoSection copy={copy.ceo} />
      <AboutSection copy={copy.about} />
      <BeliefsSection copy={copy.beliefs} />
      <EasyTechSection copy={copy.easyTech} lang={lang} />
      <HistorySection copy={copy.history} />
      <ContactSection copy={copy.contact} lang={lang} />
    </main>
  );
}
