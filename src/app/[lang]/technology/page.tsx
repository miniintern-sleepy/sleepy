import type { Metadata } from "next";

import { getTechnologyCopy } from "@/lib/content";

import ClinicalSection from "./_components/ClinicalSection";
import IntroSection from "./_components/IntroSection";
import PatentsSection from "./_components/PatentsSection";
import PrinciplesSection from "./_components/PrinciplesSection";

export const metadata: Metadata = { title: "기술" };

// 기술 (/ko/technology) — 피그마 "디자인 초안 > 기술 · 시안 01"(224:7736)
// 섹션: 1. 상단 소개·스펙트럼  2. 원리 3가지  3. 임상 연구  4. 지식재산권
// 주의: 시안에는 F-10의 탭과 제품 배너가 없다. 시안이 확정되면 F-10을 맞춘다(#21).
export default async function TechnologyPage() {
  const copy = await getTechnologyCopy();

  return (
    <main className="overflow-x-clip break-keep">
      {/* 스크립트가 꺼져 있어도 내용은 보이게 한다. */}
      <noscript>
        <style>{"[data-reveal]{opacity:1;translate:none}"}</style>
      </noscript>
      <IntroSection copy={copy.intro} />
      <PrinciplesSection copy={copy.principles} />
      <ClinicalSection copy={copy.clinical} />
      <PatentsSection copy={copy.patents} />
    </main>
  );
}
