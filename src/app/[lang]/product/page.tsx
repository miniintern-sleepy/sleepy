import type { Metadata } from "next";

import { getProductCopy, getProductSpecs, getPurchaseUrl } from "@/lib/content";

import AlgorithmSection from "./_components/AlgorithmSection";
import FeaturesSection from "./_components/FeaturesSection";
import HowToUseSection from "./_components/HowToUseSection";
import IntroSection from "./_components/IntroSection";
import KitSection from "./_components/KitSection";
import MomentsSection from "./_components/MomentsSection";
import SpecsSection from "./_components/SpecsSection";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getProductCopy();
  return { title: "제품", description: copy.intro.description };
}

// D2에는 F-03의 탭·하단 구매 배너가 없다. 사양·구매 동작은 F-03·F-06과 DB를 따른다(#27).
export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const [copy, specs, purchaseUrl, { lang }] = await Promise.all([
    getProductCopy(),
    getProductSpecs(),
    getPurchaseUrl(),
    params,
  ]);

  return (
    <main className="relative isolate overflow-clip bg-product-surface break-keep">
      <IntroSection copy={copy.intro} purchaseUrl={purchaseUrl} />
      <FeaturesSection copy={copy.features} />
      <MomentsSection copy={copy.moments} />
      <AlgorithmSection copy={copy.algorithm} lang={lang} />
      <HowToUseSection copy={copy.howToUse} />
      <KitSection copy={copy.kit} specs={specs} />
      <SpecsSection specs={specs} />
    </main>
  );
}
