import PageHero from "@/components/ui/PageHero";
import PurchaseButton from "@/components/ui/PurchaseButton";
import type { Metadata } from "next";

import "./product.css";

import {
  getProductCopy,
  getProductSpecs,
  getPurchaseUrl,
  getUiCopy,
  pageMetadata,
} from "@/lib/content";
import { toLocale } from "@/lib/i18n";

import AlgorithmSection from "./_components/AlgorithmSection";
import GallerySection from "./_components/GallerySection";
import HowToUseSection from "./_components/HowToUseSection";
import KitSection from "./_components/KitSection";
import MomentsSection from "./_components/MomentsSection";
import SpecsSection from "./_components/SpecsSection";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/product">): Promise<Metadata> {
  return pageMetadata((await params).lang, "product", "productSection");
}

// 구매 히어로 → 갤러리 → 생활 장면 → 알고리즘 → 사용 순서 → 고정 숫자 구성·DB 사양(#79).
export default async function ProductPage({
  params,
}: PageProps<"/[lang]/product">) {
  const lang = toLocale((await params).lang);
  const ui = getUiCopy(lang);
  const [copy, specs, purchaseUrl] = await Promise.all([
    getProductCopy(lang),
    getProductSpecs(),
    getPurchaseUrl(),
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
          newWindow={ui.newWindow}
        />
      </PageHero>
      <GallerySection copy={copy.features} ui={ui.product} />
      <MomentsSection copy={copy.moments} label={ui.product.momentsLabel} />
      <AlgorithmSection copy={copy.algorithm} lang={lang} />
      <HowToUseSection copy={copy.howToUse} ui={ui.product} />
      <KitSection copy={copy.kit} alt={ui.product.kitAlt} />
      <SpecsSection specs={specs} ui={ui.product} />
    </main>
  );
}
