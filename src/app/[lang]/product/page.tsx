import PageHero from "@/components/ui/PageHero";
import type { Metadata } from "next";

import "./product.css";

import { getProductCopy, getProductSpecs } from "@/lib/content";

import AlgorithmSection from "./_components/AlgorithmSection";
import FeaturesSection from "./_components/FeaturesSection";
import HowToUseSection from "./_components/HowToUseSection";
import KitSection from "./_components/KitSection";
import MomentsSection from "./_components/MomentsSection";
import SpecsSection from "./_components/SpecsSection";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "슬리비",
    description: "슬리피 · 비약물적 수면 기술과 디지털 귀마개 슬리비 · 제품",
  };
}

// 공통 히어로 → 특징 → 생활 장면 → 알고리즘 → 사용 순서 → 구성·DB 사양(#61).
// 구매 버튼·사용 방법 링크는 후속 제품 페이지 구성에서 다시 배치한다.
export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const [copy, specs, { lang }] = await Promise.all([
    getProductCopy(),
    getProductSpecs(),
    params,
  ]);

  return (
    <main
      data-product-page
      className="product-page relative isolate overflow-clip bg-paper break-keep"
      id="main"
    >
      <PageHero
        title={copy.intro.title}
        description={copy.intro.description}
        wave="product"
      />
      <FeaturesSection copy={copy.features} />
      <MomentsSection copy={copy.moments} />
      <AlgorithmSection copy={copy.algorithm} lang={lang} />
      <HowToUseSection copy={copy.howToUse} />
      <KitSection copy={copy.kit} specs={specs} />
      <SpecsSection specs={specs} />
    </main>
  );
}
