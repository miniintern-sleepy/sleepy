import PageHero from "@/components/ui/PageHero";
import type { Metadata } from "next";
import "./technology.css";

import { getTechnologyCopy, getUiCopy, pageMetadata } from "@/lib/content";
import { toLocale } from "@/lib/i18n";

import VideoSection from "./_components/VideoSection";
import ClinicalSection from "./_components/ClinicalSection";
import IntroSection from "./_components/IntroSection";
import PatentsSection from "./_components/PatentsSection";
import PrinciplesSection from "./_components/PrinciplesSection";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/technology">): Promise<Metadata> {
  return pageMetadata((await params).lang, "technology");
}

// B의 배치·A의 대응 모션을 사용한다(#54).
// 섹션: 1. 공통 히어로  2. 중추신경계·스펙트럼  3. 원리 3가지  4. 임상 연구  5. 기술 소개 영상  6. 지식재산권

export default async function TechnologyPage({
  params,
}: PageProps<"/[lang]/technology">) {
  const lang = toLocale((await params).lang);
  const copy = await getTechnologyCopy(lang);
  const ui = getUiCopy(lang);

  return (
    <main className="technology-page break-keep" id="main">
      {/* 스크립트가 꺼져 있어도 내용은 보이게 한다. */}
      <noscript>
        <style>
          {"[data-reveal],[data-reveal] *{opacity:1;translate:none;scale:none}"}
        </style>
      </noscript>
      <PageHero
        title={copy.hero.title}
        description={copy.hero.description}
        wave="technology"
      />
      <IntroSection copy={copy.intro} ui={ui.technology} />
      <PrinciplesSection copy={copy.principles} ui={ui.technology} />
      <ClinicalSection copy={copy.clinical} ui={ui} />
      <VideoSection copy={copy.video} ui={ui} />
      <PatentsSection copy={copy.patents} ui={ui.technology} />
    </main>
  );
}
