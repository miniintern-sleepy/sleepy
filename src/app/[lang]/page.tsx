import type { Metadata } from "next";
import { toLocale } from "@/lib/i18n";
import { Suspense } from "react";
import {
  getHomeCopy,
  getCompanyCopy,
  getProductCopy,
  getPurchaseUrl,
  getUiCopy,
  pageMetadata,
} from "@/lib/content";
import HeroSection from "./_components/HeroSection";
import EverydayStorySection from "./_components/EverydayStorySection";
import DayTriptychSection from "./_components/DayTriptychSection";
import FounderStorySection from "./_components/FounderStorySection";
import ProductStageSection from "./_components/ProductStageSection";
import LatestNewsSection from "./_components/LatestNewsSection";
import HomeFaqSection from "./_components/HomeFaqSection";
import "./home.css";
export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { description } = pageMetadata((await params).lang, "home");
  return { title: { absolute: "Sleepy" }, description };
}
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const lang = toLocale((await params).lang);
  const [copy, company, product, purchaseUrl] = await Promise.all([
    getHomeCopy(lang),
    getCompanyCopy(lang),
    getProductCopy(lang),
    getPurchaseUrl(),
  ]);
  const ui = getUiCopy(lang);
  return (
    <main className="home-page" id="main">
      <HeroSection copy={copy.hero} lang={lang} />
      <EverydayStorySection copy={copy.everyday} />
      <DayTriptychSection copy={copy.day} lang={lang} ui={ui.home} />
      <FounderStorySection copy={copy.founder} company={company} lang={lang} />
      <ProductStageSection
        copy={copy.product}
        lang={lang}
        purchaseUrl={purchaseUrl}
        purchaseCopy={product.intro}
        ui={ui}
      />
      <Suspense fallback={null}>
        <LatestNewsSection lang={lang} ui={ui} />
      </Suspense>
      <Suspense fallback={null}>
        <HomeFaqSection copy={copy.faq} lang={lang} />
      </Suspense>
    </main>
  );
}
