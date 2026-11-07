import type { Metadata } from "next";
import "./technology.css";

import { getTechnologyCopy } from "@/lib/content";

import ClinicalSection from "./_components/ClinicalSection";
import IntroSection from "./_components/IntroSection";
import PatentsSection from "./_components/PatentsSection";
import PrinciplesSection from "./_components/PrinciplesSection";

export const metadata: Metadata = {
  title: "기술",
  description: "슬리피 · 비약물적 수면 기술과 디지털 귀마개 슬리비 · 기술",
};

// B의 배치·A의 대응 모션을 사용한다(#54).
// 섹션: 1. 상단 소개·스펙트럼  2. 원리 3가지  3. 임상 연구  4. 지식재산권

export default async function TechnologyPage() {
  const copy = await getTechnologyCopy();

  return (
    <main className="technology-page break-keep" id="main">
      {/* 스크립트가 꺼져 있어도 내용은 보이게 한다. */}
      <noscript>
        <style>
          {"[data-reveal],[data-reveal] *{opacity:1;translate:none;scale:none}"}
        </style>
      </noscript>
      <IntroSection copy={copy.intro} />
      <PrinciplesSection copy={copy.principles} />
      <ClinicalSection copy={copy.clinical} />
      <PatentsSection copy={copy.patents} />
    </main>
  );
}
