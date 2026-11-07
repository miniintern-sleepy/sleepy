import type { Metadata } from "next";
import { Suspense } from "react";
import ContactBanner from "@/components/ui/ContactBanner";
import {
  getHomeCopy,
  getCompanyCopy,
  getProductCopy,
  getPurchaseUrl,
} from "@/lib/content";
import HeroSection from "./_components/HeroSection";
import EverydayStorySection from "./_components/EverydayStorySection";
import DayTriptychSection from "./_components/DayTriptychSection";
import FounderStorySection from "./_components/FounderStorySection";
import ProductStageSection from "./_components/ProductStageSection";
import LatestNewsSection from "./_components/LatestNewsSection";
import "./home.css";
export const metadata: Metadata = {
  title: { absolute: "슬리피 | 잠의 과학을, 생활의 언어로." },
  description: "슬리피 · 비약물적 수면 기술과 디지털 귀마개 슬리비 · 메인",
};
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const [copy, company, product, purchaseUrl, { lang }] = await Promise.all([
    getHomeCopy(),
    getCompanyCopy(),
    getProductCopy(),
    getPurchaseUrl(),
    params,
  ]);
  return (
    <main className="home-page" id="main">
      <HeroSection copy={copy.hero} lang={lang} />
      <EverydayStorySection copy={copy.everyday} />
      <DayTriptychSection copy={copy.day} lang={lang} />
      <FounderStorySection copy={copy.founder} company={company} lang={lang} />
      <ProductStageSection
        copy={copy.product}
        lang={lang}
        purchaseUrl={purchaseUrl}
        purchaseCopy={product.intro}
      />
      <Suspense fallback={null}>
        <LatestNewsSection lang={lang} />
      </Suspense>
      <ContactBanner lang={lang} copy={company.contact} />
    </main>
  );
}
