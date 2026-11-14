import PageHero from "@/components/ui/PageHero";
import PurchaseButton from "@/components/ui/PurchaseButton";
import type { Metadata } from "next";

import "./product.css";

import { getProductCopy, getProductSpecs, getPurchaseUrl } from "@/lib/content";

import AlgorithmSection from "./_components/AlgorithmSection";
import GallerySection from "./_components/GallerySection";
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

// 구매 히어로 → 갤러리 → 생활 장면 → 알고리즘 → 사용 순서 → 고정 숫자 구성·DB 사양(#79).
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
    <main
      data-product-page
      className="product-page relative isolate overflow-clip bg-paper break-keep"
      id="main"
    >
      <PageHero title={copy.intro.title} wave="product">
        <PurchaseButton
          url={purchaseUrl}
          copy={copy.intro}
          location="product"
        />
      </PageHero>
      <GallerySection copy={copy.features} />
      <MomentsSection copy={copy.moments} />
      <AlgorithmSection copy={copy.algorithm} lang={lang} />
      <HowToUseSection copy={copy.howToUse} />
      <KitSection copy={copy.kit} specs={specs} />
      <SpecsSection specs={specs} />
    </main>
  );
}
