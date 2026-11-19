import { cacheLife, cacheTag } from "next/cache";

import * as enCompany from "@/content/en/company";
import * as enContact from "@/content/en/contact";
import * as enFaq from "@/content/en/faq";
import * as enHome from "@/content/en/home";
import * as enNewsroom from "@/content/en/newsroom";
import * as enProduct from "@/content/en/product";
import * as enTechnology from "@/content/en/technology";
import * as enUi from "@/content/en/ui";
import * as koCompany from "@/content/ko/company";
import * as koContact from "@/content/ko/contact";
import * as koFaq from "@/content/ko/faq";
import * as koHome from "@/content/ko/home";
import * as koNewsroom from "@/content/ko/newsroom";
import * as koProduct from "@/content/ko/product";
import * as koTechnology from "@/content/ko/technology";
import * as koUi from "@/content/ko/ui";
import { defaultLocale, toLocale, type Locale } from "@/lib/i18n";
import { createReadClient } from "@/lib/supabase/server";
import type {
  Faq,
  NewsArticle,
  NewsCategory,
  ProductSpec,
} from "@/types/content";

// 관리 화면(C-01) 전에는 대시보드에서 고쳐도 캐시를 지울 방법이 없어서 한 시간마다 새로 읽는다.
// 관리 Action은 저장 뒤 같은 태그(테이블 이름)로 캐시를 지운다.

/**
 * 공개된 FAQ를 노출 순서대로 가져온다. 없으면 빈 배열.
 * 영문 페이지는 영문 열을 쓰고, 영문이 비어 있으면 한국어 원문을 대신 보여 준다(#98).
 */
export async function getFaqs(lang: Locale = defaultLocale): Promise<Faq[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("faqs");

  const read = (columns: string) =>
    createReadClient()
      .from("faqs")
      .select(columns)
      .eq("is_published", true)
      .order("sort_order")
      .order("id")
      .returns<FaqRow[]>();
  let { data, error } = await read(
    "id, question, answer, question_en, answer_en",
  );
  // 이유: CI 빌드용 DB에는 영문 열 마이그레이션(20261118090000)이 아직 없어 빌드가 멈췄다(2026-11-19, PR #99).
  // 주의: 열이 없을 때(42703)만 한국어 열로 다시 읽는다. 다른 오류는 그대로 던진다.
  if (error?.code === "42703")
    ({ data, error } = await read("id, question, answer"));
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    question: (lang === "en" && row.question_en?.trim()) || row.question,
    answer: (lang === "en" && row.answer_en?.trim()) || row.answer,
  }));
}

type FaqRow = Faq & { question_en?: string | null; answer_en?: string | null };

/** 공개된 제품 사양을 노출 순서대로 가져온다. */
export async function getProductSpecs(): Promise<ProductSpec[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("product_specs");

  const { data, error } = await createReadClient()
    .from("product_specs")
    .select("id, label, value")
    .eq("is_published", true)
    .order("sort_order")
    .order("id");
  if (error) throw error;
  return data;
}

/**
 * 구매 페이지 주소를 가져온다.
 *
 * @returns 비어 있거나 `https://`로 시작하지 않으면 `null`. 화면은 "출시 예정"을 보여 준다(F-06).
 */
export async function getPurchaseUrl(): Promise<string | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("site_settings");

  const { data, error } = await createReadClient()
    .from("site_settings")
    .select("value")
    .eq("key", "purchase_url")
    .maybeSingle();
  if (error) throw error;
  const url = data?.value;
  return url?.startsWith("https://") ? url : null;
}

/** 공개된 뉴스 기사를 최신순으로 가져온다. 분류를 빼면 전체. */
export async function getNewsList(
  category?: NewsCategory,
): Promise<NewsArticle[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("news_articles");

  let query = createReadClient()
    .from("news_articles")
    .select(newsColumns)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .order("id", { ascending: false });
  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw error;
  return data.map(toNewsArticle);
}

const newsColumns =
  "id, category, title, summary, source_name, source_url, thumbnail_url, published_at, is_featured";

type NewsRow = {
  id: number;
  category: NewsCategory;
  title: string;
  summary: string | null;
  source_name: string | null;
  source_url: string | null;
  thumbnail_url: string | null;
  published_at: string;
  is_featured: boolean;
};

function toNewsArticle(row: NewsRow): NewsArticle {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    summary: row.summary,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    thumbnailUrl: row.thumbnail_url,
    publishedAt: row.published_at,
    isFeatured: row.is_featured,
  };
}

// 긴 소개 문구는 코드 안 파일에 둔다(D-30). 나중에 Supabase로 옮겨도 화면 코드를 고치지 않도록
// 지금부터 async로 두고 화면은 await로 부른다.

/** 화면 틀과 공통 안내 문구. 동기 함수라 클라이언트로 넘길 값을 고를 때도 쓴다. */
export function getUiCopy(lang: Locale = defaultLocale) {
  return lang === "en" ? enUi.uiCopy : koUi.uiCopy;
}

/** 메인 화면 문구를 가져온다. */
export async function getHomeCopy(lang: Locale = defaultLocale) {
  return lang === "en" ? enHome.homeCopy : koHome.homeCopy;
}

/** 회사 소개 화면 문구를 가져온다. */
export async function getCompanyCopy(lang: Locale = defaultLocale) {
  return lang === "en" ? enCompany.companyCopy : koCompany.companyCopy;
}

/** 기술 화면 문구를 가져온다. */
export async function getTechnologyCopy(lang: Locale = defaultLocale) {
  return lang === "en"
    ? enTechnology.technologyCopy
    : koTechnology.technologyCopy;
}

/** 제품 화면 문구를 가져온다. */
export async function getProductCopy(lang: Locale = defaultLocale) {
  return lang === "en" ? enProduct.productCopy : koProduct.productCopy;
}

/** FAQ 화면 문구를 가져온다. */
export async function getFaqCopy(lang: Locale = defaultLocale) {
  return lang === "en" ? enFaq.faqCopy : koFaq.faqCopy;
}

/** 뉴스룸 화면 문구를 가져온다. */
export async function getNewsroomCopy(lang: Locale = defaultLocale) {
  return lang === "en" ? enNewsroom.newsroomCopy : koNewsroom.newsroomCopy;
}

/** 문의하기 화면 문구를 가져온다. */
export async function getContactCopy(lang: Locale = defaultLocale) {
  return lang === "en" ? enContact.contactCopy : koContact.contactCopy;
}

type PageKey = keyof ReturnType<typeof getUiCopy>["meta"]["pages"];

/**
 * 화면별 제목과 설명. 설명은 "슬리피 · … · 구간 이름" 꼴이다.
 *
 * @param section 설명 끝에 붙일 구간 이름. 제목과 다를 때만 준다(제품: 제목 "슬리비", 구간 "제품").
 */
export function pageMetadata(lang: string, page: PageKey, section?: PageKey) {
  const { meta } = getUiCopy(toLocale(lang));
  return {
    title: meta.pages[page],
    description: `${meta.pageDescription} · ${meta.pages[section ?? page]}`,
  };
}
