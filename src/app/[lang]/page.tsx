import { getHomeCopy, getPurchaseUrl } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

import BenefitsSection from "./_components/BenefitsSection";
import CompanyBannerSection from "./_components/CompanyBannerSection";
import HeroSection from "./_components/HeroSection";
import ScenesSection from "./_components/ScenesSection";

// 메인 (/ko) — 피그마 "디자인 초안 > 01 메인", 기능 명세 F-01
// 섹션: 1. 히어로(제품 보기·구매하러 가기)  2. 핵심 장점  3. 사용 상황  4. 회사 소개로 가는 배너
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const [copy, purchaseUrl, { lang }] = await Promise.all([
    getHomeCopy(),
    getPurchaseUrl(),
    params,
  ]);
  if (!isLocale(lang)) return null;

  return (
    <main className="break-keep">
      <HeroSection copy={copy.hero} lang={lang} purchaseUrl={purchaseUrl} />
      <BenefitsSection copy={copy.benefits} />
      <ScenesSection copy={copy.scenes} />
      <CompanyBannerSection copy={copy.companyBanner} lang={lang} />
    </main>
  );
}
