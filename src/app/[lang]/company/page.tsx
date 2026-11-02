import type { Metadata } from "next";

import { getCompanyCopy } from "@/lib/content";

import CeoSection from "./_components/CeoSection";
import EasyTechSection from "./_components/EasyTechSection";
import HistorySection from "./_components/HistorySection";
import IntroSection from "./_components/IntroSection";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getCompanyCopy();
  return { title: "회사 소개", description: copy.intro.description };
}

// 회사 소개 (/ko/company) — 피그마 "디자인 초안 > 02 회사 소개", 기능 명세 F-02
// 섹션: 1. 소개 문구  2. 대표 이야기  3. 기술을 쉬운 말로  4. 슬리피의 걸음(연혁)
export default async function CompanyPage() {
  const copy = await getCompanyCopy();

  return (
    <main className="break-keep">
      {/* 스크립트가 꺼져 있어도 내용은 보이게 한다. */}
      <noscript>
        <style>
          {"[data-reveal],[data-reveal] *{opacity:1;translate:none;scale:none}"}
        </style>
      </noscript>
      <IntroSection copy={copy.intro} />
      <CeoSection copy={copy.ceo} />
      <EasyTechSection copy={copy.easyTech} />
      <HistorySection copy={copy.history} />
    </main>
  );
}
