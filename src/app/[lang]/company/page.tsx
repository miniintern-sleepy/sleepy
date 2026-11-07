import type { Metadata } from "next";
import "./company.css";

import { getCompanyCopy, getTechnologyCopy } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

import BeliefsSection from "./_components/BeliefsSection";
import CeoSection from "./_components/CeoSection";
import ContactSection from "./_components/ContactSection";
import EasyTechSection from "./_components/EasyTechSection";
import HistorySection from "./_components/HistorySection";
import IntroSection from "./_components/IntroSection";

export const metadata: Metadata = {
  title: "회사 소개",
  description: "슬리피 · 비약물적 수면 기술과 디지털 귀마개 슬리비 · 회사 소개",
};

// 회사 소개 (/ko/company) — A의 구간 순서와 배치 유지(#54), 기능 명세 F-02
// 섹션: 1. 소개 문구·사진·한눈에 보기  2. 대표 이야기  3. 슬리피가 믿는 것
//       4. 기술을 쉬운 말로  5. 슬리피의 걸음(연혁)  6. 문의
export default async function CompanyPage({
  params,
}: PageProps<"/[lang]/company">) {
  const [copy, technology, { lang }] = await Promise.all([
    getCompanyCopy(),
    getTechnologyCopy(),
    params,
  ]);
  if (!isLocale(lang)) return null;

  const patent = technology.patents.stats[0];
  const facts = [
    ...copy.facts,
    { value: `${patent.count}${patent.unit}`, label: patent.label },
  ];

  return (
    <main className="company-page break-keep" id="main">
      {/* 스크립트가 꺼져 있어도 내용은 보이게 한다. */}
      <noscript>
        <style>
          {"[data-reveal],[data-reveal] *{opacity:1;translate:none;scale:none}"}
        </style>
      </noscript>
      <IntroSection copy={copy.intro} facts={facts} />
      <CeoSection copy={copy.ceo} />
      <BeliefsSection copy={copy.beliefs} />
      <EasyTechSection copy={copy.easyTech} lang={lang} />
      <HistorySection copy={copy.history} />
      <ContactSection copy={copy.contact} lang={lang} />
    </main>
  );
}
